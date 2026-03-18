# onlymore-n8n-automation

Skill de création de workflows n8n + MCP pour l'automatisation inter-filiales ONLYMORE.

## Contexte

ONLYMORE Group utilise n8n (self-hosted ou cloud) comme orchestrateur central pour :
- Synchroniser les données entre filiales
- Automatiser les tâches récurrentes (posts sociaux, reporting, alertes)
- Connecter les services externes (Notion, Supabase, Stripe, Google Cloud, Slack)
- Piloter les agents IA via MCP (Model Context Protocol)

## Instructions

Quand ce skill est invoqué :

### 1. Analyse du besoin
- Identifier les services source et destination
- Définir le trigger (webhook, cron, event Supabase, Notion update)
- Mapper les données à transférer

### 2. Création du workflow n8n
Générer un JSON n8n importable avec :
- **Trigger node** : webhook, schedule, ou event listener
- **Processing nodes** : transformation, filtrage, enrichissement
- **Action nodes** : POST API, update DB, send notification
- **Error handling** : catch node + notification Slack/email en cas d'échec

### 3. Templates par cas d'usage

#### Notion → Supabase sync
- Écouter les changements dans la base Notion (polling ou webhook)
- Mapper les propriétés Notion vers les colonnes Supabase
- Upsert dans la table cible

#### Stripe → Notion reporting
- Webhook Stripe (payment_intent.succeeded)
- Écrire une entrée dans la base Notion "Revenus"
- Calculer les totaux mensuels

#### Social Calendar automation
- Lire les posts "Prêt à publier" depuis Notion
- Poster automatiquement via les APIs sociales (Buffer, LinkedIn API)
- Marquer comme "Publié" dans Notion après succès

#### Alerte Sentinel (Colibri en Vol)
- Event-driven : écouter les signaux Supabase realtime
- Déclencher une action (notification, email, webhook)
- Logger l'événement dans la base monitoring

### 4. MCP Integration
- Configurer les connexions MCP pour Claude Code
- Exposer les endpoints n8n comme outils MCP
- Permettre à Claude d'invoquer des workflows n8n directement

### 5. Livrables
- Fichier JSON n8n importable
- Documentation des variables d'environnement requises
- Instructions de déploiement (n8n cloud ou self-hosted)

## Services connectés

| Service | Usage |
|---|---|
| Notion | Base de données centrale, calendrier éditorial |
| Supabase | Backend COLHYBRI (PostgreSQL + Auth + Realtime) |
| Stripe | Paiements COLHYBRI (€3/mois) |
| Google Cloud | APIs (Maps, OAuth, Cloud Functions) |
| Vercel | Déploiement Next.js |
| Slack | Notifications internes |
| LinkedIn API | Posts automatiques |

## Filiale

ONLYMORE Group (toutes filiales)
