# Google Reviews Connector — Référence Business Profile API

## Produit : Reputation Locale (Upsell)

Ce connecteur fait partie de l'offre **Reputation Locale**, un upsell proposé aux commerçants OnlyMore pour gérer automatiquement leurs avis Google.

## Pricing Upsell Reputation Locale

| Plan | Prix/mois | Inclus |
|---|---|---|
| **Starter** | 0€ | Pas d'accès avis Google |
| **Pro** | 49€/mois | Publications LinkedIn + Facebook |
| **Reputation Locale** | 79€/mois | Pro + Avis Google + Réponses IA |

### Fonctionnalités Reputation Locale

- Fetch automatique des avis Google (quotidien)
- Détection de sentiment (positif/neutre/négatif)
- Génération automatique de réponses IA personnalisées
- Alerte sur avis négatifs (≤ 2 étoiles)
- Dashboard de suivi de la réputation
- Réponse en 1 clic (approbation de la réponse IA)

---

## API : Google Business Profile API

### Endpoint — Lister les Avis

```
GET https://mybusiness.googleapis.com/v4/accounts/{account_id}/locations/{location_id}/reviews
```

### Authentification

- **Type** : OAuth 2.0 Bearer Token
- **Header** : `Authorization: Bearer {access_token}`
- **Scopes** : `https://www.googleapis.com/auth/business.manage`

### Paramètres

| Paramètre | Type | Description |
|---|---|---|
| `pageSize` | integer | Nombre d'avis par page (max 50) |
| `pageToken` | string | Token de pagination |
| `orderBy` | string | Tri : `updateTime desc` |

### Réponse

```json
{
  "reviews": [
    {
      "reviewId": "AbCdEfGh12345",
      "reviewer": {
        "displayName": "Jean Dupont",
        "profilePhotoUrl": "https://lh3.googleusercontent.com/..."
      },
      "starRating": 5,
      "comment": "Excellent service, je recommande vivement !",
      "createTime": "2024-01-15T10:30:00Z",
      "updateTime": "2024-01-15T10:30:00Z",
      "reviewReply": {
        "comment": "Merci beaucoup Jean ! À bientôt.",
        "updateTime": "2024-01-15T14:00:00Z"
      }
    }
  ],
  "averageRating": 4.5,
  "totalReviewCount": 127,
  "nextPageToken": "token_xyz"
}
```

---

## Endpoint — Répondre à un Avis

```
PUT https://mybusiness.googleapis.com/v4/accounts/{account_id}/locations/{location_id}/reviews/{review_id}/reply
```

### Payload

```json
{
  "comment": "Merci pour votre avis ! Nous sommes ravis que vous ayez apprécié notre service."
}
```

### Réponse

```json
{
  "comment": "Merci pour votre avis ! Nous sommes ravis que vous ayez apprécié notre service.",
  "updateTime": "2024-01-15T14:00:00Z"
}
```

---

## Endpoint — Supprimer une Réponse

```
DELETE https://mybusiness.googleapis.com/v4/accounts/{account_id}/locations/{location_id}/reviews/{review_id}/reply
```

---

## Stratégie de Réponse IA

### Avis Positif (4-5 étoiles)

```
Prompt système :
"Tu es le gérant de {merchant_name}. Remercie chaleureusement le client.
Mentionne un détail spécifique de son avis. Invite-le à revenir.
2-3 phrases, ton chaleureux et professionnel."
```

Exemple de réponse générée :
> Merci beaucoup Jean pour ce retour si positif ! Nous sommes ravis que notre service vous ait plu. Au plaisir de vous revoir bientôt chez nous !

### Avis Neutre (3 étoiles)

```
Prompt système :
"Tu es le gérant de {merchant_name}. Remercie le client pour son retour.
Reconnais les points d'amélioration mentionnés. Propose une solution.
2-3 phrases, ton empathique et constructif."
```

### Avis Négatif (1-2 étoiles)

```
Prompt système :
"Tu es le gérant de {merchant_name}. Présente des excuses sincères.
Ne sois pas défensif. Propose une solution concrète (invitation à revenir, contact direct).
3-4 phrases, ton humble et orienté solution."
```

Exemple de réponse générée :
> Nous sommes vraiment désolés de votre expérience, Marie. Ce n'est pas le niveau de service que nous souhaitons offrir. Nous aimerions comprendre ce qui s'est passé — pourriez-vous nous contacter au 01 23 45 67 89 ? Nous ferons tout pour rattraper cela.

---

## Configuration OAuth Google

### Étape 1 : Créer les credentials

1. Aller sur Google Cloud Console
2. Activer l'API "Google My Business" / "Business Profile API"
3. Créer des identifiants OAuth 2.0
4. Configurer l'URI de redirection

### Étape 2 : Obtenir le token

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

code={auth_code}
&client_id={client_id}
&client_secret={client_secret}
&redirect_uri={redirect_uri}
&grant_type=authorization_code
```

### Étape 3 : Rafraîchir le token

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

---

## Codes d'Erreur

| Code | Signification | Action |
|---|---|---|
| `401` | Token expiré | Rafraîchir via refresh_token |
| `403` | Pas d'accès à cette location | Vérifier les permissions du compte |
| `404` | Location non trouvée | Vérifier le location_id / place_id |
| `429` | Rate limit | Attendre et réessayer |
| `500` | Erreur serveur Google | Réessayer après 60s |

## Rate Limits

- **Requêtes** : 60 requêtes/minute par projet
- **Reviews** : Pas de limite spécifique documentée
- **Replies** : Pas de limite spécifique documentée
- **Recommandation** : 1 fetch/jour par location est largement suffisant

## Notes Importantes

1. L'API Google Business Profile est en cours de migration vers la v1
2. Les tokens Google n'expirent pas tant que le refresh_token est valide
3. Le `place_id` Google Maps ≠ `location_id` Business Profile (utiliser l'API de mapping)
4. Les réponses aux avis apparaissent immédiatement sur Google Maps
5. Google peut retirer des avis qui violent leurs policies (pas de contrôle côté API)
6. Maximum **1 réponse par avis** (pas de conversation)
