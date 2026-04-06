# ONLYMORE Command Center — Claude Code Configuration

## Project Overview

ONLYMORE Group Command Center — React/Next.js dashboard managing 4 subsidiaries (filiales) with 8 permanent AI agents, 14+ custom skills, and 7 live MCP integrations.

## Filiale Context Routing

**CRITICAL RULE**: Before producing any deliverable (content, code, analysis, design), load the relevant filiale context from `context/`.

| Keyword in task | Context to load |
|----------------|-----------------|
| COLHYBRI, commerce local, solidaire, 75/25 | `context/colhybri/` |
| CROWNIUM, football, sport, financement sportif, UEFA | `context/crownium/` |
| DOJUKU, SHINGI, jeu vidéo, kata, martial arts | `context/dojuku-shingi/` |
| PLUMAYA, édition, univers narratif, IP | `context/plumaya/` |
| ONLYMORE, groupe, holding, investor, legal | `context/onlymore-group/` |

**Default**: If no filiale is identified, load `context/onlymore-group/`.

**Multi-filiale tasks**: If a task spans multiple filiales, load all relevant contexts.

## Agent Assignment

8 permanent agents are available. Match tasks to the right agent:

| Agent | Role | Primary Use |
|-------|------|-------------|
| ALPHA | Strategy & Decision | Business strategy, positioning, roadmap |
| FORGE | Builder & Creator | Code, features, technical implementation |
| VAULT | Data & Finance | Financial models, analytics, compliance |
| SHIELD | Security & Legal | ACPR, RGPD, security audits, legal review |
| HERALD | Communication | LinkedIn, content, PR, brand voice |
| NEXUS | Integration & Ops | MCP, n8n workflows, API connections |
| SENTINEL | Monitoring & QA | Testing, audits, quality checks |
| TITAN | Infrastructure | DevOps, Vercel, Supabase, architecture |

## MCP Integrations

- **Supabase** — Database, auth, edge functions
- **Vercel** — Deployment, domains, analytics
- **Notion** — Knowledge base, TODO DB, editorial calendar
- **n8n** — Workflow automation (onlymore.app.n8n.cloud)
- **Gmail** — Notifications, outreach
- **Canva** — Design assets, brand kits
- **Google Calendar** — Scheduling, reminders
- **Composio LinkedIn** — Publish to 4 LinkedIn pages, auto OAuth refresh

## Notion TODO DB

- **Database ID**: `88d1d8cb-614b-45b4-be62-e6820d8049d9`
- **Data Source**: `collection://fd098f9f-202e-41db-9cdb-042c40cff516`
- **Key properties**: Action, Statut, Priorite, Entite, Agent IA, Auto-Eligible, Status Skill, ROI Estime, Frequence, Trigger Pattern

## Skill Automation (Boucle de Chasse)

When a task is performed manually more than 3 times:
1. Flag it as a skill candidate in Notion (Status Skill = "candidat")
2. Document the trigger pattern
3. Estimate ROI (faible/moyen/fort)
4. Use skill-creator to formalize if ROI >= moyen

## Taskbot Rules

Tasks marked `Auto-Eligible = true` in the TODO DB are candidates for autonomous execution:
- **Level 1 (current)**: n8n scans hourly, notifies Florent for approval
- **Level 2 (target)**: Routine tasks (LinkedIn posts, audits, reports) execute automatically
- **Level 3 (Q3 2026)**: Multi-agent routing with feedback loops

## Code Standards

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Language**: French for content/brand, English for code/comments
