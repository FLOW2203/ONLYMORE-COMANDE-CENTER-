import {
  EntityKey,
  HashtagSet,
  ArchetypeTemplate,
  HookPattern,
  TacticalTechnique,
  ProprietaryConcept,
  CTAType,
  AlgorithmSignal,
  QualityCheck,
  CarouselSlide,
} from '@/types/linkedin'

// ── Hashtag Library (unchanged from v1) ──

export const HASHTAG_LIBRARY: Record<EntityKey, HashtagSet> = {
  COLHYBRI: {
    broad: ['#fintech'],
    niche: ['#financialinclusion', '#solidarity', '#localcommerce'],
    geo: ['#Occitanie', '#Nimes'],
  },
  'DOJUKU SHINGI': {
    broad: ['#martialarts'],
    niche: ['#communityimpact', '#fitnesstech', '#intergenerational'],
    geo: ['#RustBelt', '#Wisconsin'],
  },
  CROWNIUM: {
    broad: ['#sportsbusiness'],
    niche: ['#clubfinancing', '#mutualism', '#sportsinvestment'],
    geo: ['#UEFA', '#Ligue1'],
  },
  'ONLYMORE FINANCE': {
    broad: ['#fintech'],
    niche: ['#lombardcredit', '#wealthtech'],
    geo: ['#France'],
  },
  'ONLYMORE Group': {
    broad: ['#socialentrepreneurship'],
    niche: ['#impactinvesting', '#ESS', '#socialinnovation'],
    geo: ['#FrenchTech', '#MadeInFrance'],
  },
  Founder: {
    broad: ['#entrepreneurship'],
    niche: ['#autodidact', '#founderstory', '#startuplife'],
    geo: ['#Occitanie'],
  },
}

// ── The 4 Story Archetypes ──

