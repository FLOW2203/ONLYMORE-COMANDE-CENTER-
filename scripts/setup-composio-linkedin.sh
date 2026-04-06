#!/bin/bash
# ============================================
# ONLYMORE — Setup Composio LinkedIn MCP
# Publish to 4 LinkedIn pages directly from
# Claude Code via Composio MCP integration
# ============================================

set -euo pipefail

echo "SETUP COMPOSIO LINKEDIN MCP — ONLYMORE GROUP"
echo "================================================"
echo ""

# ---- Configuration ----
COMPOSIO_MCP_NAME="linkedin-composio"

# ---- Check prerequisites ----
if ! command -v claude &> /dev/null; then
  echo "ERROR: 'claude' CLI not found. Install Claude Code first."
  exit 1
fi

# ---- Step 1: Check for API key ----
echo "STEP 1 — Composio API Key"
if [ -z "${COMPOSIO_API_KEY:-}" ]; then
  echo "COMPOSIO_API_KEY is not set."
  echo ""
  echo "To get your key:"
  echo "  1. Sign up at https://app.composio.dev/signup"
  echo "  2. Go to https://app.composio.dev/settings/api-keys"
  echo "  3. Copy your API key"
  echo ""
  echo "Then run:"
  echo "  export COMPOSIO_API_KEY=\"your-key-here\""
  echo "  bash scripts/setup-composio-linkedin.sh"
  echo ""
  exit 1
fi
echo "  API key found."
echo ""

# ---- Step 2: Check for MCP URL ----
echo "STEP 2 — Composio MCP URL"
if [ -z "${COMPOSIO_MCP_URL:-}" ]; then
  echo "COMPOSIO_MCP_URL is not set."
  echo ""
  echo "To get your MCP URL:"
  echo "  1. Go to https://app.composio.dev/mcp"
  echo "  2. Select 'LinkedIn' in the toolkits"
  echo "  3. Copy the generated MCP URL"
  echo ""
  echo "Then run:"
  echo "  export COMPOSIO_MCP_URL=\"your-mcp-url-here\""
  echo "  bash scripts/setup-composio-linkedin.sh"
  echo ""
  exit 1
fi
echo "  MCP URL found."
echo ""

# ---- Step 3: Register MCP in Claude Code ----
echo "STEP 3 — Registering MCP server in Claude Code"
claude mcp add --transport http "$COMPOSIO_MCP_NAME" \
  "$COMPOSIO_MCP_URL" \
  --headers "X-API-Key:$COMPOSIO_API_KEY"

echo "  MCP server '$COMPOSIO_MCP_NAME' registered."
echo ""

# ---- Done ----
echo "================================================"
echo "SETUP COMPLETE"
echo "================================================"
echo ""
echo "Restart Claude Code, then verify with: /mcp"
echo ""
echo "LinkedIn pages available:"
echo "  1. ONLYMORE group (holding/vision)"
echo "  2. colhybri (local solidarity commerce)"
echo "  3. Pillar Pay (fintech/BNPL)"
echo "  4. DOJUKU SHINGI (martial arts/gaming)"
echo ""
echo "Advantages over manual Bearer Token:"
echo "  - Composio handles OAuth refresh automatically"
echo "  - No token expiring every 2 months"
echo "  - No manual Person URN needed"
echo "  - Native multi-page support"
echo "  - 8th MCP in the ONLYMORE stack"
