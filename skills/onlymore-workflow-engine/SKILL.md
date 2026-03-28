# Skill: onlymore-workflow-engine

> Moteur de workflows autonome basé sur Supabase Edge Functions + pg_cron.
> Remplace n8n pour toutes les automatisations OnlyMore.

## TRIGGER CONDITIONS

Ce skill se déclenche quand l'utilisateur demande :
- "publie ce post sur LinkedIn"
- "automatise les publications sans n8n"
- "gère les avis Google du commerçant"
- "configure le workflow engine"
- "cron supabase publication"
- Toute mention de workflow, automatisation, publication sociale, avis Google dans le contexte OnlyMore

## Supabase Reference

- **Project ref** : `isuzbpzwxcagtnbosgjl`
- **Region** : eu-west-3
- **API URL** : `https://isuzbpzwxcagtnbosgjl.supabase.co`

---

## Section 1 : Architecture Globale

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────┐
│                  Claude Code (UI)                    │
│          Commandes utilisateur / Templates           │
└──────────────┬──────────────────────────┬───────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐   ┌──────────────────────────┐
│   Supabase Database  │   │  Supabase Edge Functions  │
│                      │   │                            │
│  - workflows         │   │  - publish-linkedin        │
│  - workflow_runs     │   │  - publish-facebook        │
│  - publish_queue     │   │  - generate-content        │
│  - token_vault       │   │  - fetch-reviews           │
│  - google_reviews    │   │                            │
│  - merchants         │   └──────────────────────────┘
│  - content_templates │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       pg_cron         │
│                       │
│  - publish_pending    │
│  - generate_daily     │
│  - fetch_reviews      │
│  - cleanup_old_runs   │
└───────────────────────┘
```

### Principes

1. **Zero infrastructure externe** : tout tourne dans Supabase (DB + Edge Functions + pg_cron)
2. **Queue-based** : les publications passent par `publish_queue` avant envoi
3. **Token Vault** : les tokens API sont stockés chiffrés dans `token_vault`
4. **Idempotent** : chaque run a un ID unique, pas de double-publication
5. **Observable** : chaque exécution est loguée dans `workflow_runs`

---

## Section 2 : SQL — Création des Tables

### 2.1 Table `workflows`

```sql
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('publish_linkedin', 'publish_facebook', 'generate_content', 'fetch_reviews', 'custom')),
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  cron_schedule TEXT, -- format cron standard : '0 9 * * 1-5'
  merchant_id UUID REFERENCES public.merchants(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflows_type ON public.workflows(type);
CREATE INDEX idx_workflows_active ON public.workflows(is_active) WHERE is_active = true;

COMMENT ON TABLE public.workflows IS 'Définitions des workflows automatisés OnlyMore';
```

### 2.2 Table `workflow_runs`

```sql
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'skipped')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflow_runs_workflow ON public.workflow_runs(workflow_id);
CREATE INDEX idx_workflow_runs_status ON public.workflow_runs(status);
CREATE INDEX idx_workflow_runs_created ON public.workflow_runs(created_at DESC);

COMMENT ON TABLE public.workflow_runs IS 'Historique des exécutions de workflows';
```

### 2.3 Table `publish_queue`

```sql
CREATE TABLE IF NOT EXISTS public.publish_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'publishing', 'published', 'failed', 'cancelled')),
  external_post_id TEXT,
  merchant_id UUID REFERENCES public.merchants(id),
  workflow_id UUID REFERENCES public.workflows(id),
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_publish_queue_status ON public.publish_queue(status);
CREATE INDEX idx_publish_queue_scheduled ON public.publish_queue(scheduled_at) WHERE status = 'queued';
CREATE INDEX idx_publish_queue_platform ON public.publish_queue(platform);

COMMENT ON TABLE public.publish_queue IS 'File d''attente des publications sociales';
```

### 2.4 Table `token_vault`

```sql
CREATE TABLE IF NOT EXISTS public.token_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL, -- 'linkedin', 'facebook', 'google_business', 'claude_api'
  merchant_id UUID REFERENCES public.merchants(id),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service, merchant_id)
);

-- RLS : seules les Edge Functions avec service_role peuvent lire
ALTER TABLE public.token_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.token_vault
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE public.token_vault IS 'Stockage sécurisé des tokens API (accès service_role uniquement)';
```

### 2.5 Table `google_reviews`

```sql
CREATE TABLE IF NOT EXISTS public.google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id),
  review_id TEXT NOT NULL UNIQUE, -- ID Google
  author_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  review_date TIMESTAMPTZ,
  reply_text TEXT,
  reply_date TIMESTAMPTZ,
  ai_suggested_reply TEXT,
  ai_reply_approved BOOLEAN DEFAULT false,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  needs_attention BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_google_reviews_merchant ON public.google_reviews(merchant_id);