export const ARCHETYPE_TEMPLATES: ArchetypeTemplate[] = [
  {
    id: 'wound-lesson',
    label: 'The Wound \u2192 Lesson',
    labelFR: 'Blessure \u2192 Le\u00e7on',
    tagline: 'Hero suffers \u2192 discovers a truth \u2192 shares it so others don\'t suffer',
    bestFor: 'Exp\u00e9rience personnelle, takes contre-intuitifs, histoires d\'\u00e9chec, vuln\u00e9rabilit\u00e9',
    exampleAngle: 'J\'ai livr\u00e9 des colis pendant 3 ans. Un jour, un commer\u00e7ant m\'a offert un caf\u00e9. Pas un caf\u00e9 de politesse. Un vrai geste.',
    sections: [
      { placeholder: 'Hook: le moment douloureux (sp\u00e9cifique, vivide, sensoriel)', hint: 'Max 2 lignes. Ne jamais commencer par "Je", "Nous", "Aujourd\'hui"' },
      { placeholder: 'Conflit: ce que tout le monde croit vs. ce qui s\'est r\u00e9ellement pass\u00e9', hint: 'Contraste brutal. Chiffres > adjectifs.' },
      { placeholder: 'R\u00e9solution: le reframe, la le\u00e7on', hint: 'La v\u00e9rit\u00e9 universelle que cette exp\u00e9rience r\u00e9v\u00e8le' },
      { placeholder: 'CTA: "Est-ce que \u00e7a t\'est d\u00e9j\u00e0 arriv\u00e9 ?"', hint: 'Question ouverte qui invite au partage d\'exp\u00e9rience' },
    ],
  },
  {
    id: 'underdog-victory',
    label: 'The Underdog \u2192 Victory',
    labelFR: 'Outsider \u2192 Victoire',
    tagline: 'Everyone said impossible \u2192 Hero did it anyway \u2192 proof it\'s possible for you too',
    bestFor: 'Entrepreneuriat, innovation, impact social, lancements produit, milestones',
    exampleAngle: 'Pas de dipl\u00f4me. Pas de r\u00e9seau. Pas de bureau. Juste un ordi et une conviction : la solidarit\u00e9 locale peut devenir un mod\u00e8le \u00e9conomique.',
    sections: [
      { placeholder: 'Hook: le claim "impossible" ou le point de d\u00e9part sous-estim\u00e9', hint: 'Contraste entre l\'attente et la r\u00e9alit\u00e9' },
      { placeholder: 'Conflit: les obstacles, les sceptiques, les chiffres difficiles', hint: 'Liste concr\u00e8te. Sp\u00e9cifique > vague.' },
      { placeholder: 'R\u00e9solution: la perc\u00e9e + ce qui l\'a rendue possible', hint: 'Le moment pivot. Ce qui a tout chang\u00e9.' },
      { placeholder: 'CTA: "Tu es plus proche que tu ne le crois."', hint: 'Assertion inspirante ou invitation directe' },
    ],
  },
  {
    id: 'revelation',
    label: 'The Revelation',
    labelFR: 'La R\u00e9v\u00e9lation',
    tagline: 'A fact/story from history \u2192 reframed as insight for today',
    bestFor: 'Thought leadership, contenu viral, posts par analogie (caff\u00e8 sospeso, mutualisme, colibri)',
    exampleAngle: 'En 1831, les canuts de Lyon ont invent\u00e9 la mutuelle. Pas par charit\u00e9. Par survie collective. 220 ans plus tard, on a oubli\u00e9 cette le\u00e7on.',
    sections: [
      { placeholder: 'Hook: l\'histoire inattendue ou le fait historique', hint: 'Commencer par le fait surprenant, pas le contexte' },
      { placeholder: 'Conflit: la tension entre "alors" et "maintenant"', hint: 'Le parall\u00e8le qui cr\u00e9e le "aha moment"' },
      { placeholder: 'R\u00e9solution: le parall\u00e8le moderne, la v\u00e9rit\u00e9 actionnable', hint: 'Connecter \u00e0 ONLYMORE/COLHYBRI naturellement' },
      { placeholder: 'CTA: inviter au d\u00e9bat ou au partage', hint: 'Question qui ouvre la discussion' },
    ],
  },
  {
    id: 'infrastructure-play',
    label: 'The Infrastructure Play \u2605',
    labelFR: 'Infrastructure Play \u2605',
    tagline: 'Disruption kills old world \u2192 Names new scarce resource \u2192 Your product = inevitable infrastructure',
    bestFor: 'Positionnement produit, visibilit\u00e9 fundraising, thought leadership avec r\u00e9v\u00e9lation produit',
    exampleAngle: 'Les grandes surfaces ont aspir\u00e9 400 milliards du commerce local en 20 ans. Tout le monde peut commander en ligne maintenant.',
    sections: [
      { placeholder: 'Hook: le fait de disruption (chiffre choc, constat universel)', hint: 'Z\u00e9ro "je". Parler du monde, pas de soi.' },
      { placeholder: 'Death: "Ce qui veut dire que [ancien paradigme] vient de mourir."', hint: 'Pivot n\u00e9gatif. Une phrase qui d\u00e9truit l\'ancien monde.' },
      { placeholder: 'Nouvelle monnaie: "La seule ressource rare qui reste : [X]"', hint: 'Nommer la ressource rare avec pr\u00e9cision' },
      { placeholder: 'Anaphore: "[X] tournera sur [Y]. [Z] survivra par [Y]..." (3-5 r\u00e9p\u00e9titions)', hint: 'Monter en intensit\u00e9. Rythme hypnotique.' },
      { placeholder: '[ENTIT\u00c9] construit l\'infrastructure pour ce monde : [concept propri\u00e9taire]', hint: 'Le produit appara\u00eet comme cons\u00e9quence logique, pas comme pitch' },
      { placeholder: 'CTA: raret\u00e9 + exclusivit\u00e9 + flattery cibl\u00e9e', hint: 'Le lecteur doit se reconna\u00eetre dans le profil vis\u00e9' },
    ],
  },
]

// ── Hook Patterns ──

export const HOOK_PATTERNS: HookPattern[] = [
  { id: 'chiffre-choc', label: 'Chiffre choc', example: '400 milliards aspir\u00e9s du commerce local en 20 ans.' },
  { id: 'claim-provocante', label: 'Claim provocante', example: 'La proximit\u00e9 est morte. Personne ne l\'a remarqu\u00e9.' },
  { id: 'contraste-brutal', label: 'Contraste brutal', example: 'Il a perdu le proc\u00e8s. Et gagn\u00e9 l\'opinion publique.' },
  { id: 'tabou-confession', label: 'Tabou / confession', example: 'J\'ai mis 3 ans \u00e0 comprendre que travailler plus ne servait \u00e0 rien.' },
  { id: 'question-rhetorique', label: 'Question rh\u00e9torique', example: 'Combien de quartiers vont disparaitre avant qu\'on r\u00e9agisse ?' },
  { id: 'disruption-fact', label: 'Disruption fact', example: 'Les agents IA envoient 10 000 messages par jour. Tout le monde peut joindre tout le monde.' },
]

// ── Tactical Techniques ──

