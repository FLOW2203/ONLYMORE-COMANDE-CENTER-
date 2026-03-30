#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════
# ONLYMORE CLI v2.1 — Zero-MCP Command Center
# Connects: Supabase, Vercel, GitHub, Notion, n8n, Stripe,
#           Google Workspace (gws)
# ═══════════════════════════════════════════════════════════

# ── Constants ──────────────────────────────────────────────

SUPA_REF_COLHYBRI="isuzbpzwxcagtnbosgjl"
SUPA_REF_DOJUKU="cbmasgbbhmunzjoqbpcs"
SUPA_ORG="urtlbxfbyuhvsdeseuam"
SUPA_OBSOLETE="ydzuywqzzbpwytwwfmeq"

GITHUB_ORG="FLOW2203"
N8N_INSTANCE="onlymore.app.n8n.cloud"

VERCEL_COLHYBRI="prj_Len92CpsvpcnAHK2iIy7ODeT6ObG"
VERCEL_COLHYBRI_GAMES="prj_USeRDBo8OXsOqlyZ4GVCt8ioKejK"
VERCEL_COLHYBRI_VISION="prj_7yIiCGVa2tFW4AyLZ04LyMTiQVZs"
VERCEL_DOJUKU="prj_ibJpfHkZdAXdHkBvDA4SOUeRWcBJ"

NOTION_TODO_DB="fd098f9f-202e-41db-9cdb-042c40cff516"
NOTION_EDITORIAL_DB="042ec1b1-22db-45b4-b727-0bc5f630aad0"
NOTION_PROMPT_LIB="0e626e83-9f9b-43b5-8243-b1e72a85d563"
NOTION_COMMAND_CENTER="31b98dfff6a681298dcbe37403faca80"

STRIPE_DOJUKU_PRODUCT="prod_SZo3hQwpppmkd8"

SITES=("colhybri.com" "dojukushingi.com" "colhybri.vision")

GOOGLE_ACCOUNT="onlymore2024@gmail.com"

# ── Colors ─────────────────────────────────────────────────

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── Helpers ────────────────────────────────────────────────

header() {
  echo ""
  echo -e "${BOLD}${CYAN}═══ $1 ═══${NC}"
  echo ""
}

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

mask_secret() {
  local val="$1"
  if [[ ${#val} -gt 10 ]]; then
    echo "${val:0:6}...${val: -4}"
  else
    echo "***"
  fi
}

api_call() {
  local response http_code body
  response=$(curl -s -w "\n%{http_code}" --max-time 10 "$@") || {
    echo "ERROR: Connection failed"
    return 1
  }
  http_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | sed '$d')
  if [[ "$http_code" -ge 300 ]]; then
    fail "HTTP $http_code"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    return 1
  fi
  echo "$body"
}

require_env() {
  local var_name="$1"
  if [[ -z "${!var_name:-}" ]]; then
    fail "Missing env var: $var_name"
    return 1
  fi
}

preflight_ref_check() {
  if grep -rn "$SUPA_OBSOLETE" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.env*" 2>/dev/null | grep -v "om-cli.sh" | grep -v "SKILL.md" | grep -v "setup.sh" | grep -v ".git/"; then
    fail "OBSOLETE Supabase ref found! Aborting."
    exit 1
  fi
  ok "No obsolete refs found"
}

# ── Supabase ───────────────────────────────────────────────

cmd_supabase() {
  local subcmd="${1:-tables}"
  local ref="${SUPA_REF_COLHYBRI}"
  shift 2>/dev/null || true

  # Handle dojuku subcommand
  if [[ "$subcmd" == "dojuku" ]]; then
    ref="$SUPA_REF_DOJUKU"
    subcmd="${1:-tables}"
    shift 2>/dev/null || true
  fi

  case "$subcmd" in
    tables)
      header "Supabase Tables ($ref)"
      require_env SUPABASE_ACCESS_TOKEN || return 1
      api_call "https://api.supabase.com/v1/projects/$ref/database/query" \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"query":"SELECT tablename FROM pg_tables WHERE schemaname='\''public'\'' ORDER BY tablename"}' | jq -r '.[] | .tablename' 2>/dev/null || true
      ;;
    query)
      header "Supabase Query ($ref)"
      require_env SUPABASE_ACCESS_TOKEN || return 1
      local sql="${1:-SELECT current_timestamp}"
      api_call "https://api.supabase.com/v1/projects/$ref/database/query" \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"query\":\"$sql\"}" | jq . 2>/dev/null || true
      ;;
    rls-audit)
      header "Supabase RLS Audit ($ref)"
      require_env SUPABASE_ACCESS_TOKEN || return 1
      api_call "https://api.supabase.com/v1/projects/$ref/database/query" \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"query":"SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='\''public'\'' ORDER BY tablename"}' | jq . 2>/dev/null || true
      ;;
    functions)
      header "Supabase Edge Functions ($ref)"
      require_env SUPABASE_ACCESS_TOKEN || return 1
      api_call "https://api.supabase.com/v1/projects/$ref/functions" \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" | jq '.[] | {name, status, version}' 2>/dev/null || true
      ;;
    *)
      echo "Usage: om supabase [tables|query|rls-audit|functions|dojuku]"
      ;;
  esac
}

