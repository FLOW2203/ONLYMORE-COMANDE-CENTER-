'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'composer' | 'strategy' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'composer', label: 'Post Builder', desc: 'Créer des posts Threads conversationnels et authentiques' },
  { id: 'strategy', label: 'Stratégie', desc: 'Positionnement, ton et intégration Instagram' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication' },
]

const postStyles = [
  { style: 'Pensée spontanée', example: 'Un truc que j\'ai réalisé aujourd\'hui en bossant sur mon projet...', tip: 'Le plus authentique possible' },
  { style: 'Question ouverte', example: 'Vous préférez bosser le matin tôt ou tard le soir ?', tip: 'Conversations > broadcasting' },
  { style: 'Mini-thread', example: 'Post 1 → réponse à soi-même → développement', tip: 'Utiliser les réponses pour développer' },
  { style: 'Observation marché', example: 'Je vois de plus en plus de marques qui...', tip: 'Partager sa veille' },
  { style: 'Behind the scenes', example: 'Ce matin en arrivant au bureau, première chose que je fais...', tip: 'Humaniser la marque' },
]

const checklistItems = [
  { cat: 'Contenu', items: ['Texte < 500 caractères', 'Ton conversationnel et authentique', 'Pas de hashtags (Threads n\'en utilise pas)', 'Valeur ou conversation sincère'] },
  { cat: 'Engagement', items: ['Question ouverte pour générer des réponses', 'Prêt à répondre aux commentaires', 'Cross-post Instagram si pertinent', 'Fréquence : 1-3 posts/jour'] },
]

export default function ThreadsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('composer')
  const [post, setPost] = useState('')
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
                  Threads <span className="text-white/80">Conversations</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Authenticité & Communauté</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-white/10 text-text' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'composer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-mono text-white/60 mb-1 block">POST THREADS</label>
              <textarea value={post} onChange={(e) => setPost(e.target.value)} placeholder="Parle comme à des amis pro..."
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm font-mono text-text placeholder:text-muted/50 resize-none h-40" />
              <span className={`text-[9px] font-mono ${post.length <= 500 ? 'text-green-400' : 'text-red-400'}`}>{post.length}/500</span>
            </div>
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Styles qui marchent</h3>
              <div className="space-y-2">
                {postStyles.map((s) => (
                  <div key={s.style} className="border border-border rounded-lg p-3 bg-white/[0.02]">
                    <span className="text-xs font-sans font-semibold text-text">{s.style}</span>
                    <p className="text-[10px] font-mono text-muted mt-1">{s.example}</p>
                    <p className="text-[9px] font-mono text-white/40 mt-1">{s.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Positionnement Threads</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-text">Authenticité first</span><p className="text-[10px] font-mono text-muted mt-1">Threads récompense le contenu genuine. Pas de corporate speak.</p></div>
                <div><span className="text-xs font-sans font-semibold text-text">Conversations &gt; Broadcast</span><p className="text-[10px] font-mono text-muted mt-1">Poser des questions, répondre aux autres, créer du lien réel.</p></div>
                <div><span className="text-xs font-sans font-semibold text-text">Cross-post IG</span><p className="text-[10px] font-mono text-muted mt-1">L'intégration Instagram booste la découvrabilité sur Threads.</p></div>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-white/[0.02]">
              <h3 className="text-sm font-sans font-semibold text-text mb-2">Threads vs X — Différences clés</h3>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-muted">
                <div><strong className="text-text">Threads :</strong> Conversationnel, positif, communautaire, pas de hashtags, lié à Instagram</div>
                <div><strong className="text-text">X :</strong> Opinions tranchées, news, provocateur, hashtags, engagement rapide</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-white/60 rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-text line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — Threads — HERALD</p>
          <span className="text-[9px] font-mono text-muted">Authentique — Conversationnel — Communautaire</span>
        </div>
      </footer>
    </main>
  )
}
