import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface GenerateRequest {
  merchant_id: string;
  platform: "linkedin" | "facebook" | "instagram";
  category?: string;
  custom_prompt?: string;
  schedule_at?: string;
}

Deno.serve(async (req: Request) => {
  try {
    const body = (await req.json()) as GenerateRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", body.merchant_id)
      .single();

    if (!merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: templates } = await supabase
      .from("content_templates")
      .select("*")
      .or(`platform.eq.${body.platform},platform.eq.all`)
      .eq("is_active", true)
      .order("usage_count", { ascending: true })
      .limit(3);

    const { data: claudeToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "claude_api")
      .is("merchant_id", null)
      .single();

    if (!claudeToken?.access_token) {
      throw new Error("Claude API key not found in token_vault");
    }

    const systemPrompt = `Tu es un expert en marketing digital pour commerçants locaux français.
Tu génères du contenu engageant pour ${body.platform}.
Commerçant : ${merchant.name} (${merchant.business_type})
Langue : français
Ton : professionnel mais chaleureux, adapté aux commerçants de proximité.
Longueur : 150-300 mots pour LinkedIn, 100-200 pour Facebook, 50-100 pour Instagram.`;

    const userPrompt = body.custom_prompt ||
      `Génère un post ${body.platform} pour ${merchant.name} (${merchant.business_type}).
${body.category ? `Catégorie : ${body.category}` : ""}
${templates?.length ? `Inspiration template : ${templates[0].template_text}` : ""}`;

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": claudeToken.access_token,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeResult = await claudeResponse.json();
    const generatedContent = claudeResult.content[0].text;

    let queueItem = null;
    if (body.schedule_at) {
      const { data: queued } = await supabase
        .from("publish_queue")
        .insert({
          platform: body.platform,
          content: generatedContent,
          scheduled_at: body.schedule_at,
          merchant_id: body.merchant_id,
          metadata: { category: body.category, auto_generated: true },
        })
        .select()
        .single();
      queueItem = queued;
    }

    if (templates?.length) {
      await supabase
        .from("content_templates")
        .update({ usage_count: templates[0].usage_count + 1 })
        .eq("id", templates[0].id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
        queued: !!queueItem,
        queue_id: queueItem?.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