# ── Vercel ─────────────────────────────────────────────────

cmd_vercel() {
  local subcmd="${1:-deploys}"
  shift 2>/dev/null || true

  case "$subcmd" in
    deploys)
      header "Vercel Recent Deployments"
      if command -v vercel &>/dev/null; then
        vercel ls 2>/dev/null || fail "vercel ls failed"
      else
        fail "Vercel CLI not installed. Run: npm i -g vercel"
      fi
      ;;
    logs)
      header "Vercel Deployment Logs"
      local url="${1:-}"
      if [[ -z "$url" ]]; then
        echo "Usage: om vercel logs <deployment-url>"
        return 1
      fi
      vercel logs "$url" 2>/dev/null || fail "vercel logs failed"
      ;;
    env)
      header "Vercel Environment Variables"
      vercel env ls 2>/dev/null || fail "vercel env ls failed"
      ;;
    inspect)
      header "Vercel Inspect"
      local url="${1:-}"
      if [[ -z "$url" ]]; then
        echo "Usage: om vercel inspect <deployment-url>"
        return 1
      fi
      vercel inspect "$url" 2>/dev/null || fail "vercel inspect failed"
      ;;
    *)
      echo "Usage: om vercel [deploys|logs|env|inspect]"
      ;;
  esac
}

# ── GitHub ─────────────────────────────────────────────────

cmd_github() {
  local subcmd="${1:-repos}"
  shift 2>/dev/null || true

  case "$subcmd" in
    repos)
      header "GitHub Repos ($GITHUB_ORG)"
      gh repo list "$GITHUB_ORG" --limit 20 2>/dev/null || fail "gh repo list failed"
      ;;
    prs)
      header "GitHub Open PRs"
      local repo="${1:-}"
      if [[ -n "$repo" ]]; then
        gh pr list --repo "$GITHUB_ORG/$repo" 2>/dev/null || fail "gh pr list failed"
      else
        info "Scanning all repos for open PRs..."
        for repo_name in $(gh repo list "$GITHUB_ORG" --json name -q '.[].name' 2>/dev/null); do
          local prs
          prs=$(gh pr list --repo "$GITHUB_ORG/$repo_name" --json number,title,state -q '.[] | "\(.number): \(.title)"' 2>/dev/null || true)
          if [[ -n "$prs" ]]; then
            echo -e "\n  ${BOLD}$repo_name${NC}"
            echo "$prs" | sed 's/^/    /'
          fi
        done
      fi
      ;;
    merge)
      header "GitHub Merge PR"
      local pr_num="${1:-}"
      local repo="${2:-}"
      if [[ -z "$pr_num" || -z "$repo" ]]; then
        echo "Usage: om github merge <pr-number> <repo>"
        return 1
      fi
      gh pr merge "$pr_num" --repo "$GITHUB_ORG/$repo" --squash 2>/dev/null || fail "gh pr merge failed"
      ;;
    ci)
      header "GitHub CI Status"
      local repo="${1:-}"
      if [[ -z "$repo" ]]; then
        echo "Usage: om github ci <repo>"
        return 1
      fi
      gh run list --repo "$GITHUB_ORG/$repo" --limit 5 2>/dev/null || fail "gh run list failed"
      ;;
    clone)
      header "GitHub Clone"
      local repo="${1:-}"
      if [[ -z "$repo" ]]; then
        echo "Usage: om github clone <repo>"
        return 1
      fi
      gh repo clone "$GITHUB_ORG/$repo" 2>/dev/null || fail "gh repo clone failed"
      ;;
    *)
      echo "Usage: om github [repos|prs|merge|ci|clone]"
      ;;
  esac
}

