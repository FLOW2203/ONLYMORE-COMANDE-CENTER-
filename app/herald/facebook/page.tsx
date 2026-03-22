'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'composer' | 'strategy' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'composer', label: 'Post Builder', desc: 'Créer des posts Facebook optimisés pour l\'engagement communautaire' },
  { id: 'strategy', label: 'Stratégie & Algo', desc: 'Groupes, événements, et signaux algorithmiques Facebook' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification pré-publication' },
]

const contentTypes = [
  { name: 'Post question', desc: 'Poser une question ouverte pour stimuler les commentaires', example: '"Quel est votre plus grand défi en ce moment ?"', engagement: 'Très élevé' },
  { name: 'Vidéo native', desc: 'Upload direct avec sous-titres, 1-3 minutes', example: 'Tutoriel, behind-the-scenes, témoignage', engagement: 'Élevé' },
  { name: 'Reel Facebook', desc: 'Format court vertical, cross-post Instagram', example: 'Tips rapides, avant/après, tendances', engagement: 'Élevé' },
  { name: 'Événement', desc: 'Webinaires, lancements, meetups', example: 'Invitation avec visuels et détails', engagement: 'Modéré' },
  { name: 'Sondage', desc: '2-4 options pour l\'engagement rapide', example: '"Team A ou Team B ?"', engagement: 'Élevé' },
  { name: 'Post lien', desc: 'Partage d\'article avec commentaire', example: 'Lien en premier commentaire pour meilleure portée', engagement: 'Faible' },
]

const checklistItems = [
  { cat: 'Contenu', items: ['Post entre 40-80 mots', 'Visuels attractifs et de qualité', 'Question ou CTA pour l\'engagement', 'Pas de lien dans le post (mettre en commentaire)'] },
  { cat: 'Timing', items: ['Publié entre 13h-16h en semaine', 'Ou 12h-13h le week-end', 'Prêt à répondre aux commentaires', 'Fréquence : 3-5 posts/semaine'] },
  { cat: 'Optimisation', items: ['Vidéo native (pas de lien YouTube)', 'Description engageante pour les événements', 'Groupes communautaires actifs', 'Contenu qui génère des conversations significatives'] },
]

export default function FacebookPage() {
  const [activeTab, setActiveTab] = useState<Tab>('composer')
  const [postText, setPostText] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (item: string) => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  const totalChecks = checklistItems.flatMap((c) => c.items).length
  const doneChecks = Object.values(checked).filter(Boolean).length
  const wordCount = postText.trim().split(/\s+/).filter(Boolean).length

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/herald" className="text-xs font-mono text-muted hover:text-text transition-colors">← HERALD</Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  Facebook <span className="text-[#1877F2]">Community</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Pages, Groupes & Événements</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#1877F2]/20 text-[#1877F2]' : 'text-muted hover:text-text'}`}
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
              <label className="text-[10px] font-mono text-[#1877F2] mb-1 block">POST FACEBOOK</label>
              <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Écris ton post Facebook ici... (40-80 mots recommandés)"
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-48" />
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-[9px] font-mono ${wordCount >= 40 && wordCount <= 80 ? 'text-green-400' : wordCount > 80 ? 'text-yellow-400' : 'text-muted'}`}>
                  {wordCount} mots — {wordCount < 40 ? 'trop court' : wordCount <= 80 ? 'parfait' : 'un peu long'}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Types de contenus</h3>
              <div className="space-y-2">
                {contentTypes.map((ct) => (
                  <div key={ct.name} className="border border-border rounded-lg p-3 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-text">{ct.name}</span>
                      <span className="text-[8px] font-mono text-[#1877F2] bg-[#1877F2]/10 px-1.5 py-0.5 rounded">{ct.engagement}</span>
                    </div>
                    <p className="text-[10px] font-mono text-muted mt-1">{ct.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">Algorithme Facebook — Signaux clés</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#1877F2]">Conversations significatives</span><p className="text-[10px] font-mono text-muted mt-1">Facebook favorise les interactions entre personnes. Posts qui génèrent des commentaires longs et des discussions.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#1877F2]">Groupes &gt; Pages</span><p className="text-[10px] font-mono text-muted mt-1">Le contenu de groupes a une portée organique supérieure aux pages. Investir dans la communauté.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#1877F2]">Vidéo native</span><p className="text-[10px] font-mono text-muted mt-1">Toujours uploader directement. Les liens YouTube sont pénalisés par l'algorithme.</p></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-sm font-sans font-semibold text-text mb-2">Stratégie Groupes</h3>
                <ul className="space-y-1 text-[10px] font-mono text-muted">
                  <li>- Créer un groupe communautaire autour de la marque</li>
                  <li>- Publier 1-2 discussions/jour</li>
                  <li>- Utiliser les sondages et questions</li>
                  <li>- Modérer activement et valoriser les membres</li>
                  <li>- Contenu exclusif pour les membres du groupe</li>
                </ul>
              </div>
              <div className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-sm font-sans font-semibold text-text mb-2">Stratégie Événements</h3>
                <ul className="space-y-1 text-[10px] font-mono text-muted">
                  <li>- Webinaires et lives hebdomadaires</li>
                  <li>- Événements de lancement produit</li>
                  <li>- Meetups communautaires</li>
                  <li>- Co-hosts avec des partenaires</li>
                  <li>- Replay et highlights post-événement</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#1877F2] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#1877F2]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#1877F2] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
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
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — Facebook Community — HERALD</p>
          <span className="text-[9px] font-mono text-muted">3-5 posts/semaine — Groupes = portée — Vidéo native = boost</span>
        </div>
      </footer>
    </main>
  )
}
