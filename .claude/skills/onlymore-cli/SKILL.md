---
name: onlymore-cli
description: >
  ONLYMORE CLI v2.0 — Command center zero-MCP connectant 6 services (Supabase, Vercel,
  GitHub, Notion, n8n, Stripe) via CLI natifs et API REST directes. Dispatcher bash
  complet avec health checks, deploy pipeline, query database, manage workflows.
  Triggers: CLI, om, status, deploy, database, query, notion, n8n, workflow, github,
  PR, merge, stripe, supabase, vercel, infra, audit, health, connecte tout, dashboard,
  ops, om-cli, command center CLI, health check, deploy pipeline, smoke test,
  services status, API check, environment setup, om health, om deploy.
allowed-tools:
  - Bash
  - Read
  - Write
  - Grep
  - Glob
---

# ONLYMORE CLI v2.0 — Zero-MCP Command Center

## Overview

Dispatcher bash (`om-cli.sh`) that connects 6 services without MCP servers.
Everything runs through native CLIs (gh, vercel, supabase, stripe) and curl + jq.

## Critical Constants

```bash
# Supabase
SUPA_REF_COLHYBRI="isuzbpzwxcagtnbosgjl"
SUPA_REF_DOJUKU="cbmasgbbhmunzjoqbpcs"
SUPA_ORG="urtlbxfbyuhvsdeseuam"
SUPA_OBSOLETE="ydzuywqzzbpwytwwfmeq"  # FORBIDDEN — abort if found

# GitHub
GITHUB_ORG="FLOW2203"

# n8n
N8N_INSTANCE="onlymore.app.n8n.cloud"

# Vercel Project IDs
VERCEL_COLHYBRI="prj_Len92CpsvpcnAHK2iIy7ODeT6ObG"
VERCEL_COLHYBRI_GAMES="prj_USeRDBo8OXsOqlyZ4GVCt8ioKejK"
VERCEL_COLHYBRI_VISION="prj_7yIiCGVa2tFW4AyLZ04LyMTiQVZs"
VERCEL_DOJUKU="prj_ibJpfHkZdAXdHkBvDA4SOUeRWcBJ"

# Notion Database IDs
NOTION_TODO_DB="fd098f9f-202e-41db-9cdb-042c40cff516"
NOTION_EDITORIAL_DB="042ec1b1-22db-45b4-b727-0bc5f630aad0"
NOTION_PROMPT_LIB="0e626e83-9f9b-43b5-8243-b1e72a85d563"
NOTION_COMMAND_CENTER="31b98dfff6a681298dcbe37403faca80"

# Stripe
STRIPE_DOJUKU_PRODUCT="prod_SZo3hQwpppmkd8"

# Sites to monitor
SITES=("colhybri.com" "dojukushingi.com" "colhybri.vision")
```

## Required Environment Variables

Read from env, NEVER hardcoded:

| Variable | Source | Usage |
|----------|--------|-------|
| SUPABASE_ACCESS_TOKEN | supabase.com/dashboard/account/tokens | Management API |
| SUPABASE_ANON_KEY | Project Settings > API | REST API queries |
| NOTION_API_KEY | notion.so/my-integrations | Notion API v1 |
| N8N_API_KEY | n8n Settings > API | Workflow management |
| STRIPE_SECRET_KEY | dashboard.stripe.com/apikeys | Stripe API |
| GITHUB_TOKEN | Auto-managed via `gh auth` | GitHub API |

## Required CLIs

curl, jq, git, node, npm, gh, vercel, supabase, stripe

## Service Commands

### Supabase (`om supabase|supa|sb`)

```bash
# List tables
curl -s "https://${SUPA_REF}.supabase.co/rest/v1/" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" | jq

# Execute SQL (Management API)
curl -s "https://api.supabase.com/v1/projects/${SUPA_REF}/database/query" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT tablename FROM pg_tables WHERE schemaname = '\''public'\''"}' | jq

# List Edge Functions
curl -s "https://api.supabase.com/v1/projects/${SUPA_REF}/functions" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" | jq

# RLS audit
# SQL: SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public'
```

### Vercel (`om vercel|vc`)

```bash
# List deployments
vercel ls --token "$VERCEL_TOKEN" 2>/dev/null || \
curl -s "https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=5" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" | jq '.deployments[] | {url, state, created}'

# Get project info
vercel inspect <deployment-url>

# Get env vars
vercel env ls
```

