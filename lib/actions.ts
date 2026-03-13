import { Action } from '@/types/action'

export const ACTIONS: Action[] = [
  // ═══ COLHYBRI APP (colhybri.com) ═══
  { id: 1, date: "2026-02-11", filiale: "COLHYBRI", categorie: "Technique", titre: "Sécurité Supabase — RLS + exposition données publiques", statut: "✅", lien: "https://claude.ai/chat/ccf7c9bb-5ced-46d6-a71a-3e264bd63062" },
  { id: 2, date: "2026-02-11", filiale: "COLHYBRI", categorie: "Technique", titre: "Flow d'abonnement Stripe €3/mois — page S'abonner 404 fixée", statut: "✅", lien: "https://claude.ai/chat/ccf7c9bb-5ced-46d6-a71a-3e264bd63062" },
  { id: 3, date: "2026-02-11", filiale: "COLHYBRI", categorie: "Technique", titre: "Page édition profil + upload avatar", statut: "✅", lien: "https://claude.ai/chat/ccf7c9bb-5ced-46d6-a71a-3e264bd63062" },
  { id: 4, date: "2026-02-18", filiale: "COLHYBRI", categorie: "Technique", titre: "Password reset — email envoyé mais lien invalide (fix Supabase URL)", statut: "✅", lien: "https://claude.ai/chat/a9f517d1-44cb-4ad3-866a-e18266f8d762" },
  { id: 5, date: "2026-02-28", filiale: "COLHYBRI", categorie: "Technique", titre: "Google OAuth — fix 'missing OAuth secret' + sync Supabase DB", statut: "✅", lien: "https://claude.ai/chat/c5767cb3-dcb0-4aa3-8824-85c76163145d" },
  { id: 6, date: "2026-02-28", filiale: "COLHYBRI", categorie: "Technique", titre: "Google Maps GPS caching — stratégie zéro coût (Haversine + cache DB)", statut: "✅", lien: "https://claude.ai/chat/c5767cb3-dcb0-4aa3-8824-85c76163145d" },
  { id: 7, date: "2026-02-28", filiale: "COLHYBRI", categorie: "Produit", titre: "Sentinel 'Colibri en Vol' — microservice event-driven (prompt Claude Code généré)", statut: "🔄", lien: "https://claude.ai/chat/e97948bf-15d9-4448-9115-369b35d8a624" },
  { id: 8, date: "2026-03-06", filiale: "COLHYBRI", categorie: "Sécurité", titre: "Audit sécurité complet — XML prompt 7 phases OWASP + RGPD", statut: "🔄", lien: "https://claude.ai/chat/d83765f8-393d-4d9c-997a-c74eb2c59553" },
  { id: 9, date: "2026-03-06", filiale: "COLHYBRI", categorie: "Technique", titre: "Git revert commit problématique (vidéo Gemini)", statut: "🔄", lien: "https://claude.ai/chat/19d2670f-2909-4066-ade7-8cce501df2ba" },
  { id: 10, date: "2026-02-05", filiale: "COLHYBRI", categorie: "Partenariat", titre: "Email Delubac/DeluPay — proposition flux financiers", statut: "✅", lien: "https://claude.ai/chat/2b216e73-48a7-41ae-b65e-2250cf2f5e2e" },
  { id: 11, date: "2026-02-26", filiale: "COLHYBRI", categorie: "Partenariat", titre: "Stancer/Iliad — carrier billing €3/mois (email George Owen envoyé)", statut: "🔄", lien: "https://claude.ai/chat/8fa7c241-9f4b-4f46-94b2-5397cbf2a9d3" },
  { id: 12, date: "2026-03-01", filiale: "COLHYBRI", categorie: "Partenariat", titre: "TOPLisha + Qubi — messages LinkedIn outreach rédigés", statut: "📅", lien: "https://claude.ai/chat/0d03d98a-ea64-419a-a665-6e5f25540c8f" },
  { id: 13, date: "2026-02-12", filiale: "COLHYBRI", categorie: "Investor", titre: "Pitch deck US (Scale2Miami) — PDF hummingbird 14 slides", statut: "✅", lien: "https://claude.ai/chat/3dbebb52-b329-4c2d-90b4-5587156bbbc9" },
  { id: 14, date: "2026-02-18", filiale: "COLHYBRI", categorie: "Investor", titre: "Dossier financier investisseur — projections 3 ans, TAM France 19.3M", statut: "✅", lien: "https://claude.ai/chat/0fcdfc2a-a6ef-4ec5-8c86-c71bd6ac6d1a" },
  { id: 15, date: "2026-02-24", filiale: "COLHYBRI", categorie: "Accélérateur", titre: "Scale2Miami — questionnaire candidature rédigé", statut: "🔄", lien: "https://claude.ai/chat/bd715b5d-cd89-43eb-a7bc-3dc8ac5f894d" },
  { id: 16, date: "2026-02-17", filiale: "COLHYBRI", categorie: "Accélérateur", titre: "French Tech Capital Days 2026 — réponses candidature", statut: "🔄", lien: "https://claude.ai/chat/2a261567-888f-4b68-a86e-7487c589f32d" },
  // ═══ COLHYBRI.VISION (site vitrine) ═══
  { id: 17, date: "2026-02-18", filiale: "COLHYBRI.vision", categorie: "Technique", titre: "Site Next.js 14 multilingue — 7 locales, 74 pages statiques déployées", statut: "✅", lien: "https://claude.ai/chat/03a54a03-0d94-49dd-85ee-ca5984e291de" },
  { id: 18, date: "2026-02-19", filiale: "COLHYBRI.vision", categorie: "Technique", titre: "DNS Hostinger + Vercel config → colhybri.vision live", statut: "✅", lien: "https://claude.ai/chat/9e1e2846-38c1-4e23-88ef-cdba5d65884a" },
  { id: 19, date: "2026-02-19", filiale: "COLHYBRI.vision", categorie: "Technique", titre: "Fix JSON zh.json — erreur parsing webpack multilingue", statut: "✅", lien: "https://claude.ai/chat/9e1e2846-38c1-4e23-88ef-cdba5d65884a" },
  { id: 20, date: "2026-02-19", filiale: "COLHYBRI.vision", categorie: "Produit", titre: "CTA 'Rejoindre le mouvement' → redirect colhybri.com", statut: "✅", lien: "https://claude.ai/chat/fa9cceff-f4b3-40de-9101-119b411608e6" },
  { id: 21, date: "2026-03-02", filiale: "COLHYBRI.vision", categorie: "Technique", titre: "Suppression métriques gonflées (€12.48M ARR, 520K clients) → pre-seed", statut: "✅", lien: "https://claude.ai/chat/d8e883cf-7ad4-43c8-ab52-ead6d47285f0" },
  { id: 22, date: "2026-03-02", filiale: "COLHYBRI.vision", categorie: "Technique", titre: "Restauration déploiement après suppression accidentelle repo", statut: "✅", lien: "https://claude.ai/chat/61a59ecb-1963-41f3-96c3-07f2698ea314" },
  { id: 23, date: "2026-02-20", filiale: "COLHYBRI.vision", categorie: "Contenu", titre: "Legends culturelles / immersion locale par pays (colibri, robin, perroquet…)", statut: "🔄", lien: "https://claude.ai/chat/b911791f-dcba-4381-a11d-c8ae9b0f3878" },
  { id: 24, date: "2026-03-03", filiale: "COLHYBRI.vision", categorie: "Contenu", titre: "Page /pour-les-villes : bénéfices + sources 'cœurs de ville'", statut: "🔄", lien: "https://claude.ai/chat/a239864e-fd25-4e5c-a461-6401ff477d48" },
  { id: 25, date: "2026-03-03", filiale: "COLHYBRI.vision", categorie: "Contenu", titre: "Page /pour-les-commerces : ESG, CA, acteurs de santé économique", statut: "🔄", lien: "https://claude.ai/chat/a239864e-fd25-4e5c-a461-6401ff477d48" },
  { id: 26, date: "2026-03-03", filiale: "COLHYBRI.vision", categorie: "Technique", titre: "Team agent IA nettoyeur — centrage + pages manquantes (EN/FR/ES/GB)", statut: "🔄", lien: "https://claude.ai/chat/a239864e-fd25-4e5c-a461-6401ff477d48" },
  { id: 27, date: "2026-02-20", filiale: "COLHYBRI.vision", categorie: "SEO", titre: "Stats confiance/solitude globales — 6 régions, SEO sémantique GEO", statut: "📅", lien: "https://claude.ai/chat/3b481bbb-2056-4529-a5aa-ec58e5da3de3" },
  { id: 28, date: "2026-02-25", filiale: "COLHYBRI.vision", categorie: "SEO", titre: "Team agent SEO/GEO — routage dynamique + schema.org + sitemap", statut: "📅", lien: "https://claude.ai/chat/738a022e-a929-4ffa-95b3-2a06233a1ec8" },
  // ═══ CROWNIUM ═══
  { id: 29, date: "2026-02-03", filiale: "CROWNIUM", categorie: "Accélérateur", titre: "FIFA Innovation Programme — dossier Golden Circle soumis", statut: "✅", lien: "https://claude.ai/chat/9920c422-eebf-49dd-9b24-370c190cd783" },
  { id: 30, date: "2026-02-06", filiale: "CROWNIUM", categorie: "Accélérateur", titre: "Fujitsu Accelerator for Sports — soumission J0 (deadline atteinte)", statut: "✅", lien: "https://claude.ai/chat/416c0d62-aa5c-4ee9-8d07-52a9955ffd67" },
  { id: 31, date: "2026-02-06", filiale: "CROWNIUM", categorie: "Accélérateur", titre: "Fujitsu PPTX 11 slides — FR + EN + JP (temple japonais)", statut: "✅", lien: "https://claude.ai/chat/8e8de942-8247-4661-b1c5-118e3e290ef9" },
  { id: 32, date: "2026-02-11", filiale: "CROWNIUM", categorie: "Accélérateur", titre: "Gener8tor Wisconsin / Green Bay Packers — Word + stratégie", statut: "✅", lien: "https://claude.ai/chat/c32ef311-46c7-48d7-b8de-08ad368c1d60" },
  { id: 33, date: "2026-02-12", filiale: "CROWNIUM", categorie: "Contenu", titre: "France & création grandes compétitions sportives mondiales (Jules Rimet…)", statut: "✅", lien: "https://claude.ai/chat/64b2e981-6148-4a4f-959a-d47f9e96f76f" },
  { id: 34, date: "2026-02-09", filiale: "CROWNIUM", categorie: "Partenariat", titre: "OM/McCourt — contact Shéhérazade Semsar + Constance Bommelaer identifiés", statut: "📅", lien: "https://claude.ai/chat/02b437f6-4485-4d78-aaf5-ba5440e5f380" },
  { id: 35, date: "2026-03-01", filiale: "CROWNIUM", categorie: "Partenariat", titre: "FCA commerce coopératif — comment LinkedIn rédigé (Olivier Urrutia)", statut: "✅", lien: "https://claude.ai/chat/476faa8f-bb77-48e1-86d5-010e77de2425" },
  { id: 36, date: "2026-02-04", filiale: "CROWNIUM", categorie: "Recherche", titre: "Top clubs omnisports FR (Créteil, ASPTT…) — prospection partenaires", statut: "✅", lien: "https://claude.ai/chat/2cd5d673-d947-499f-b244-3ce24aa5dd0f" },
  // ═══ DOJUKU SHINGI ═══
  { id: 37, date: "2026-02-09", filiale: "DOJUKU SHINGI", categorie: "Technique", titre: "Claude Code + WSL2 setup + VS Code (DOJUKU-SHINGI repo)", statut: "✅", lien: "https://claude.ai/chat/f62d1e99-6b69-449f-a194-ec4f0c895920" },
  { id: 38, date: "2026-02-19", filiale: "DOJUKU SHINGI", categorie: "Technique", titre: "Site vitrine multilingue — PR mergé (12 pages, 7 langues, Netlify)", statut: "✅", lien: "https://claude.ai/chat/b19c39d3-1c1d-4014-9248-6bf513866813" },
  { id: 39, date: "2026-02-19", filiale: "DOJUKU SHINGI", categorie: "Technique", titre: "Fix 404 Netlify — netlify.toml + @netlify/plugin-nextjs", statut: "✅", lien: "https://claude.ai/chat/b19c39d3-1c1d-4014-9248-6bf513866813" },
  { id: 40, date: "2026-04-11", filiale: "DOJUKU SHINGI", categorie: "Lancement", titre: "US Launch — Rust Belt cities (Detroit, Cleveland, Pittsburgh…)", statut: "📅", lien: "" },
  // ═══ ONLYMORE GROUP (holding) ═══
  { id: 41, date: "2026-02-11", filiale: "GROUPE", categorie: "Stratégie", titre: "Schema synapses + API flows — visualisation React interactive", statut: "✅", lien: "https://claude.ai/chat/5ef790e6-6fb3-4e3e-9bd2-2b0756b98680" },
  { id: 42, date: "2026-03-06", filiale: "GROUPE", categorie: "Investor", titre: "Apports en nature €262K médiane — rapport Word (droit commercial FR)", statut: "✅", lien: "https://claude.ai/chat/43648016-bfc8-487b-8391-02dec4777476" },
  { id: 43, date: "2026-03-06", filiale: "GROUPE", categorie: "Investor", titre: "Pitch deck FR + EN (PPTX + PDF) — valorisation €1.3M–€2.15M", statut: "✅", lien: "https://claude.ai/chat/43648016-bfc8-487b-8391-02dec4777476" },
  { id: 44, date: "2026-02-16", filiale: "GROUPE", categorie: "Marketing", titre: "Kit marketing 7 principes CopyChief — toutes filiales", statut: "✅", lien: "https://claude.ai/chat/13be76a0-36cc-4618-a09d-bc4a55c65ded" },
  { id: 45, date: "2026-02-27", filiale: "GROUPE", categorie: "Investor", titre: "Stratégie VCs espagnols — 11 fonds ciblés, emails + LinkedIn personnalisés", statut: "✅", lien: "https://claude.ai/chat/af144b95-66d0-48e1-a553-7dd50f22357c" },
  { id: 46, date: "2026-03-01", filiale: "GROUPE", categorie: "RH", titre: "CV FR + EN + guide entretien (Beacon Hire) — métriques requalifiées projections", statut: "✅", lien: "https://claude.ai/chat/ba1ad0e5-d140-4ebf-9ab4-55eab37e3bcc" },
  { id: 47, date: "2026-02-11", filiale: "GROUPE", categorie: "Partenariat", titre: "Beast Industries/MrBeast — analyse post-acquisition Step, stratégie outreach", statut: "📅", lien: "https://claude.ai/chat/396a6e78-c8c5-47a6-8521-533f3c3feaae" },
  { id: 48, date: "2026-02-09", filiale: "GROUPE", categorie: "Partenariat", titre: "Proposition partenariat Anthropic (COLHYBRI add-on Claude Pro)", statut: "📅", lien: "https://claude.ai/chat/73c93cf9-f1c2-44a1-82b5-e1fbc4ca39e2" },
  { id: 49, date: "2026-02-16", filiale: "GROUPE", categorie: "Stratégie", titre: "España Vaciada — stratégie déploiement COLHYBRI + dossier région", statut: "📅", lien: "https://claude.ai/chat/d4992ac4-8b78-4787-aaab-b009eb4f130d" },
  { id: 50, date: "2026-03-06", filiale: "GROUPE", categorie: "Investor", titre: "Pierre Entremont — tweets outreach rédigés (lancement FR + TAM)", statut: "📅", lien: "https://claude.ai/chat/bc4a780d-b6b6-4cb4-b652-48843da0c93a" },
  { id: 51, date: "2026-02-28", filiale: "GROUPE", categorie: "Stratégie", titre: "Plan stratégique Notion — 6 piliers, 14 agents IA, organigramme", statut: "✅", lien: "https://claude.ai/chat/9aa555c0-ccb6-4c5e-b639-6722040de9a6" },
  { id: 52, date: "2026-03-01", filiale: "GROUPE", categorie: "BizDev", titre: "Base prospection commerçants FR — FNCV, FFAC, Action Cœur de Ville + Excel", statut: "✅", lien: "https://claude.ai/chat/d4e8a94c-0143-4d99-997e-da7c01bf1926" },
  { id: 53, date: "2026-03-05", filiale: "GROUPE", categorie: "Technique", titre: "Google Cloud Console via MCP/n8n — connexion en cours", statut: "🔄", lien: "https://claude.ai/chat/914fb2fa-fe35-4f75-8dab-41184988aa0f" },
]