# ── Notion ─────────────────────────────────────────────────

cmd_notion() {
  local subcmd="${1:-todos}"
  shift 2>/dev/null || true

  require_env NOTION_API_KEY || return 1

  local notion_headers=(
    -H "Authorization: Bearer $NOTION_API_KEY"
    -H "Notion-Version: 2022-06-28"
    -H "Content-Type: application/json"
  )

  case "$subcmd" in
    todos)
      header "Notion TODOs (not done)"
      api_call -X POST "https://api.notion.com/v1/databases/$NOTION_TODO_DB/query" \
        "${notion_headers[@]}" \
        -d '{"filter":{"property":"Statut","select":{"does_not_equal":"✅ FAIT"}},"page_size":20}' \
        | jq -r '.results[] | "\(.properties.Statut.select.name // "?") | \(.properties.Action.title[0].plain_text // "untitled") | \(.properties.Priorité.select.name // "-") | \(.properties["Agent IA"].select.name // "-")"' 2>/dev/null || true
      ;;
    search)
      header "Notion Search"
      local query="${1:-ONLYMORE}"
      api_call -X POST "https://api.notion.com/v1/search" \
        "${notion_headers[@]}" \
        -d "{\"query\":\"$query\",\"page_size\":10}" \
        | jq -r '.results[] | "\(.object): \(.properties.title.title[0].plain_text // .title[0].plain_text // .url // "untitled")"' 2>/dev/null || true
      ;;
    create-todo)
      header "Notion Create TODO"
      local title="${1:-}"
      local priority="${2:-P1 Important}"
      local entity="${3:-GROUPE}"
      if [[ -z "$title" ]]; then
        echo "Usage: om notion create-todo \"Title\" [priority] [entity]"
        return 1
      fi
      api_call -X POST "https://api.notion.com/v1/pages" \
        "${notion_headers[@]}" \
        -d "{
          \"parent\":{\"database_id\":\"$NOTION_TODO_DB\"},
          \"properties\":{
            \"Action\":{\"title\":[{\"text\":{\"content\":\"$title\"}}]},
            \"Statut\":{\"select\":{\"name\":\"⬜ À FAIRE\"}},
            \"Priorité\":{\"select\":{\"name\":\"$priority\"}},
            \"Entité\":{\"select\":{\"name\":\"$entity\"}}
          }
        }" | jq '{id: .id, url: .url}' 2>/dev/null || true
      ;;
    editorial)
      header "Notion Editorial Calendar"
      api_call -X POST "https://api.notion.com/v1/databases/$NOTION_EDITORIAL_DB/query" \
        "${notion_headers[@]}" \
        -d '{"page_size":10}' \
        | jq -r '.results[] | .properties' 2>/dev/null | head -50 || true
      ;;
    *)
      echo "Usage: om notion [todos|search|create-todo|editorial]"
      ;;
  esac
}

# ── n8n ────────────────────────────────────────────────────

