# CROWNIUM -- Framework d'Audit Fuite des Talents

## Objectif

Quantifier la douleur de chaque club prospecte pour demontrer l'impact financier et sportif de la fuite des talents, et montrer comment CROWNIUM aurait change la trajectoire. Ce framework est l'outil de prospection principal de CROWNIUM : chaque pitch club commence par un audit personnalise.

## Methodologie

### Etape 1 : Collecte de Donnees (5 dernieres saisons)

Pour chaque club cible, collecter :
- Liste des joueurs cles vendus (top 10 par montant de transfert)
- Montants des transferts sortants (brut et net)
- Age des joueurs au moment du depart
- Nombre de saisons passees au club
- Cout de formation estime (source : rapport DNCG ou estimation standard par division)
- Valeur Transfermarkt au depart vs a l'arrivee au club (plus-value creee par le club)
- Destination (club acheteur, division, pays)
- Duree restante du contrat au moment de la vente (leverage de negociation)

**Sources** :
- Transfermarkt (valeurs marche, historique transferts, profils joueurs)
- Rapports DNCG (donnees financieres clubs francais)
- Rapports annuels des clubs (si publics)
- Presse sportive (L'Equipe, So Foot, Foot Mercato, sites locaux)

### Etape 2 : Analyse d'Impact Sportif

Pour chaque depart majeur, mesurer :
- Classement du club la saison avant le depart
- Classement la saison apres le depart
- Nombre de points perdus (correlation, pas causalite : le noter)
- Turnover entraineurs (instabilite post-ventes)
- Affluence stade avant/apres (impact sur les revenus billetterie)
- Performance en coupes (elimination precoce apres departs?)
- Nombre de recrues necessaires pour remplacer (cout de remplacement)

**Indicateurs composites** :
- Score de stabilite de l'effectif : nombre de titulaires conserves d'une saison a l'autre
- Score de dependance transferts : % du budget total provenant des ventes de joueurs
- Score de formation nette : joueurs formes au club presents dans l'effectif vs vendus

### Etape 3 : Calcul de la Valeur Perdue

**Formule principale** :
```
Valeur Perdue = Somme (Valeur marche au depart - Indemnite recue - Cout formation)
```

**Valeur sportive perdue** :
```
Points manques (estimation) x Valeur d'un point (droits TV + billetterie + sponsors par point de classement)
```

Note : La valeur d'un point de classement varie par division :
- Ligue 1 : [A COMPLETER] euros/point (droits TV + billetterie)
- Ligue 2 : [A COMPLETER] euros/point
- National : [A COMPLETER] euros/point
- Bundesliga : [A COMPLETER] euros/point
- [A COMPLETER autres divisions cibles]

**Valeur marque perdue** :
- Impact sur l'attractivite du club pour les sponsors
- Impact sur le merchandising (maillots du joueur parti)
- Impact sur la couverture mediatique
- [A COMPLETER : methode de quantification]

### Etape 4 : Simulation "Si Retention"

Pour chaque joueur cle parti, simuler :
1. **Scenario de retention** : que se serait-il passe si le club l'avait garde 2 saisons de plus?
2. **Simulation de classement** : projection basee sur les stats du joueur et la performance de l'equipe
3. **Revenus additionnels** : meilleur classement = plus de droits TV, billetterie, sponsors
4. **Valeur marchande** : le joueur aurait-il pris de la valeur (age, progression)?
5. **Cout de la prolongation** : combien aurait coute la revalorisation salariale?

**Calcul du ROI mutualist** :
```
Supporters CROWNIUM necessaires = Cout prolongation / (Contribution mensuelle x 12)
```

Exemple : Si prolonger un joueur coute 200 000 euros/an de plus, et que chaque supporter Tier 1 contribue [A COMPLETER] euros/mois :
- Tier 1 : [A COMPLETER] supporters necessaires
- Mix Tier 1+2 : [A COMPLETER] supporters necessaires

**Question cle pour le club** : "Pensez-vous que [X] supporters seraient prets a investir [Y] euros/mois pour garder [Joueur Z]?"

## Template de Rapport Club

### Page de Couverture
- Logo CROWNIUM + logo du club
- "Audit Fuite des Talents : [Nom du Club]"
- "Prepare par CROWNIUM pour [Nom du Dirigeant]"
- Date

### Section 1 : Fiche Club

| Donnee | Valeur |
|--------|--------|
| Club | [Nom] |
| Ligue | [Division] |
| Budget annuel | [euros] |
| Masse salariale | [euros] |
| Revenus transferts (5 ans) | [euros] |
| Depenses transferts (5 ans) | [euros] |
| Solde net | [euros] |
| Joueurs formes au club dans le top 5 des ligues europeennes | [Nombre] |
| Affluence moyenne | [Nombre] |
| Nombre d'abonnes | [Nombre] |

### Section 2 : Tableau des Departs

| Joueur | Saison | Age | Destination | Montant | Valeur Transfermarkt | Duree restante contrat | Impact classement |
|--------|--------|-----|-------------|---------|---------------------|----------------------|-------------------|
| [Nom] | [Annee] | [Age] | [Club] | [euros M] | [euros M] | [mois] | [+/- places] |

### Section 3 : Graphique de Valeur Perdue
- **Axe X** : saisons (5 dernieres)
- **Axe Y gauche** : valeur cumulee des joueurs vendus (barres)
- **Axe Y droit** : classement du club (courbe)
- **Objectif visuel** : montrer la correlation entre ventes et chute de classement
- Format : genere via [A COMPLETER outil de dataviz]

### Section 4 : Les "What If" (3 scenarios)
- **Scenario A** : Retention du joueur le plus cher vendu. Impact estime sur le classement et les revenus.
- **Scenario B** : Retention des 3 joueurs les plus importants (par stats, pas par montant). Impact estime.
- **Scenario C** : Retention de tous les joueurs formes au club partis en 5 ans. Impact maximal theorique.

### Section 5 : Projection CROWNIUM

| Metrique | Valeur |
|----------|--------|
| Nombre de supporters Tier 1 necessaires pour financer Scenario A | [Nombre] |
| Nombre de supporters Tier 2 necessaires pour financer Scenario A | [Nombre] |
| Mix optimal (Tier 1 + Tier 2 + Tier 3) | [Repartition] |
| Timeline de construction de la communaute | [Mois] |
| ROI pour le club : joueur retenu = revenus supplementaires | [euros/an] |
| Point mort : quand les revenus CROWNIUM couvrent le cout de retention | [Mois] |

### Section 6 : Proposition d'Accompagnement
- Offre d'onboarding CROWNIUM adaptee au club
- Timeline de mise en place (3-6 mois)
- Premiers objectifs : nombre de supporters vises a 6 mois, 12 mois
- Engagement CROWNIUM : pas de frais tant que [A COMPLETER seuil] n'est pas atteint

## Sources de Donnees

| Source | Type de donnees | Acces |
|--------|----------------|-------|
| Transfermarkt | Valeurs marche, historique transferts, profils joueurs | Gratuit (scraping) + API [A COMPLETER] |
| DNCG (France) | Rapports financiers clubs francais | Public (rapports annuels) |
| UEFA Club Licensing Benchmarking Report | Donnees financieres clubs europeens | Public (rapport annuel) |
| football-data.org | Resultats, classements, stats | API [A COMPLETER acces] |
| FBref / StatsBomb | Stats avancees joueurs | Gratuit (FBref) |
| Presse sportive | Contexte, annonces transferts, interviews | Veille manuelle + alertes |
| Comptes annuels des clubs | Bilans, comptes de resultat | Greffe du tribunal de commerce (France) |

## Clubs Prioritaires pour Audit

### Priorite 1 (lancer l'audit immediatement)
1. **Nimes Olympique** : proximite geographique, histoire de ventes forcees, relega de Ligue 1 en National en quelques saisons, symbole de la spirale de la fuite des talents.

### Priorite 2 (preparer l'audit)
2. [A COMPLETER : club Ligue 2 avec solde transferts tres negatif]
3. [A COMPLETER : club Bundesliga formateur type Freiburg ou Mainz]

### Priorite 3 (veille et opportunite)
4. [A COMPLETER : club en crise financiere, actualite recente]
5. [A COMPLETER : club avec base supporters tres engagee mais frustree]

### Criteres de priorisation
- Solde net transferts sur 5 ans (plus c'est negatif, plus la douleur est forte)
- Taille de la base supporters (potentiel de collecte mutualist)
- Proximite geographique (facilite de prospection pour les premiers clubs)
- Ouverture connue de la direction a l'innovation
- Actualite recente (depart d'un joueur emblematique, difficultes financieres)

## Utilisation du Framework par les Agents

| Agent | Role dans l'audit |
|-------|-------------------|
| ALPHA | Valide la strategie de prospection et la priorisation des clubs |
| VAULT | Collecte et analyse les donnees financieres, construit les simulations |
| HERALD | Redige le rapport dans le ton CROWNIUM, prepare la presentation |
| SHIELD | Verifie la conformite reglementaire des simulations et des promesses |
| FORGE | Construit le dashboard de visualisation des donnees |
| NEXUS | Automatise la collecte de donnees via les API (Transfermarkt, football-data) |
| SENTINEL | Valide la qualite des donnees et l'exactitude des calculs |

## Checklist Avant Envoi du Rapport

- [ ] Toutes les donnees sont sourcees et verifiables
- [ ] Aucune promesse de rendement garanti
- [ ] Ton CROWNIUM respecte (voir brand-voice.md)
- [ ] "Nous" utilise partout, jamais "je"
- [ ] Positionnement additif respecte (pas d'attaque de concurrents)
- [ ] Simulations clairement presentees comme des projections, pas des garanties
- [ ] Mention "[A COMPLETER]" pour toute donnee non encore disponible
- [ ] Relu par SHIELD pour conformite reglementaire
- [ ] Format PDF professionnel, co-branding CROWNIUM + club