export const TACTICAL_TECHNIQUES: TacticalTechnique[] = [
  {
    id: 'anaphore',
    label: 'Anaphore',
    labelFR: 'L\'Anaphore',
    description: 'R\u00e9p\u00e9tition d\'une structure syntaxique pour cr\u00e9er un rythme hypnotique.',
    usage: 'Arch\u00e9type 4 (Infrastructure Play) et arch\u00e9type 2 (Underdog) pour lister les obstacles.',
    example: '[X] tournera sur [Y].\n[Z] survivra par [Y].\n[W] rena\u00eetra par [Y].\n[V] se construira sur [Y].',
  },
  {
    id: 'pivot-negatif',
    label: 'Pivot N\u00e9gatif',
    labelFR: 'Le Pivot N\u00e9gatif',
    description: 'Une phrase courte qui d\u00e9truit un paradigme entier.',
    usage: 'Arch\u00e9type 4 + arch\u00e9type 3 (Revelation). Toujours suivi de la "nouvelle monnaie".',
    example: '"Ce qui veut dire que [ancien monde] vient de mourir."\n"[Concept] est mort. Personne ne l\'a remarqu\u00e9."',
  },
  {
    id: 'concept-proprietaire',
    label: 'Concept Propri\u00e9taire',
    labelFR: 'Le Concept Propri\u00e9taire',
    description: 'Nommer sa solution avec un terme m\u00e9morisable que le lecteur ne peut pas googler ailleurs.',
    usage: 'Toujours en arch\u00e9type 4. Le concept doit \u00eatre un nom propre de votre solution.',
  },
  {
    id: 'zero-je',
    label: 'Zero-Je',
    labelFR: 'Le Z\u00e9ro-Je',
    description: 'Parler du monde, pas de soi. Le produit appara\u00eet en fin de post comme cons\u00e9quence in\u00e9vitable.',
    usage: 'Arch\u00e9type 4 principalement. Test : si on peut supprimer le nom du produit et que le post reste int\u00e9ressant, c\'est bon.',
  },
  {
    id: 'ton-affirmatif',
    label: 'Ton Affirmatif',
    labelFR: 'Le Ton Affirmatif',
    description: 'Aucun conditionnel ("pourrait", "devrait"). Aucune h\u00e9sitation ("peut-\u00eatre", "je pense que"). Le futur est d\u00e9j\u00e0 l\u00e0.',
    usage: 'Tous les arch\u00e9types, mais critique pour l\'arch\u00e9type 4.',
  },
  {
    id: 'flattery-ciblee',
    label: 'Flattery Cibl\u00e9e',
    labelFR: 'La Flattery Cibl\u00e9e',
    description: 'Le lecteur doit se reconna\u00eetre dans le profil vis\u00e9 par le CTA.',
    usage: 'CTA de l\'arch\u00e9type 4 et du networking.',
    example: '"Priorit\u00e9 aux fondateurs et aux superconnecteurs."\n"Commer\u00e7ants de quartier, c\'est pour vous."',
  },
]

// ── Proprietary Concepts ──

export const PROPRIETARY_CONCEPTS: ProprietaryConcept[] = [
  { entity: 'COLHYBRI', fr: 'Moteur de solidarit\u00e9 locale', en: 'Neighbourhood Grid' },
  { entity: 'CROWNIUM', fr: 'Financement mutualiste', en: 'Community Ownership Engine' },
  { entity: 'DOJUKU SHINGI', fr: 'Transmission interg\u00e9n\u00e9rationnelle IA', en: 'Digital Sensei Network' },
  { entity: 'ONLYMORE FINANCE', fr: 'Cr\u00e9dit solidaire index\u00e9', en: 'Solidarity Credit Engine' },
]

// ── CTA Types ──

export const CTA_TYPES: CTAType[] = [
  { type: 'Question ouverte', when: 'Engagement, d\u00e9bat', example: 'Et toi, c\'est quoi ton geste ?' },
  { type: 'Partage d\'exp\u00e9rience', when: 'Viralit\u00e9', example: 'Si \u00e7a te parle, partage avec quelqu\'un qui a besoin de l\'entendre.' },
  { type: 'Scarcity', when: 'Lancement produit', example: '50 places. Commer\u00e7ants de quartier en priorit\u00e9.' },
  { type: 'Assertion finale', when: 'Thought leadership', example: 'Chaque geste compte. Le v\u00f4tre aussi.' },
  { type: 'Invitation directe', when: 'Networking', example: 'DM ouvert pour en parler.' },
]

// ── Infrastructure Play Examples per Entity ──

