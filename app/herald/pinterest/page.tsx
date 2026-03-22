'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'composer' | 'seo' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'composer', label: 'Pin Builder', desc: 'Créer des épingles optimisées avec titre, description SEO et lien' },
  { id: 'seo', label: 'SEO Pinterest', desc: 'Mots-clés, tableaux et stratégie de référencement visuel' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication' },
]

const pinTypes = [
  { name: 'Épingle standard', ratio: '2:3 (1000x1500)', desc: 'Image verticale avec titre overlay, lien vers site', tip: 'Le format de base, toujours efficace' },
  { name: 'Idea Pin', ratio: '9:16', desc: '1-20 pages, storytelling visuel, tutoriel', tip: 'Format natif favorisé par l\'algo' },
  { name: 'Épingle vidéo', ratio: '2:3 ou 9:16', desc: '6-60 secondes, auto-play dans le feed', tip: 'Capte l\'attention dans le scroll' },
  { name: 'Carrousel', ratio: '2:3', desc: 'Multi-images swipables', tip: 'Pour les tutoriels step-by-step' },
]

const checklistItems = [
  { cat: 'Visuel', items: ['Format vertical 2:3 (min 1000px large)', 'Texte overlay lisible et contrasté', 'Pas trop de texte (30% max de l\'image)', 'Branding subtil (logo ou couleurs)'] },
  { cat: 'SEO', items: ['Titre avec mot-clé principal', 'Description 200-500 caractères', 'Mots-clés naturels dans la description', 'Alt text renseigné', 'Tableau correctement nommé'] },
  { cat: 'Optimisation', items: ['Lien vers page de destination fonctionnel', 'Rich Pin activé si applicable', 'Planifié 45j avant événement saisonnier', 'Fréquence : 5-15 épingles/jour'] },
]

export default function PinterestPage() {
  const [activeTab, setActiveTab] = useState<Tab>('composer')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [board, setBoard] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (item: string) => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  const totalChecks = checklistItems.flatMap((c) => c.items).length
  const doneChecks = Object.values(checked).filter(Boolean).length

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/herald" className="text-xs font-mono text-muted hover:text-text transition-colors">← HERALD</Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  Pinterest <span className="text-[#E60023]">Studio</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Épingles, SEO & Trafic Web</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#E60023]/20 text-[#E60023]' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'composer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-[#E60023] mb-1 block">TITRE DE L'ÉPINGLE</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mot-clé principal + accroche"
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
                <span className="text-[9px] font-mono text-muted">{title.length}/100 caractères</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#E60023] mb-1 block">DESCRIPTION SEO</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mots-clés naturels, 200-500 caractères..."
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-32" />
                <span className={`text-[9px] font-mono ${description.length >= 200 && description.length <= 500 ? 'text-green-400' : 'text-muted'}`}>{description.length}/500</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#E60023] mb-1 block">LIEN DESTINATION</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..."
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#E60023] mb-1 block">TABLEAU</label>
                <input value={board} onChange={(e) => setBoard(e.target.value)} placeholder="Nom du tableau avec mots-clés"
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Types d'épingles</h3>
              <div className="space-y-2">
                {pinTypes.map((p) => (
                  <div key={p.name} className="border border-border rounded-lg p-3 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-text">{p.name}</span>
                      <span className="text-[8px] font-mono text-[#E60023] bg-[#E60023]/10 px-1.5 py-0.5 rounded">{p.ratio}</span>
                    </div>
                    <p className="text-[10px] font-mono text-muted mt-1">{p.desc}</p>
                    <p className="text-[9px] font-mono text-[#E60023]/60 mt-1">{p.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Pinterest = Moteur de recherche visuel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#E60023]">Durée de vie 3-6 mois</span><p className="text-[10px] font-mono text-muted mt-1">Contrairement aux autres plateformes (heures), les épingles vivent des mois. Investissement long terme.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#E60023]">Mots-clés partout</span><p className="text-[10px] font-mono text-muted mt-1">Bio, noms de tableaux, titres et descriptions d'épingles. Chaque champ est une opportunité SEO.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#E60023]">Saisonnalité</span><p className="text-[10px] font-mono text-muted mt-1">Planifier 45 jours avant les événements. Noël en novembre, été en mai, etc.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#E60023] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#E60023]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#E60023] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — Pinterest Studio — HERALD</p>
          <span className="text-[9px] font-mono text-muted">SEO visuel — Durée de vie 3-6 mois — Trafic web</span>
        </div>
      </footer>
    </main>
  )
}