CREATE INDEX idx_google_reviews_rating ON public.google_reviews(rating);
CREATE INDEX idx_google_reviews_attention ON public.google_reviews(needs_attention) WHERE needs_attention = true;

COMMENT ON TABLE public.google_reviews IS 'Avis Google Business importés et réponses IA';
```

### 2.6 Table `merchants`

```sql
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type TEXT,
  google_place_id TEXT,
  linkedin_org_id TEXT,
  facebook_page_id TEXT,
  timezone TEXT NOT NULL DEFAULT 'Europe/Paris',
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'reputation_locale')),
  config JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_merchants_active ON public.merchants(is_active) WHERE is_active = true;

COMMENT ON TABLE public.merchants IS 'Commerçants clients OnlyMore';
```

### 2.7 Table `content_templates`

```sql
CREATE TABLE IF NOT EXISTS public.content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business', 'all')),
  template_text TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- ex: ['merchant_name', 'product', 'date']
  category TEXT, -- 'promo', 'engagement', 'review_response', 'seasonal'
  language TEXT NOT NULL DEFAULT 'fr',
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_templates_platform ON public.content_templates(platform);
CREATE INDEX idx_content_templates_category ON public.content_templates(category);

COMMENT ON TABLE public.content_templates IS 'Templates de contenu pour génération IA';
```

---

## Section 3 : Edge Function — publish-linkedin

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

    // 1. Récupérer l'item de la queue
    const { data: item, error: fetchError } = await supabase
      .from("publish_queue")
      .select("*, merchants(*)")
      .eq("id", queue_id)
      .single();

    if (fetchError || !item) {
      return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }

    if (item.status !== "queued") {
      return new Response(JSON.stringify({ error: "Item already processed" }), { status: 409 });
    }

    // 2. Marquer comme "publishing"
    await supabase
      .from("publish_queue")
      .update({ status: "publishing", updated_at: new Date().toISOString() })
      .eq("id", queue_id);

    // 3. Récupérer le token LinkedIn
    const { data: tokenData } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "linkedin")
      .eq("merchant_id", item.merchant_id)
      .single();

    if (!tokenData?.access_token) {
      throw new Error("LinkedIn token not found for merchant");
    }

    // 4. Publier via LinkedIn ugcPosts API
    const linkedinPayload = {
      author: `urn:li:organization:${item.merchants.linkedin_org_id}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: item.content,
          },
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

    // 5. Marquer comme publié
    await supabase
      .from("publish_queue")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        external_post_id: postId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", queue_id);

    // 6. Logger le run
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

    // Mettre à jour le statut en failed avec retry logic
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
```

---

## Section 4 : Edge Function — publish-facebook

Voir le fichier de référence : `references/facebook-connector.md`

L'Edge Function `publish-facebook` suit la même architecture que `publish-linkedin` :
1. Récupère l'item de `publish_queue` (platform = 'facebook')
2. Récupère le token depuis `token_vault` (service = 'facebook')
3. Publie via Graph API `/{page_id}/feed`
4. Met à jour le statut et logue le run

---

## Section 5 : Edge Function — generate-content

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
  schedule_at?: string; // ISO date, si fourni = auto-queue
}

serve(async (req: Request) => {
  try {
    const body = (await req.json()) as GenerateRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Récupérer les infos du commerçant
    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", body.merchant_id)
      .single();

    if (!merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), { status: 404 });
    }

    // 2. Récupérer un template adapté
    const { data: templates } = await supabase
      .from("content_templates")
      .select("*")
      .or(`platform.eq.${body.platform},platform.eq.all`)
      .eq("is_active", true)
      .order("usage_count", { ascending: true })
      .limit(3);

    // 3. Récupérer la clé API Claude
    const { data: claudeToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "claude_api")
      .is("merchant_id", null)
      .single();

    if (!claudeToken?.access_token) {
      throw new Error("Claude API key not found in token_vault");
    }

    // 4. Générer le contenu via Claude API
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

    // 5. Si schedule_at fourni, ajouter à la queue
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

    // 6. Incrémenter le compteur du template utilisé
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
```

---

## Section 5bis : Edge Function — fetch-reviews (Reputation Locale)

