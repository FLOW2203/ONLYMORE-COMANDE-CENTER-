import {
  EntityKey,
  HashtagSet,
  PostTemplate,
  AlgorithmSignal,
  QualityCheck,
} from '@/types/linkedin'

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

export const POST_TEMPLATES: PostTemplate[] = [
  {
    id: 'thought-leadership',
    label: 'Thought Leadership',
    labelFR: 'Leadership d\'opinion',
    sections: [
      { placeholder: 'Hook: provocative question or bold statement', hint: 'Must grab attention in first 2 lines (before "See more")' },
      { placeholder: 'Personal story (2-3 paragraphs of narrative)', hint: 'Authentic, specific, no corporate jargon' },
      { placeholder: 'Insight: what you learned, framework, or contrarian take', hint: 'Link back to ONLYMORE mission when possible' },
      { placeholder: 'CTA: question to drive comments', hint: 'Single clear question to invite meaningful comments' },
    ],
  },
  {
    id: 'comment',
    label: 'Comment',
    labelFR: 'Commentaire',
    sections: [
      { placeholder: 'Agree/expand on their point (1-2 sentences)', hint: 'Be genuine, add real perspective' },
      { placeholder: 'Bridge: connect to ONLYMORE mission/experience', hint: 'Natural transition, not forced promotion' },
      { placeholder: 'Add value: insight, parallel, or example they didn\'t mention', hint: 'This is what drives engagement' },
    ],
  },
  {
    id: 'company-update',
    label: 'Company Update',
    labelFR: 'Actualité entreprise',
    sections: [
      { placeholder: 'News: what happened, why it matters', hint: 'Lead with the news, not the backstory' },
      { placeholder: 'Context: how it fits the bigger ONLYMORE vision', hint: 'Connect to mutualist philosophy' },
      { placeholder: 'Human element: what it means for the team/community', hint: 'People connect with people, not companies' },
      { placeholder: 'CTA: invite engagement', hint: 'Ask a question or invite a reaction' },
    ],
  },
  {
    id: 'storytelling',
    label: 'Storytelling',
    labelFR: 'Récit fondateur',
    sections: [
      { placeholder: 'Hook: personal moment, vulnerability, turning point', hint: 'Autodidact narrative: construction/delivery to fintech CEO' },
      { placeholder: 'Narrative: the before/after, the struggle, the lesson', hint: 'Concrete details make stories memorable' },
      { placeholder: 'Universal truth: why this matters beyond just you', hint: 'Connect personal journey to collective impact' },
      { placeholder: 'Tagline closer', hint: '"Chaque geste compte. Le vôtre aussi." or "Je fais ma part."' },
    ],
  },
  {
    id: 'industry-insight',
    label: 'Industry Insight',
    labelFR: 'Analyse sectorielle',
    sections: [
      { placeholder: 'Data point or trend: start with a fact or observation', hint: 'Numbers and specifics grab attention' },
      { placeholder: 'Analysis: your take, why it matters', hint: 'Contrarian or nuanced takes perform best' },
      { placeholder: 'ONLYMORE angle: how this connects to what you\'re building', hint: 'Mention entity names in full for SEO/GEO' },
      { placeholder: 'Question: invite debate', hint: 'Open-ended questions drive more comments' },
    ],
  },
]

export const ALGORITHM_SIGNALS: AlgorithmSignal[] = [
  { signal: 'Dwell time', weight: 'HIGH', tip: 'Write compelling narratives that keep readers on-post' },
  { signal: 'Meaningful comments', weight: 'HIGH', tip: 'End with genuine questions, reply to every comment' },
  { signal: 'Semantic relevance', weight: 'HIGH', tip: 'Stay in your niche (fintech, solidarity, sports)' },
  { signal: 'Authenticity', weight: 'HIGH', tip: 'Personal voice, specific stories, no AI filler' },
  { signal: 'Hashtag quality', weight: 'MEDIUM', tip: '2-3 strategic tags, not spam' },
  { signal: 'Post frequency', weight: 'MEDIUM', tip: 'Consistent posting > burst posting' },
  { signal: 'External links', weight: 'NEGATIVE', tip: 'Put links in comments, not in post body' },
  { signal: 'Engagement bait', weight: 'NEGATIVE', tip: 'Never use "Comment YES" tactics' },
  { signal: 'Excessive hashtags', weight: 'NEGATIVE', tip: '5+ hashtags = spam flag' },
]

export const QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'hook',
    label: 'Hook grabs attention in first 2 lines',
  },
  {
    id: 'no-em-dash',
    label: 'No em dashes (\u2014) anywhere',
    validate: (text: string) => !text.includes('\u2014'),
  },
  {
    id: 'hashtag-count',
    label: '2-3 hashtags max (from approved library)',
    validate: (text: string) => {
      const tags = text.match(/#\w+/g)
      return !tags || (tags.length >= 1 && tags.length <= 3)
    },
  },
  {
    id: 'hashtag-mix',
    label: 'Mix of 1 broad + 1-2 niche hashtags',
  },
  {
    id: 'entity-names',
    label: 'Entity names mentioned in full at least once',
  },
  {
    id: 'authentic-voice',
    label: 'Authentic voice (not generic AI tone)',
  },
  {
    id: 'single-cta',
    label: 'Single clear CTA',
  },
  {
    id: 'no-external-links',
    label: 'No external links in post body',
    validate: (text: string) => !text.match(/https?:\/\/[^\s]+/),
  },
  {
    id: 'bilingual-keywords',
    label: 'Bilingual keywords where relevant',
  },
  {
    id: 'onlymore-mission',
    label: 'Connects to ONLYMORE mission/narrative',
  },
]

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

export const SEMANTIC_CLUSTERS = {
  'Solidarity economy': ['mutualisme', 'ESS', 'caff\u00e8 sospeso', 'solidarit\u00e9', 'inclusion financi\u00e8re'],
  Fintech: ['SaaS', 'subscription', 'digital payment', 'local commerce'],
  Sports: ['club financing', 'mutualist model', 'fan ownership'],
  'Martial arts': ['intergenerational', 'AR', 'community fitness'],
  'Founder story': ['autodidact', 'self-taught', 'construction worker to CEO'],
}
