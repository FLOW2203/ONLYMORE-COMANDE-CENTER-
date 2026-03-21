export type LogoType =
  | 'wordmark'
  | 'lettermark'
  | 'pictorial'
  | 'abstract'
  | 'mascot'
  | 'emblem'
  | 'combination'

export type ColorHarmony =
  | 'monochromatic'
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'

export interface LogoTypeInfo {
  id: LogoType
  label: string
  description: string
  bestFor: string
  examples: string
}

export interface ColorInfo {
  name: string
  hex: string
  emotions: string
  industries: string
  warning: string
}

export interface DesignPrinciple {
  id: string
  title: string
  description: string
}

export interface LogoVariation {
  name: string
  useCase: string
  specs: string
}

export interface BrandBriefData {
  brandName: string
  tagline: string
  whatItDoes: string
  values: string
  audience: string
  positioning: string
  competitors: string
  usage: string
  colorPrefs: string
  symbolPrefs: string
  constraints: string
}

export interface LogoQualityCheck {
  id: string
  category: 'design' | 'brand' | 'technical' | 'deliverables'
  label: string
}
