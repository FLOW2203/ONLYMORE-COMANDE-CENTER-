# Skills externes — Couche 2 execution

Skills externes (open-source ou tiers) installes dans un namespace dedie pour
preserver la doctrine ONLYMORE (Couche 1) de toute contamination.

## Architecture en couches

| Couche | Path | Contenu | Status |
|---|---|---|---|
| **Couche 1 — Doctrine ONLYMORE** | `/skills/onlymore-*` (racine) + `/.claude/agents/` + `/context/` | WHY, agents permanents, doctrine 7 Legendes, brand voice, valeurs | Intouchable. Toute modification passe par revue CEO + commit explicite. |
| **Couche 2 — Execution externe** | `/skills/external/<vendor>/` | Skills tactiques operationnels (CRO, copy, SEO, emails, sales) | Importable, versionne, jetable. Un `rm -rf` du dossier vendor doit etre suffisant pour rollback. |

## Regle de separation

**Ne jamais melanger les deux namespaces.** Un skill externe ne doit jamais :

- Etre place a la racine de `/skills/`.
- Modifier `/skills/onlymore-*`.
- Modifier `/.claude/agents/`.
- Modifier `/context/`.

Inversement, la doctrine Couche 1 ne reference jamais directement un skill
Couche 2 par chemin absolu : la communication se fait via le context file
`.agents/product-marketing.md`.

## Vendors actuellement installes

### corey-haines/ (Corey Haines Marketing Skills v2.0)

- **Source** : https://github.com/coreyhaines31/marketingskills
- **Version** : 2.0.0 (2026-05-05)
- **Skills installes** : `cro`, `copywriting`, `ai-seo`, `emails`,
  `sales-enablement` (5 sur 40 disponibles).
- **Context file consume** : `.agents/product-marketing.md` (path canonique
  v2.0) avec fallback `.claude/product-marketing.md`.
- **Note importante** : le skill historique `email-sequence` a ete renomme
  `emails` en v2.0 (rename officiel ligne 61 VERSIONS.md).

#### Rollback complet

```
rm -rf skills/external/corey-haines/
```

#### Mise a jour

```
git clone https://github.com/coreyhaines31/marketingskills.git /tmp/mks
cp -r /tmp/mks/skills/{cro,copywriting,ai-seo,emails,sales-enablement} \
      skills/external/corey-haines/
```

## Ajouter un nouveau vendor

1. Creer `skills/external/<vendor>/`.
2. Copier UNIQUEMENT les skills necessaires.
3. Documenter source, version, skills installes dans ce README.
4. Verifier qu'aucun nom n'entre en conflit avec un skill Couche 1.
5. Commit avec message clair `feat(skills): add <vendor> v<X.Y> in external namespace`.