```typescript
// supabase/functions/fetch-reviews/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://isuzbpzwxcagtnbosgjl.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface FetchReviewsRequest {
  merchant_id: string;
}

serve(async (req: Request) => {
  try {
    const { merchant_id } = (await req.json()) as FetchReviewsRequest;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Récupérer le commerçant et son place_id
    const { data: merchant } = await supabase
      .from("merchants")
      .select("*")
      .eq("id", merchant_id)
      .single();

    if (!merchant?.google_place_id) {
      return new Response(JSON.stringify({ error: "No Google Place ID" }), { status: 400 });
    }

    // 2. Récupérer le token Google
    const { data: googleToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "google_business")
      .eq("merchant_id", merchant_id)
      .single();

    if (!googleToken?.access_token) {
      throw new Error("Google Business token not found");
    }

    // 3. Fetch reviews via Google Business Profile API
    const reviewsResponse = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${merchant.config.google_account_id}/locations/${merchant.google_place_id}/reviews`,
      {
        headers: { Authorization: `Bearer ${googleToken.access_token}` },
      }
    );

    if (!reviewsResponse.ok) {
      throw new Error(`Google API error: ${reviewsResponse.status}`);
    }

    const reviewsData = await reviewsResponse.json();
    const reviews = reviewsData.reviews || [];

    // 4. Récupérer la clé Claude pour les réponses IA
    const { data: claudeToken } = await supabase
      .from("token_vault")
      .select("access_token")
      .eq("service", "claude_api")
      .is("merchant_id", null)
      .single();

    let newReviewsCount = 0;
    let aiRepliesGenerated = 0;

    for (const review of reviews) {
      // 5. Upsert chaque avis
      const { data: existing } = await supabase
        .from("google_reviews")
        .select("id, reply_text")
        .eq("review_id", review.reviewId)
        .single();

      const sentiment =
        review.starRating >= 4 ? "positive" : review.starRating >= 3 ? "neutral" : "negative";

      const reviewRecord = {
        merchant_id,
        review_id: review.reviewId,
        author_name: review.reviewer?.displayName || "Anonyme",
        rating: review.starRating,
        comment: review.comment || "",
        review_date: review.createTime,
        reply_text: review.reviewReply?.comment || null,
        reply_date: review.reviewReply?.updateTime || null,
        sentiment,
        needs_attention: review.starRating <= 2,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase.from("google_reviews").update(reviewRecord).eq("id", existing.id);
      } else {
        await supabase.from("google_reviews").insert(reviewRecord);
        newReviewsCount++;
      }

      // 6. Générer une réponse IA si pas encore de reply et plan reputation_locale
      if (!review.reviewReply && merchant.plan === "reputation_locale" && claudeToken?.access_token) {
        const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": claudeToken.access_token,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 512,
            system: `Tu es le gérant de ${merchant.name} (${merchant.business_type}).
Tu réponds aux avis Google de manière professionnelle, empathique et personnalisée.
- Avis positif : remercie chaleureusement, mentionne un détail de l'avis
- Avis négatif : excuse sincère, propose une solution concrète, invite à revenir
- Toujours en français, 2-4 phrases max`,
            messages: [
              {
                role: "user",
                content: `Avis ${review.starRating}/5 de ${review.reviewer?.displayName || "un client"} : "${review.comment || "Pas de commentaire"}"`,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          const suggestedReply = aiResult.content[0].text;

          await supabase
            .from("google_reviews")
            .update({ ai_suggested_reply: suggestedReply })
            .eq("review_id", review.reviewId);

          aiRepliesGenerated++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_reviews: reviews.length,
        new_reviews: newReviewsCount,
        ai_replies_generated: aiRepliesGenerated,
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
```

---

## Section 6 : Setup pg_cron

```sql
-- Activer l'extension pg_cron si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Publier les posts en attente (toutes les 5 minutes)
SELECT cron.schedule(
  'publish-pending-posts',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://isuzbpzwxcagtnbosgjl.supabase.co/functions/v1/publish-linkedin',
    body := jsonb_build_object('queue_id', pq.id),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    )
  )
  FROM public.publish_queue pq
  WHERE pq.status = 'queued'
    AND pq.platform = 'linkedin'
    AND pq.scheduled_at <= now()
  ORDER BY pq.scheduled_at ASC
  LIMIT 10;
  $$
);

-- 2. Publier les posts Facebook en attente (toutes les 5 minutes)
SELECT cron.schedule(
  'publish-pending-facebook',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://isuzbpzwxcagtnbosgjl.supabase.co/functions/v1/publish-facebook',
    body := jsonb_build_object('queue_id', pq.id),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    )
  )
  FROM public.publish_queue pq
  WHERE pq.status = 'queued'
    AND pq.platform = 'facebook'
    AND pq.scheduled_at <= now()
  ORDER BY pq.scheduled_at ASC
  LIMIT 10;
  $$
);

-- 3. Fetch Google Reviews quotidien (tous les jours à 8h)
SELECT cron.schedule(
  'fetch-google-reviews-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://isuzbpzwxcagtnbosgjl.supabase.co/functions/v1/fetch-reviews',
    body := jsonb_build_object('merchant_id', m.id),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    )
  )
  FROM public.merchants m
  WHERE m.is_active = true
    AND m.plan = 'reputation_locale'
    AND m.google_place_id IS NOT NULL;
  $$
);

