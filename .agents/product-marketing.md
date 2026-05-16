# ONLYMORE Group — Product Marketing Context

> Context file consume par les skills Corey Haines (v2.0+) installes dans
> `skills/external/corey-haines/`. Path canonique `.agents/product-marketing.md`,
> avec fallback historique `.claude/product-marketing.md`.
>
> **Doctrine ONLYMORE (Couche 1)** : intouchable. Definie ici et dans `context/`.
> **Skills externes (Couche 2)** : execution operationnelle, consomment ce context.

---

## 1. Identite Groupe

- **Nom legal** : ONLYMORE Group (holding)
- **Siege** : 13 rue de Gascogne, 30230 Rodilhan, France
- **Slogan** : "Optimisons vos oeuvres."
- **Valeur fondamentale** : "Nous n'avons pas besoin de nuire aux autres pour briller."
- **Devise interne** : "Deviens la personne dont tu veux que le monde soit."
  (Gandhi / Nietzsche 1913)
- **Ancrage** : 220 ans de mutualisme francais (1803, premieres mutuelles
  ouvrieres > loi 1898 > ESS 2014 > ONLYMORE 2024).
- **Inspiration** : tradition napolitaine du caffe sospeso, legende du colibri
  ("Je le sais, mais je fais ma part").

## 2. WHY (raison d'etre)

> "Que chacun puisse vivre et prosperer la ou il a grandi."

Le combat anti-fuite des talents, anti-emigration involontaire, anti-precarite
est la matrice qui aligne les 5 filiales. Toute decision strategique passe le
test du colibri, le test du "nuire", le test du "nous", le test du sospeso, le
test de la continuite (cf. `context/onlymore-group/values.md`).

## 3. Trois combats fondateurs

1. **Reduire la pauvrete** par la solidarite redistributive scalable.
2. **Stopper la fuite des talents** (sportifs, artisans, commercants,
   travailleurs) hors des territoires qui les ont formes.
3. **Lutter contre l'emigration involontaire** : permettre a chacun de rester
   chez soi par choix, pas par defaut.

## 4. Positionnement (transversal aux 5 filiales)

- **Additif, pas oppositif** : nous completons l'existant, nous ne le
  remplacons pas.
- **Supplement, pas contradiction** : nous ajoutons une option, pas une
  obligation.
- **ESS comme cadre** : modele prouve, encadre par la loi 2014.
- **Technologie comme levier** : 1 CEO + Claude Code + 8 agents IA permanents +
  7 integrations MCP = velocite de 20 personnes.
- **Toujours "nous", jamais "je"** dans toute communication externe.

## 5. Les 5 entites du groupe

### COLHYBRI — SaaS commerce local solidaire

