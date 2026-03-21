'use client'

import { useState } from 'react'
import LinkedInComposer from '@/components/LinkedInComposer'
import HashtagHelper from '@/components/HashtagHelper'
import TacticalTechniques from '@/components/TacticalTechniques'
import CommentStrategy from '@/components/CommentStrategy'
import QualityChecklist from '@/components/QualityChecklist'
import Link from 'next/link'

type Tab = 'composer' | 'techniques' | 'comments' | 'hashtags' | 'checklist'

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: 'composer', label: 'Compositeur', description: 'Cr\u00e9er un post avec les 4 arch\u00e9types narratifs (Blessure, Underdog, R\u00e9v\u00e9lation, Infrastructure Play)' },
  { id: 'techniques', label: 'Techniques', description: 'Anaphore, Pivot N\u00e9gatif, Concept Propri\u00e9taire, Z\u00e9ro-Je, Ton Affirmatif, Flattery Cibl\u00e9e' },
  { id: 'comments', label: 'Commentaires', description: 'Strat\u00e9gie de commentaire pour visibilit\u00e9, networking et positionnement' },
  { id: 'hashtags', label: 'Hashtags & SEO', description: 'Biblioth\u00e8que de hashtags et clusters s\u00e9mantiques par entit\u00e9' },
  { id: 'checklist', label: 'Qualit\u00e9 & Algo', description: 'Checklist v2.0 pr\u00e9-publication et signaux algorithme 2026' },
]

export default function LinkedInStrategyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('composer')

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-xs font-mono text-muted hover:text-text transition-colors"
              >
                \u2190 Calendrier
              </Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  LinkedIn <span className="text-[#0A66C2]">Copywriter</span>
                  <span className="text-[9px] font-mono text-muted ml-2">v2.0</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">
                  TEAM HERALD \u2014 4 Story Archetypes + Clara Gold Framework
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/logo"
                className="text-[9px] font-mono text-[#D4A843] bg-[#D4A843]/10 border border-[#D4A843]/20 px-2 py-1 rounded hover:bg-[#D4A843]/20 transition-colors"
              >
                Logo Creator
              </Link>
              <span className="text-[9px] font-mono text-muted bg-white/[0.03] border border-border px-2 py-1 rounded">
                Florent Gibert
              </span>
              <span className="text-[9px] font-mono text-[#0A66C2] bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-2 py-1 rounded">
                Founder & CEO
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#0A66C2]/20 text-[#0A66C2]'
                    : 'text-muted hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>

        {activeTab === 'composer' && <LinkedInComposer />}
        {activeTab === 'techniques' && <TacticalTechniques />}
        {activeTab === 'comments' && <CommentStrategy />}
        {activeTab === 'hashtags' && <HashtagHelper />}
        {activeTab === 'checklist' && <QualityChecklist />}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between flex-wrap gap-2">
          <p className="text-[9px] font-mono text-muted">
            ONLYMORE Group \u2014 LinkedIn Copywriter v2.0 \u2014 Clara Gold Framework
          </p>
          <div className="flex items-center gap-4 text-[9px] font-mono text-muted">
            <span>3 posts/semaine min</span>
            <span>40% personnel / 30% thought / 30% product</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
