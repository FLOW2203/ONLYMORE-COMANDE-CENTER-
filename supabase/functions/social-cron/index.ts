import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: pendingPosts, error } = await supabase
      .from("scheduled_posts")
      .select("id, title, target_platforms, scheduled_at, retry_count")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(10);

    if (error) throw error;

    if (!pendingPosts?.length) {
      return new Response(JSON.stringify({ success: true, message: "No pending posts", published: 0 }), { headers: corsHeaders });
    }

    const results = [];
    for (const post of pendingPosts) {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/social-publish`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: post.id }),
        });

        const data = await res.json();
        results.push({ post_id: post.id, title: post.title, status: data.status || "error", details: data });
      } catch (err) {
        results.push({ post_id: post.id, title: post.title, status: "error", error: err instanceof Error ? err.message : String(err) });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: corsHeaders });
  }
});
