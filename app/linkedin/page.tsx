'use client'

import { useState } from 'react'
import LinkedInComposer from '@/components/LinkedInComposer'
import HashtagHelper from '@/components/HashtagHelper'
import QualityChecklist from '@/components/QualityChecklist'
import Link from 'next/link'

type Tab = 'composer' | 'hashtags' | 'checklist'

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: 'composer', label: 'Compositeur', description: 'Créer un post LinkedIn avec les templates approuvés' },
  { id: 'hashtags', label: 'Hashtags & SEO', description: 'Bibliothèque de hashtags et clusters sémantiques' },
  { id: 'checklist', label: 'Qualité & Algo', description: 'Checklist pré-publication et signaux algorithme' },
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
                ← Calendrier
              </Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  LinkedIn <span className="text-[#0A66C2]">Strategy</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">
                  TEAM HERALD — Content & Copywriting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-muted bg-white/[0.03] border border-border px-2 py-1 rounded">
                Florent Gibert
              </span>
              <span className="text-[9px] font-mono text-muted bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-2 py-1 rounded text-[#0A66C2]">
                Founder & CEO
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-xs font-mono transition-colors ${
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
        {/* Tab description */}
        <p className="text-xs font-mono text-muted mb-6">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>

        {activeTab === 'composer' && <LinkedInComposer />}
        {activeTab === 'hashtags' && <HashtagHelper />}
        {activeTab === 'checklist' && <QualityChecklist />}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted">
            ONLYMORE Group — LinkedIn Content Strategy 2026
          </p>
          <div className="flex items-center gap-4 text-[9px] font-mono text-muted">
            <span>3-4 posts/semaine</span>
            <span>Mar-Jeu, 8h-9h ou 17h-18h</span>
            <span>Occitanie/France</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
