# LinkedIn Connector — Référence API

## Endpoint Principal

```
POST https://api.linkedin.com/v2/ugcPosts
```

## Authentification

- **Type** : OAuth 2.0 Bearer Token
- **Header** : `Authorization: Bearer {access_token}`
- **Header requis** : `X-Restli-Protocol-Version: 2.0.0`

## Scopes Requis

| Scope | Description |
|---|---|
| `w_member_social` | Publier en tant que membre |
| `r_organization_social` | Lire les posts d'organisation |
| `w_organization_social` | Publier en tant qu'organisation |

## Payload — Post Texte Simple

```json
{
  "author": "urn:li:organization:{org_id}",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Contenu du post ici"
      },
      "shareMediaCategory": "NONE"
    }
  },
  "visibility": {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}
```

## Payload — Post avec Image

```json
{
  "author": "urn:li:organization:{org_id}",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Contenu du post avec image"
      },
      "shareMediaCategory": "IMAGE",
      "media": [
        {
          "status": "READY",
          "originalUrl": "https://example.com/image.jpg",
          "mediaType": "IMAGE"
        }
      ]
    }
  },
  "visibility": {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}
```

## Upload d'Image (si nécessaire)

### Étape 1 : Enregistrer l'upload

```
POST https://api.linkedin.com/v2/assets?action=registerUpload
```

```json
{
  "registerUploadRequest": {
    "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
    "owner": "urn:li:organization:{org_id}",
    "serviceRelationships": [
      {
        "relationshipType": "OWNER",
        "identifier": "urn:li:userGeneratedContent"
      }
    ]
  }
}
```

### Étape 2 : Upload binaire

```
PUT {uploadUrl}
Content-Type: image/jpeg
Body: <binary image data>
```

### Étape 3 : Utiliser l'asset dans le post

```json
{
  "media": [
    {
      "status": "READY",
      "media": "urn:li:digitalmediaAsset:{asset_id}"
    }
  ]
}
```

## Codes d'Erreur

| Code | Signification | Action |
|---|---|---|
| `401` | Token expiré ou invalide | Rafraîchir le token via refresh_token |
| `403` | Permissions insuffisantes | Vérifier les scopes OAuth |
| `422` | Payload invalide | Vérifier le format du contenu |
| `429` | Rate limit atteint | Attendre et réessayer (exponential backoff) |
| `500` | Erreur serveur LinkedIn | Réessayer après 60s |

## Rate Limits

- **Publications** : 100 posts/jour par organisation
- **API calls** : 100 requêtes/jour pour ugcPosts (membres), 1000/jour (organisations)
- **Recommandation** : Maximum 2-3 posts/jour par page pour l'engagement optimal

## Refresh Token Flow

```
POST https://www.linkedin.com/oauth/v2/accessToken
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token={refresh_token}
&client_id={client_id}
&client_secret={client_secret}
```

Réponse :
```json
{
  "access_token": "new_access_token",
  "expires_in": 5184000,
  "refresh_token": "new_refresh_token",
  "refresh_token_expires_in": 31536000
}
```

## Notes Importantes

1. Les tokens LinkedIn expirent après **60 jours**
2. Les refresh tokens expirent après **1 an**
3. L'auteur doit être `urn:li:organization:{org_id}` pour les pages entreprise
4. Les images doivent être uploadées séparément via l'API Assets
5. Le contenu est limité à **3000 caractères** par post
