'use client'

import { useState } from 'react'
import { QUALITY_CHECKS, ALGORITHM_SIGNALS } from '@/lib/linkedin-strategy'

const weightColors: Record<string, { bg: string; text: string; border: string }> = {
  HIGH: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  MEDIUM: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  NEGATIVE: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
}

export default function QualityChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [postText, setPostText] = useState('')

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = Object.values(checked).filter(Boolean).length
  const totalChecks = QUALITY_CHECKS.length

  const autoResults = QUALITY_CHECKS.reduce<Record<string, boolean | null>>((acc, check) => {
    acc[check.id] = check.validate && postText.trim() ? check.validate(postText) : null
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Optional Auto-Check Input */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Coller le texte pour vérification automatique (optionnel)
        </label>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Collez votre post LinkedIn ici pour une analyse automatique..."
          rows={4}
          className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-3 text-sm text-text font-sans placeholder:text-muted/50 focus:outline-none focus:border-[#0A66C2]/50 resize-none transition-colors"
        />
        {postText.trim() && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-mono text-muted">{postText.length} caractères</span>
            <span className="text-[10px] font-mono text-muted">
              {(postText.match(/#\w+/g) || []).length} hashtags
            </span>
            {postText.includes('\u2014') && (
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                Em dash (\u2014) détecté!
              </span>
            )}
            {/https?:\/\/[^\s]+/.test(postText) && (
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                Lien externe détecté
              </span>
            )}
          </div>
        )}
      </div>

      {/* Manual Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] font-mono text-muted uppercase tracking-wider">
            Checklist qualité
          </label>
          <span className="text-[10px] font-mono text-muted">
            {completedCount}/{totalChecks} vérifié
          </span>
        </div>
        <div className="bg-white/[0.02] border border-border rounded-xl divide-y divide-border">
          {QUALITY_CHECKS.map((check) => {
            const autoResult = autoResults[check.id]
            const isChecked = checked[check.id] || false
            const hasAutoFail = autoResult === false
            const hasAutoPass = autoResult === true

            return (
              <button
                key={check.id}
                onClick={() => toggleCheck(check.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                    hasAutoFail
                      ? 'border-red-500 bg-red-500/20'
                      : hasAutoPass
                        ? 'border-green-500 bg-green-500/20'
                        : isChecked
                          ? 'border-[#0A66C2] bg-[#0A66C2]/20'
                          : 'border-border'
                  }`}
                >
                  {hasAutoFail && <span className="text-red-400 text-xs">!</span>}
                  {hasAutoPass && <span className="text-green-400 text-xs">&#10003;</span>}
                  {!hasAutoFail && !hasAutoPass && isChecked && (
                    <span className="text-[#0A66C2] text-xs">&#10003;</span>
                  )}
                </div>
                <span
                  className={`text-xs font-mono transition-colors ${
                    hasAutoFail
                      ? 'text-red-400'
                      : hasAutoPass || isChecked
                        ? 'text-text/80'
                        : 'text-muted'
                  }`}
                >
                  {check.label}
                </span>
              </button>
            )
          })}
        </div>
        {completedCount === totalChecks && (
          <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
            <p className="text-xs font-mono text-green-400">Toutes les vérifications sont passées. Prêt à publier.</p>
          </div>
        )}
      </div>

      {/* Algorithm Signals */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Signaux algorithme LinkedIn 2026
        </label>
        <div className="space-y-2">
          {ALGORITHM_SIGNALS.map((signal) => {
            const colors = weightColors[signal.weight]
            return (
              <div
                key={signal.signal}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${colors.bg} ${colors.border}`}
              >
                <span className={`text-[10px] font-mono font-bold uppercase ${colors.text} min-w-[60px]`}>
                  {signal.weight}
                </span>
                <div className="flex-1">
                  <span className="text-xs font-mono text-text/80">{signal.signal}</span>
                  <p className="text-[10px] font-mono text-muted mt-0.5">{signal.tip}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Formatting Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <h4 className="text-xs font-mono font-semibold text-red-400 mb-3">Interdit</h4>
          <ul className="space-y-1.5 text-[11px] font-mono text-text/60">
            <li>Pas de tirets longs (\u2014)</li>
            <li>Pas plus de 5 hashtags</li>
            <li>Pas d'engagement bait ("Comment YES...")</li>
            <li>Pas de filler AI générique</li>
            <li>Pas de mass tagging</li>
          </ul>
        </div>
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <h4 className="text-xs font-mono font-semibold text-green-400 mb-3">Obligatoire</h4>
          <ul className="space-y-1.5 text-[11px] font-mono text-text/60">
            <li>Hook dans les 2 premières lignes</li>
            <li>Paragraphes courts (1-3 phrases)</li>
            <li>Espaces entre paragraphes</li>
            <li>Un seul CTA en fin de post</li>
            <li>Format natif (liens en commentaire)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