### GitHub (`om github|git`)

```bash
# List repos
gh repo list ${GITHUB_ORG} --limit 20

# List open PRs
gh pr list --repo ${GITHUB_ORG}/<repo>

# Merge PR
gh pr merge <number> --repo ${GITHUB_ORG}/<repo> --squash

# CI status
gh run list --repo ${GITHUB_ORG}/<repo> --limit 5
```

### Notion (`om notion|nt`)

```bash
# Query TODO DB
curl -s "https://api.notion.com/v1/databases/${NOTION_TODO_DB}/query" \
  -H "Authorization: Bearer ${NOTION_API_KEY}" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"filter":{"property":"Statut","select":{"does_not_equal":"✅ FAIT"}},"page_size":20}' | jq

# Search
curl -s "https://api.notion.com/v1/search" \
  -H "Authorization: Bearer ${NOTION_API_KEY}" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"query":"<term>","page_size":5}' | jq

# Create TODO
curl -s "https://api.notion.com/v1/pages" \
  -H "Authorization: Bearer ${NOTION_API_KEY}" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"parent":{"database_id":"'"${NOTION_TODO_DB}"'"},"properties":{...}}' | jq
```

### n8n (`om n8n`)

```bash
# List workflows
curl -s "https://${N8N_INSTANCE}/api/v1/workflows?limit=50" \
  -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data[] | {id, name, active}'

# List executions
curl -s "https://${N8N_INSTANCE}/api/v1/executions?limit=10" \
  -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data[] | {id, workflowId, status, startedAt}'

# Activate/deactivate workflow
curl -s -X PATCH "https://${N8N_INSTANCE}/api/v1/workflows/<id>" \
  -H "X-N8N-API-KEY: ${N8N_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"active": true}' | jq
```

### Stripe (`om stripe|st`)

```bash
# Balance
stripe balance retrieve 2>/dev/null || \
curl -s "https://api.stripe.com/v1/balance" \
  -u "${STRIPE_SECRET_KEY}:" | jq

# Recent payments
curl -s "https://api.stripe.com/v1/charges?limit=10" \
  -u "${STRIPE_SECRET_KEY}:" | jq '.data[] | {id, amount, currency, status}'

# Products
curl -s "https://api.stripe.com/v1/products?limit=20" \
  -u "${STRIPE_SECRET_KEY}:" | jq '.data[] | {id, name, active}'
```

## Orchestration

### Health Check (`om health`)
Sequential check of all 6 services + site reachability.
Each service: API ping with 5s timeout, report status.

### Deploy Pipeline (`om deploy <project>`)
1. Preflight: grep for obsolete ref → abort if found
2. npm run build
3. vercel --prod
4. Sleep 30s for propagation
5. Smoke test: curl site, check HTTP 200

### PR Review Flow (`om github prs`)
List open PRs across all FLOW2203 repos with status.

## Security Rules

1. **NEVER** use ref `ydzuywqzzbpwytwwfmeq` — it is obsolete
2. **NEVER** hardcode API keys — always read from environment
3. **ALWAYS** check HTTP status before parsing JSON response
4. **ALWAYS** run `grep -rn "ydzuywqzzbpwytwwfmeq"` before any deploy
5. **ALWAYS** mask secrets in output (show first 6 + ... + last 4 chars)

## Error Handling Pattern

```bash
api_call() {
  local response http_code body
  response=$(curl -s -w "\n%{http_code}" "$@")
  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')
  if [[ "$http_code" -ge 300 ]]; then
    echo "ERROR: HTTP $http_code"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    return 1
  fi
  echo "$body"
}
```

## Files

| File | Purpose |
|------|---------|
| SKILL.md | This documentation |
| scripts/om-cli.sh | Main dispatcher (~450 lines) |
| scripts/setup.sh | Environment validator (~180 lines) |

## Usage

```bash
om health              # Check all 6 services
om supabase tables     # List Supabase tables
om vercel deploys      # Recent deployments
om github repos        # List org repos
om notion todos        # Open TODOs
om n8n workflows       # List n8n workflows
om stripe balance      # Stripe balance
om deploy colhybri     # Full deploy pipeline
om setup               # Run environment setup
```
