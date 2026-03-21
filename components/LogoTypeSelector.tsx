'use client'

import { useState } from 'react'
import { LogoType } from '@/types/logo'
import { LOGO_TYPES, LOGO_VARIATIONS, TOOL_DECISION, SIZE_GUIDE } from '@/lib/logo-data'

export default function LogoTypeSelector() {
  const [selectedType, setSelectedType] = useState<LogoType | null>(null)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const questions = [
    { id: 'short-name', question: 'Le nom de marque est-il court et distinctif (2-3 syllabes)?', yes: 'wordmark' as LogoType },
    { id: 'long-name', question: 'Le nom comporte-t-il 3+ mots?', yes: 'lettermark' as LogoType },
    { id: 'character', question: 'La marque a-t-elle besoin d\'un personnage/mascotte?', yes: 'mascot' as LogoType },
    { id: 'heritage', question: 'Le prestige et l\'h\u00e9ritage sont-ils importants?', yes: 'emblem' as LogoType },
    { id: 'global', question: 'La marque op\u00e8re-t-elle \u00e0 l\'international / multilingue?', yes: 'abstract' as LogoType },
    { id: 'new-brand', question: 'Est-ce une nouvelle marque qui a besoin de notori\u00e9t\u00e9?', yes: 'combination' as LogoType },
  ]

  const toggleAnswer = (id: string) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const recommendation = (() => {
    for (const q of questions) {
      if (answers[q.id]) return q.yes
    }
    return 'combination' as LogoType
  })()

  const activeType = selectedType ?? recommendation
  const typeInfo = LOGO_TYPES.find((t) => t.id === activeType)

  return (
    <div className="space-y-6">
      {/* Type Cards */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Les 7 types de logo
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {LOGO_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                activeType === type.id
                  ? 'bg-[#D4A843]/10 border-[#D4A843]/40'
                  : 'bg-white/[0.02] border-border hover:border-white/20'
              }`}
            >
              <h4
                className={`text-sm font-sans font-semibold mb-1 ${
                  activeType === type.id ? 'text-[#D4A843]' : 'text-text'
                }`}
              >
                {type.label}
              </h4>
              <p className="text-[10px] font-mono text-muted mb-2">{type.description}</p>
              <p className="text-[9px] font-mono text-muted/70">{type.examples}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {typeInfo && (
        <div className="bg-white/[0.02] border border-border rounded-xl p-5">
          <h3 className="text-base font-sans font-semibold text-[#D4A843] mb-2">{typeInfo.label}</h3>
          <p className="text-sm font-sans text-text/80 mb-3">{typeInfo.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
              <span className="text-muted font-mono text-[10px] block mb-1">Id\u00e9al pour</span>
              <span className="text-xs text-text/80 font-sans">{typeInfo.bestFor}</span>
            </div>
            <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
              <span className="text-muted font-mono text-[10px] block mb-1">Exemples</span>
              <span className="text-xs text-text/80 font-sans">{typeInfo.examples}</span>
            </div>
          </div>
        </div>
      )}

      {/* Decision Helper */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Assistant de s\u00e9lection
        </label>
        <div className="bg-white/[0.02] border border-border rounded-xl divide-y divide-border">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => toggleAnswer(q.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div
                className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                  answers[q.id]
                    ? 'border-[#D4A843] bg-[#D4A843]/20'
                    : 'border-border'
                }`}
              >
                {answers[q.id] && <span className="text-[#D4A843] text-xs">&#10003;</span>}
              </div>
              <span className={`text-xs font-mono ${answers[q.id] ? 'text-text' : 'text-muted'}`}>
                {q.question}
              </span>
              <span
                className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded border border-border"
                style={{
                  color: answers[q.id] ? '#D4A843' : '#556',
                  borderColor: answers[q.id] ? '#D4A84360' : undefined,
                  backgroundColor: answers[q.id] ? '#D4A84315' : undefined,
                }}
              >
                {LOGO_TYPES.find((t) => t.id === q.yes)?.label}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[10px] font-mono text-muted mt-2">
          Recommandation: <span className="text-[#D4A843]">{LOGO_TYPES.find((t) => t.id === recommendation)?.label}</span>
          {!Object.values(answers).some(Boolean) && ' (par d\u00e9faut: Combination Mark, le plus versatile)'}
        </p>
      </div>

      {/* Tool Decision */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Quel outil utiliser?
        </label>
        <div className="space-y-2">
          {TOOL_DECISION.map((tool) => (
            <div
              key={tool.tool}
              className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-border rounded-lg"
            >
              <span className="text-xs font-sans text-text/80 flex-1">{tool.condition}</span>
              <span className="text-[10px] font-mono text-[#D4A843] bg-[#D4A843]/10 border border-[#D4A843]/20 px-2 py-0.5 rounded">
                {tool.tool}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Variations Required */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Variations requises (syst\u00e8me responsive)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {LOGO_VARIATIONS.map((v) => (
            <div key={v.name} className="bg-white/[0.02] border border-border rounded-lg p-3">
              <h5 className="text-xs font-mono text-text/80 font-semibold mb-1">{v.name}</h5>
              <p className="text-[10px] font-mono text-muted">{v.useCase}</p>
              <p className="text-[9px] font-mono text-muted/60 mt-1">{v.specs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Size Guide */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Guide des tailles d'export
        </label>
        <div className="bg-white/[0.02] border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2 text-muted text-[10px] uppercase">Contexte</th>
                <th className="text-left px-4 py-2 text-muted text-[10px] uppercase">Taille</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((s) => (
                <tr key={s.context} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 text-text/80">{s.context}</td>
                  <td className="px-4 py-2 text-muted">{s.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
