# colhybri-security

Skill d'audit sécurité pour COLHYBRI — OWASP Top 10 + Supabase RLS + RGPD.

## Contexte

COLHYBRI manipule des données utilisateurs (profils, géolocalisation GPS, abonnements Stripe). La sécurité est critique.

Stack : Next.js 14, Supabase (PostgreSQL + RLS), Stripe, Google OAuth.

## Instructions

Quand ce skill est invoqué, exécuter un audit en 7 phases :

### Phase 1 — RLS Supabase
- Lister toutes les tables avec `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
- Vérifier que chaque table a au moins une RLS policy active
- Identifier les tables sans policy (exposition données publiques)
- Proposer des policies `USING (auth.uid() = user_id)` pour chaque table non protégée

### Phase 2 — Authentification
- Vérifier la config Supabase Auth (providers actifs)
- Tester le flow password reset (URL de redirection correcte)
- Valider la config OAuth Google (client ID, redirect URIs)
- Vérifier que les tokens JWT expirent correctement

### Phase 3 — Injection & XSS (OWASP A03/A07)
- Scanner les composants React pour du `dangerouslySetInnerHTML`
- Vérifier la sanitisation des inputs utilisateur
- Checker les API routes pour l'injection SQL (parameterized queries)
- Valider les headers CSP dans `next.config.js`

### Phase 4 — Secrets & Config (OWASP A05)
- Vérifier que `.env.local` est dans `.gitignore`
- Scanner le repo pour des secrets exposés (API keys, tokens)
- Confirmer que les `NEXT_PUBLIC_*` vars ne contiennent pas de secrets server-side
- Vérifier les permissions du service role key Supabase

### Phase 5 — Stripe & Paiements
- Valider la signature des webhooks Stripe
- Vérifier que le mode test vs live est correctement configuré
- Confirmer que les montants ne sont pas modifiables côté client

### Phase 6 — RGPD
- Vérifier la présence d'une page de politique de confidentialité
- Confirmer le mécanisme de suppression de compte / données utilisateur
- Vérifier le consentement cookies (banner RGPD)
- Valider que les données GPS ne sont pas stockées sans consentement

### Phase 7 — Rapport
- Générer un rapport avec : vulnérabilités trouvées, sévérité (Critique/Haute/Moyenne/Basse), recommandations
- Classer par priorité de correction

## Filiale

COLHYBRI — colhybri.com
