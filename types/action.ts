export type Filiale = 'COLHYBRI' | 'COLHYBRI.vision' | 'CROWNIUM' | 'DOJUKU SHINGI' | 'GROUPE'

export type Categorie =
  | 'Technique'
  | 'Produit'
  | 'Sécurité'
  | 'Partenariat'
  | 'Investor'
  | 'Accélérateur'
  | 'Contenu'
  | 'SEO'
  | 'Stratégie'
  | 'Marketing'
  | 'RH'
  | 'BizDev'
  | 'Recherche'
  | 'Lancement'

export type StatutAction = '✅' | '🔄' | '📅'

export interface Action {
  id: number
  date: string
  filiale: Filiale
  categorie: Categorie
  titre: string
  statut: StatutAction
  lien: string
}
