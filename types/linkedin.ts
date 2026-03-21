export type StoryArchetype =
  | 'wound-lesson'
  | 'underdog-victory'
  | 'revelation'
  | 'infrastructure-play'

export type LinkedInPostType =
  | StoryArchetype
  | 'comment'
  | 'carousel'

export type EntityKey =
  | 'COLHYBRI'
  | 'DOJUKU SHINGI'
  | 'CROWNIUM'
  | 'ONLYMORE FINANCE'
  | 'ONLYMORE Group'
  | 'Founder'

export interface HashtagSet {
  broad: string[]
  niche: string[]
  geo: string[]
}

export interface ArchetypeTemplate {
  id: StoryArchetype
  label: string
  labelFR: string
  tagline: string
  bestFor: string
  exampleAngle: string
  sections: { placeholder: string; hint: string }[]
}

export interface HookPattern {
  id: string
  label: string
  example: string
}

export interface TacticalTechnique {
  id: string
  label: string
  labelFR: string
  description: string
  usage: string
  example?: string
}

export interface ProprietaryConcept {
  entity: string
  fr: string
  en: string
}

export interface CTAType {
  type: string
  when: string
  example: string
}

export interface AlgorithmSignal {
  signal: string
  weight: 'HIGH' | 'MEDIUM' | 'NEGATIVE'
  tip: string
}

export interface QualityCheck {
  id: string
  label: string
  validate?: (text: string) => boolean
}

export interface CarouselSlide {
  number: number
  purpose: string
  maxWords: number
}
