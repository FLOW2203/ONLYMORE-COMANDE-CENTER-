'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'composer' | 'formats' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'composer', label: 'Caption Builder', desc: 'Créer des captions Instagram optimisées avec hook, corps et CTA' },
  { id: 'formats', label: 'Formats & Algo', desc: 'Formats performants et signaux algorithmiques Instagram 2024-2026' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication et optimisation' },
]

const formatCards = [
  { name: 'Reel', reach: 'Portée max', engagement: '★★★★☆', desc: '15-90s vertical, hook visuel, transitions dynamiques', tip: 'Format #1 pour la croissance organique' },
  { name: 'Carrousel', reach: 'Très bon', engagement: '★★★★★', desc: '2-10 slides, storytelling visuel, CTA sur dernière slide', tip: 'Meilleur taux d\'engagement moyen' },
  { name: 'Post image', reach: 'Modéré', engagement: '★★★☆☆', desc: 'Photo unique, ratio 1:1 ou 4:5, esthétique soignée', tip: 'Pour la cohérence du feed' },
  { name: 'Story', reach: 'Followers', engagement: '★★★★☆', desc: 'Contenu éphémère 24h, stickers interactifs', tip: 'Sondages et questions boostent l\'engagement' },
  { name: 'Guide', reach: 'SEO', engagement: '★★☆☆☆', desc: 'Collections thématiques de posts existants', tip: 'Excellent pour le SEO Instagram' },
  { name: 'Live', reach: 'Priorité algo', engagement: '★★★★★', desc: 'Diffusion en direct, Q&A, collaborations', tip: 'Notification push à tous les followers' },
]

const checklistItems = [
  { cat: 'Visuel', items: ['Ratio 1:1 ou 4:5 (Reel: 9:16)', 'Qualité HD minimum', 'Cohérence esthétique avec le feed', 'Alt text renseigné (accessibilité + SEO)'] },
  { cat: 'Caption', items: ['Hook dans les 125 premiers caractères', 'Valeur claire pour le lecteur', 'CTA engageant (question, save, partage)', 'Hashtags mix (5-15) populaires + niche'] },
  { cat: 'Optimisation', items: ['Publié entre 11h-13h ou 19h-21h', 'Mots-clés SEO dans la caption', 'Localisation ajoutée', 'Prêt à répondre aux commentaires 30min'] },
]

export default function InstagramPage() {
  const [activeTab, setActiveTab] = useState<Tab>('composer')
  const [hookText, setHookText] = useState('')
  const [body, setBody] = useState('')
  const [cta, setCta] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (item: string) => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  const totalChecks = checklistItems.flatMap((c) => c.items).length
  const doneChecks = Object.values(checked).filter(Boolean).length

  const captionPreview = [hookText, '', body, '', cta, '.', '.', '.', hashtags].filter((l, i) => l || (i === 1 && hookText) || (i === 4 && cta)).join('\n')

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/herald" className="text-xs font-mono text-muted hover:text-text transition-colors">← HERALD</Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  Instagram <span className="text-[#E1306C]">Studio</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Captions, Reels & Stories</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#E1306C]/20 text-[#E1306C]' : 'text-muted hover:text-text'}`}
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
                <label className="text-[10px] font-mono text-[#E1306C] mb-1 block">HOOK (première ligne visible)</label>
                <textarea value={hookText} onChange={(e) => setHookText(e.target.value)} placeholder="Ligne captivante avant 'voir plus'..."
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-16" />
                <span className="text-[9px] font-mono text-muted">{hookText.length}/125 caractères recommandés</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#E1306C] mb-1 block">CORPS</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Valeur, histoire, ou information..."
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-32" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#E1306C] mb-1 block">CTA</label>
                <textarea value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Invitation à interagir..."
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-16" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#E1306C] mb-1 block">HASHTAGS</label>
                <textarea value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#hashtag1 #hashtag2 #hashtag3..."
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-16" />
                <span className="text-[9px] font-mono text-muted">{hashtags.split('#').filter(Boolean).length} hashtags — 5-15 recommandés</span>
              </div>
            </div>
            <div className="border border-border rounded-xl p-4 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Preview Caption</h3>
              <div className="bg-black rounded-xl p-4 min-h-[300px]">
                <pre className="text-xs text-white whitespace-pre-wrap font-mono leading-relaxed">{captionPreview || 'Remplis les champs pour voir l\'aperçu...'}</pre>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[9px] font-mono text-muted">
                <span>{captionPreview.length} caractères</span>
                <span>Max 2200</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'formats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formatCards.map((f) => (
                <div key={f.name} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-sans font-semibold text-text">{f.name}</span>
                    <span className="text-[9px] font-mono text-[#E1306C]">{f.engagement}</span>
                  </div>
                  <span className="text-[8px] font-mono text-[#E1306C] bg-[#E1306C]/10 px-1.5 py-0.5 rounded">{f.reach}</span>
                  <p className="text-[10px] font-mono text-muted mt-2">{f.desc}</p>
                  <p className="text-[10px] font-mono text-text/60 mt-1 italic">{f.tip}</p>
                </div>
              ))}
            </div>
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Algorithme Instagram 2024-2026</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#E1306C]">Partages en DM = #1</span><p className="text-[10px] font-mono text-muted mt-1">Le signal le plus fort. Créer du contenu que les gens envoient à leurs amis.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#E1306C]">30 min critiques</span><p className="text-[10px] font-mono text-muted mt-1">L'engagement dans les 30 premières minutes détermine la portée totale.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#E1306C]">SEO Instagram</span><p className="text-[10px] font-mono text-muted mt-1">Mots-clés dans bio, captions et alt text prennent de l'importance.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#E1306C] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#E1306C]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#E1306C] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — Instagram Studio — HERALD</p>
          <span className="text-[9px] font-mono text-muted">Reels = croissance — Carrousels = engagement — Stories = fidélisation</span>
        </div>
      </footer>
    </main>
  )
}
