#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════
# ONLYMORE CLI v2.0 — Environment Validator
# Checks: CLIs, auth, env vars, API connectivity, sites
# ═══════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

ok()   { echo -e "  ${GREEN}✓${NC} $1"; PASSED=$((PASSED + 1)); }
fail() { echo -e "  ${RED}✗${NC} $1"; FAILED=$((FAILED + 1)); }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; WARNINGS=$((WARNINGS + 1)); }
info() { echo -e "  ${CYAN}→${NC} $1"; }

header() {
  echo ""
  echo -e "${BOLD}${CYAN}═══ $1 ═══${NC}"
  echo ""
}

mask_secret() {
  local val="$1"
  if [[ ${#val} -gt 10 ]]; then
    echo "${val:0:6}...${val: -4}"
  else
    echo "***set***"
  fi
}

SUPA_OBSOLETE="ydzuywqzzbpwytwwfmeq"
N8N_INSTANCE="onlymore.app.n8n.cloud"
SUPA_REF_COLHYBRI="isuzbpzwxcagtnbosgjl"
SITES=("colhybri.com" "dojukushingi.com" "colhybri.vision")

# ── Phase 1: CLI Availability ──────────────────────────────

header "Phase 1: CLI Availability"

REQUIRED_CLIS=("curl" "jq" "git" "node" "npm" "gh" "vercel" "supabase" "stripe" "gws")
INSTALL_HINTS=(
  "curl: apt install curl"
  "jq: apt install jq"
  "git: apt install git"
  "node: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
  "npm: included with node"
  "gh: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
  "vercel: npm i -g vercel"
  "supabase: npm i -g supabase"
  "stripe: https://stripe.com/docs/stripe-cli"
  "gws: npm i -g @googleworkspace/cli"
)

for i in "${!REQUIRED_CLIS[@]}"; do
  cli="${REQUIRED_CLIS[$i]}"
  if command -v "$cli" &>/dev/null; then
    version=$("$cli" --version 2>/dev/null | head -1 || echo "installed")
    ok "$cli ($version)"
  else
    fail "$cli not found — Install: ${INSTALL_HINTS[$i]}"
  fi
done

# ── Phase 2: Authentication ────────────────────────────────

header "Phase 2: Authentication"

# GitHub
if command -v gh &>/dev/null; then
  if gh auth status &>/dev/null 2>&1; then
    user=$(gh api user -q .login 2>/dev/null || echo "unknown")
    ok "GitHub authenticated as $user"
  else
    fail "GitHub not authenticated — Run: gh auth login"
  fi
else
  fail "GitHub CLI not available"
fi

# Vercel
if command -v vercel &>/dev/null; then
  vercel_user=$(vercel whoami 2>/dev/null || echo "")
  if [[ -n "$vercel_user" ]]; then
    ok "Vercel authenticated as $vercel_user"
  else
    fail "Vercel not authenticated — Run: vercel login"
  fi
else
  fail "Vercel CLI not available"
fi

# Google Workspace
if command -v gws &>/dev/null; then
  gws_method=$(gws auth status 2>/dev/null | jq -r '.auth_method // "none"' 2>/dev/null || echo "none")
  if [[ "$gws_method" != "none" ]]; then
    ok "Google Workspace authenticated ($gws_method)"
  else
    warn "Google Workspace not authenticated — Run: gws auth setup && gws auth login"
  fi
else
  fail "Google Workspace CLI not available"
fi

# ── Phase 3: Environment Variables ─────────────────────────

header "Phase 3: Environment Variables"

ENV_VARS=(
  "SUPABASE_ACCESS_TOKEN:supabase.com/dashboard/account/tokens"
  "NOTION_API_KEY:notion.so/my-integrations"
  "N8N_API_KEY:n8n instance Settings > API"
  "STRIPE_SECRET_KEY:dashboard.stripe.com/apikeys"
)

for entry in "${ENV_VARS[@]}"; do
  var_name="${entry%%:*}"
  source_hint="${entry#*:}"
  if [[ -n "${!var_name:-}" ]]; then
    ok "$var_name = $(mask_secret "${!var_name}")"
  else
    fail "$var_name not set — Get it from: $source_hint"
  fi
done

# SUPABASE_ANON_KEY (optional but useful)
if [[ -n "${SUPABASE_ANON_KEY:-}" ]]; then
  ok "SUPABASE_ANON_KEY = $(mask_secret "$SUPABASE_ANON_KEY")"
else
  warn "SUPABASE_ANON_KEY not set (optional, needed for REST queries)"
fi

# ── Phase 4: API Connectivity ──────────────────────────────

header "Phase 4: API Connectivity"

# Supabase Management API
if [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
    "https://api.supabase.com/v1/projects/$SUPA_REF_COLHYBRI" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" ]]; then
    ok "Supabase API reachable (HTTP $http_code)"
  else
    fail "Supabase API error (HTTP $http_code)"
  fi
else
  info "Skipping Supabase API test (no token)"
fi

# Notion API
if [[ -n "${NOTION_API_KEY:-}" ]]; then
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
    "https://api.notion.com/v1/users/me" \
    -H "Authorization: Bearer $NOTION_API_KEY" \
    -H "Notion-Version: 2022-06-28" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" ]]; then
    ok "Notion API reachable (HTTP $http_code)"
  else
    fail "Notion API error (HTTP $http_code)"
  fi
else
  info "Skipping Notion API test (no token)"
fi

# n8n API
if [[ -n "${N8N_API_KEY:-}" ]]; then
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
    "https://$N8N_INSTANCE/api/v1/workflows?limit=1" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" ]]; then
    ok "n8n API reachable (HTTP $http_code)"
  else
    fail "n8n API error (HTTP $http_code)"
  fi
else
  info "Skipping n8n API test (no token)"
fi

# Stripe API
if [[ -n "${STRIPE_SECRET_KEY:-}" ]]; then
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 \
    "https://api.stripe.com/v1/balance" \
    -u "$STRIPE_SECRET_KEY:" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" ]]; then
    ok "Stripe API reachable (HTTP $http_code)"
  else
    fail "Stripe API error (HTTP $http_code)"
  fi
else
  info "Skipping Stripe API test (no token)"
fi

# ── Phase 5: Site Reachability ─────────────────────────────

header "Phase 5: Site Reachability"

for site in "${SITES[@]}"; do
  http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://$site" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" || "$http_code" == "301" || "$http_code" == "302" ]]; then
    ok "$site (HTTP $http_code)"
  else
    warn "$site unreachable (HTTP $http_code)"
  fi
done

# ── Phase 6: Security Scan ─────────────────────────────────

header "Phase 6: Security Scan"

info "Scanning for obsolete Supabase ref ($SUPA_OBSOLETE)..."
if grep -rn "$SUPA_OBSOLETE" . \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include="*.json" --include="*.env*" --include="*.md" \
  2>/dev/null | grep -v "om-cli.sh" | grep -v "setup.sh" | grep -v "SKILL.md" | grep -v ".git/" | grep -v "node_modules/"; then
  fail "OBSOLETE Supabase ref found in codebase! Must be replaced with $SUPA_REF_COLHYBRI"
else
  ok "No obsolete Supabase refs found"
fi

# ── Summary ────────────────────────────────────────────────

header "Summary"

echo -e "  ${GREEN}Passed:${NC}   $PASSED"
echo -e "  ${RED}Failed:${NC}   $FAILED"
echo -e "  ${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [[ $FAILED -eq 0 ]]; then
  echo -e "${BOLD}${GREEN}  All checks passed!${NC}"
  echo ""
  echo "ok flo let's go 😎"
else
  echo -e "${BOLD}${RED}  $FAILED check(s) failed. Fix issues above before proceeding.${NC}"
  echo ""
  echo "  Missing env vars? Set them with:"
  echo "    export SUPABASE_ACCESS_TOKEN=\"...\""
  echo "    export NOTION_API_KEY=\"...\""
  echo "    export N8N_API_KEY=\"...\""
  echo "    export STRIPE_SECRET_KEY=\"...\""
fi

exit $FAILED
