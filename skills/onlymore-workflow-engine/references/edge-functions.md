# Edge Functions — Référence de Déploiement

## Structure du Projet

```
supabase/
  functions/
    publish-linkedin/
      index.ts
    publish-facebook/
      index.ts
    generate-content/
      index.ts
    fetch-reviews/
      index.ts
```

## Déploiement

### Pré-requis

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref isuzbpzwxcagtnbosgjl
```

### Déployer une fonction

```bash
# Déployer une seule fonction
supabase functions deploy publish-linkedin --project-ref isuzbpzwxcagtnbosgjl

# Déployer toutes les fonctions
supabase functions deploy --project-ref isuzbpzwxcagtnbosgjl
```

### Variables d'environnement

```bash
# Définir les secrets
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...
supabase secrets set --project-ref isuzbpzwxcagtnbosgjl
```

---

## Edge Function : publish-linkedin

### Code TypeScript Complet

```typescript
// supabase/functions/publish-linkedin/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface PublishRequest {
  queue_id: string;
}

serve(async (req: Request) => {
  try {
    const { queue_id } = (await req.json()) as PublishRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Récupérer l'item
    const { data: item, error } = await supabase
      .from("publish_queue")
      .select("*, merchants(*)")
      .eq("id", queue_id)
      .single();

    if (error || !item) {
      return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    if (item.status !== "queued") {
      return new Response(JSON.stringify({ error: "Already processed" }), { status: 409 });
    }

    // Lock item
    await supabase
      .from("publish_queue")
      .update({ status: "publishing", updated_at: new Date().toISOString() })
      .eq("id", queue_id);

    // Get token
    const { data: tokenData } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "linkedin")
      .eq("merchant_id", item.merchant_id)
      .single();

    if (!tokenData?.access_token) {
      throw new Error("LinkedIn token not found");
    }

    // Build LinkedIn payload
    const payload = {
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

    // Publish
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`LinkedIn ${response.status}: ${errBody}`);
    }

    const result = await response.json();

    // Update queue
    await supabase
      .from("publish_queue")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        external_post_id: result.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", queue_id);

    // Log run
    await supabase.from("workflow_runs").insert({
      workflow_id: item.workflow_id,
      status: "success",
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      output_data: { post_id: result.id, platform: "linkedin" },
    });

    return new Response(JSON.stringify({ success: true, post_id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

---

## Edge Function : generate-content

### Code TypeScript Complet

```typescript
// supabase/functions/generate-content/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
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

serve(async (req: Request) => {
  try {
    const body = (await req.json()) as GenerateRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get merchant
    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", body.merchant_id)
      .single();

    if (!merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), { status: 404 });
    }

    // Get template
    const { data: templates } = await supabase
      .from("content_templates")
      .select("*")
      .or(`platform.eq.${body.platform},platform.eq.all`)
      .eq("is_active", true)
      .order("usage_count", { ascending: true })
      .limit(3);

    // Get Claude API key
    const { data: claudeToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "claude_api")
      .is("merchant_id", null)
      .single();

    if (!claudeToken?.access_token) {
      throw new Error("Claude API key not found");
    }

    // Generate content
    const systemPrompt = `Tu es un expert en marketing digital pour commerçants locaux français.
Tu génères du contenu engageant pour ${body.platform}.
Commerçant : ${merchant.name} (${merchant.business_type})
Langue : français
Ton : professionnel mais chaleureux.
Longueur : 150-300 mots pour LinkedIn, 100-200 pour Facebook, 50-100 pour Instagram.`;

    const userPrompt = body.custom_prompt ||
      `Génère un post ${body.platform} pour ${merchant.name} (${merchant.business_type}).
${body.category ? `Catégorie : ${body.category}` : ""}
${templates?.length ? `Inspiration : ${templates[0].template_text}` : ""}`;

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
    const content = claudeResult.content[0].text;

    // Auto-queue if scheduled
    let queueItem = null;
    if (body.schedule_at) {
      const { data: queued } = await supabase
        .from("publish_queue")
        .insert({
          platform: body.platform,
          content,
          scheduled_at: body.schedule_at,
          merchant_id: body.merchant_id,
          metadata: { category: body.category, auto_generated: true },
        })
        .select()
        .single();
      queueItem = queued;
    }

    return new Response(
      JSON.stringify({ success: true, content, queued: !!queueItem, queue_id: queueItem?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

---

## Invocation des Edge Functions

### Via cURL

```bash
curl -X POST \
  'https://isuzbpzwxcagtnbosgjl.supabase.co/functions/v1/publish-linkedin' \
  -H 'Authorization: Bearer {SUPABASE_ANON_KEY}' \
  -H 'Content-Type: application/json' \
  -d '{"queue_id": "uuid-here"}'
```

### Via Supabase Client

```typescript
const { data, error } = await supabase.functions.invoke("publish-linkedin", {
  body: { queue_id: "uuid-here" },
});
```

### Via pg_cron + pg_net

```sql
SELECT net.http_post(
  url := 'https://isuzbpzwxcagtnbosgjl.supabase.co/functions/v1/publish-linkedin',
  body := '{"queue_id": "uuid-here"}'::jsonb,
  headers := '{"Authorization": "Bearer {SERVICE_ROLE_KEY}", "Content-Type": "application/json"}'::jsonb
);
```

---

## Monitoring

### Voir les logs

```bash
supabase functions logs publish-linkedin --project-ref isuzbpzwxcagtnbosgjl
```

### Vérifier le statut

```bash
supabase functions list --project-ref isuzbpzwxcagtnbosgjl
```

## Notes

1. Les Edge Functions ont un timeout de **60 secondes** par défaut
2. La mémoire est limitée à **150MB** par invocation
3. Les cold starts ajoutent ~200ms à la première invocation
4. Utiliser `SUPABASE_SERVICE_ROLE_KEY` pour les appels internes (bypass RLS)
5. Les Edge Functions supportent Deno, pas Node.js