cmd_n8n() {
  local subcmd="${1:-workflows}"
  shift 2>/dev/null || true

  require_env N8N_API_KEY || return 1

  local n8n_base="https://$N8N_INSTANCE/api/v1"

  case "$subcmd" in
    workflows)
      header "n8n Workflows"
      api_call "$n8n_base/workflows?limit=50" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        | jq -r '.data[] | "\(if .active then "🟢" else "⚪" end) [\(.id)] \(.name)"' 2>/dev/null || true
      ;;
    executions)
      header "n8n Recent Executions"
      api_call "$n8n_base/executions?limit=10" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        | jq -r '.data[] | "\(.status) | wf:\(.workflowId) | \(.startedAt)"' 2>/dev/null || true
      ;;
    activate)
      local wf_id="${1:-}"
      if [[ -z "$wf_id" ]]; then echo "Usage: om n8n activate <workflow-id>"; return 1; fi
      header "n8n Activate Workflow $wf_id"
      api_call -X PATCH "$n8n_base/workflows/$wf_id" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active":true}' | jq '{id, name, active}' 2>/dev/null || true
      ;;
    deactivate)
      local wf_id="${1:-}"
      if [[ -z "$wf_id" ]]; then echo "Usage: om n8n deactivate <workflow-id>"; return 1; fi
      header "n8n Deactivate Workflow $wf_id"
      api_call -X PATCH "$n8n_base/workflows/$wf_id" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active":false}' | jq '{id, name, active}' 2>/dev/null || true
      ;;
    trigger)
      local wf_id="${1:-}"
      if [[ -z "$wf_id" ]]; then echo "Usage: om n8n trigger <workflow-id>"; return 1; fi
      header "n8n Trigger Workflow $wf_id"
      api_call -X POST "$n8n_base/workflows/$wf_id/activate" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" | jq . 2>/dev/null || true
      ;;
    *)
      echo "Usage: om n8n [workflows|executions|activate|deactivate|trigger]"
      ;;
  esac
}

# ── Stripe ─────────────────────────────────────────────────

cmd_stripe() {
  local subcmd="${1:-balance}"
  shift 2>/dev/null || true

  require_env STRIPE_SECRET_KEY || return 1

  case "$subcmd" in
    balance)
      header "Stripe Balance"
      api_call "https://api.stripe.com/v1/balance" \
        -u "$STRIPE_SECRET_KEY:" \
        | jq '.available[] | "\(.amount / 100) \(.currency)"' 2>/dev/null || true
      ;;
    customers)
      header "Stripe Customers"
      api_call "https://api.stripe.com/v1/customers?limit=10" \
        -u "$STRIPE_SECRET_KEY:" \
        | jq -r '.data[] | "\(.id) | \(.email // "no email") | \(.name // "no name")"' 2>/dev/null || true
      ;;
    payments)
      header "Stripe Recent Payments"
      api_call "https://api.stripe.com/v1/charges?limit=10" \
        -u "$STRIPE_SECRET_KEY:" \
        | jq -r '.data[] | "\(.status) | \(.amount / 100) \(.currency) | \(.description // "no desc")"' 2>/dev/null || true
      ;;
    subscriptions)
      header "Stripe Subscriptions"
      api_call "https://api.stripe.com/v1/subscriptions?limit=10" \
        -u "$STRIPE_SECRET_KEY:" \
        | jq -r '.data[] | "\(.status) | \(.items.data[0].price.id) | \(.customer)"' 2>/dev/null || true
      ;;
    products)
      header "Stripe Products"
      api_call "https://api.stripe.com/v1/products?limit=20" \
        -u "$STRIPE_SECRET_KEY:" \
        | jq -r '.data[] | "\(if .active then "🟢" else "⚪" end) \(.id) | \(.name)"' 2>/dev/null || true
      ;;
    *)
      echo "Usage: om stripe [balance|customers|payments|subscriptions|products]"
      ;;
  esac
}

# ── Google Workspace ───────────────────────────────────────

