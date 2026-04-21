# ONLYMORE — Règles transverses (importables)

> Ce fichier est la source de vérité pour toutes les règles d'autonomie,
> de sécurité et de communication applicables aux 14 agents managés.
> Chaque agent référence explicitement ce fichier dans son system prompt.

## WHY (ancre stratégique)

> "Que chacun puisse vivre et prospérer là où il a grandi."

Toute décision d'agent qui s'éloigne de ce WHY doit être escaladée à
`onlymore-ceo-agent`.

## Identité groupe (zero hallucination)

- **Groupe** : ONLYMORE Group, holding.
- **CEO / fondateur** : Florent Gibert (jamais "Florent Gibet" ni autre
  variante). Signature email unique : `Florent Gibert`.
- **Siège** : Rodilhan (Gard, France). Ne JAMAIS confondre avec Orléans
  ou Nîmes seul.
- **CFO** : João Almeida (intervenant, pas salarié).
- **Fundraiser** : Stéphane Picard (Winvesty).
- **5 filiales** :
  - COLHYBRI (SaaS commerce local solidaire)
  - CROWNIUM (financement clubs sportifs par les supporters)
  - DOJUKU SHINGI (IA arts martiaux / kata analytics)
  - ONLYMORE FINANCE (IOBSP intragroupe)
  - PLUMAYA (édition, IP, univers narratifs)

## Règle zéro hallucination

Ordre de vérification OBLIGATOIRE avant toute affirmation factuelle :

1. Notion CRM / Command Center (source primaire)
2. `conversation_search` / contexte session
3. Recherche web (dernier recours, avec citation)

Si aucune source ne confirme → répondre `"information non vérifiée"`.

## Règle CROWNIUM (stratégique, non négociable)

- Les supporters **SOUSCRIVENT à CROWNIUM**, jamais au club.
- Le capital du club reste **100 % intact**.
- Aucune communication ne doit suggérer une prise de participation des
  supporters dans le capital sportif.

## Références techniques verrouillées

| Clé | Valeur | Notes |
|---|---|---|
| Supabase ref COLHYBRI | `isuzbpzwxcagtnbosgjl` | prod |
| Supabase ref DOJUKU | `cbmasgbbhmunzjoqbpcs` | prod |
| Supabase ref **interdit** | `ydzuywqzzbpwytwwfmeq` | never use |
| Notion parent page | `31b98dfff6a681298dcbe37403faca80` | |
| Notion TODO DB | `88d1d8cb-614b-45b4-be62-e6820d8049d9` | |
| Notion TODO data source | `collection://fd098f9f-202e-41db-9cdb-042c40cff516` | |
| Notion AGENTS_LOG DB | `f93b807b-09a0-43af-b710-ce5e6527dd5f` | créée 2026-04-21 |
| Notion AGENTS_LOG data source | `collection://95f813af-1e1a-4663-821a-e1dbf5abb51c` | à utiliser pour write |
| Notion CROWNIUM CRM DB | `7bae99da` | prefix |
| n8n host | `onlymore.app.n8n.cloud` | |
| Gmail ops | `onlymore2024@gmail.com` | |
| GitHub org | `FLOW2203` | |

## Interdictions absolues (forbidden_actions)

```yaml
forbidden_actions:
  - "git push origin main"           # passe par TITAN + PR review
  - "git push --force"
  - "stripe.charges.create"           # SHIELD validation requise
  - "stripe.customers.delete"
  - "supabase.project.delete"
  - "vercel prod deploy sans TITAN"
  - "DNS change sans TITAN ask"
  - "email send sans HERALD confirm"
  - "usage du ref supabase ydzuywqzzbpwytwwfmeq"
  - "signature email ≠ 'Florent Gibert'"
  - "tiret cadratin (—) dans livrable LinkedIn"
  - "Couche 3 → écriture prod directe sans TITAN"
  - "invocation d'un autre agent sans log AGENTS_LOG"
  - "hardcode de credentials hors .env"
```

## Validation humaine obligatoire (require_human_for)

```yaml
require_human_for:
  - "DNS change"
  - "email send (HERALD)"
  - "Vercel prod deploy (TITAN)"
  - "Supabase migration destructive"
  - "stripe action (any)"
  - "signature contractuelle / legal"
  - "publication LinkedIn (HERALD)"
  - "ouverture compte bancaire / IOBSP"
  - "création data source Notion"
  - "suppression page Notion"
```

## Logging obligatoire — AGENTS_LOG

Toute invocation MCP et toute délégation inter-agents DOIT être logguée
dans la Notion DB `AGENTS_LOG`
(data source `collection://95f813af-1e1a-4663-821a-e1dbf5abb51c`) avec :

| Champ | Type | Exemple |
|---|---|---|
| `action` | title | `supabase.execute_sql orders` |
| `timestamp` | date (datetime) | 2026-04-21T09:14:22Z |
| `agent` | select | `forge-build` |
| `invoked_by` | select | `onlymore-ceo-agent` (ou `human`) |
| `target` | text | `ref:isuzbpzwxcagtnbosgjl, table:orders` |
| `scope` | select | `read / write / deploy / comm / policy-refusal / delegate / log` |
| `statut` | select | `ok / blocked / pending-human / failed / refused` |
| `entite` | multi-select | `COLHYBRI / CROWNIUM / DOJUKU / FINANCE / PLUMAYA / GROUPE` |
| `trace_id` | text | uuid-v4 |
| `notes` | text | contexte libre (diff, reason, handoff) |

DB créée le 2026-04-21 sous le parent groupe par le CEO agent via
l'install script. Si la DB disparaît → `install-agents.sh` la recrée.

## Principe de moindre privilège

- Chaque agent n'a accès qu'aux outils listés dans son frontmatter `tools:`.
- Tout tool non listé DOIT être refusé même si techniquement disponible.
- L'élévation passe par `onlymore-ceo-agent` qui délègue explicitement.

## Convention commit GitHub

Format obligatoire des messages :

```
<agent-name>: <verbe impératif> <objet>

Exemples :
forge-build: add supabase migration orders_v2
titan-cutover: promote colhybri-web to production
shield-security: audit RLS on payments table
```

## Matrice d'autonomie

| Niveau | Sémantique | Comportement |
|---|---|---|
| `auto` | exécution directe | log AGENTS_LOG, pas de validation |
| `confirm` | demande 1 ligne | "Je vais X sur Y. OK ?" puis attend |
| `ask` | demande structurée | plan complet + risques avant action |

## Fil rouge de session (règle CEO)

`onlymore-ceo-agent` DOIT surfacer en début de session :

1. PR ouvertes > 48 h
2. Tâches TODO DB `Priorite=haute` non assignées
3. Synapses non-pinned détectées par `nexus-synapses`
4. Alertes `sentinel-monitor` non acquittées
5. Deadlines Calendar < 7 jours sur items `onlymore-investor`