-- 4. Cleanup des anciens runs (tous les dimanches à 3h du matin)
SELECT cron.schedule(
  'cleanup-old-workflow-runs',
  '0 3 * * 0',
  $$
  DELETE FROM public.workflow_runs
  WHERE created_at < now() - interval '90 days'
    AND status IN ('success', 'skipped');
  $$
);
```

---

## Section 7 : Commandes Claude Code Templates

### Publier un post LinkedIn

```
@workflow publie sur LinkedIn pour [merchant_name] :
"[contenu du post]"
Planifié pour : [date ISO ou "maintenant"]
```

### Générer du contenu IA

```
@workflow génère un post [linkedin|facebook|instagram] pour [merchant_name]
Catégorie : [promo|engagement|seasonal]
Prompt personnalisé : "[instructions spécifiques]"
```

### Consulter les avis Google

```
@workflow affiche les avis Google de [merchant_name]
Filtre : [positif|négatif|sans réponse|tous]
```

### Approuver une réponse IA

```
@workflow approuve la réponse IA pour l'avis [review_id]
```

### Voir le statut des workflows

```
@workflow statut
```

---

## Section 8 : Migration n8n vers Workflow Engine

| Fonctionnalité | n8n (ancien) | Workflow Engine (nouveau) |
|---|---|---|
| Publication LinkedIn | Webhook → HTTP Request node | `publish_queue` → Edge Function `publish-linkedin` |
| Publication Facebook | Webhook → HTTP Request node | `publish_queue` → Edge Function `publish-facebook` |
| Génération contenu | Webhook → Claude node → HTTP | Edge Function `generate-content` |
| Planification | Cron Trigger node | pg_cron natif |
| Stockage tokens | n8n Credentials | `token_vault` table (RLS) |
| Logs d'exécution | n8n Execution History | `workflow_runs` table |
| Avis Google | Non implémenté | Edge Function `fetch-reviews` + table `google_reviews` |
| Coût infrastructure | ~20€/mois (n8n cloud) | 0€ (inclus dans Supabase Pro) |
| Latence | 200-500ms (webhook chain) | 50-150ms (direct Edge Function) |
| Fiabilité | Dépend uptime n8n | 99.9% SLA Supabase |

### Étapes de migration

1. **Exporter** les workflows n8n actifs (JSON)
2. **Mapper** chaque node vers la table/function correspondante
3. **Migrer** les credentials n8n vers `token_vault`
4. **Tester** chaque workflow migré en mode dry-run
5. **Basculer** les cron jobs
6. **Monitorer** pendant 48h
7. **Désactiver** n8n

---

## Section 9 : Prérequis Tokens

### LinkedIn
- **OAuth 2.0** : Client ID + Client Secret
- **Scopes** : `w_member_social`, `r_organization_social`, `w_organization_social`
- **Token** : Access token (expire 60 jours) + Refresh token
- **Org ID** : ID de l'organisation LinkedIn du commerçant

### Facebook
- **Graph API** : App ID + App Secret
- **Page Access Token** : Token longue durée (60 jours, renouvelable)
- **Permissions** : `pages_manage_posts`, `pages_read_engagement`
- **Page ID** : ID de la page Facebook du commerçant

### Claude API
- **API Key** : Clé API Anthropic
- **Stockage** : 1 seule clé globale (merchant_id = NULL dans token_vault)

### Google Business Profile
- **OAuth 2.0** : Client ID + Client Secret
- **Scopes** : `https://www.googleapis.com/auth/business.manage`
- **Account ID** : ID du compte Google Business
- **Place ID** : ID du lieu Google du commerçant

---

## Section 10 : Checklist de Déploiement

- [ ] 1. Tables créées dans Supabase (7 tables)
- [ ] 2. RLS activé sur `token_vault`
- [ ] 3. Index créés sur toutes les tables
- [ ] 4. Edge Function `publish-linkedin` déployée
- [ ] 5. Edge Function `publish-facebook` déployée
- [ ] 6. Edge Function `generate-content` déployée
- [ ] 7. Edge Function `fetch-reviews` déployée
- [ ] 8. pg_cron configuré (4 jobs)
- [ ] 9. Token LinkedIn stocké dans `token_vault`
- [ ] 10. Token Facebook stocké dans `token_vault`
- [ ] 11. Clé API Claude stockée dans `token_vault`
- [ ] 12. Token Google Business stocké (si plan reputation_locale)
- [ ] 13. Au moins 1 commerçant créé dans `merchants`
- [ ] 14. Test de publication LinkedIn réussi
- [ ] 15. Test de génération de contenu réussi
