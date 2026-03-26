# 🧠 onlymore-skills

**Arsenal de skills Claude Code pour ONLYMORE Group**

Skills personnalisés pour accélérer le développement des filiales : COLHYBRI, CROWNIUM, DOJUKU SHINGI, ONLYMORE FINANCE.

## Skills disponibles

| Skill | Description | Filiale |
|---|---|---|
| `colhybri-deploy` | Déploiement Vercel + Supabase + Stripe pour colhybri.com | COLHYBRI |
| `colhybri-security` | Audit sécurité OWASP + RLS Supabase + RGPD | COLHYBRI |
| `onlymore-game-creator` | Générateur de mini-jeux HTML5 pour engagement communautaire | GROUPE |
| `onlymore-investor` | Génération pitch decks, dossiers financiers, outreach investisseurs | GROUPE |
| `onlymore-n8n-automation` | Workflows n8n + MCP pour automatisation inter-filiales | GROUPE |
| `onlymore-stitch-design` | Google Stitch MCP — design system IA → React components | GROUPE |

## Installation

```bash
# Cloner le repo
git clone https://github.com/FLOW2203/onlymore-skills.git
cd onlymore-skills

# Installer tous les skills
chmod +x install.sh
./install.sh
```

### Installation manuelle

```bash
cp -r colhybri-deploy ~/.claude/skills/
cp -r colhybri-security ~/.claude/skills/
cp -r onlymore-game-creator ~/.claude/skills/
cp -r onlymore-investor ~/.claude/skills/
cp -r onlymore-n8n-automation ~/.claude/skills/
cp -r onlymore-stitch-design ~/.claude/skills/
```

## Utilisation

Dans Claude Code, les skills sont automatiquement détectés depuis `~/.claude/skills/`. Chaque `SKILL.md` contient les instructions que Claude suit lors de l'invocation.

## Structure

```
onlymore-skills/
├── README.md
├── LICENSE
├── install.sh
├── .gitignore
├── colhybri-deploy/SKILL.md
├── colhybri-security/SKILL.md
├── onlymore-game-creator/SKILL.md
├── onlymore-investor/SKILL.md
├── onlymore-n8n-automation/SKILL.md
└── onlymore-stitch-design/SKILL.md
```

## Licence

MIT — ONLYMORE Group 2026
