export type LinkedInPostType =
  | 'thought-leadership'
  | 'comment'
  | 'company-update'
  | 'storytelling'
  | 'industry-insight'

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

export interface PostTemplate {
  id: LinkedInPostType
  label: string
  labelFR: string
  sections: { placeholder: string; hint: string }[]
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
