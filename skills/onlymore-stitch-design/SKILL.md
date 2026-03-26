# onlymore-stitch-design

Skill d'intégration Google Stitch MCP pour les designs COLHYBRI et les filiales ONLYMORE.

## Contexte

Google Stitch est le design system IA qui génère des écrans HTML/CSS. Via le MCP proxy, Claude Code accède directement aux designs sans copier-coller.

**Pipeline :** Stitch (design IA) → MCP proxy → Claude Code (récupère HTML/CSS + Design DNA) → intègre dans le repo React/Vite COLHYBRI → deploy Vercel.

Stack MCP existante (7 MCPs) : Supabase, Vercel, Notion, n8n, Gmail, Canva, Google Calendar.
Stitch = 8ème MCP.

## Références projet

- GitHub org : FLOW2203
- Supabase ref COLHYBRI : `isuzbpzwxcagtnbosgjl` (seul ref valide)
- Git user : Florent Gibert <onlymore2024@gmail.com>

## Instructions

Quand ce skill est invoqué :

### 1. Vérifier la connexion Stitch MCP
```bash
npx @_davideast/stitch-mcp doctor
```
Si la connexion n'est pas active, guider l'utilisateur :
```bash
npx @_davideast/stitch-mcp init --client "Claude Code"
```

### 2. Lister les projets Stitch disponibles
```bash
npx @_davideast/stitch-mcp view --projects
```

### 3. Explorer les écrans d'un projet
```bash
npx @_davideast/stitch-mcp screens -p <project-id>
```

### 4. Récupérer le code d'un écran
```bash
npx @_davideast/stitch-mcp tool get_screen_code -d '{"projectId": "<project-id>", "screenId": "<screen-id>"}'
```

### 5. Récupérer le screenshot d'un écran
```bash
npx @_davideast/stitch-mcp tool get_screen_image -d '{"projectId": "<project-id>", "screenId": "<screen-id>"}'
```

### 6. Générer un site Astro complet depuis les écrans
```bash
npx @_davideast/stitch-mcp site -p <project-id>
```

### 7. Intégration dans le repo COLHYBRI
Après récupération du HTML/CSS depuis Stitch :
- Extraire les composants réutilisables (header, footer, cards, buttons)
- Convertir en composants React/TypeScript
- Appliquer la palette ONLYMORE :
  - COLHYBRI : `#00D4AA`
  - CROWNIUM : `#FFD700`
  - DOJUKU SHINGI : `#FF6B35`
  - GROUPE : `#7B61FF`
- Intégrer dans l'architecture Vite/React existante
- Vérifier la responsivité mobile-first
- Committer avec un message clair et push

### 8. Générer un DESIGN.md
À partir du Design DNA extrait de Stitch, générer un fichier `DESIGN.md` contenant :
- Palette de couleurs utilisée
- Typographie
- Spacing system
- Components library (noms, props, usage)
- Breakpoints responsive

## MCP Config

La configuration MCP pour Claude Code (à ajouter dans `claude_desktop_config.json` ou `.mcp.json`) :

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_USE_SYSTEM_GCLOUD": "1"
      }
    }
  }
}
```

## Outils MCP disponibles via Stitch

| Outil | Description |
|---|---|
| `build_site` | Génère un site complet depuis les écrans Stitch |
| `get_screen_code` | Récupère le HTML/CSS d'un écran |
| `get_screen_image` | Récupère le screenshot base64 |
| `create_project` | Crée un nouveau projet Stitch |
| `list_projects` | Liste tous les projets |
| `create_screen` | Crée un nouvel écran dans un projet |
| `edit_screen` | Modifie un écran existant |

## Filiale

ONLYMORE Group (priorité COLHYBRI)
