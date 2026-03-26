#!/bin/bash
# ============================================================
# install.sh — Installe les skills ONLYMORE dans ~/.claude/skills/
# ============================================================

set -e

SKILLS_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SKILLS=(
  "colhybri-deploy"
  "colhybri-security"
  "onlymore-game-creator"
  "onlymore-investor"
  "onlymore-n8n-automation"
  "onlymore-stitch-design"
)

echo "🧠 Installation des skills ONLYMORE..."
echo ""

# Creer le dossier skills s'il n'existe pas
mkdir -p "$SKILLS_DIR"

for skill in "${SKILLS[@]}"; do
  if [ -d "$SCRIPT_DIR/$skill" ]; then
    cp -r "$SCRIPT_DIR/$skill" "$SKILLS_DIR/"
    echo "  ✅ $skill"
  else
    echo "  ⚠️  $skill — dossier introuvable, skip"
  fi
done

echo ""
echo "🎯 ${#SKILLS[@]} skills installés dans $SKILLS_DIR/"
echo ""
ls -1 "$SKILLS_DIR/"
echo ""
echo "ok flo let's go 😎"