export const FILIALES: string[] = ['COLHYBRI', 'COLHYBRI.vision', 'CROWNIUM', 'DOJUKU SHINGI', 'GROUPE']

export const CATEGORIES: string[] = [
  'Technique', 'Produit', 'Sécurité', 'Partenariat', 'Investor',
  'Accélérateur', 'Contenu', 'SEO', 'Stratégie', 'Marketing',
  'RH', 'BizDev', 'Recherche', 'Lancement',
]

export const STATUTS = [
  { emoji: '✅', label: 'Terminé' },
  { emoji: '🔄', label: 'En cours' },
  { emoji: '📅', label: 'Planifié' },
]

export const filialeColors: Record<string, string> = {
  'COLHYBRI': '#00D4AA',
  'COLHYBRI.vision': '#00B894',
  'CROWNIUM': '#FFD700',
  'DOJUKU SHINGI': '#FF6B35',
  'GROUPE': '#7B61FF',
}

export const categorieColors: Record<string, string> = {
  'Technique': '#60A5FA',
  'Produit': '#34D399',
  'Sécurité': '#F87171',
  'Partenariat': '#FBBF24',
  'Investor': '#A78BFA',
  'Accélérateur': '#F472B6',
  'Contenu': '#38BDF8',
  'SEO': '#4ADE80',
  'Stratégie': '#C084FC',
  'Marketing': '#FB923C',
  'RH': '#22D3EE',
  'BizDev': '#E879F9',
  'Recherche': '#94A3B8',
  'Lancement': '#FCD34D',
}
