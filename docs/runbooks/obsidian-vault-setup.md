# Procédure ONLYMORE — Connect Vault Obsidian + Dépôt Constitutions Chiffré

> **Runbook validé** : 13/05/2026
> **Auteur** : Florent Gibert (CEO ONLYMORE Group)
> **Co-validation IA** : Claude (assistant doctrine ONLYMORE)
> **Dernière exécution** : [date à compléter manuellement après première exécution]
> **Référence croisée** : PR #8 (https://github.com/FLOW2203/ONLYMORE-COMANDE-CENTER-/pull/8) pour les 7 fichiers constitutionnels
> **Statut** : v1.0 — opérationnel

**Date** : 13/05/2026
**Vault** : `C:\ONLYMORE\00_HOLDING` (Git Bash : `/c/ONLYMORE/00_HOLDING`)
**Cible** : Repo distant `FLOW2203/onlymore-vault`, chiffrement git-crypt sur `9_META/00_Constitutions/`
**Durée totale estimée** : 15 minutes
**Pré-requis validés** : Git Bash ✅ · GPG 2.4.9 ✅ · `gh` CLI ✅

---

## Phase 1 — Sauvegarde de l'état actuel (2 min)

Tu as 4 fichiers modifiés et 4 fichiers untracked dans ton vault. On les met en sécurité **temporairement** avant toute opération destructive.

```bash
cd /c/ONLYMORE/00_HOLDING
git stash push -u -m "snapshot-pre-cli-setup-$(date +%Y%m%d-%H%M)"
git stash list
```

**Sortie attendue** : `stash@{0}: On main: snapshot-pre-cli-setup-20260513-1510` (timestamp variera)

→ Ton travail est en sécurité. Tu pourras le récupérer avec `git stash pop` après.

---

## Phase 2 — Vérification ou génération de la clé GPG (3 min)

### 2a. Vérifier si tu as déjà une clé

```bash
gpg --list-secret-keys onlymore2024@gmail.com
```

**Si une clé existe** : tu verras une sortie type `sec rsa4096/XXXXXXXXX 2025-XX-XX [SC]`. Note le **ID de clé** (la partie après le `/`). Passe à la Phase 3.

**Si rien ne s'affiche ou erreur "No public key"** : tu n'as pas encore de clé pour cet email. Passe à 2b.

### 2b. Créer une clé GPG dédiée ONLYMORE (à faire une fois pour toutes)

```bash
gpg --full-generate-key
```

**Réponses à donner aux questions** :

