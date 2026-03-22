'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'script' | 'seo' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'script', label: 'Script Builder', desc: 'Créer un script vidéo YouTube avec la structure Hook → Intro → Contenu → CTA' },
  { id: 'seo', label: 'SEO & Thumbnail', desc: 'Optimiser titre, description, tags et miniature pour le référencement YouTube' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication et optimisation algorithmique' },
]

const scriptSections = [
  { key: 'hook', label: 'HOOK (0-30s)', placeholder: 'Promesse + preview du contenu. Pourquoi rester ?', color: '#FF0000' },
  { key: 'intro', label: 'INTRO (30s-1min)', placeholder: 'Contexte + "restez jusqu\'à la fin pour..."', color: '#FF0000' },
  { key: 'body', label: 'CONTENU PRINCIPAL', placeholder: 'Sections avec transitions claires. Un point par section.', color: '#FF0000' },
  { key: 'recap', label: 'RÉCAP', placeholder: 'Résumé des points clés en 30 secondes.', color: '#FF0000' },
  { key: 'cta', label: 'CTA (dernier 30s)', placeholder: 'Abonnement + vidéo suivante + commentaire', color: '#FF0000' },
]

const checklistItems = [
  { cat: 'Titre & Thumbnail', items: ['Titre < 60 caractères, mot-clé en début', 'Miniature avec visage expressif', 'Texte large et lisible sur miniature', 'Contraste fort, couleurs vives'] },
  { cat: 'Description & Tags', items: ['Description 200+ mots avec mots-clés', 'Timestamps/chapitres dans la description', 'Liens utiles (site, réseaux)', '10-15 tags mix large + spécifique'] },
  { cat: 'Vidéo', items: ['Hook dans les 30 premières secondes', 'Rythme dynamique, pas de longueurs', 'Cards et end screens configurés', 'Sous-titres activés/vérifiés'] },
  { cat: 'Publication', items: ['Publié à l\'heure optimale pour l\'audience', 'Community post d\'annonce', 'Partage cross-platform immédiat', 'Prêt à répondre aux commentaires 1h'] },
]

export default function YouTubePage() {
  const [activeTab, setActiveTab] = useState<Tab>('script')
  const [sections, setSections] = useState<Record<string, string>>({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
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
                  YouTube <span className="text-[#FF0000]">Studio</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Scripts, SEO & Thumbnails</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#FF0000]/20 text-[#FF0000]' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'script' && (
          <div className="space-y-4">
            {scriptSections.map((s) => (
              <div key={s.key}>
                <label className="text-[10px] font-mono text-[#FF0000] mb-1 block">{s.label}</label>
                <textarea
                  value={sections[s.key] || ''}
                  onChange={(e) => setSections((prev) => ({ ...prev, [s.key]: e.target.value }))}
                  placeholder={s.placeholder}
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-24"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-[#FF0000] mb-1 block">TITRE</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mot-clé principal en début — max 60 caractères"
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50" />
              <span className={`text-[9px] font-mono ${title.length <= 60 ? 'text-green-400' : 'text-red-400'}`}>{title.length}/60</span>
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#FF0000] mb-1 block">DESCRIPTION</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="200+ mots. Inclure : résumé, timestamps, liens, mots-clés naturels."
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-48" />
              <span className="text-[9px] font-mono text-muted">{description.trim().split(/\s+/).filter(Boolean).length} mots — 200+ recommandés</span>
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#FF0000] mb-1 block">TAGS (séparés par des virgules)</label>
              <textarea value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag principal, tag secondaire, tag large..."
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-20" />
              <span className="text-[9px] font-mono text-muted">{tags.split(',').filter((t) => t.trim()).length} tags — 10-15 recommandés</span>
            </div>
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Algorithme YouTube</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#FF0000]">Watch time = #1</span><p className="text-[10px] font-mono text-muted mt-1">Taux de rétention et temps de visionnage sont les facteurs principaux.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#FF0000]">CTR Thumbnail</span><p className="text-[10px] font-mono text-muted mt-1">Le taux de clic sur la miniature détermine la distribution initiale.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#FF0000]">Session time</span><p className="text-[10px] font-mono text-muted mt-1">Les vidéos qui gardent les viewers sur YouTube sont récompensées.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF0000] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#FF0000]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#FF0000] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — YouTube Studio — HERALD</p>
          <span className="text-[9px] font-mono text-muted">Watch time = #1 — Thumbnail CTR — SEO description</span>
        </div>
      </footer>
    </main>
  )
}
