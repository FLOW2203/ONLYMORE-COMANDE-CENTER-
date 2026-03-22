'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'script' | 'trends' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'script', label: 'Script Builder', desc: 'Créer un script vidéo TikTok avec la structure Hook → Setup → Contenu → Payoff' },
  { id: 'trends', label: 'Trends & Formats', desc: 'Formats viraux, sons tendance, et idées de séries récurrentes' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication et optimisation algorithmique' },
]

const hookTypes = [
  { type: 'Question choc', example: '"Vous saviez que 90% des startups..."' },
  { type: 'Stat surprenante', example: '"3 secondes. C\'est tout ce que vous avez."' },
  { type: 'Contrarian', example: '"Arrêtez de poster sur LinkedIn."' },
  { type: 'Curiosité', example: '"Ce que personne ne vous dit sur..."' },
  { type: 'Mouvement', example: 'Action physique qui capte le regard' },
]

const formats = [
  { name: 'Talking head', desc: 'Face caméra, énergie haute, sous-titres', duration: '15-60s' },
  { name: 'Storytime', desc: 'Narration personnelle avec rebondissements', duration: '30-90s' },
  { name: 'Tutorial', desc: 'Step-by-step rapide, montage dynamique', duration: '15-60s' },
  { name: 'Before/After', desc: 'Transformation visuelle, révélation', duration: '15-30s' },
  { name: 'POV', desc: 'Point de vue immersif, identification', duration: '15-60s' },
  { name: 'Trend remix', desc: 'Adapter un trend à son secteur', duration: '15-30s' },
  { name: 'Green screen', desc: 'Réaction à article/post/stat', duration: '15-60s' },
  { name: 'Stitch/Duet', desc: 'Répondre à un contenu existant', duration: '15-60s' },
]

const checklistItems = [
  { cat: 'Hook', items: ['Les 3 premières secondes captent l\'attention', 'Texte à l\'écran visible immédiatement', 'Le son/musique est accrocheur'] },
  { cat: 'Contenu', items: ['Rythme dynamique sans temps mort', 'Valeur claire pour le viewer', 'Story arc avec payoff satisfaisant', 'Durée optimale (pas de padding)'] },
  { cat: 'Technique', items: ['Format vertical 9:16', 'Bonne luminosité et cadrage', 'Sous-titres ajoutés', 'Son/musique tendance utilisé'] },
  { cat: 'Optimisation', items: ['3-5 hashtags (mix trending + niche)', 'Description avec mots-clés', 'Heure de publication optimale (18h-22h)', 'CTA engageant (commentaire/partage)'] },
]

export default function TikTokPage() {
  const [activeTab, setActiveTab] = useState<Tab>('script')
  const [hook, setHook] = useState('')
  const [setup, setSetup] = useState('')
  const [content, setContent] = useState('')
  const [payoff, setPayoff] = useState('')
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
                  TikTok <span className="text-[#FF0050]">Creator</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Scripts, trends & viralité</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#FF0050]/20 text-[#FF0050]' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'script' && (
          <div className="space-y-6">
            {/* Hook types */}
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Types de hooks (0-3s)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {hookTypes.map((h) => (
                  <div key={h.type} className="border border-border rounded-lg p-3 bg-white/[0.02]">
                    <span className="text-xs font-sans font-semibold text-[#FF0050]">{h.type}</span>
                    <p className="text-[10px] font-mono text-muted mt-1">{h.example}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Script builder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-[#FF0050] mb-1 block">HOOK (0-3s)</label>
                  <textarea value={hook} onChange={(e) => setHook(e.target.value)} placeholder="Capturer l'attention immédiatement..."
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-20" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#FF0050] mb-1 block">SETUP (3-10s)</label>
                  <textarea value={setup} onChange={(e) => setSetup(e.target.value)} placeholder="Poser le contexte rapidement..."
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-20" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#FF0050] mb-1 block">CONTENU (10-45s)</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Valeur, divertissement, émotion..."
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-28" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#FF0050] mb-1 block">PAYOFF (45-60s)</label>
                  <textarea value={payoff} onChange={(e) => setPayoff(e.target.value)} placeholder="Conclusion satisfaisante + CTA..."
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-20" />
                </div>
              </div>

              {/* Preview */}
              <div className="border border-border rounded-xl p-4 bg-white/[0.02]">
                <h3 className="text-xs font-mono text-muted mb-3">Preview Script</h3>
                <div className="bg-black rounded-2xl p-4 aspect-[9/16] max-h-[500px] overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-3">
                    {hook && <div><span className="text-[8px] font-mono text-[#FF0050]">HOOK</span><p className="text-xs text-white mt-0.5">{hook}</p></div>}
                    {setup && <div><span className="text-[8px] font-mono text-[#FF0050]/60">SETUP</span><p className="text-xs text-white/80 mt-0.5">{setup}</p></div>}
                    {content && <div><span className="text-[8px] font-mono text-[#FF0050]/40">CONTENU</span><p className="text-xs text-white/70 mt-0.5">{content}</p></div>}
                    {payoff && <div><span className="text-[8px] font-mono text-[#FF0050]/80">PAYOFF</span><p className="text-xs text-white mt-0.5">{payoff}</p></div>}
                  </div>
                  {!hook && !setup && !content && !payoff && (
                    <p className="text-xs text-white/30 text-center my-auto">Remplis le script pour voir l'aperçu</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-muted mb-3">Formats qui performent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {formats.map((f) => (
                <div key={f.name} className="border border-border rounded-lg p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-sans font-semibold text-text">{f.name}</span>
                    <span className="text-[8px] font-mono text-[#FF0050] bg-[#FF0050]/10 px-1.5 py-0.5 rounded">{f.duration}</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Algorithme TikTok — Signaux clés</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#FF0050]">Watch time #1</span><p className="text-[10px] font-mono text-muted mt-1">Taux de complétion = facteur le plus important. Viser &gt;80%.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#FF0050]">Partages &gt; Likes</span><p className="text-[10px] font-mono text-muted mt-1">Un partage vaut 10x un like. Créer du contenu partageable.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#FF0050]">200 premières vues</span><p className="text-[10px] font-mono text-muted mt-1">Les 200 premiers viewers déterminent la distribution globale.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF0050] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)}
                        className="w-3.5 h-3.5 rounded border-border accent-[#FF0050]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#FF0050] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — TikTok Creator — HERALD</p>
          <span className="text-[9px] font-mono text-muted">1-3 vidéos/jour — Hook 3s — Watch time = #1</span>
        </div>
      </footer>
    </main>
  )
}
