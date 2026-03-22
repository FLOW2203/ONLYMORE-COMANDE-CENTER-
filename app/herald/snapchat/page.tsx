'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'creator' | 'formats' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'creator', label: 'Snap Creator', desc: 'Créer des concepts Snap et Spotlight optimisés Gen Z' },
  { id: 'formats', label: 'Formats & AR', desc: 'Stories, Spotlight, Lenses AR et Snap Map' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication' },
]

const contentIdeas = [
  { type: 'Day in the life', desc: 'Story immersive d\'une journée type', audience: 'Gen Z', format: 'Story' },
  { type: 'Quick tips', desc: 'Conseil rapide en 10 secondes max', audience: 'Tous', format: 'Spotlight' },
  { type: 'Before/After', desc: 'Transformation visuelle avec reveal', audience: 'Gen Z', format: 'Spotlight' },
  { type: 'Behind the scenes', desc: 'Coulisses authentiques et spontanées', audience: 'Fans', format: 'Story' },
  { type: 'AR Experience', desc: 'Filtre/lens interactif brandé', audience: 'Gen Z', format: 'Lens' },
  { type: 'Event coverage', desc: 'Live d\'événement avec géofiltre', audience: 'Local', format: 'Snap Map' },
]

const checklistItems = [
  { cat: 'Contenu', items: ['Format vertical 9:16 plein écran', 'Durée 3-10 secondes par Snap', 'Contenu authentique et spontané', 'Stickers et dessins interactifs'] },
  { cat: 'Spotlight', items: ['Contenu 100% original', 'Divertissant ou surprenant', 'Hook immédiat', 'Pas de filigrane d\'autres plateformes'] },
  { cat: 'Audience', items: ['Adapté au langage Gen Z', 'Ton fun et décontracté', 'Stories quotidiennes pour la fidélisation', 'Utilisation des géofiltres pour events'] },
]

export default function SnapchatPage() {
  const [activeTab, setActiveTab] = useState<Tab>('creator')
  const [concept, setConcept] = useState('')
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
                  Snapchat <span className="text-[#FFFC00]">Creator</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Éphémère, AR & Gen Z</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#FFFC00]/20 text-[#FFFC00]' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'creator' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-mono text-[#FFFC00] mb-1 block">CONCEPT SNAP</label>
              <textarea value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Décris ton concept de Snap / Story / Spotlight..."
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-40" />
            </div>
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Idées de contenu</h3>
              <div className="space-y-2">
                {contentIdeas.map((idea) => (
                  <div key={idea.type} className="border border-border rounded-lg p-3 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-text">{idea.type}</span>
                      <div className="flex gap-1">
                        <span className="text-[8px] font-mono text-[#FFFC00] bg-[#FFFC00]/10 px-1.5 py-0.5 rounded">{idea.format}</span>
                        <span className="text-[8px] font-mono text-muted bg-white/[0.05] px-1.5 py-0.5 rounded">{idea.audience}</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-muted mt-1">{idea.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Story', desc: 'Séquence de Snaps, visible 24h. Format principal pour la fidélisation.', color: '#FFFC00' },
                { name: 'Spotlight', desc: 'Contenu viral public, format court vertical. Pas besoin de followers.', color: '#FFFC00' },
                { name: 'Lens AR', desc: 'Expériences de réalité augmentée interactives et brandées.', color: '#FFFC00' },
                { name: 'Snap Map', desc: 'Contenu géolocalisé. Parfait pour les événements physiques.', color: '#FFFC00' },
              ].map((f) => (
                <div key={f.name} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                  <span className="text-sm font-sans font-semibold text-text">{f.name}</span>
                  <p className="text-[10px] font-mono text-muted mt-2">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Audience Snapchat</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#FFFC00]">75% ont 13-34 ans</span><p className="text-[10px] font-mono text-muted mt-1">Audience ultra-jeune. Ton et contenu adaptés à la Gen Z.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#FFFC00]">Mobile-first</span><p className="text-[10px] font-mono text-muted mt-1">100% vertical. Communication visuelle. Fun et spontané.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#FFFC00]">0 followers = viral</span><p className="text-[10px] font-mono text-muted mt-1">Spotlight ne nécessite pas de followers. L'algo distribue le meilleur contenu.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFFC00] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#FFFC00]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#FFFC00] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — Snapchat Creator — HERALD</p>
          <span className="text-[9px] font-mono text-muted">Gen Z — Éphémère — AR — Authenticité</span>
        </div>
      </footer>
    </main>
  )
}