cmd_google() {
  local subcmd="${1:-health}"
  shift 2>/dev/null || true

  if ! command -v gws &>/dev/null; then
    fail "gws CLI not installed. Install: npm i -g @googleworkspace/cli"
    return 1
  fi

  case "$subcmd" in
    health)
      header "Google Workspace Health"
      local auth_status
      auth_status=$(gws auth status 2>/dev/null || echo '{"auth_method":"none"}')
      local method
      method=$(echo "$auth_status" | jq -r '.auth_method // "none"' 2>/dev/null || echo "none")
      if [[ "$method" != "none" ]]; then
        ok "Google Workspace authenticated (method: $method)"
      else
        warn "Google Workspace not authenticated"
        echo ""
        echo "  To authenticate, run manually in a terminal:"
        echo "    1. gws auth setup    (configure Google Cloud Project)"
        echo "    2. gws auth login    (opens browser for OAuth)"
        echo "  Account: $GOOGLE_ACCOUNT"
      fi
      ;;
    drive)
      header "Google Drive"
      local drive_cmd="${1:-list}"
      shift 2>/dev/null || true
      case "$drive_cmd" in
        list)
          gws drive files list --params '{"pageSize": 10, "fields": "files(id,name,mimeType,modifiedTime)"}' --format table 2>/dev/null \
            || fail "gws drive files list failed (auth needed?)"
          ;;
        search)
          local query="${1:-}"
          if [[ -z "$query" ]]; then echo "Usage: om google drive search \"query\""; return 1; fi
          gws drive files list --params "{\"q\": \"name contains '${query}'\", \"pageSize\": 10, \"fields\": \"files(id,name,mimeType)\"}" --format table 2>/dev/null \
            || fail "gws drive search failed"
          ;;
        *)
          echo "Usage: om google drive [list|search]"
          ;;
      esac
      ;;
    gmail)
      header "Gmail"
      local gmail_cmd="${1:-list}"
      shift 2>/dev/null || true
      case "$gmail_cmd" in
        list)
          gws gmail users messages list --params '{"userId": "me", "maxResults": 10}' --format table 2>/dev/null \
            || fail "gws gmail list failed (auth needed?)"
          ;;
        send)
          local to="${1:-}" subject="${2:-}" body="${3:-}"
          if [[ -z "$to" || -z "$subject" ]]; then
            echo "Usage: om google gmail send \"to@email\" \"Subject\" \"Body\""
            return 1
          fi
          local raw
          raw=$(printf "To: %s\r\nFrom: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n%s" \
            "$to" "$GOOGLE_ACCOUNT" "$subject" "$body" | base64 -w 0 | tr '+/' '-_' | tr -d '=')
          gws gmail users messages send --params '{"userId": "me"}' --json "{\"raw\": \"$raw\"}" 2>/dev/null \
            || fail "gws gmail send failed"
          ;;
        *)
          echo "Usage: om google gmail [list|send]"
          ;;
      esac
      ;;
    calendar)
      header "Google Calendar"
      local cal_cmd="${1:-list}"
      shift 2>/dev/null || true
      case "$cal_cmd" in
        list)
          local now
          now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
          gws calendar events list --params "{\"calendarId\": \"primary\", \"timeMin\": \"$now\", \"maxResults\": 10, \"singleEvents\": true, \"orderBy\": \"startTime\"}" --format table 2>/dev/null \
            || fail "gws calendar list failed (auth needed?)"
          ;;
        create)
          local summary="${1:-}" date="${2:-}" time="${3:-09:00}"
          if [[ -z "$summary" || -z "$date" ]]; then
            echo "Usage: om google calendar create \"Summary\" \"2026-04-15\" [\"09:00\"]"
            return 1
          fi
          local start_dt="${date}T${time}:00"
          local end_hour=$((${time%%:*} + 1))
          local end_dt="${date}T$(printf '%02d' $end_hour):${time##*:}:00"
          gws calendar events insert --params '{"calendarId": "primary"}' \
            --json "{\"summary\": \"$summary\", \"start\": {\"dateTime\": \"$start_dt\", \"timeZone\": \"Europe/Paris\"}, \"end\": {\"dateTime\": \"$end_dt\", \"timeZone\": \"Europe/Paris\"}}" 2>/dev/null \
            || fail "gws calendar create failed"
          ;;
        *)
          echo "Usage: om google calendar [list|create]"
          ;;
      esac
      ;;
    sheets)
      header "Google Sheets"
      local sheets_cmd="${1:-list}"
      shift 2>/dev/null || true
      case "$sheets_cmd" in
        get)
          local sheet_id="${1:-}"
          if [[ -z "$sheet_id" ]]; then echo "Usage: om google sheets get <spreadsheetId>"; return 1; fi
          gws sheets spreadsheets get --params "{\"spreadsheetId\": \"$sheet_id\"}" 2>/dev/null \
            || fail "gws sheets get failed"
          ;;
        read)
          local sheet_id="${1:-}" range="${2:-Sheet1!A1:Z100}"
          if [[ -z "$sheet_id" ]]; then echo "Usage: om google sheets read <spreadsheetId> [range]"; return 1; fi
          gws sheets spreadsheets values get --params "{\"spreadsheetId\": \"$sheet_id\", \"range\": \"$range\"}" --format table 2>/dev/null \
            || fail "gws sheets read failed"
          ;;
        *)
          echo "Usage: om google sheets [get|read]"
          ;;
      esac
      ;;
    docs)
      header "Google Docs"
      local docs_cmd="${1:-get}"
      shift 2>/dev/null || true
      case "$docs_cmd" in
        get)
          local doc_id="${1:-}"
          if [[ -z "$doc_id" ]]; then echo "Usage: om google docs get <documentId>"; return 1; fi
          gws docs documents get --params "{\"documentId\": \"$doc_id\"}" 2>/dev/null \
            || fail "gws docs get failed"
          ;;
        create)
          local title="${1:-Untitled}"
          gws docs documents create --json "{\"title\": \"$title\"}" 2>/dev/null \
            || fail "gws docs create failed"
          ;;
        *)
          echo "Usage: om google docs [get|create]"
          ;;
      esac
      ;;
    *)
      echo "Usage: om google [health|drive|gmail|calendar|sheets|docs]"
      ;;
  esac
}

