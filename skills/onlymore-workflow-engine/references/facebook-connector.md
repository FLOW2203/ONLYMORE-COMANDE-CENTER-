# Facebook Connector — Référence Graph API

## Endpoint Principal

```
POST https://graph.facebook.com/v18.0/{page_id}/feed
```

## Authentification

- **Type** : Page Access Token
- **Header** : `Authorization: Bearer {page_access_token}`
- **Alternative** : Query param `?access_token={token}`

## Permissions Requises

| Permission | Description |
|---|---|
| `pages_manage_posts` | Publier sur la page |
| `pages_read_engagement` | Lire les engagements (likes, commentaires) |
| `pages_show_list` | Lister les pages gérées |

## Edge Function Complète — publish-facebook

```typescript
// supabase/functions/publish-facebook/index.ts
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

    // 3. Récupérer le token Facebook
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

    // 4. Publier via Graph API
    let fbEndpoint: string;
    let fbBody: Record<string, unknown>;

    if (item.media_urls?.length > 0) {
      // Publication avec photo
      fbEndpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      fbBody = {
        message: item.content,
        url: item.media_urls[0], // Facebook accepte une URL directe
        access_token: tokenData.access_token,
      };
    } else {
      // Publication texte seul
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
```

## Payload — Post Texte

```json
{
  "message": "Contenu du post",
  "access_token": "{page_access_token}"
}
```

## Payload — Post avec Lien

```json
{
  "message": "Découvrez notre nouveau produit !",
  "link": "https://example.com/product",
  "access_token": "{page_access_token}"
}
```

## Payload — Post avec Photo

```json
{
  "message": "Notre équipe en action !",
  "url": "https://example.com/photo.jpg",
  "access_token": "{page_access_token}"
}
```

## Obtenir un Page Access Token Longue Durée

### Étape 1 : User Token → Long-Lived User Token

```
GET https://graph.facebook.com/v18.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={app_id}
  &client_secret={app_secret}
  &fb_exchange_token={short_lived_token}
```

### Étape 2 : Long-Lived User Token → Page Token

```
GET https://graph.facebook.com/v18.0/me/accounts
  ?access_token={long_lived_user_token}
```

Le Page Access Token retourné est automatiquement longue durée (~60 jours).

## Codes d'Erreur

| Code | Sous-code | Signification | Action |
|---|---|---|---|
| `190` | `460` | Token expiré | Renouveler le token |
| `190` | `463` | Token expiré | Renouveler le token |
| `200` | — | Permissions manquantes | Vérifier permissions |
| `4` | — | Rate limit | Attendre 1h minimum |
| `100` | — | Paramètre invalide | Vérifier le payload |
| `368` | — | Contenu bloqué (spam) | Modifier le contenu |

## Rate Limits

- **Pages** : 4800 appels / 24h (200/heure)
- **Publications** : Pas de limite officielle mais ~25 posts/jour recommandé
- **Photos** : 1000 photos/24h par page

## Notes Importantes

1. Les Page Access Tokens longue durée expirent après **~60 jours**
2. Utiliser `/{page_id}/photos` pour les images (pas `/feed` avec `source`)
3. Les publications multi-images nécessitent un album ou des photo IDs individuels
4. Facebook peut bloquer les publications répétitives (anti-spam)
5. Le Graph API v18.0 est la version stable recommandée
