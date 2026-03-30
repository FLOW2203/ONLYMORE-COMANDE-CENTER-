export type Statut = 'Idée' | 'En rédaction' | 'Visuel en cours' | 'Prêt à publier' | 'Publié' | 'Archivé'

export type Marque = 'ONLYMORE Group' | 'COLHYBRI' | 'CROWNIUM' | 'DOJUKU SHINGI' | 'ONLYMORE FINANCE'

export type Plateforme = 'Facebook' | 'Instagram' | 'TikTok' | 'LinkedIn' | 'X/Twitter' | 'YouTube' | 'Threads' | 'Discord'

export type TypeContenu = 'Post image' | 'Reel/Short' | 'Story' | 'Carousel' | 'Thread' | 'Article' | 'Live'

export type Pilier = 'Solidarité' | 'Produit/Tuto' | 'Behind the scenes' | 'Impact social' | 'Motivation' | 'Partenariat'

export type Agent = 'Content Strategist' | 'Copywriter' | 'Visual Creator' | 'Video Producer' | 'Community Manager' | 'Growth Hacker'

export interface Post {
  id: string
  titre: string
  datePublication: string | null
  statut: Statut
  marque: Marque | string
  plateformes: Plateforme[]
  typeContenu: TypeContenu | string
  pilier: Pilier | string
  agent: Agent | string
  captionFR: string
  captionEN: string
  hashtags: string
  lienCanva: string | null
  publie: boolean
  engagement: number
}
