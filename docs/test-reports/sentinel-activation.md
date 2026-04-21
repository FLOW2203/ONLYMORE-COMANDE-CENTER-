# Activation @sentinel-monitor — Rapport de bascule

*Run : 2026-04-21T10:30:00Z → 2026-04-21T10:50:00Z*
*Session : préparation complète en local + Notion. Activation cron déléguée à import manuel (MCP n8n absent de la session).*

## 1. Pré-checks

| Check | Résultat |
|---|---|
| Agent sentinel-monitor (require_logging=true) | **OK** — `.claude/agents/sentinel-monitor.md:require_logging: true` |
| HEAD main | **OK** — `22e675c` |
| AGENTS_LOG Notion accessible | **OK** — DS `collection://95f813af-1e1a-4663-821a-e1dbf5abb51c` fetchable |
| n8n instance reachable | **OK** — `https://onlymore.app.n8n.cloud` répond HTTP 403 (auth wall, service up) |
| **MCP n8n (création programmatique)** | **KO** — absent de la liste de tools de la session. Impact : Phase 2 produit un JSON exportable + runbook, Phase 4 bascule = **NO-GO** tant que import manuel non fait. |

Entrée AGENTS_LOG bootstrap du blocage : `trace_id=sentinel-activation-preflight`, page `34998dff-f6a6-812c-808e-f301803db634`.

## 2. Notion SENTINEL_ALERTS

| Item | Valeur |
|---|---|
| Page parent créée | https://www.notion.so/34998dfff6a681fe8032e3068f34a73b |
| Page ID | `34998dff-f6a6-81fe-8032-e3068f34a73b` |
| Database créée | https://www.notion.so/7afd4d5533d94343ba14510f179321bc |
| Database ID | `7afd4d55-33d9-4343-ba14-510f179321bc` |
| Data source | `collection://43aac0b9-1459-4925-bfc1-25fec070b8d6` |
| Parent Command Center | **OK** — sous `31b98dfff6a681298dcbe37403faca80` |

**Colonnes vérifiées : 9/9**
1. `detail` (title, rich text ≤ 500)
2. `timestamp` (date with time UTC)
3. `niveau` (select : CRITIQUE/HAUTE/MOYENNE/INFO)
4. `regle_violee` (select : MCP_NO_LOG/REFUSAL_BURST/AGENT_SILENT/FRONTMATTER_DRIFT/OTHER)
5. `agent` (select : 14 options des 14 agents)
6. `mcp_source` (select : notion/supabase/vercel/n8n/gdrive/gmail/calendar/canva/miro/netlify/none)
7. `scan_trace_id` (rich text, format `sentinel-scan-YYYYMMDDHH`)
8. `traite` (checkbox, default false)
9. `action_ceo` (rich text, action CEO requise)

## 3. Workflow n8n

| Item | Valeur |
|---|---|
| Nom | `SENTINEL_HOURLY_SCAN` |
| Fichier source | `docs/workflows/sentinel-hourly-scan.n8n.json` |
| Cron expression | `0 * * * *` (UTC) |
| Fenêtre scan | `now - 65 min` → `now` (overlap 5 min) |
| Nodes | **9 configurés** (Cron → window → fetch → detect → [self-log + explode → push Notion → if CRITIQUE → email]) |
| Credentials à renseigner | 3 placeholders `__REPLACE_NOTION_CRED_ID__` + 1 `__REPLACE_GMAIL_CRED_ID__` (cf. runbook §2.4) |
| URL workflow n8n | **non applicable** tant que import manuel non fait |
| Runbook d'import | [`docs/workflows/SENTINEL_HOURLY_SCAN.md`](../workflows/SENTINEL_HOURLY_SCAN.md) |

### Détection — état des règles

| Règle | Niveau | MVP | Extension future |
|---|---|---|---|
| RULE 1 — MCP_NO_LOG | CRITIQUE | placeholder | câbler Vercel API + Supabase audit + n8n executions |
| RULE 2 — REFUSAL_BURST (≥3 refusals/agent/fenêtre) | HAUTE | **câblée** | — |
| RULE 3 — AGENT_SILENT | MOYENNE | placeholder | câbler GitHub commits + n8n executions |
| RULE 4 — FRONTMATTER_DRIFT | INFO | non implémentée | scan `.claude/agents/*.md` frontmatter diff |
| Self-log sentinel | — | **câblée** | — |

