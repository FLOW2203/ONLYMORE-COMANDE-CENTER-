# ONLYMORE Managed Agents — Runbook (1 page)

## Invoquer le système

**Entry point unique** : toute requête passe par l'orchestrateur.

```
@onlymore-ceo-agent <requête en langage naturel>
```

Exemples :

```
@onlymore-ceo-agent prépare un post LinkedIn COLHYBRI pour demain
@onlymore-ceo-agent audit RLS sur la table payments
@onlymore-ceo-agent deploy forge/feat-checkout en prod
```

Le CEO agent identifie la couche (fonctionnels L2 ou entité L3), route,
et formalise la délégation.

### Invocation directe (avancé)

Il est techniquement possible d'appeler un sous-agent directement
(`@forge-build ...`), mais cela **court-circuite la traçabilité
AGENTS_LOG**. À réserver au debug.

## Ajouter un nouvel agent

1. Créer `.claude/agents/<nom-kebab>.md` avec le frontmatter strict :
   ```yaml
   ---
   name: <nom-kebab>
   description: <triggers>
   tools: [whitelist]
   model: opus | sonnet
   autonomy: auto | confirm | ask
   permission_mode: default | acceptEdits | plan
   forbidden_actions: []
   require_human_for: []
   ---
   ```
2. Ajouter les outils au `_shared/mcp-routing.json`.
3. Mettre à jour le tableau `delegation_matrix`.
4. Référencer l'agent dans `onlymore-ceo-agent.md` (section routing).
5. `bash scripts/install-agents.sh` → commit.

## Révoquer un accès MCP

1. Retirer les outils du frontmatter `tools:` de l'agent concerné.
2. Retirer l'agent des listes du `_shared/mcp-routing.json`.
3. Commit préfixé : `shield-security: revoke <tool> from <agent>`.
4. Notion AGENTS_LOG : logger l'action de révocation.
5. Redémarrer la session Claude Code pour recharger les agents.

## Cas d'urgence — désactiver un agent

```bash
mv .claude/agents/<agent>.md .claude/agents/<agent>.md.disabled
git commit -am "shield-security: disable <agent> pending audit"
```

L'orchestrateur routera vers un fallback (le CEO lui-même si aucun autre
agent ne couvre le scope).

## Inspection rapide

| Besoin | Commande / action |
|---|---|
| Lister les agents | `ls .claude/agents/*.md` |
| Voir la whitelist d'un agent | `grep -A 40 '^tools:' .claude/agents/<agent>.md` |
| Auditer AGENTS_LOG | Notion → DB AGENTS_LOG → filtre last 24h |
| Détecter dérive | @sentinel-monitor "scan agents activity last 7d" |

## Escalade humaine

Toute action marquée `require_human_for` bloque et affiche :

```
[HUMAN REQUIRED] <agent> demande validation pour : <action>
  Impact : <...>
  Réversible : oui/non
  OK pour exécuter ? (yes/no/details)
```

Réponse `yes` = proceed. `no` = abort + log. `details` = expansion.