# ── Health Check ───────────────────────────────────────────

cmd_health() {
  header "ONLYMORE Health Check"
  local passed=0 failed=0

  # Supabase
  info "Supabase (COLHYBRI)..."
  if [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
    if curl -sf --max-time 5 "https://api.supabase.com/v1/projects/$SUPA_REF_COLHYBRI" \
      -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -o /dev/null 2>/dev/null; then
      ok "Supabase COLHYBRI connected"; passed=$((passed + 1))
    else
      fail "Supabase COLHYBRI unreachable"; failed=$((failed + 1))
    fi
  else
    fail "SUPABASE_ACCESS_TOKEN not set"; failed=$((failed + 1))
  fi

  # Vercel
  info "Vercel..."
  if command -v vercel &>/dev/null && vercel whoami &>/dev/null 2>&1; then
    ok "Vercel authenticated"; passed=$((passed + 1))
  else
    fail "Vercel not authenticated"; failed=$((failed + 1))
  fi

  # GitHub
  info "GitHub..."
  if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
    ok "GitHub authenticated"; passed=$((passed + 1))
  else
    fail "GitHub not authenticated"; failed=$((failed + 1))
  fi

  # Notion
  info "Notion..."
  if [[ -n "${NOTION_API_KEY:-}" ]]; then
    if curl -sf --max-time 5 "https://api.notion.com/v1/users/me" \
      -H "Authorization: Bearer $NOTION_API_KEY" \
      -H "Notion-Version: 2022-06-28" -o /dev/null 2>/dev/null; then
      ok "Notion connected"; passed=$((passed + 1))
    else
      fail "Notion unreachable"; failed=$((failed + 1))
    fi
  else
    fail "NOTION_API_KEY not set"; failed=$((failed + 1))
  fi

  # n8n
  info "n8n..."
  if [[ -n "${N8N_API_KEY:-}" ]]; then
    if curl -sf --max-time 5 "https://$N8N_INSTANCE/api/v1/workflows?limit=1" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" -o /dev/null 2>/dev/null; then
      ok "n8n connected"; passed=$((passed + 1))
    else
      fail "n8n unreachable"; failed=$((failed + 1))
    fi
  else
    fail "N8N_API_KEY not set"; failed=$((failed + 1))
  fi

  # Stripe
  info "Stripe..."
  if [[ -n "${STRIPE_SECRET_KEY:-}" ]]; then
    if curl -sf --max-time 5 "https://api.stripe.com/v1/balance" \
      -u "$STRIPE_SECRET_KEY:" -o /dev/null 2>/dev/null; then
      ok "Stripe connected"; passed=$((passed + 1))
    else
      fail "Stripe unreachable"; failed=$((failed + 1))
    fi
  else
    fail "STRIPE_SECRET_KEY not set"; failed=$((failed + 1))
  fi

  # Google Workspace
  info "Google Workspace..."
  if command -v gws &>/dev/null; then
    local gws_method
    gws_method=$(gws auth status 2>/dev/null | jq -r '.auth_method // "none"' 2>/dev/null || echo "none")
    if [[ "$gws_method" != "none" ]]; then
      ok "Google Workspace authenticated ($gws_method)"; passed=$((passed + 1))
    else
      fail "Google Workspace not authenticated (run: gws auth login)"; failed=$((failed + 1))
    fi
  else
    fail "gws CLI not installed"; failed=$((failed + 1))
  fi

  # Sites
  echo ""
  info "Sites..."
  for site in "${SITES[@]}"; do
    if curl -sf --max-time 5 "https://$site" -o /dev/null 2>/dev/null; then
      ok "$site reachable"
    else
      warn "$site unreachable"
    fi
  done

  # Summary
  echo ""
  echo -e "${BOLD}══════════════════════════════════${NC}"
  echo -e "  Services: ${GREEN}$passed${NC}/${BOLD}7${NC} connected | ${RED}$failed${NC} failed"
  echo -e "${BOLD}══════════════════════════════════${NC}"

  if [[ $failed -eq 0 ]]; then
    echo ""
    echo "ok flo let's go 😎"
  fi
}

# ── Deploy Pipeline ────────────────────────────────────────

cmd_deploy() {
  local project="${1:-colhybri}"
  header "Deploy Pipeline: $project"

  # Step 1: Preflight
  info "Preflight ref check..."
  preflight_ref_check

  # Step 2: Build
  info "Building..."
  npm run build || { fail "Build failed"; return 1; }
  ok "Build successful"

  # Step 3: Deploy
  info "Deploying to Vercel (production)..."
  vercel --prod --yes 2>/dev/null || { fail "Deploy failed"; return 1; }
  ok "Deployed to production"

  # Step 4: Wait
  info "Waiting 30s for propagation..."
  sleep 30

  # Step 5: Smoke test
  local site
  case "$project" in
    colhybri) site="colhybri.com" ;;
    dojuku)   site="dojukushingi.com" ;;
    vision)   site="colhybri.vision" ;;
    *)        site="$project" ;;
  esac
  info "Smoke test: https://$site"
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$site" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" ]]; then
    ok "Smoke test passed (HTTP $http_code)"
  else
    fail "Smoke test failed (HTTP $http_code)"
    return 1
  fi

  echo ""
  echo "ok flo let's go 😎"
}

