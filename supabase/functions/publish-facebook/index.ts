import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface PublishRequest {
  queue_id: string;
}

Deno.serve(async (req: Request) => {
  try {
    const { queue_id } = (await req.json()) as PublishRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: item, error: fetchError } = await supabase
      .from("publish_queue")
      .select("*, merchants(*)")
      .eq("id", queue_id)
      .single();

    if (fetchError || !item) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (item.status !== "queued") {
      return new Response(JSON.stringify({ error: "Item already processed" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("publish_queue")
      .update({ status: "publishing", updated_at: new Date().toISOString() })
      .eq("id", queue_id);

    const { data: tokenData } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "facebook")
      .eq("merchant_id", item.merchant_id)
      .single();

    if (!tokenData?.access_token) {
      throw new Error("Facebook token not found for merchant");
    }

    const pageId = item.merchants.facebook_page_id;
    if (!pageId) {
      throw new Error("Facebook Page ID not configured for merchant");
    }

    let fbEndpoint: string;
    let fbBody: Record<string, unknown>;

    if (item.media_urls?.length > 0) {
      fbEndpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      fbBody = {
        message: item.content,
        url: item.media_urls[0],
        access_token: tokenData.access_token,
      };
    } else {
      fbEndpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;
      fbBody = {
        message: item.content,
        access_token: tokenData.access_token,
      };
    }

    const fbResponse = await fetch(fbEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fbBody),
    });

    if (!fbResponse.ok) {
      const errorBody = await fbResponse.text();
      throw new Error(`Facebook API error ${fbResponse.status}: ${errorBody}`);
    }

    const result = await fbResponse.json();
    const postId = result.id || result.post_id;

    await supabase
      .from("publish_queue")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        external_post_id: postId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", queue_id);

    await supabase.from("workflow_runs").insert({
      workflow_id: item.workflow_id,
      status: "success",
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      output_data: { post_id: postId, platform: "facebook" },
    });

    return new Response(JSON.stringify({ success: true, post_id: postId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { queue_id } = await req.clone().json();

      const { data: item } = await supabase
        .from("publish_queue")
        .select("retry_count, max_retries, workflow_id")
        .eq("id", queue_id)
        .single();

      if (item) {
        const newStatus = item.retry_count < item.max_retries ? "queued" : "failed";
        await supabase
          .from("publish_queue")
          .update({
            status: newStatus,
            retry_count: item.retry_count + 1,
            error_message: errorMessage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", queue_id);

        await supabase.from("workflow_runs").insert({
          workflow_id: item.workflow_id,
          status: "failed",
          error_message: errorMessage,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });
      }
    } catch (_) {
      // Silent fail on error logging
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
