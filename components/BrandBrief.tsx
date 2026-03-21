'use client'

import { useState } from 'react'
import { BrandBriefData } from '@/types/logo'

const emptyBrief: BrandBriefData = {
  brandName: '',
  tagline: '',
  whatItDoes: '',
  values: '',
  audience: '',
  positioning: '',
  competitors: '',
  usage: '',
  colorPrefs: '',
  symbolPrefs: '',
  constraints: '',
}

const fields: { key: keyof BrandBriefData; label: string; placeholder: string; rows: number }[] = [
  { key: 'brandName', label: 'Nom de la marque', placeholder: 'Ex: COLHYBRI', rows: 1 },
  { key: 'tagline', label: 'Tagline / Slogan', placeholder: 'Ex: Chaque geste compte. Le v\u00f4tre aussi.', rows: 1 },
  { key: 'whatItDoes', label: 'Activit\u00e9 (une phrase)', placeholder: 'Ex: Plateforme fintech de solidarit\u00e9 digitale pour le commerce local', rows: 2 },
  { key: 'values', label: 'Valeurs (3-5)', placeholder: 'Ex: Solidarit\u00e9, Innovation, Inclusion, Proximit\u00e9, Mutualisme', rows: 2 },
  { key: 'audience', label: 'Audience cible', placeholder: 'Ex: Commer\u00e7ants locaux, citoyens engag\u00e9s, 25-55 ans, France/Europe', rows: 2 },
  { key: 'positioning', label: 'Positionnement', placeholder: 'Premium vs abordable? Traditionnel vs moderne? S\u00e9rieux vs ludique?', rows: 2 },
  { key: 'competitors', label: 'Concurrents (2-3)', placeholder: 'Qui sont les concurrents directs? \u00c0 quoi ressemblent leurs logos?', rows: 2 },
  { key: 'usage', label: 'Usages principaux', placeholder: 'Ex: App mobile, site web, cartes de visite, r\u00e9seaux sociaux', rows: 2 },
  { key: 'colorPrefs', label: 'Pr\u00e9f\u00e9rences couleurs', placeholder: 'Couleurs aim\u00e9es ou \u00e0 \u00e9viter?', rows: 1 },
  { key: 'symbolPrefs', label: 'Symboles / Styles', placeholder: 'Symboles souhait\u00e9s ou \u00e0 \u00e9viter?', rows: 1 },
  { key: 'constraints', label: 'Contraintes', placeholder: 'Budget, d\u00e9lai, doit fonctionner en N&B?', rows: 1 },
]

export default function BrandBrief() {
  const [brief, setBrief] = useState<BrandBriefData>(emptyBrief)
  const [mode, setMode] = useState<'full' | 'quick'>('full')
  const [exported, setExported] = useState(false)

  const quickFields: (keyof BrandBriefData)[] = ['brandName', 'whatItDoes', 'values', 'usage', 'colorPrefs']

  const update = (key: keyof BrandBriefData, value: string) => {
    setBrief((prev) => ({ ...prev, [key]: value }))
    setExported(false)
  }

  const filledCount = (mode === 'full' ? fields : fields.filter((f) => quickFields.includes(f.key)))
    .filter((f) => brief[f.key].trim().length > 0).length
  const totalCount = mode === 'full' ? fields.length : quickFields.length

  const exportBrief = () => {
    const lines = fields
      .filter((f) => brief[f.key].trim())
      .map((f) => `${f.label}: ${brief[f.key]}`)
    navigator.clipboard.writeText(lines.join('\n'))
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  const handleReset = () => {
    setBrief(emptyBrief)
    setExported(false)
  }

  const visibleFields = mode === 'full' ? fields : fields.filter((f) => quickFields.includes(f.key))

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setMode('full')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              mode === 'full' ? 'bg-[#D4A843]/20 text-[#D4A843]' : 'text-muted hover:text-text'
            }`}
          >
            Brief complet
          </button>
          <button
            onClick={() => setMode('quick')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
              mode === 'quick' ? 'bg-[#D4A843]/20 text-[#D4A843]' : 'text-muted hover:text-text'
            }`}
          >
            Mode rapide
          </button>
        </div>
        <span className="text-[10px] font-mono text-muted">
          {filledCount}/{totalCount} rempli
        </span>
      </div>

      {/* Info banner */}
      <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-4">
        <p className="text-[11px] font-mono text-[#D4A843]/80">
          Un logo est un actif fonctionnel. Ne jamais commencer le design sans comprendre la marque.
          {mode === 'quick' && ' Le mode rapide couvre les 5 champs essentiels.'}
        </p>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {visibleFields.map((field) => (
          <div key={field.key}>
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1.5">
              {field.label}
            </label>
            {field.rows === 1 ? (
              <input
                type="text"
                value={brief[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-2.5 text-sm text-text font-sans placeholder:text-muted/50 focus:outline-none focus:border-[#D4A843]/50 transition-colors"
              />
            ) : (
              <textarea
                value={brief[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows}
                className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-2.5 text-sm text-text font-sans placeholder:text-muted/50 focus:outline-none focus:border-[#D4A843]/50 resize-none transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      {/* Preview / Export */}
      {filledCount >= 3 && (
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
            R\u00e9sum\u00e9 du brief
          </label>
          <div className="bg-white/[0.02] border border-border rounded-xl p-4 space-y-2">
            {fields
              .filter((f) => brief[f.key].trim())
              .map((f) => (
                <div key={f.key} className="flex gap-3">
                  <span className="text-[10px] font-mono text-muted min-w-[120px]">{f.label}</span>
                  <span className="text-xs font-sans text-text/80">{brief[f.key]}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={exportBrief}
          disabled={filledCount < 3}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors ${
            exported
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-[#D4A843] text-[#050810] hover:bg-[#D4A843]/80 disabled:opacity-30 disabled:cursor-not-allowed'
          }`}
        >
          {exported ? 'Copi\u00e9!' : 'Copier le brief'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-border text-xs font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
        >
          R\u00e9initialiser
        </button>
      </div>
    </div>
  )
}