## 4. Test manuel Phase 3

| Item | Valeur |
|---|---|
| Script | `scripts/sentinel-scan-local.mjs` (oracle local, réutilisable CI) |
| Fenêtre testée | `2026-04-21T08:00:00Z` → `2026-04-21T11:00:00Z` (3 h, couvre tout le baseline v1) |
| Entrées scannées | **26** (bootstrap + preflight + 18 test run + 3 backlog + re-run adv + deploy + activation preflight) |
| Alertes générées | **0** (attendu : 0) |
| `refusal_by_agent` observé | crownium-lead: 2, colhybri-lead: 1, dojuku-lead: 1, finance-lead: 1, plumaya-lead: 1 |
| Seuil REFUSAL_BURST | ≥3 — **non franchi** par aucun agent |
| Self-log créé | **OK** — page `34998dff-f6a6-8178-9e7e-dd8820d8d401` (trace `sentinel-scan-dryrun-c8c321f`) |
| Test positif (injection 3 refusals crownium) | **PASS** — 1 alerte HAUTE REFUSAL_BURST générée comme attendu |
| Verdict test | **PASS** (négatif 0 bruit + positif détection correcte) |

## 5. Activation cron

| Item | Valeur |
|---|---|
| Toggle ON | **non effectué** (dépend import manuel dans n8n) |
| Prochain run programmé | **HH:00:00Z** suivant le toggle ON |
| Statut actuel | **EN ATTENTE IMPORT MANUEL** |
| Action Florent requise | Import `docs/workflows/sentinel-hourly-scan.n8n.json` dans n8n cloud + credentials Notion/Gmail + toggle ON (cf. runbook §2-4) |

## 6. URLs essentielles

| Ressource | URL |
|---|---|
| Page Notion SENTINEL_ALERTS | https://www.notion.so/34998dfff6a681fe8032e3068f34a73b |
| Database SENTINEL_ALERTS | https://www.notion.so/7afd4d5533d94343ba14510f179321bc |
| Workflow JSON | `docs/workflows/sentinel-hourly-scan.n8n.json` |
| Runbook | `docs/workflows/SENTINEL_HOURLY_SCAN.md` |
| Oracle local | `scripts/sentinel-scan-local.mjs` |
| AGENTS_LOG (filtre sentinel) | https://www.notion.so/f93b807b09a043afb710ce5e6527dd5f?filter=agent-equals-sentinel-monitor |
| Agent definition | `.claude/agents/sentinel-monitor.md` |

## 7. Recommandation

### GO bascule officielle : **NON** (EN ATTENTE)

Raison : le MCP n8n n'était pas accessible depuis cette session Claude Code, le toggle activation cron doit donc être fait manuellement par Florent sur `onlymore.app.n8n.cloud`.

### Actions Florent avant bascule OFFICIELLE

1. Ouvrir https://onlymore.app.n8n.cloud → Import workflow depuis `docs/workflows/sentinel-hourly-scan.n8n.json`.
2. Remplacer les 4 credentials placeholders (3 × Notion, 1 × Gmail `onlymore2024@gmail.com`).
3. Exécuter un run manuel avec la fenêtre de test (cf. runbook §3) → vérifier 0 fausse alerte.
4. Si test OK → toggle ON. Prochain run automatique à `HH:00:00Z`.
5. Logger le toggle ON dans AGENTS_LOG avec `trace_id=sentinel-activation-cron-on`.

### Critère d'acceptation bascule réussie

- Dans les 65 min qui suivent le toggle ON : 1 entrée AGENTS_LOG `agent=sentinel-monitor, scope=log, trace_id=sentinel-scan-YYYYMMDDHH`.
- Dans SENTINEL_ALERTS : 0 ligne CRITIQUE sur 48 h (sauf incident réel).

### Si GO validé par Florent

- Mettre à jour ce rapport (`docs/test-reports/sentinel-activation.md`) avec :
  - `statut: ACTIF`
  - `toggle_on_timestamp: ...`
  - `workflow_url: https://onlymore.app.n8n.cloud/workflow/<id>`
- Commit `sentinel-monitor: cron activated <timestamp>`.

---
Bascule sentinel — Florent Gibert
