#!/bin/bash
# ============================================================
# setup-stitch-mcp.sh — Configure Google Stitch MCP pour Claude Code
# ============================================================
# Exécuter ce script en local (pas sur serveur CI) car il nécessite
# un browser pour l'OAuth Google.
# ============================================================

set -e

echo "🧩 Setup Google Stitch MCP pour ONLYMORE Group"
echo ""

# Step 1: Check if npx is available
if ! command -v npx &> /dev/null; then
  echo "❌ npx non trouvé. Installer Node.js 18+ d'abord."
  exit 1
fi

# Step 2: Install stitch-mcp
echo "📦 Installation de @_davideast/stitch-mcp..."
npx @_davideast/stitch-mcp --version

# Step 3: Run init wizard
echo ""
echo "🔐 Lancement du wizard d'authentification..."
echo "   → Un browser va s'ouvrir pour l'OAuth Google"
echo "   → Sélectionner le compte onlymore2024@gmail.com"
echo "   → Choisir 'Claude Code' comme MCP client"
echo ""
npx @_davideast/stitch-mcp init --client "Claude Code"

# Step 4: Verify
echo ""
echo "🏥 Vérification de la santé..."
npx @_davideast/stitch-mcp doctor

# Step 5: Enable Stitch API (requires gcloud)
if command -v gcloud &> /dev/null; then
  echo ""
  echo "🔌 Activation de l'API Stitch sur GCP..."
  gcloud beta services enable stitch.googleapis.com 2>/dev/null || echo "⚠️  API déjà activée ou erreur (vérifier manuellement)"
else
  echo ""
  echo "⚠️  gcloud CLI non trouvé. Activer l'API manuellement :"
  echo "   gcloud beta services enable stitch.googleapis.com"
fi

# Step 6: Install skill
SKILLS_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -d "$SCRIPT_DIR/skills/onlymore-stitch-design" ]; then
  mkdir -p "$SKILLS_DIR"
  cp -r "$SCRIPT_DIR/skills/onlymore-stitch-design" "$SKILLS_DIR/"
  echo ""
  echo "✅ Skill onlymore-stitch-design installé dans $SKILLS_DIR/"
fi

# Step 7: List projects
echo ""
echo "📋 Projets Stitch disponibles :"
npx @_davideast/stitch-mcp view --projects 2>/dev/null || echo "⚠️  Aucun projet trouvé (ou auth incomplète)"

echo ""
echo "🎯 Setup terminé !"
echo ""
echo "Prochaines étapes :"
echo "  1. npx @_davideast/stitch-mcp view --projects"
echo "  2. npx @_davideast/stitch-mcp screens -p <project-id>"
echo "  3. Invoquer le skill dans Claude Code"
echo ""
echo "ok flo let's go 😎"