# ── Help ───────────────────────────────────────────────────

cmd_help() {
  cat <<'HELP'

  ╔══════════════════════════════════════════════════╗
  ║         ONLYMORE CLI v2.1 — om <command>        ║
  ╚══════════════════════════════════════════════════╝

  SERVICES:
    supabase|supa|sb  [tables|query|rls-audit|functions|dojuku]
    vercel|vc         [deploys|logs|env|inspect]
    github|git        [repos|prs|merge|ci|clone]
    notion|nt         [todos|search|create-todo|editorial]
    n8n               [workflows|executions|activate|deactivate|trigger]
    stripe|st         [balance|customers|payments|subscriptions|products]
    google|gws        [health|drive|gmail|calendar|sheets|docs]

  ORCHESTRATION:
    health|status     Check all 7 services + sites
    deploy            Preflight → build → deploy → smoke test
    setup             Run environment validator

  EXAMPLES:
    om health
    om supabase tables
    om supabase dojuku tables
    om github repos
    om notion todos
    om notion create-todo "Fix OAuth flow" "P0 Critique" "COLHYBRI"
    om n8n workflows
    om stripe balance
    om google drive list
    om google gmail send "to@email" "Subject" "Body"
    om google calendar create "RDV Occitanie Angels" "2026-04-15" "10:00"
    om deploy colhybri

HELP
}

# ── Main Dispatcher ────────────────────────────────────────

main() {
  local cmd="${1:-help}"
  shift 2>/dev/null || true

  case "$cmd" in
    supabase|supa|sb)     cmd_supabase "$@" ;;
    vercel|vc)            cmd_vercel "$@" ;;
    github|git)           cmd_github "$@" ;;
    notion|nt)            cmd_notion "$@" ;;
    n8n)                  cmd_n8n "$@" ;;
    stripe|st)            cmd_stripe "$@" ;;
    google|gws)           cmd_google "$@" ;;
    health|status)        cmd_health ;;
    deploy)               cmd_deploy "$@" ;;
    setup)
      local script_dir
      script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
      bash "$script_dir/setup.sh"
      ;;
    help|--help|-h)       cmd_help ;;
    *)
      fail "Unknown command: $cmd"
      cmd_help
      exit 1
      ;;
  esac
}

main "$@"
