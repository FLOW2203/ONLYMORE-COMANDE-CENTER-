import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface GenerateRequest {
  topic: string;
  entity?: string;
  platforms?: string[];
  tone?: string;
  language?: string;
  schedule_at?: string;
  agent_task_id?: string;
  custom_prompt?: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as GenerateRequest;
    if (!body.topic) {
      return new Response(JSON.stringify({ error: "topic required" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const entity = body.entity || "ONLYMORE";
    const targetPlatforms = body.platforms || ["linkedin"];
    const tone = body.tone || "professionnel mais chaleureux";
    const language = body.language || "fr";
    const agentTaskId = body.agent_task_id || null;

    // Get Claude API key from token_vault
    const { data: claudeToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "claude_api")
      .is("merchant_id", null)
      .single();

    if (!claudeToken?.access_token) {
      throw new Error("Claude API key not found in token_vault");
    }

    // Platform length guidelines
    const platformGuides = targetPlatforms.map((p: string) => {
      const guides: Record<string, string> = {
        linkedin: "LinkedIn: 150-300 mots, professionnel, hashtags pertinents",
        facebook: "Facebook: 100-200 mots, engageant, emoji moderes",
        x: "X/Twitter: max 280 caracteres, percutant, hashtags",
        instagram: "Instagram: 50-150 mots, visuel, 5-10 hashtags",
        bluesky: "Bluesky: max 300 caracteres, conversationnel",
        discord: "Discord: 100-500 mots, communautaire, markdown",
        telegram: "Telegram: 100-300 mots, informatif, liens",
        mastodon: "Mastodon: max 500 caracteres, communautaire",
        devto: "Dev.to: article technique, 500-2000 mots, code samples",
        medium: "Medium: article long, 800-2000 mots, storytelling",
        reddit: "Reddit: discussion, 200-500 mots, pas de promo directe",
      };
      return guides[p] || `${p}: contenu adapte`;
    }).join("\n");

    const systemPrompt = `Tu es un expert en marketing digital et communication pour des marques innovantes francaises.
Tu generes du contenu engageant et authentique.
Marque/Entite : ${entity}
Ton : ${tone}
Langue : ${language === "fr" ? "francais" : language}

Regles :
- Contenu original, pas de cliches
- Adapte au format de chaque plateforme
- Inclus des hashtags pertinents si la plateforme le permet
- Call-to-action naturel
- Pas de texte generique

Guides par plateforme :
${platformGuides}`;

    const userPrompt = body.custom_prompt || `Genere un post sur le sujet suivant pour ${targetPlatforms.join(", ")} :

Sujet : ${body.topic}
Entite : ${entity}

Si plusieurs plateformes, genere un contenu principal adapte a la plateforme principale (${targetPlatforms[0]}),
puis propose des variantes courtes pour les autres plateformes.`;

    // Call Claude API
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": claudeToken.access_token,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status} ${await claudeResponse.text()}`);
    }

    const claudeResult = await claudeResponse.json();
    const generatedText = claudeResult.content[0].text;

    // Schedule the post
    const scheduledAt = body.schedule_at || new Date(Date.now() + 3600000).toISOString();

    const { data: scheduledPost, error: insertErr } = await supabase
      .from("scheduled_posts")
      .insert({
        title: body.topic.slice(0, 100),
        content: generatedText,
        target_platforms: targetPlatforms,
        scheduled_at: scheduledAt,
        entity: entity,
        status: "pending",
        agent_task_id: agentTaskId,
        tags: [entity.toLowerCase(), "ai-generated"],
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    // BRIDGE: Report to Team Orchestrator if agent_task_id
    if (agentTaskId) {
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/agent-orchestrator`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "submit_output",
            task_id: agentTaskId,
            output_type: "content_generated",
            output_data: {
              scheduled_post_id: scheduledPost.id,
              content: generatedText,
              platforms: targetPlatforms,
              scheduled_at: scheduledAt,
            },
            summary: `Contenu genere pour ${entity} sur ${targetPlatforms.join(", ")}`,
          }),
        });
      } catch (_) { /* silent */ }
    }

    return new Response(JSON.stringify({
      success: true,
      scheduled_post_id: scheduledPost.id,
      content: generatedText,
      platforms: targetPlatforms,
      scheduled_at: scheduledAt,
      entity,
      agent_task_id: agentTaskId,
    }), { status: 201, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: corsHeaders });
  }
});