export const INFRA_PLAY_EXAMPLES: Record<string, string> = {
  COLHYBRI: `Les grandes surfaces ont aspir\u00e9 400 milliards du commerce local en 20 ans.
Tout le monde peut commander en ligne maintenant.

Ce qui veut dire que la proximit\u00e9 vient de mourir.
La seule ressource rare qui reste : la solidarit\u00e9 de quartier.

Dans le monde d'apr\u00e8s, la fid\u00e9lit\u00e9 tournera sur la solidarit\u00e9.
Les commerces survivront par la solidarit\u00e9.
Les quartiers se reconstruiront par la solidarit\u00e9.
L'\u00e9conomie locale rena\u00eetra par la solidarit\u00e9.

COLHYBRI construit l'infrastructure pour ce monde :
le moteur de solidarit\u00e9 locale.

Chaque geste compte. Le v\u00f4tre aussi.`,

  CROWNIUM: `Les fonds d'investissement ont rachet\u00e9 47% des clubs pros europ\u00e9ens.
N'importe qui avec un ch\u00e9quier peut poss\u00e9der un club maintenant.

Ce qui veut dire que l'identit\u00e9 des clubs vient de mourir.
La seule ressource rare qui reste : l'appartenance.

La fid\u00e9lit\u00e9 tournera sur l'appartenance.
Les clubs survivront par l'appartenance.
Le sport se reconstruira par l'appartenance.

CROWNIUM construit l'infrastructure pour ce monde :
le financement mutualiste des clubs sportifs.`,

  'DOJUKU SHINGI': `YouTube a mis 10 millions de vid\u00e9os de self-d\u00e9fense en ligne.
N'importe qui peut regarder un tuto maintenant.

Ce qui veut dire que le savoir technique vient de mourir.
La seule ressource rare qui reste : la transmission.

L'apprentissage tournera sur la transmission.
Le respect se construira sur la transmission.
La discipline rena\u00eetra par la transmission.

DOJUKU SHINGI construit l'infrastructure pour ce monde :
la transmission interg\u00e9n\u00e9rationnelle par l'IA.`,
}

// ── Comment Strategy ──

export const COMMENT_STRUCTURE = [
  'Ligne 1 : Valider le point central du post (pas "super post !")',
  'Ligne 2-3 : Ajouter une perspective unique / un exemple personnel',
  'Ligne 4 : Question ou ouverture vers l\'auteur',
]

export const COMMENT_DONTS = [
  '"Super post !" / "100% d\'accord" (z\u00e9ro valeur ajout\u00e9e)',
  'Commentaire plus long que le post original',
  'Pitch direct sans valider le propos de l\'auteur',
  'Emojis excessifs',
  'Em dashes (\u2014)',
]

// ── Carousel Framework ──

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  { number: 1, purpose: 'Hook visuel + titre choc', maxWords: 25 },
  { number: 2, purpose: 'Le probl\u00e8me (chiffres, donn\u00e9es)', maxWords: 25 },
  { number: 3, purpose: 'Pourquoi c\'est pire que tu crois', maxWords: 25 },
  { number: 4, purpose: 'Le pivot / la r\u00e9v\u00e9lation', maxWords: 25 },
  { number: 5, purpose: 'Point cl\u00e9 #1', maxWords: 25 },
  { number: 6, purpose: 'Point cl\u00e9 #2', maxWords: 25 },
  { number: 7, purpose: 'Point cl\u00e9 #3', maxWords: 25 },
  { number: 8, purpose: 'Point cl\u00e9 #4 (optionnel)', maxWords: 25 },
  { number: 9, purpose: 'Le r\u00e9sum\u00e9 / la punchline', maxWords: 25 },
  { number: 10, purpose: 'CTA + logo + slogan', maxWords: 25 },
]

// ── Algorithm Signals ──

export const ALGORITHM_SIGNALS: AlgorithmSignal[] = [
  { signal: 'Dwell time', weight: 'HIGH', tip: 'Narratives captivantes qui gardent le lecteur sur le post' },
  { signal: 'Meaningful comments', weight: 'HIGH', tip: 'Finir par des vraies questions, r\u00e9pondre \u00e0 chaque commentaire' },
  { signal: 'Semantic relevance', weight: 'HIGH', tip: 'Rester dans sa niche (fintech, solidarit\u00e9, sports)' },
  { signal: 'Authenticity', weight: 'HIGH', tip: 'Voix personnelle, histoires sp\u00e9cifiques, pas de filler AI' },
  { signal: 'Hashtag quality', weight: 'MEDIUM', tip: '3-5 tags strat\u00e9giques en fin de post' },
  { signal: 'Post frequency', weight: 'MEDIUM', tip: 'Constance > burst posting. 3 posts/semaine min.' },
  { signal: 'External links', weight: 'NEGATIVE', tip: 'Liens en commentaire, pas dans le body' },
  { signal: 'Engagement bait', weight: 'NEGATIVE', tip: 'Jamais de "Comment YES" / "Like si..."' },
  { signal: 'Excessive hashtags', weight: 'NEGATIVE', tip: '5+ hashtags = flag spam' },
]

