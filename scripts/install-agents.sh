#!/usr/bin/env bash
#
# install-agents.sh — ONLYMORE managed agent team v1
#
# 1. Cree l'arborescence .claude/agents/
# 2. Verifie la presence des 7 MCP servers attendus
# 3. Cree la DB Notion AGENTS_LOG si absente
# 4. Commit "feat: ONLYMORE managed agent team v1"
#
# Usage: bash scripts/install-agents.sh [--skip-mcp-check] [--skip-notion] [--no-commit]

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
AGENTS_DIR="$REPO_ROOT/.claude/agents"
SHARED_DIR="$AGENTS_DIR/_shared"

SKIP_MCP_CHECK=false
SKIP_NOTION=false
NO_COMMIT=false

for arg in "$@"; do
  case "$arg" in
    --skip-mcp-check) SKIP_MCP_CHECK=true ;;
    --skip-notion)    SKIP_NOTION=true ;;
    --no-commit)      NO_COMMIT=true ;;
    *) echo "arg inconnu: $arg" >&2; exit 2 ;;
  esac
done

log() { printf "\033[36m[install-agents]\033[0m %s\n" "$*"; }
ok()  { printf "\033[32m  ok\033[0m %s\n" "$*"; }
ko()  { printf "\033[31m  KO\033[0m %s\n" "$*"; }
warn(){ printf "\033[33m  !!\033[0m %s\n" "$*"; }

#
# Step 1 — arborescence
#
log "Step 1/4 — creation arborescence"

mkdir -p "$SHARED_DIR"

EXPECTED_AGENTS=(
  onlymore-ceo-agent
  alpha-design
  forge-build
  vault-finance
  shield-security
  herald-comm
  nexus-synapses
  sentinel-monitor
  titan-cutover
  colhybri-lead
  crownium-lead
  dojuku-lead
  finance-lead
  plumaya-lead
)

MISSING=()
for a in "${EXPECTED_AGENTS[@]}"; do
  if [[ -f "$AGENTS_DIR/$a.md" ]]; then
    ok "$a.md present"
  else
    ko "$a.md ABSENT"
    MISSING+=("$a")
  fi
done

for f in onlymore-rules.md mcp-routing.json; do
  if [[ -f "$SHARED_DIR/$f" ]]; then
    ok "_shared/$f present"
  else
    ko "_shared/$f ABSENT"
    MISSING+=("_shared/$f")
  fi
done

if (( ${#MISSING[@]} > 0 )); then
  ko "Fichiers manquants — executer la generation des agents avant de continuer."
  exit 1
fi

#
# Step 2 — MCP servers attendus
#
log "Step 2/4 — verification MCP servers"

EXPECTED_MCP_PREFIXES=(
  "1ead01bd-863a-485d-ab66-9f79ed4cbb18"   # supabase
  "d56f05e9-cf06-4609-87a4-c316dad7cd73"   # vercel
  "f9197290-b5e1-44da-863d-030489ec096e"   # notion
  "4f1c4b94-2072-44b9-92a8-477765bee6ec"   # canva
  "5692b34b-deab-463b-8aaf-3f2754db54ce"   # calendar
  "a4e225ee-06eb-4d74-8d4b-c4dc2d81e9d4"   # gmail / drive
  "e5ec0d99-cce6-4ec8-b90d-d9456ae85c25"   # workspace / docs
)

if [[ "$SKIP_MCP_CHECK" == true ]]; then
  warn "check MCP saute (--skip-mcp-check)"
else
  ROUTING="$SHARED_DIR/mcp-routing.json"
  for id in "${EXPECTED_MCP_PREFIXES[@]}"; do
    if grep -q "$id" "$ROUTING" 2>/dev/null; then
      ok "MCP $id referencee"
    else
      warn "MCP $id absente du routing"
    fi
  done
fi

#
# Step 3 — DB Notion AGENTS_LOG
#
log "Step 3/4 — Notion AGENTS_LOG"

if [[ "$SKIP_NOTION" == true ]]; then
  warn "creation Notion sautee (--skip-notion)"
else
  cat <<'EOF'
  [NOTION] Cette etape necessite Claude Code avec le MCP Notion actif.
  Execution manuelle recommandee via @onlymore-ceo-agent :

    @onlymore-ceo-agent "cree la DB Notion AGENTS_LOG sous parent
    31b98dfff6a681298dcbe37403faca80 avec les champs :
      timestamp (date), agent (select), invoked_by (select),
      action (text), target (text), scope (select: read/write/deploy/comm),
      statut (select: ok/blocked/pending-human/failed),
      entite (multi-select), trace_id (text)"

  Le CEO agent validera avant creation.
EOF
fi

#
# Step 4 — commit
#
log "Step 4/4 — commit"

cd "$REPO_ROOT"

if [[ "$NO_COMMIT" == true ]]; then
  warn "commit saute (--no-commit)"
  exit 0
fi

git add .claude/agents scripts/install-agents.sh 2>/dev/null || true

if git diff --cached --quiet; then
  warn "aucun changement a committer"
else
  git commit -m "$(cat <<'MSG'
feat: ONLYMORE managed agent team v1

14 subagents Claude Code (.claude/agents/) :
- 1 orchestrateur : onlymore-ceo-agent
- 8 fonctionnels : alpha, forge, vault, shield, herald, nexus, sentinel, titan
- 5 entity leads : colhybri, crownium, dojuku, finance, plumaya

+ _shared/onlymore-rules.md (regles transverses)
+ _shared/mcp-routing.json (whitelist outil -> agent)
+ scripts/install-agents.sh (installation + verif)

Principe de moindre privilege applique par agent.
Autonomie graduee (auto / confirm / ask) par agent.
Logs AGENTS_LOG Notion obligatoire pour toute invocation MCP.
MSG
)"
  ok "commit cree"
fi

log "Termine."
