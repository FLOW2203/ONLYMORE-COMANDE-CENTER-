'use client'

import { useState } from 'react'
import { LOGO_QUALITY_CHECKS } from '@/lib/logo-data'

const categoryLabels: Record<string, { label: string; color: string }> = {
  design: { label: 'Design', color: '#D4A843' },
  brand: { label: 'Marque', color: '#0D7377' },
  technical: { label: 'Technique', color: '#7B61FF' },
  deliverables: { label: 'Livrables', color: '#00D4AA' },
}

const categories = ['design', 'brand', 'technical', 'deliverables'] as const

export default function LogoChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const totalChecks = LOGO_QUALITY_CHECKS.length
  const completedCount = Object.values(checked).filter(Boolean).length
  const progress = totalChecks > 0 ? (completedCount / totalChecks) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-wider">
            Progression
          </label>
          <span className="text-[10px] font-mono text-muted">
            {completedCount}/{totalChecks} ({Math.round(progress)}%)
          </span>
        </div>
        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: progress === 100 ? '#34D399' : '#D4A843',
            }}
          />
        </div>
        {progress === 100 && (
          <div className="mt-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
            <p className="text-xs font-mono text-green-400">Toutes les v\u00e9rifications pass\u00e9es. Logo pr\u00eat \u00e0 livrer.</p>
          </div>
        )}
      </div>

      {/* Category-grouped checks */}
      {categories.map((category) => {
        const checks = LOGO_QUALITY_CHECKS.filter((c) => c.category === category)
        const catColor = categoryLabels[category].color
        const catCompleted = checks.filter((c) => checked[c.id]).length

        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: catColor }}
              />
              <label
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: catColor }}
              >
                {categoryLabels[category].label}
              </label>
              <span className="text-[9px] font-mono text-muted ml-auto">
                {catCompleted}/{checks.length}
              </span>
            </div>
            <div className="bg-white/[0.02] border border-border rounded-xl divide-y divide-border">
              {checks.map((check) => {
                const isChecked = checked[check.id] || false

                return (
                  <button
                    key={check.id}
                    onClick={() => toggleCheck(check.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div
                      className="w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all"
                      style={{
                        borderColor: isChecked ? catColor : 'rgba(255,255,255,0.08)',
                        backgroundColor: isChecked ? catColor + '20' : 'transparent',
                      }}
                    >
                      {isChecked && (
                        <span style={{ color: catColor }} className="text-xs">&#10003;</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono transition-colors ${
                        isChecked ? 'text-text/80' : 'text-muted'
                      }`}
                    >
                      {check.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Reset */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setChecked({})}
          className="px-4 py-2 rounded-lg border border-border text-xs font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
        >
          R\u00e9initialiser la checklist
        </button>
      </div>

      {/* B&W Test Reminder */}
      <div className="bg-white/[0.02] border border-border rounded-xl p-4">
        <h4 className="text-xs font-mono text-text/80 font-semibold mb-3">Le test Noir & Blanc</h4>
        <p className="text-[11px] font-mono text-muted mb-3">Avant d'ajouter toute couleur, v\u00e9rifier:</p>
        <ul className="space-y-1.5 text-[11px] font-mono text-muted">
          <li>La silhouette est-elle lisible clairement?</li>
          <li>Le contraste est-il suffisant?</li>
          <li>Tous les \u00e9l\u00e9ments sont-ils distinguables?</li>
          <li>L'espace n\u00e9gatif fonctionne-t-il intentionnellement?</li>
        </ul>
      </div>

      {/* Presentation Tips */}
      <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-4">
        <h4 className="text-xs font-mono font-semibold text-[#D4A843] mb-3">Protocole de pr\u00e9sentation</h4>
        <ol className="space-y-1.5 text-[11px] font-mono text-text/70 list-decimal list-inside">
          <li>Rappeler le brief (ce qui a \u00e9t\u00e9 demand\u00e9)</li>
          <li>Expliquer le rationnel du design (forme, couleur, type)</li>
          <li>Montrer le logo en contexte (carte, site, app)</li>
          <li>Pr\u00e9senter les variations (couleur, N&B, revers\u00e9)</li>
          <li>Demander un feedback sp\u00e9cifique (pas "vous aimez?")</li>
          <li>Max 3 it\u00e9rations majeures avant de r\u00e9\u00e9valuer le brief</li>
        </ol>
      </div>
    </div>
  )
}