- Type de clé : **9** (ECC and ECC) ou défaut **1** (RSA and RSA) si tu veux du standard
- Taille : **4096**
- Validité : **0** (n'expire jamais)
- Confirmation : **y**
- Real name : **Florent Gibert**
- Email : **onlymore2024@gmail.com**
- Comment : **ONLYMORE Group Vault Master Key**
- Confirmation finale : **O** (Okay)
- Passphrase : choisis une passphrase forte, **note-la dans un password manager** (1Password, Bitwarden, KeePass). Sans elle, plus aucun déchiffrement possible.

**Sortie finale attendue** : `pub rsa4096/XXXXXXXX 2026-05-13 [SC]` + `uid Florent Gibert (ONLYMORE Group Vault Master Key) <onlymore2024@gmail.com>`

### 2c. Exporter une copie de sauvegarde de la clé (critique)

```bash
mkdir -p /c/ONLYMORE/00_SAFE_KEYS
gpg --export-secret-keys --armor onlymore2024@gmail.com > /c/ONLYMORE/00_SAFE_KEYS/onlymore-master-key-private.asc
gpg --export --armor onlymore2024@gmail.com > /c/ONLYMORE/00_SAFE_KEYS/onlymore-master-key-public.asc
```

→ Copie le dossier `00_SAFE_KEYS/` sur **2 supports externes différents** (clé USB chiffrée + drive cloud privé chiffré). Sans cette clé, en cas de crash machine, tes constitutions chiffrées seraient **définitivement illisibles**.

---

## Phase 3 — Création du repo distant + ajout remote (1 min)

```bash
gh repo create FLOW2203/onlymore-vault \
  --private \
  --description "ONLYMORE Group — Obsidian vault (doctrine, IP, CRM, briefs CFO)"

cd /c/ONLYMORE/00_HOLDING
git remote add origin https://github.com/FLOW2203/onlymore-vault.git
git remote -v
```

**Sortie attendue** :

```
origin  https://github.com/FLOW2203/onlymore-vault.git (fetch)
origin  https://github.com/FLOW2203/onlymore-vault.git (push)
```

---

## Phase 4 — Création du .gitignore Obsidian-aware (1 min)

```bash
cat > .gitignore <<'EOF'
# === Obsidian workspace (préférences locales, pas à versionner) ===
.obsidian/workspace*
.obsidian/cache/
.obsidian/graph.json
.obsidian/app.json
.obsidian/appearance.json
.obsidian/hotkeys.json

# === Système ===
.trash/
.DS_Store
Thumbs.db
desktop.ini

# === Temporaires éditeurs ===
*.tmp
*~
.~lock.*

# === Sécurité ===
*.key
*.pem
.env*
00_SAFE_KEYS/

# === Backups locaux ===
*.bak
*.backup
EOF

# Retirer du suivi les fichiers .obsidian/* déjà tracked
git rm --cached .obsidian/core-plugins.json .obsidian/graph.json .obsidian/workspace.json 2>/dev/null || true

git add .gitignore
git commit -m "chore: add Obsidian-aware .gitignore + remove workspace files from tracking"
```

---

## Phase 5 — Setup git-crypt sur dossiers sensibles (3 min)

### 5a. Vérifier que git-crypt est installé

```bash
git-crypt --version
```

**Si commande not found** : installer via le bundle Git for Windows alternatif OU télécharger depuis https://github.com/AGWA/git-crypt/releases (binaire `git-crypt-X.Y.Z-x86_64.exe` à placer dans `/c/Program Files/Git/usr/bin/` puis renommer en `git-crypt.exe`).

### 5b. Initialiser git-crypt et déclarer les dossiers chiffrés

```bash
git-crypt init
git-crypt add-gpg-user onlymore2024@gmail.com

cat > .gitattributes <<'EOF'
# === Dossiers chiffrés via git-crypt ===
9_META/00_Constitutions/** filter=git-crypt diff=git-crypt
9_META/05_CFO_Briefs/** filter=git-crypt diff=git-crypt
9_META/06_Doctrine_Sensible/** filter=git-crypt diff=git-crypt
6_CRM/** filter=git-crypt diff=git-crypt

# Garder lisibles les README et index
9_META/**/README.md !filter !diff
9_META/**/_INDEX.md !filter !diff
EOF

git add .gitattributes
git commit -m "feat(security): setup git-crypt on sensitive folders (Constitutions, Briefs CFO, CRM)"
```

---

## Phase 6 — Dépôt des 7 fichiers constitutionnels (3 min)

### 6a. Créer le dossier cible

```bash
mkdir -p 9_META/00_Constitutions
```

### 6b. Télécharger et décompresser le zip

Tu télécharges depuis Claude Code Web (PR #8 du repo `ONLYMORE-COMANDE-CENTER-`, URL https://github.com/FLOW2203/ONLYMORE-COMANDE-CENTER-/pull/8) <!-- CORRECTION 1 --> le fichier `00-constitutions-financieres-onlymore.zip` dans ton dossier Téléchargements Windows (`C:\Users\Moi\Downloads\`).

Puis dans Git Bash :

```bash
cd /c/ONLYMORE/00_HOLDING/9_META/00_Constitutions
unzip /c/Users/Moi/Downloads/00-constitutions-financieres-onlymore.zip
ls -la
```

**Sortie attendue** : 7 fichiers `.md` listés (1 MOC + 1 constitution principale + 4 stubs + 1 brief CFO).

### 6c. Vérifier que le chiffrement est actif

```bash
cd /c/ONLYMORE/00_HOLDING
git status
git check-attr filter -- 9_META/00_Constitutions/2026-05-13-Cascade-Mutualiste-SPV-Constitution-3.md
```

**Sortie attendue** : `9_META/00_Constitutions/2026-05-13-Cascade-Mutualiste-SPV-Constitution-3.md: filter: git-crypt` → confirmation que le fichier sera chiffré au commit.

### 6d. Garde-fou : audit de couverture du chiffrement (recommandé) <!-- CORRECTION 3 -->

Avant le tout premier push, scanner l'ensemble des fichiers stagés pour vérifier qu'aucun fichier sensible n'échappe au filtre git-crypt :

```bash
cd /c/ONLYMORE/00_HOLDING
git add -A
git ls-files --cached | xargs -I {} sh -c 'echo "=== {} ==="; git check-attr filter -- "{}"' | grep -E 'Constitutions|CFO_Briefs|Doctrine_Sensible|CRM' | grep -v 'filter: git-crypt'
```

Sortie attendue : AUCUNE LIGNE retournée.

Si une ou plusieurs lignes apparaissent, cela signifie qu'un fichier sensible n'a pas reçu le filtre git-crypt. Diagnostic : vérifier `.gitattributes` (Phase 5b) et corriger les patterns avant tout push.

Ce garde-fou est non-bloquant si la Phase 9a (vérification visuelle sur GitHub) est respectée scrupuleusement, mais il permet une détection automatique pré-push sans avoir à ouvrir GitHub.

---

## Phase 7 — Premier commit + push chiffré (1 min)

```bash
git add 9_META/00_Constitutions/
git commit -m "feat(doctrine): add 3rd Financial Constitution (Cascade Mutualiste SPV) + 6 associated stubs

- 1 MOC index for Constitutions Financières
- 1 main doc: Cascade Mutualiste SPV (3rd Constitution)
- 4 stubs: Double Boucle Infinie, Capital Sociétaire Inaliénable, Charte Bienveillance CROWNIUM, Charte Fonds Services Suspendus
- 1 Brief CFO João Almeida 2026-05

All files encrypted at-rest via git-crypt with GPG key onlymore2024@gmail.com.

Reference: PR #8 ONLYMORE-COMANDE-CENTER."

git push -u origin main
```

**Sortie attendue** : `* [new branch] main -> main` → ton vault est désormais sur GitHub, avec les 7 fichiers constitutionnels **chiffrés at-rest**.

---

## Phase 8 — Récupérer le travail mis en sécurité (Phase 1) (1 min)

```bash
git stash pop
git status
```

Tes 4 modifications + 4 fichiers untracked sont réintégrés au working directory. À toi de décider quoi commit prochainement.

---

## Phase 9 — Vérification finale (test du chiffrement, 1 min)

### 9a. Vérifier que les fichiers sont bien chiffrés sur GitHub

Va sur https://github.com/FLOW2203/onlymore-vault/blob/main/9_META/00_Constitutions/2026-05-13-Cascade-Mutualiste-SPV-Constitution-3.md

**Attendu** : GitHub doit afficher du binaire illisible (du type `GITCRYPT...` puis des caractères aléatoires). **Si tu vois du markdown en clair → ARRÊT IMMÉDIAT, le chiffrement n'est pas actif.** Force-push impossible sans clarification.

### 9b. Test de déchiffrement en local

```bash
cd /c/ONLYMORE/00_HOLDING
cat 9_META/00_Constitutions/2026-05-13-Cascade-Mutualiste-SPV-Constitution-3.md | head -20
```

**Attendu** : Tu vois le frontmatter YAML en clair. La couche git-crypt déchiffre transparently côté local mais chiffre côté GitHub.

### 9c. Test de simulation nouvelle machine

**Note** <!-- CORRECTION 2 --> : `git-crypt status` ne montre les fichiers comme `encrypted` qu'après le premier commit avec filtre actif (Phase 7). Si tu le lances avant Phase 7, tous les fichiers apparaîtront `not encrypted` — c'est normal et n'indique aucun problème.

```bash
git-crypt status
```

**Attendu** : Statut `encrypted` sur les fichiers des 4 dossiers sensibles, `not encrypted` sur les autres.

---

## Phase 10 — Workflow quotidien à partir de maintenant

À chaque session de travail :

```bash
# Matin
cd /c/ONLYMORE/00_HOLDING
git pull --rebase

# Pendant la journée → tu travailles normalement dans Obsidian

# Soir
git add -A
git commit -m "vault: sync $(date +%Y-%m-%d)"
git push
```

Ou bien, **et c'est ce que je recommande**, tu installes le plugin **Obsidian Git** :

1. Settings → Community plugins → Browse → "Obsidian Git" → Install + Enable
2. Settings → Obsidian Git → activer :
   - "Auto pull on startup" : ✅
   - "Auto push on close" : ✅
   - "Vault backup interval (minutes)" : 30
   - "Auto commit-and-sync" : ✅

→ À partir de là, tout est automatique. Tu ouvres Obsidian, ça pull. Tu fermes, ça push. Tu travailles, ça commit toutes les 30 min.

---

## Architecture finale en place

```
C:\ONLYMORE\00_HOLDING\                  ← Ton vault Obsidian
├── .git/                                 ← Versionning local
├── .gitignore                            ← Obsidian-aware
├── .gitattributes                        ← git-crypt config
├── .git-crypt/                           ← Clés de chiffrement (privé)
├── .obsidian/                            ← Config Obsidian (partielle, workspace exclu)
├── 1_PROJECTS/
├── 2_AREAS/
├── 3_RESOURCES/
├── 4_ARCHIVES/
├── 5_ZETTEL/
├── 6_CRM/                                ← 🔒 Chiffré (CRM stratégique)
├── 7_TEMPLATES/
├── 8_DAILY/
├── 9_META/
│   ├── 00_Constitutions/                 ← 🔒 Chiffré (3 constitutions + chartes + brief CFO)
│   │   ├── _MOC-Constitutions-Financieres.md
│   │   ├── 2026-05-13-Cascade-Mutualiste-SPV-Constitution-3.md
│   │   ├── 2026-05-13-Constitution-Double-Boucle-Infinie.md
│   │   ├── 2026-05-13-Capital-Societaire-Inalienable.md
│   │   ├── 2026-05-13-Charte-Bienveillance-CROWNIUM.md
│   │   ├── 2026-05-13-Charte-Fonds-Services-Suspendus.md
│   │   └── 2026-05-13-Brief-CFO-Joao-Almeida-2026-05.md
│   ├── 05_CFO_Briefs/                    ← 🔒 Chiffré (future)
│   └── 06_Doctrine_Sensible/             ← 🔒 Chiffré (future)
├── README.md
└── VELODROME_ONLYMORE.md

C:\ONLYMORE\00_SAFE_KEYS\                 ← Backup clés GPG (jamais commit, jamais cloud public)
├── onlymore-master-key-private.asc
└── onlymore-master-key-public.asc

Remote : github.com/FLOW2203/onlymore-vault (privé, contenu chiffré at-rest)
```

---

## Garde-fous non-négociables

| Règle | Justification |
|---|---|
| **Jamais commit le dossier `00_SAFE_KEYS/`** | Déjà dans `.gitignore`. Si tu push ta clé privée, le chiffrement devient inutile. |
| **Toujours sauvegarder la clé GPG sur 2 supports physiques différents** | Perte de clé = perte de tous les fichiers chiffrés. Pas de récupération possible. |
| **Vérifier après chaque push que GitHub affiche du binaire** sur les fichiers sensibles | Test régulier du chiffrement opérationnel. |
| **Ajouter João Almeida comme collaborateur git-crypt** uniquement après réunion CFO en présentiel | Cohérent avec ta règle "engagements en présentiel uniquement". |
| **Avant de quitter Obsidian, vérifier `git status`** | Aucune modification perdue si auto-sync activé. |

---

## En cas de problème

| Symptôme | Diagnostic | Solution |
|---|---|---|
| `git-crypt: command not found` | git-crypt pas installé | Télécharger binaire GitHub release, placer dans `/c/Program Files/Git/usr/bin/` |
| `gpg: keyserver receive failed` | Pare-feu bloque port 11371 | Utiliser `--keyserver hkps://keys.openpgp.org` |
| Fichier en clair sur GitHub | git-crypt pas actif | `git-crypt status` pour diagnostiquer + force re-encrypt |
| Push refusé `Updates were rejected` | Conflits avec remote | `git pull --rebase` d'abord, puis re-push |
| Plugin Obsidian Git échoue | Authentification HTTPS | Configurer credential helper : `git config --global credential.helper manager` |

---

**Auteur** : Florent Gibert, CEO ONLYMORE Group
**Date** : 13 mai 2026
**Statut** : Procédure opérationnelle validée
**Référence** : Cascade Mutualiste SPV (3ᵉ Constitution Financière)
