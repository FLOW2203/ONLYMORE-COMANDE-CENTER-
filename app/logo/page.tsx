'use client'

import { useState } from 'react'
import BrandBrief from '@/components/BrandBrief'
import LogoTypeSelector from '@/components/LogoTypeSelector'
import ColorPsychology from '@/components/ColorPsychology'
import LogoChecklist from '@/components/LogoChecklist'
import Link from 'next/link'

type Tab = 'brief' | 'type' | 'colors' | 'checklist'

const tabs: { id: Tab; label: string; description: string }[] = [
  { id: 'brief', label: 'Brand Brief', description: 'D\u00e9finir l\'identit\u00e9, les valeurs, l\'audience et les pr\u00e9f\u00e9rences de la marque' },
  { id: 'type', label: 'Type & Outils', description: 'Choisir le type de logo, les outils et les variations requises' },
  { id: 'colors', label: 'Couleurs & Design', description: 'Psychologie des couleurs, principes de design et construction g\u00e9om\u00e9trique' },
  { id: 'checklist', label: 'Checklist', description: 'V\u00e9rification qualit\u00e9 avant livraison du logo final' },
]

export default function LogoCreatorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('brief')

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
                  Logo <span className="text-[#D4A843]">Creator</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">
                  TEAM ALPHA \u2014 Professional Logo Design Workflow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/linkedin"
                className="text-[9px] font-mono text-[#0A66C2] bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-2 py-1 rounded hover:bg-[#0A66C2]/20 transition-colors"
              >
                LinkedIn Strategy
              </Link>
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
                    ? 'bg-[#D4A843]/20 text-[#D4A843]'
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

        {activeTab === 'brief' && <BrandBrief />}
        {activeTab === 'type' && <LogoTypeSelector />}
        {activeTab === 'colors' && <ColorPsychology />}
        {activeTab === 'checklist' && <LogoChecklist />}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted">
            ONLYMORE Group \u2014 Logo Creator Workflow
          </p>
          <div className="flex items-center gap-4 text-[9px] font-mono text-muted">
            <span>Brief \u2192 Type \u2192 Design \u2192 Quality Gate</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
