'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'composer' | 'thread' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'composer', label: 'Tweet Builder', desc: 'Créer des tweets percutants et optimisés pour X' },
  { id: 'thread', label: 'Thread Builder', desc: 'Construire des threads éducatifs ou narratifs tweet par tweet' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication et optimisation' },
]

const tweetStyles = [
  { style: 'Opinion forte', example: '"Le networking est mort. La construction de relations, non."', tip: 'Prendre position génère des réponses' },
  { style: 'Observation', example: '"Les meilleurs founders que je connais ne pitchent jamais. Ils racontent."', tip: 'Montrer qu\'on observe le monde' },
  { style: 'Liste', example: '"5 outils que j\'utilise chaque jour :\n1.\n2.\n3..."', tip: 'Format snackable et sauvegardable' },
  { style: 'Contrarian', example: '"Arrêtez de chercher un mentor. Commencez par être utile."', tip: 'Challenger les idées reçues' },
  { style: 'Storytelling', example: '"En 2020 j\'avais 0€ sur mon compte. Aujourd\'hui..."', tip: 'L\'arc narratif capte l\'attention' },
  { style: 'Question', example: '"Quelle est la compétence la plus sous-estimée en business ?"', tip: 'Les questions génèrent des réponses' },
]

const checklistItems = [
  { cat: 'Tweet', items: ['Chaque mot compte (280 chars max)', 'Pas de hashtags excessifs (1-2 max)', 'Image ou média si pertinent', 'Pas de lien dans le tweet (mettre en réponse)'] },
  { cat: 'Thread', items: ['Tweet 1 = hook irrésistible', 'Numérotation claire (1/, 2/, etc.)', 'Un point par tweet', 'Dernier tweet = CTA (RT/Follow)'] },
  { cat: 'Timing', items: ['Publié entre 8h-10h ou 17h-19h', 'Prêt à interagir 15-30 min après', 'Participation active aux conversations', 'Fréquence : 3-5 tweets/jour minimum'] },
]

export default function XPage() {
  const [activeTab, setActiveTab] = useState<Tab>('composer')
  const [tweet, setTweet] = useState('')
  const [threadTweets, setThreadTweets] = useState([''])
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (item: string) => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  const totalChecks = checklistItems.flatMap((c) => c.items).length
  const doneChecks = Object.values(checked).filter(Boolean).length

  const addTweet = () => setThreadTweets((prev) => [...prev, ''])
  const updateTweet = (i: number, val: string) => setThreadTweets((prev) => prev.map((t, idx) => (idx === i ? val : t)))
  const removeTweet = (i: number) => setThreadTweets((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/herald" className="text-xs font-mono text-muted hover:text-text transition-colors">← HERALD</Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  X <span className="text-[#9BA3AF]">Writer</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Tweets, Threads & Conversations</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#9BA3AF]/20 text-[#9BA3AF]' : 'text-muted hover:text-text'}`}
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
              <label className="text-[10px] font-mono text-[#9BA3AF] mb-1 block">TWEET</label>
              <textarea value={tweet} onChange={(e) => setTweet(e.target.value)} placeholder="Chaque mot doit compter..."
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm font-mono text-text placeholder:text-muted/50 resize-none h-32" />
              <span className={`text-[9px] font-mono ${tweet.length <= 280 ? 'text-green-400' : 'text-red-400'}`}>{tweet.length}/280</span>
            </div>
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Styles de tweets</h3>
              <div className="space-y-2">
                {tweetStyles.map((s) => (
                  <div key={s.style} className="border border-border rounded-lg p-3 bg-white/[0.02]">
                    <span className="text-xs font-sans font-semibold text-text">{s.style}</span>
                    <p className="text-[10px] font-mono text-muted mt-1 whitespace-pre-line">{s.example}</p>
                    <p className="text-[9px] font-mono text-[#9BA3AF] mt-1">{s.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'thread' && (
          <div className="space-y-3">
            {threadTweets.map((t, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-[10px] font-mono text-[#9BA3AF] mt-2 w-8 shrink-0">{i + 1}/</span>
                <textarea
                  value={t}
                  onChange={(e) => updateTweet(i, e.target.value)}
                  placeholder={i === 0 ? 'Hook — Le tweet le plus important' : i === threadTweets.length - 1 ? 'CTA — RT si utile / Follow pour plus' : 'Un point par tweet, clair et concis'}
                  className="flex-1 bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-20"
                />
                <div className="flex flex-col gap-1">
                  <span className={`text-[9px] font-mono ${t.length <= 280 ? 'text-muted' : 'text-red-400'}`}>{t.length}</span>
                  {threadTweets.length > 1 && (
                    <button onClick={() => removeTweet(i)} className="text-[9px] text-red-400 hover:text-red-300">×</button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addTweet}
              className="w-full border border-dashed border-border rounded-lg py-2 text-xs font-mono text-muted hover:text-text hover:border-[#9BA3AF] transition-colors">
              + Ajouter un tweet au thread
            </button>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#9BA3AF] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#9BA3AF]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#9BA3AF] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — X Writer — HERALD</p>
          <span className="text-[9px] font-mono text-muted">Direct — Concis — Opiné — Authentique</span>
        </div>
      </footer>
    </main>
  )
}