// ── Quality Checks v2.0 ──

export const QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'archetype',
    label: 'Arch\u00e9type identifi\u00e9 et annonc\u00e9',
  },
  {
    id: 'hook-2-lines',
    label: 'Hook tient en 2 lignes max',
  },
  {
    id: 'no-em-dash',
    label: 'Aucun em dash (\u2014) nulle part',
    validate: (text: string) => !text.includes('\u2014'),
  },
  {
    id: 'no-je-first',
    label: 'Aucun "je" en premi\u00e8re phrase',
    validate: (text: string) => {
      const first = text.trim().split(/[.!?\n]/)[0]?.toLowerCase() ?? ''
      return !first.startsWith('je ') && !first.startsWith('j\'')
    },
  },
  {
    id: 'short-paragraphs',
    label: 'Paragraphes de 3 lignes max',
  },
  {
    id: 'chiffres-over-adjectifs',
    label: 'Chiffres > adjectifs',
  },
  {
    id: 'cta-clear',
    label: 'CTA clair et cibl\u00e9',
  },
  {
    id: 'ton-affirmatif',
    label: 'Ton affirmatif (0 conditionnel)',
    validate: (text: string) => {
      const conditionals = ['pourrait', 'devrait', 'peut-\u00eatre', 'je pense que', 'on esp\u00e8re']
      const lower = text.toLowerCase()
      return !conditionals.some((c) => lower.includes(c))
    },
  },
  {
    id: 'hashtags-end',
    label: 'Hashtags en fin de post (3-5 max)',
    validate: (text: string) => {
      const tags = text.match(/#\w+/g)
      return !tags || (tags.length >= 1 && tags.length <= 5)
    },
  },
  {
    id: 'signal-noise',
    label: 'Ratio signal/bruit : chaque phrase fait avancer l\'argument',
  },
  {
    id: 'concept-proprietaire',
    label: 'Concept propri\u00e9taire nomm\u00e9 (si arch\u00e9type 4)',
  },
  {
    id: 'zero-je-test',
    label: 'Le post reste int\u00e9ressant sans le nom du produit (test Z\u00e9ro-Je)',
  },
  {
    id: 'no-external-links',
    label: 'Pas de lien externe dans le body',
    validate: (text: string) => !text.match(/https?:\/\/[^\s]+/),
  },
  {
    id: 'langue-correcte',
    label: 'Langue correcte (FR par d\u00e9faut)',
  },
]

// ── Slogans ──

export const SLOGANS: Record<string, { fr: string; en: string }> = {
  COLHYBRI: {
    fr: 'Chaque geste compte. Le v\u00f4tre aussi.',
    en: 'Own Your Neighborhood. Own Your Future.',
  },
  'ONLYMORE Group': {
    fr: 'Deviens la personne dont tu veux que le monde soit',
    en: 'Become the person you want the world to be',
  },
  Hummingbird: {
    fr: 'Je fais ma part.',
    en: "I'm doing my part.",
  },
}

// ── Semantic Clusters ──

export const SEMANTIC_CLUSTERS = {
  '\u00c9conomie solidaire': ['mutualisme', 'ESS', 'caff\u00e8 sospeso', 'solidarit\u00e9', 'inclusion financi\u00e8re'],
  Fintech: ['SaaS', 'subscription', 'digital payment', 'local commerce'],
  Sports: ['club financing', 'mutualist model', 'fan ownership'],
  'Arts martiaux': ['intergenerational', 'AR', 'community fitness'],
  'R\u00e9cit fondateur': ['autodidact', 'self-taught', 'construction worker to CEO'],
}

// ── Editorial Mix ──

export const EDITORIAL_MIX = {
  personal: { archetypes: '1-2', label: 'Personnel (Blessure + Underdog)', pct: 40 },
  thought: { archetypes: '3', label: 'Thought leadership (R\u00e9v\u00e9lation)', pct: 30 },
  product: { archetypes: '4', label: 'Product positioning (Infrastructure Play)', pct: 30 },
}
