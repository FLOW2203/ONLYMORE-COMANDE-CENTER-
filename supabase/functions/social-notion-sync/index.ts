import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const NOTION_DB_ID = "042ec1b122db45b4b7270bc5f630aad0";

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: notionToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "notion")
      .is("merchant_id", null)
      .single();

    if (!notionToken?.access_token) {
      return new Response(JSON.stringify({ error: "Notion token not found in token_vault" }), { status: 400, headers: corsHeaders });
    }

    const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken.access_token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          or: [
            { property: "Status", status: { equals: "Ready" } },
            { property: "Status", status: { equals: "Scheduled" } },
          ],
        },
        sorts: [{ property: "Date", direction: "ascending" }],
      }),
    });

    if (!notionRes.ok) {
      throw new Error(`Notion API error: ${notionRes.status} ${await notionRes.text()}`);
    }

    const notionData = await notionRes.json();
    const pages = notionData.results || [];

    let synced = 0;
    let skipped = 0;

    for (const page of pages) {
      const pageId = page.id;
      const props = page.properties;

      const { data: existing } = await supabase
        .from("scheduled_posts")
        .select("id")
        .eq("notion_page_id", pageId)
        .limit(1);

      if (existing?.length) {
        skipped++;
        continue;
      }

      const title = props.Title?.title?.[0]?.plain_text ||
        props.Name?.title?.[0]?.plain_text || "Untitled";
      const content = props.Content?.rich_text?.[0]?.plain_text ||
        props.Description?.rich_text?.[0]?.plain_text || title;
      const scheduledAt = props.Date?.date?.start ||
        props["Scheduled Date"]?.date?.start ||
        new Date(Date.now() + 3600000).toISOString();
      const platforms = props.Platforms?.multi_select?.map((s: any) => s.name.toLowerCase()) ||
        props.Platform?.select?.name ? [props.Platform.select.name.toLowerCase()] : ["linkedin"];
      const entity = props.Entity?.select?.name || "ONLYMORE";
      const tags = props.Tags?.multi_select?.map((t: any) => t.name) || [];

      const { error: insertErr } = await supabase.from("scheduled_posts").insert({
        title,
        content,
        target_platforms: platforms,
        scheduled_at: scheduledAt,
        entity,
        notion_page_id: pageId,
        tags: [...tags, "notion-sync"],
        status: "pending",
      });

      if (!insertErr) {
        synced++;

        await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${notionToken.access_token}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify({
            properties: { Status: { status: { name: "Synced" } } },
          }),
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      total_pages: pages.length,
      synced,
      skipped,
      timestamp: new Date().toISOString(),
    }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: corsHeaders });
  }
});