- **Mission** : reduire la precarite par le commerce local solidaire.
- **Mecanique** : caffe sospeso scalable, pool 75/25 (75% redistribue en bons
  d'achat, 25% fonctionnement).
- **Slogan FR** : "Chaque geste compte. Le votre aussi."
- **Slogan EN** : "Own Your Neighborhood. Own Your Future."
- **Produit pivot** : abonnement citoyen 3 EUR/mois > pool quartier > bons
  d'achat chez commercants partenaires.
- **Personas** : commercant local 35-55 ans, citoyen urbain 25-45 ans, mairie.
- **URL** : colhybri.com (Next.js, 13 locales, 638 URLs).

### CROWNIUM — Financement mutualist clubs sportifs

- **Mission** : aider les clubs a garder leurs meilleurs talents par le
  financement supporters mutualist.
- **Cible primaire** : clubs Ligue 2 / National / National 2, presidents
  45-65 ans, budgets serres.
- **Regle absolue** : les supporters SOUSCRIVENT a CROWNIUM, jamais
  actionnaires du club. Capital club 100% intact.
- **4 tiers** : Supporter, Contributeur, Patron, Fondateur. Pas de speculation,
  pas de tokens.
- **Differenciation** : anti-fan-tokens (Chiliz/Socios speculatifs). Pas de
  trading, droits de gouvernance reels.

### DOJUKU SHINGI — IA arts martiaux (jeu video educatif)

- **Mission** : transmettre la sagesse des arts martiaux a travers le jeu
  video, honorer les aines et la diversite culturelle.
- **Cible primaire** : marche US, Rust Belt (Detroit, Pittsburgh, Cleveland,
  Gary), parents working-class 30-45 ans.
- **Produit** : app mobile, 81 techniques, 26 mini-jeux, 5 maitres x 5 cultures
  (Japon, Chine, Bresil, Thailande, [5e a completer]).
- **Vocabulaire EN-first** : wisdom, transmission, master, discipline,
  heritage. INTERDIT : combat, violence, fight, killer, war.

### ONLYMORE FINANCE — Credit intragroupe (IOBSP)

- **Mission** : acces au credit equitable garanti par actifs, intragroupe ESS.
- **Statut** : IOBSP (Intermediaire en Operations de Banque et Services de
  Paiement), regule ACPR.
- **Produit principal** : credit Lombard.
- **Role groupe** : flux financiers intragroupe, fundraising holding, pilotage
  CFO (Joao Almeida).

### PLUMAYA Editions — Maison d'edition IA-native

- **Mission** : creer des univers narratifs riches en exploitant l'IA comme
  outil de creation augmentee, pas de remplacement.
- **Positionnement** : "L'IA au service de l'imagination humaine, pas
  l'inverse."
- **Verticales** : livres (KDP), manga/BD (DOJUKU, COLHYBRI), animation, IP
  inter-filiales.
- **Vocabulaire interdit** : remplacement, automatique, robot-auteur, sans
  humain, copier.

## 6. Personas cibles par entite (resume tactique)

| Entite | Persona primaire | Douleur clef | Canal preferentiel |
|---|---|---|---|
| COLHYBRI | Commercant local 35-55 | Perte clientele face GMS / e-commerce | Bouche-a-oreille, WhatsApp, Facebook |
| COLHYBRI | Citoyen urbain 25-45 | Pouvoir d'achat + envie d'agir local | Instagram, TikTok, app mobile |
| CROWNIUM | President de club L2/National | Fuite annuelle des meilleurs joueurs | Email, rencontres in-person, presse sportive |
| CROWNIUM | Supporter engage | Sentir un impact reel, pas du token | Reseaux sociaux club, newsletter |
| DOJUKU | Parent Rust Belt | Activites educatives abordables et culturellement riches | Facebook, YouTube, recommandation peer |
| DOJUKU | Adolescent 10-16 | Jeu cool ET non-violent | TikTok, Discord, app store |
| ONLYMORE FINANCE | Holding ONLYMORE | Pilotage cashflow intragroupe | Reporting, Notion, Supabase |
| PLUMAYA | Lecteur 25-55 | Univers narratifs riches, IA assumee | Amazon KDP, librairies indep., reseaux |

## 7. Vocabulaire de marque (regles transversales)

### A privilegier

mutualisme, solidarite, impact, oeuvres, collectif, durabilite, territoire,
innovation sociale, fintech solidaire, ESS, patrimoine, transmission,
optimisation, synergie, ancrage local, commando, velocite, complementarite,
"je fais ma part", colibri, sospeso.

### Interdits absolus

disruption, killer, dominer, ecraser, revolutionner, charity, je/j'/mon/ma,
game-changer, licorne, pivot, remplacement, automatique (sans nuance),
robot-auteur, combat/violence (DOJUKU).

### Regles typographiques

- Pas de tirets longs em dash. Remplacer par virgule, point, deux-points,
  parenthese.
- Guillemets francais pour les citations en FR.
- Majuscules sur les noms de filiales : COLHYBRI, CROWNIUM, DOJUKU SHINGI,
  PLUMAYA, ONLYMORE FINANCE.
- "ONLYMORE" toujours en majuscules dans les noms propres.

## 8. Adaptation par canal (synthese)

| Canal | Registre | Format | Frequence cible |
|---|---|---|---|
| LinkedIn (FG perso + pages entites) | Thought leadership, vision macro | Articles longs, carrousels, milestones | 2-3 posts/sem par page |
| Pitch investisseur | Data first, vision, ton confiant + humble | Probleme > solution > marche > traction > equipe > ask | Trimestriel |
| Communication interne | Mode commando, transparent | Mission, sprint, livrable | Hebdo |
| Presse | "Fintech solidaire qui reconcilie profit et impact" | Communique, interview | Mensuel sur jalons |
| Reseaux grand public | Chaleureux, accessible, concret | Histoires de beneficiaires, chiffres impact | Quotidien sur 1 canal au moins |

## 9. Lien avec les autres context files

Les skills externes (cro, copywriting, ai-seo, emails, sales-enablement)
peuvent enrichir ce context en lisant les fichiers detailles par filiale :

- `context/onlymore-group/{values,brand-voice,investor-narrative,legal}.md`
- `context/colhybri/{brand-voice,competitors,offres,personas,visual-identity}.md`
- `context/crownium/{brand-voice,competitors,offres,personas,talent-drain-framework}.md`
- `context/dojuku-shingi/{brand-voice,offres,personas,visual-identity}.md`
- `context/plumaya/{brand-voice,offres,visual-identity}.md`

Ordre de lecture recommande pour un skill externe : (1) ce fichier, (2) le
context filiale pertinent, (3) la consigne specifique de la tache.

## 10. Garde-fous (a respecter par tout skill externe)

1. **Doctrine ONLYMORE Couche 1 immuable** : ne jamais modifier
   `skills/onlymore-workflow-engine/`, `.claude/agents/*.md`, `context/*`.
2. **Pas de tirets longs em dash**.
3. **Toujours "nous", jamais "je"** en communication externe.
4. **Positionnement additif** : jamais comparer negativement un concurrent
   nommement.
5. **Test du nuire** : si la deliverable nuit a un tiers, on ne l'execute pas.
6. **Mode commando + Florent Gibert signataire** : tout post LinkedIn /
   newsletter / email outreach se signe "Florent Gibert", confirmation humaine
   obligatoire avant envoi.

---

*Version 1.0 — 2026-05-16. Mainteneur : ONLYMORE CEO Agent. Modifications
soumises a revue Couche 1.*
