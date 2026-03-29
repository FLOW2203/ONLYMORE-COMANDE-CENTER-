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
      .eq("service", "linkedin")
      .eq("merchant_id", item.merchant_id)
      .single();

    if (!tokenData?.access_token) {
      throw new Error("LinkedIn token not found for merchant");
    }

    const linkedinPayload = {
      author: `urn:li:organization:${item.merchants.linkedin_org_id}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: item.content },
          shareMediaCategory: item.media_urls?.length > 0 ? "IMAGE" : "NONE",
          ...(item.media_urls?.length > 0 && {
            media: item.media_urls.map((url: string) => ({
              status: "READY",
              originalUrl: url,
              mediaType: "IMAGE",
            })),
          }),
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const linkedinResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(linkedinPayload),
    });

    if (!linkedinResponse.ok) {
      const errorBody = await linkedinResponse.text();
      throw new Error(`LinkedIn API error ${linkedinResponse.status}: ${errorBody}`);
    }

    const result = await linkedinResponse.json();
    const postId = result.id;

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
      output_data: { post_id: postId, platform: "linkedin" },
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
