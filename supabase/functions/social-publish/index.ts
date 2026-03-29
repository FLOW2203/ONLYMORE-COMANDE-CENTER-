import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Platform-specific publishers
const PUBLISHERS: Record<string, (post: any, token: any, platform: any) => Promise<{ success: boolean; post_id?: string; post_url?: string; error?: string }>> = {
  // --- TRIVIAL TIER ---
  discord: async (post, token) => {
    const webhookUrl = token.access_token;
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: post.content, ...(post.media_urls?.[0] && { embeds: [{ image: { url: post.media_urls[0] } }] }) }),
    });
    if (!res.ok) throw new Error(`Discord ${res.status}: ${await res.text()}`);
    return { success: true, post_id: "webhook", post_url: webhookUrl };
  },

  telegram: async (post, token) => {
    const botToken = token.access_token;
    const chatId = token.extra_data?.chat_id || token.platform_user_id;
    const endpoint = post.media_urls?.[0]
      ? `https://api.telegram.org/bot${botToken}/sendPhoto`
      : `https://api.telegram.org/bot${botToken}/sendMessage`;
    const body = post.media_urls?.[0]
      ? { chat_id: chatId, photo: post.media_urls[0], caption: post.content }
      : { chat_id: chatId, text: post.content, parse_mode: "HTML" };
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!data.ok) throw new Error(`Telegram: ${data.description}`);
    return { success: true, post_id: String(data.result.message_id) };
  },

  bluesky: async (post, token) => {
    const sessRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: token.platform_user_id, password: token.access_token }),
    });
    const session = await sessRes.json();
    if (!session.accessJwt) throw new Error("Bluesky auth failed");
    const record = { $type: "app.bsky.feed.post", text: post.content.slice(0, 300), createdAt: new Date().toISOString() };
    const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessJwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({ repo: session.did, collection: "app.bsky.feed.post", record }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Bluesky ${res.status}: ${JSON.stringify(data)}`);
    return { success: true, post_id: data.uri, post_url: `https://bsky.app/profile/${session.handle}/post/${data.uri.split('/').pop()}` };
  },

  // --- STANDARD TIER ---
  linkedin: async (post, token) => {
    const orgId = token.extra_data?.org_id || token.platform_user_id;
    const isOrg = !!token.extra_data?.org_id;
    const author = isOrg ? `urn:li:organization:${orgId}` : `urn:li:person:${orgId}`;
    const payload = {
      author,
      commentary: post.content,
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
    };
    const res = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202401",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`LinkedIn ${res.status}: ${await res.text()}`);
    const postId = res.headers.get("x-restli-id") || "created";
    return { success: true, post_id: postId, post_url: `https://www.linkedin.com/feed/update/${postId}` };
  },

  facebook: async (post, token) => {
    const pageId = token.platform_user_id;
    const endpoint = post.media_urls?.[0]
      ? `https://graph.facebook.com/v25.0/${pageId}/photos`
      : `https://graph.facebook.com/v25.0/${pageId}/feed`;
    const body: Record<string, unknown> = { message: post.content, access_token: token.access_token };
    if (post.media_urls?.[0]) body.url = post.media_urls[0];
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) throw new Error(`Facebook: ${data.error.message}`);
    return { success: true, post_id: data.id, post_url: `https://facebook.com/${data.id}` };
  },

  mastodon: async (post, token) => {
    const baseUrl = token.extra_data?.instance_url || "https://mastodon.social";
    const res = await fetch(`${baseUrl}/api/v1/statuses`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: post.content }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Mastodon ${res.status}: ${JSON.stringify(data)}`);
    return { success: true, post_id: data.id, post_url: data.url };
  },

  reddit: async (post, token) => {
    const subreddit = token.extra_data?.subreddit || "test";
    const res = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "OnlyMore/2.0" },
      body: new URLSearchParams({ kind: "self", sr: subreddit, title: post.title || post.content.slice(0, 100), text: post.content }),
    });
    const data = await res.json();
    if (data.json?.errors?.length) throw new Error(`Reddit: ${JSON.stringify(data.json.errors)}`);
    return { success: true, post_id: data.json?.data?.id, post_url: data.json?.data?.url };
  },

  // --- COMPLEX TIER ---
  x: async (post, token) => {
    const res = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ text: post.content.slice(0, 280) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`X ${res.status}: ${JSON.stringify(data)}`);
    return { success: true, post_id: data.data?.id, post_url: `https://x.com/i/status/${data.data?.id}` };
  },
};

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { post_id } = await req.json();
    if (!post_id) return new Response(JSON.stringify({ error: "post_id required" }), { status: 400, headers: corsHeaders });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: post, error: postErr } = await supabase.from("scheduled_posts").select("*").eq("id", post_id).single();
    if (postErr || !post) return new Response(JSON.stringify({ error: "Post not found" }), { status: 404, headers: corsHeaders });

    await supabase.from("scheduled_posts").update({ status: "publishing", updated_at: new Date().toISOString() }).eq("id", post_id);

    const results: Record<string, any> = {};
    let successCount = 0;
    let failCount = 0;

    for (const platformName of post.target_platforms) {
      const startTime = Date.now();
      try {
        const { data: platform } = await supabase.from("social_platforms").select("*").eq("name", platformName).eq("is_active", true).single();
        if (!platform) { results[platformName] = { success: false, error: "Platform not found or inactive" }; failCount++; continue; }

        const { data: token } = await supabase.from("social_tokens").select("*").eq("platform_id", platform.id).eq("is_active", true).limit(1).single();
        if (!token) { results[platformName] = { success: false, error: "No active token" }; failCount++; continue; }

        const publisher = PUBLISHERS[platformName];
        if (!publisher) { results[platformName] = { success: false, error: `No publisher for ${platformName}` }; failCount++; continue; }

        const result = await publisher(post, token, platform);
        results[platformName] = result;

        await supabase.from("published_posts").insert({
          scheduled_post_id: post_id, platform: platformName,
          platform_post_id: result.post_id, platform_post_url: result.post_url, status: "success",
        });

        await supabase.from("publication_logs").insert({
          scheduled_post_id: post_id, platform: platformName,
          action: "publish", status: "success", response_payload: result, duration_ms: Date.now() - startTime,
        });

        successCount++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        results[platformName] = { success: false, error: errorMsg };
        failCount++;

        await supabase.from("published_posts").insert({
          scheduled_post_id: post_id, platform: platformName, status: "failed", error_message: errorMsg,
        });

        await supabase.from("publication_logs").insert({
          scheduled_post_id: post_id, platform: platformName,
          action: "publish", status: "failed", error_details: errorMsg, duration_ms: Date.now() - startTime,
        });
      }
    }

    const allSuccess = failCount === 0;
    const finalStatus = allSuccess ? "published" : (successCount > 0 ? "partial" : "failed");
    await supabase.from("scheduled_posts").update({
      status: finalStatus, updated_at: new Date().toISOString(),
      ...(finalStatus === "failed" && post.retry_count < post.max_retries && { status: "pending", retry_count: post.retry_count + 1 }),
    }).eq("id", post_id);

    // BRIDGE: Report result to Team Orchestrator
    if (post.agent_task_id) {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/agent-orchestrator`, {
          method: "POST",
          headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit_output",
            task_id: post.agent_task_id,
            output_type: "post_published",
            output_data: { post_id: post.id, results, platforms: post.target_platforms, success_count: successCount, fail_count: failCount },
            summary: `Publie sur ${post.target_platforms.join(", ")} — ${allSuccess ? "OK" : "partiel " + successCount + "/" + post.target_platforms.length}`,
            forward_to: "SENTINEL",
          }),
        });
      } catch (_) { /* silent */ }
    }

    return new Response(JSON.stringify({
      success: true, post_id, status: finalStatus, results,
      summary: { success: successCount, failed: failCount, total: post.target_platforms.length },
    }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: corsHeaders });
  }
});
