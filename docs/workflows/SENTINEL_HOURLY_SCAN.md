# SENTINEL_HOURLY_SCAN — Runbook d'import & activation

Workflow n8n qui fait tourner `@sentinel-monitor` toutes les heures pile
(UTC), scanne `AGENTS_LOG`, produit des alertes dans `SENTINEL_ALERTS`
et pushe un email à `onlymore2024@gmail.com` pour tout niveau `CRITIQUE`.

> **Contexte d'activation** : la session Claude Code qui a préparé ce
> workflow n'avait pas le MCP n8n disponible. L'import doit être fait
> manuellement par Florent. Tant que l'import n'est pas confirmé, la
> bascule officielle reste **NO-GO** (cf. `docs/test-reports/sentinel-activation.md`).

## 1. Ressources existantes (déjà créées)

| Ressource | ID | URL |
|---|---|---|
| Page Notion parente | `34998dff-f6a6-81fe-8032-e3068f34a73b` | https://www.notion.so/34998dfff6a681fe8032e3068f34a73b |
| DB `SENTINEL_ALERTS` | `7afd4d55-33d9-4343-ba14-510f179321bc` | https://www.notion.so/7afd4d5533d94343ba14510f179321bc |
| Data source SENTINEL_ALERTS | `collection://43aac0b9-1459-4925-bfc1-25fec070b8d6` | — |
| DB `AGENTS_LOG` | `f93b807b-09a0-43af-b710-ce5e6527dd5f` | https://www.notion.so/f93b807b09a043afb710ce5e6527dd5f |
| Data source AGENTS_LOG | `collection://95f813af-1e1a-4663-821a-e1dbf5abb51c` | — |

## 2. Import du workflow dans n8n

1. Ouvrir https://onlymore.app.n8n.cloud → Workflows → *Import from file*.
2. Sélectionner `docs/workflows/sentinel-hourly-scan.n8n.json`.
3. n8n détecte 8 nodes : `Cron 0 * * * *` → `Compute scan window` →
   `Fetch AGENTS_LOG window` → `Detect rules 1-3` → `Self-log AGENTS_LOG`
   + `Explode alerts` → `Push alert to SENTINEL_ALERTS` → `IF niveau == CRITIQUE` →
   `Push email CRITIQUE`.
4. **Remplacer les credentials placeholders** :
   - Sur les 3 nodes Notion : sélectionner le credential existant
     `ONLYMORE Notion` (ou créer OAuth2 Internal Integration avec accès
     aux deux DB ci-dessus). Les trois `__REPLACE_NOTION_CRED_ID__`
     doivent être remplacés par la même référence.
   - Sur le node Gmail `Push email CRITIQUE` : sélectionner ou créer un
     credential OAuth2 sur `onlymore2024@gmail.com`. Remplacer
     `__REPLACE_GMAIL_CRED_ID__`.
5. Sauvegarder le workflow (en **inactif** pour l'instant, toggle OFF).

## 3. Test manuel obligatoire avant activation (Phase 3)

1. Dans le node `Compute scan window`, **remplacer temporairement** le
   calcul de fenêtre par une fenêtre artificielle incluant les 24+
   entrées bootstrap :
   ```js
   const windowStart = '2026-04-21T08:00:00Z';
   const windowEnd   = '2026-04-21T11:00:00Z';
   const scanTraceId = 'sentinel-scan-TEST-2026042110';
   ```
2. Cliquer *Execute Workflow*.
3. Vérifier sur chaque node :
   - **Fetch AGENTS_LOG window** : ≥ 24 items remontés.
   - **Detect rules 1-3** : `counts.CRITIQUE=0, HAUTE=0, MOYENNE=0`.
     Les 24 entrées existantes sont conformes. Une exception : la
     suite adversariale a produit 5 entrées `policy-refusal`, mais
     toutes ont `agent` différent (crownium, colhybri, dojuku, finance,
     plumaya), donc aucune ne déclenche `REFUSAL_BURST` (seuil = 3 par
     agent).
   - **Self-log AGENTS_LOG** : 1 nouvelle entrée AGENTS_LOG
     `agent=sentinel-monitor, scope=log, trace_id=sentinel-scan-TEST-...`.
   - **Push alert / IF / Email** : 0 exécution (rien à pousser).
4. Si tout est conforme → restaurer le `Compute scan window` original
   (retour au calcul dynamique) et sauvegarder.
5. Si un FAIL → **ne pas activer**, patcher d'abord.

## 4. Activation cron (Phase 4)

1. Toggle *Active* ON sur la fiche workflow.
2. Dans *Executions*, vérifier que le prochain run est planifié à
   `HH:00:00Z` suivant.
3. Après le premier run réel :
   - Vérifier dans AGENTS_LOG la présence de l'entrée
     `sentinel-scan-YYYYMMDDHH` (≈ 1 min après l'heure ronde).
   - Vérifier dans SENTINEL_ALERTS que 0 alerte CRITIQUE apparaît (sauf
     si anomalie réelle).
4. Pendant 48 h : observer la série de self-logs. Toute heure ronde
   sans self-log = incident SENTINEL (à escalader TITAN).

## 5. TODO d'extension (pas bloquants pour activation MVP)

Le workflow MVP couvre **RULE 2 (REFUSAL_BURST)** seulement. Les règles
1 et 3 nécessitent de câbler des sources supplémentaires :

- **RULE 1 — MCP_NO_LOG** : ajouter des nodes HTTP Request pour
  - Vercel `https://api.vercel.com/v6/deployments?since={{window_start_ms}}`
  - Supabase audit logs : `https://api.supabase.com/v1/projects/{ref}/logs?iso_timestamp_start=...`
  - n8n executions : `https://onlymore.app.n8n.cloud/api/v1/executions?startedAfter=...`
  puis dans `Detect rules 1-3`, matcher chaque event externe à une
  entrée AGENTS_LOG ± 5 min. Absence → alerte `MCP_NO_LOG` niveau
  `CRITIQUE`.
- **RULE 3 — AGENT_SILENT** : ajouter un node HTTP Request GitHub
  `GET /repos/FLOW2203/onlymore-comande-center-/commits?since=...`,
  extraire les agents cités en préfixe de commit message
  (`<agent-name>: ...`), puis comparer avec `AGENTS_LOG` sur la
  fenêtre. Agent cité mais aucune entrée → alerte `AGENT_SILENT`
  niveau `MOYENNE`.

Ces extensions peuvent être poussées via un commit `sentinel-monitor:
extend rules 1 and 3` après baseline MVP validée (2 semaines).

## 6. Rollback

Si le workflow produit du bruit ou des faux positifs :

1. **Désactiver** (toggle OFF) — ne pas supprimer.
2. Logger dans AGENTS_LOG : `agent=sentinel-monitor, statut=blocked,
   notes=disabled due to <reason>`.
3. Investiguer via les `Executions` précédentes.
4. Patch → re-test Phase 3 → re-activation.

## 7. Zero hallucination — sources de vérité

- Notion AGENTS_LOG : source unique pour le scan (les autres sources
  peuvent mentir, AGENTS_LOG est le journal officiel).
- Siège : **Rodilhan 30230**. Jamais Orléans, jamais Nîmes seul.
- Ref Supabase interdite : `ydzuywqzzbpwytwwfmeq` — bannie dans toutes
  les URL de node.
- Signature email : **Florent Gibert** — dans le body du email CRITIQUE.

---
Runbook sentinel — Florent Gibert
