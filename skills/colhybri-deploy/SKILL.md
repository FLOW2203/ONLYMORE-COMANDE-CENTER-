# colhybri-deploy

Skill de déploiement pour l'application COLHYBRI (colhybri.com).

## Contexte

COLHYBRI est une app Next.js 14 déployée sur Vercel avec :
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Paiement** : Stripe (abonnement €3/mois)
- **Auth** : Email/password + Google OAuth via Supabase
- **DNS** : Hostinger → Vercel

## Instructions

Quand ce skill est invoqué :

1. **Vérifier l'état du déploiement Vercel** :
   - Lancer `vercel --prod` ou vérifier le statut via `vercel ls`
   - Confirmer que le build Next.js passe sans erreur
   - Vérifier les variables d'environnement Vercel (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY)

2. **Valider Supabase** :
   - Vérifier que les migrations sont à jour : `supabase db push`
   - Confirmer que les RLS policies sont actives sur toutes les tables publiques
   - Tester la connexion auth (email + OAuth Google)

3. **Valider Stripe** :
   - Vérifier que le webhook Stripe pointe vers la bonne URL de production
   - Confirmer le price ID du plan €3/mois
   - Tester le flow d'abonnement en mode test si demandé

4. **Post-déploiement** :
   - Vérifier que colhybri.com répond (HTTP 200)
   - Tester les routes critiques : `/`, `/login`, `/profile`, `/subscribe`
   - Confirmer que le SSL est actif

## Commandes utiles

```bash
# Déployer en production
vercel --prod

# Vérifier les logs Vercel
vercel logs <deployment-url>

# Push les migrations Supabase
supabase db push

# Vérifier le statut Supabase
supabase status
```

## Filiale

COLHYBRI — colhybri.com
