'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'search' | 'methodology' | 'tools'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'search', label: 'Recherche', desc: 'Lancer une recherche OSINT sur une personne ou entreprise' },
  { id: 'methodology', label: 'Méthodologie', desc: 'Les 8 vecteurs de recherche et le scoring de confiance' },
  { id: 'tools', label: 'Outils & Ressources', desc: 'Outils complémentaires et bonnes pratiques OSINT' },
]

const vectors = [
  { num: 1, name: 'Email direct', query: '"prénom nom" "@" email', desc: 'Recherche d\'email directe sur le web' },
  { num: 2, name: 'Pattern entreprise', query: '"@domaine.com" contact', desc: 'Déduire le format email depuis l\'entreprise' },
  { num: 3, name: 'LinkedIn', query: 'site:linkedin.com "prénom nom"', desc: 'Profil professionnel et réseau' },
  { num: 4, name: 'Téléphone', query: '"prénom nom" tel OR phone', desc: 'Numéro professionnel public' },
  { num: 5, name: 'X / Twitter', query: 'site:x.com "prénom nom"', desc: 'Profil social et liens en bio' },
  { num: 6, name: 'Apparitions publiques', query: '"prénom nom" conférence podcast', desc: 'Interviews, talks, publications' },
  { num: 7, name: 'Plateformes contenu', query: 'site:substack.com "prénom nom"', desc: 'Medium, Substack, Skool, newsletters' },
  { num: 8, name: 'Bio & parcours', query: '"prénom nom" bio parcours article', desc: 'Informations complémentaires' },
]

const scoreTable = [
  { stars: 5, label: 'Certifié', desc: 'Email sur site officiel ou profil vérifié', color: '#00D4AA' },
  { stars: 4, label: 'Très probable', desc: 'Pattern confirmé + nom dans l\'organigramme', color: '#7B61FF' },
  { stars: 3, label: 'Probable', desc: 'Pattern déduit + personne confirmée', color: '#0A66C2' },
  { stars: 2, label: 'Hypothèse', desc: 'Pattern déduit sans confirmation directe', color: '#FFD700' },
  { stars: 1, label: 'Spéculatif', desc: 'Pure déduction logique', color: '#FF6B35' },
]

const externalTools = [
  { name: 'Hunter.io', desc: 'Recherche et vérification d\'emails', url: 'https://hunter.io', free: true },
  { name: 'RocketReach', desc: 'Base de données de contacts B2B', url: 'https://rocketreach.co', free: false },
  { name: 'Clearbit', desc: 'Enrichissement de données entreprise', url: 'https://clearbit.com', free: false },
  { name: 'SignalHire', desc: 'Emails et téléphones professionnels', url: 'https://signalhire.com', free: true },
  { name: 'Kaspr', desc: 'Extension LinkedIn pour contacts', url: 'https://kaspr.io', free: true },
  { name: 'Societeinfo', desc: 'Données entreprises françaises', url: 'https://societeinfo.com', free: true },
]

export default function OsintPage() {
  const [activeTab, setActiveTab] = useState<Tab>('search')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [context, setContext] = useState('')

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs font-mono text-muted hover:text-text transition-colors">← Calendrier</Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  OSINT <span className="text-[#FF6B35]">Prospector</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">
                  Recherche automatisée de contacts publics — Éthique & RGPD compliant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/herald" className="text-[9px] font-mono text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/20 px-2 py-1 rounded hover:bg-[#00D4AA]/20 transition-colors">
                HERALD
              </Link>
              <Link href="/linkedin" className="text-[9px] font-mono text-[#0A66C2] bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-2 py-1 rounded hover:bg-[#0A66C2]/20 transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search form */}
            <div className="border border-[#FF6B35]/20 rounded-xl p-6 bg-[#FF6B35]/5">
              <h3 className="text-sm font-sans font-semibold text-text mb-4">Cible de recherche</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#FF6B35] mb-1 block">NOM COMPLET *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom Nom"
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#FF6B35] mb-1 block">ENTREPRISE</label>
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nom de l'entreprise"
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#FF6B35] mb-1 block">FONCTION / RÔLE</label>
                  <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="CEO, CTO, Directeur..."
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#FF6B35] mb-1 block">CONTEXTE</label>
                  <input value={context} onChange={(e) => setContext(e.target.value)} placeholder="Prospection, partenariat, presse..."
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
                </div>
              </div>
              <p className="text-[9px] font-mono text-muted mt-4">
                Utilise le skill OSINT Prospector en conversation pour lancer la recherche automatisée : "Trouve les coordonnées de {name || '[Nom]'}{company ? ` chez ${company}` : ''}"
              </p>
            </div>

            {/* Fiche de contact template */}
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Format de résultat — Fiche de contact</h3>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-muted leading-relaxed">
                <p className="text-text font-semibold">Prénom Nom — Fonction @ Entreprise</p>
                <p className="mt-2">Email : prenom.nom@entreprise.com (★★★★☆)</p>
                <p>Tél : +33 6 XX XX XX XX (★★★☆☆)</p>
                <p>LinkedIn : linkedin.com/in/prenom-nom (★★★★★)</p>
                <p>X : @handle</p>
                <p>Site : entreprise.com</p>
                <p>Localisation : Ville, Pays</p>
                <p className="mt-2 text-[#FF6B35]">Empreinte numérique : LinkedIn, Medium, Substack...</p>
                <p className="mt-1">Recommandation : Canal + point d'accroche</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'methodology' && (
          <div className="space-y-6">
            {/* 8 vecteurs */}
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Les 8 vecteurs de recherche</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vectors.map((v) => (
                  <div key={v.num} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-mono flex items-center justify-center">{v.num}</span>
                      <span className="text-xs font-sans font-semibold text-text">{v.name}</span>
                    </div>
                    <code className="text-[10px] font-mono text-[#FF6B35]/80 bg-[#FF6B35]/5 px-2 py-0.5 rounded block mb-1">{v.query}</code>
                    <p className="text-[10px] font-mono text-muted">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scoring */}
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Scoring de confiance</h3>
              <div className="space-y-2">
                {scoreTable.map((s) => (
                  <div key={s.stars} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <span className="text-sm w-16" style={{ color: s.color }}>{'★'.repeat(s.stars)}{'☆'.repeat(5 - s.stars)}</span>
                    <span className="text-xs font-sans font-semibold text-text w-28">{s.label}</span>
                    <span className="text-[10px] font-mono text-muted">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {externalTools.map((tool) => (
                <div key={tool.name} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-sans font-semibold text-text">{tool.name}</span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${tool.free ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {tool.free ? 'Free tier' : 'Payant'}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-muted">{tool.desc}</p>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Principes éthiques OSINT</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono text-muted">
                <div>
                  <span className="text-xs font-sans font-semibold text-text block mb-1">Ce qu'on fait</span>
                  <ul className="space-y-1">
                    <li>- Exploiter les infos publiquement accessibles</li>
                    <li>- Croiser et vérifier les sources</li>
                    <li>- Scorer la confiance de chaque info</li>
                    <li>- Respecter la volonté de confidentialité</li>
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-sans font-semibold text-text block mb-1">Ce qu'on ne fait PAS</span>
                  <ul className="space-y-1">
                    <li>- Hacker ou contourner des protections</li>
                    <li>- Inventer des emails ou données</li>
                    <li>- Scraper des bases privées</li>
                    <li>- Exposer des données personnelles non-pro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — OSINT Prospector — Éthique & RGPD</p>
          <span className="text-[9px] font-mono text-muted">8 vecteurs — Scoring confiance — Sources publiques uniquement</span>
        </div>
      </footer>
    </main>
  )
}
