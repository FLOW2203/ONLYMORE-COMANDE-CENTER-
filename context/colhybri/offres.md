# COLHYBRI -- Offres & Modèle Économique

## Vue d'Ensemble

COLHYBRI opère un modèle hybride (B2C + B2B) basé sur des micro-abonnements récurrents. Le mécanisme central est le **pool de solidarité**, alimenté par les abonnés citoyens et redistribué sous forme de bons d'achat chez les commerçants partenaires. Le split fondamental est **75/25**: 75% redistribué, 25% pour le fonctionnement.

## Produits

### 1. Abonnement Solidarité (B2C)

| Élément | Détail |
|---------|--------|
| Prix | 3 euros/mois |
| Cible | Citoyens urbains, 25-45 ans, sensibles au pouvoir d'achat et au local |
| Paiement | Carte bancaire via Stripe, prélèvement mensuel |
| Engagement | Sans engagement, résiliable à tout moment |

**Mécanisme**: L'abonné contribue 3 euros/mois au pool de solidarité local de son quartier. En contrepartie, il reçoit:
- Accès aux offres exclusives des commerçants partenaires
- Badge solidaire (visible dans l'app et partageable sur les réseaux)
- Gamification: points d'impact, niveaux, classement quartier
- Tableau de bord personnel: suivi de l'impact de ses contributions

**Parcours utilisateur**:
1. Inscription via app mobile ou web (email + code postal)
2. Sélection du quartier d'ancrage
3. Paiement Stripe (3 euros/mois)
4. Accès immédiat au dashboard et aux offres commerçants
5. Notification mensuelle: "Votre contribution a généré X euros de bons d'achat ce mois-ci"

### 2. Abonnement Commerçant (B2B)

| Élément | Détail |
|---------|--------|
| Prix | 10 euros/mois |
| Cible | TPE/PME commerce de proximité (boulangeries, restaurants, fleuristes, librairies...) |
| Paiement | Carte bancaire ou prélèvement SEPA via Stripe |
| Engagement | Sans engagement, résiliable à tout moment |

**Mécanisme**: Le commerçant rejoint le réseau COLHYBRI de son quartier. Il reçoit:
- Des clients via le pool solidaire (bons d'achat redistribués)
- Visibilité locale augmentée (référencement dans l'app et le site)
- Dashboard commerçant: suivi des bons utilisés, nouveaux clients, impact
- Badge "Commerçant Solidaire" (vitrine physique + digital)
- Accès aux statistiques de fréquentation du quartier

**Onboarding zero-friction**:
1. Import automatique via Google Places (nom, adresse, horaires, photos)
2. Le commerçant valide ses informations en 2 minutes
3. Ajout du moyen de paiement
4. Actif immédiatement dans le réseau

### 3. Gift Cards Solidaires

| Élément | Détail |
|---------|--------|
| Split | 80% valeur faciale reversée au commerçant / 20% pool solidarité |
| Formats | Digitale (email/SMS) et physique (via partenaires locaux) |
| Montants | 10, 20, 30, 50 euros |
| Expiration | 12 mois à compter de l'achat |

**Cas d'usage**: Cadeaux d'anniversaire, fêtes, remerciements. Chaque gift card a un double impact: plaisir pour le destinataire, solidarité pour le quartier.

## Mécanique du Pool Solidarité

### Le Split 75/25

```
Contributions B2C (3 euros/mois x N abonnés)
    |
    |-- 75% --> Pool Solidarité --> Bons d'achat chez commerçants partenaires
    |
    |-- 25% --> COLHYBRI --> Fonctionnement, tech, croissance, acquisition
```

### Cycle M vers M+1
- Les contributions collectées au **mois M** alimentent les bons d'achat redistribués au **mois M+1**
- Ce décalage d'un mois permet la transparence comptable et la prévisibilité
- **Tableau de bord public par quartier**: chaque citoyen peut voir en temps réel combien a été collecté et redistribué dans son quartier

### Règles de Redistribution
- Les bons sont distribués aux bénéficiaires identifiés par critères sociaux (RSA, étudiants boursiers, seniors isolés) via des partenaires associatifs locaux
- Un bon = un commerçant partenaire du quartier
- Montant unitaire des bons: [À COMPLÉTER]
- Critères d'éligibilité bénéficiaires: [À COMPLÉTER]

## Unit Economics

| Métrique | Valeur |
|----------|--------|
| Break-even estimé | ~7 476 abonnés B2C (Year 3) |
| Revenue B2C mensuel à break-even | 7 476 x 3 euros = 22 428 euros |
| Revenue B2B estimé | [À COMPLÉTER] |
| LTV/CAC cible | [À COMPLÉTER] |
| Churn rate cible B2C | [À COMPLÉTER] |
| Churn rate cible B2B | [À COMPLÉTER] |
| Marge brute cible | [À COMPLÉTER] |
| CAC B2C estimé | [À COMPLÉTER] |
| CAC B2B estimé | [À COMPLÉTER] |

## Canal Dynabuy

| Élément | Détail |
|---------|--------|
| Partenaire | Dynabuy |
| Accès | Réseau de 375 000 TPE/PME en France |
| Commission | 10% sur les abonnements commerçants générés via Dynabuy |
| Statut | [À COMPLÉTER] |

## Stack Technique

| Composant | Technologie | Référence |
|-----------|-------------|-----------|
| Frontend | React + Vite + TypeScript | GitHub org: FLOW2203 |
| Backend / DB | Supabase (PostgreSQL) | Ref: isuzbpzwxcagtnbosgjl |
| Paiement | Stripe | Product IDs: [À COMPLÉTER] |
| Hosting | Vercel | Voir projets ci-dessous |
| Auth | Supabase Auth | Ref: isuzbpzwxcagtnbosgjl |
| Storage | Supabase Storage | Ref: isuzbpzwxcagtnbosgjl |
| Edge Functions | Supabase Edge Functions | Ref: isuzbpzwxcagtnbosgjl |

### Projets Vercel
- **colhybri** (prj_Len92CpsvpcnAHK2iIy7ODeT6ObG): site principal / app
- **colhybri-games**: module gamification
- **colhybri-vision**: module IA / analytics

### Repos GitHub (org: FLOW2203)
- [À COMPLÉTER]

## Roadmap Commerciale

| Phase | Scope | Date | Statut |
|-------|-------|------|--------|
| Phase 1 | Lancement local (Nîmes/Gard) | [À COMPLÉTER] | [À COMPLÉTER] |
| Phase 2 | Extension régionale (Occitanie) | [À COMPLÉTER] | Planifié |
| Phase 3 | Déploiement national | [À COMPLÉTER] | Planifié |
| Phase 4 | Expansion européenne | [À COMPLÉTER] | Vision |

### Jalons Phase 1
- [ ] MVP app déployé sur Vercel
- [ ] 50 premiers commerçants onboardés (Nîmes centre-ville)
- [ ] 500 premiers abonnés B2C
- [ ] Premier cycle de redistribution M vers M+1 complété
- [ ] Partenariat 1 association locale validé

## Indicateurs Clés (KPIs)

### KPIs Produit
- Nombre d'abonnés B2C actifs
- Nombre de commerçants B2B actifs
- Montant total redistribué (pool solidarité)
- Taux de rétention M+3, M+6, M+12
- NPS (Net Promoter Score)

### KPIs Business
- MRR (Monthly Recurring Revenue)
- Ratio LTV/CAC
- Churn rate mensuel
- Nombre de quartiers actifs
- Taux de conversion visiteur vers abonné

### KPIs Impact
- Nombre de bénéficiaires du pool solidarité
- Montant moyen redistribué par quartier par mois
- Nombre de commerçants ayant reçu de nouveaux clients via COLHYBRI
- Score d'engagement communautaire (gamification)
