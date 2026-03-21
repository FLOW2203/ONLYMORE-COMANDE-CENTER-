'use client'

import { useState } from 'react'
import {
  TACTICAL_TECHNIQUES,
  PROPRIETARY_CONCEPTS,
  CTA_TYPES,
  CAROUSEL_SLIDES,
  EDITORIAL_MIX,
} from '@/lib/linkedin-strategy'

const techniqueColors: Record<string, string> = {
  'anaphore': '#0A66C2',
  'pivot-negatif': '#ED64A6',
  'concept-proprietaire': '#D4A843',
  'zero-je': '#48BB78',
  'ton-affirmatif': '#ECC94B',
  'flattery-ciblee': '#7B61FF',
}

export default function TacticalTechniques() {
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Technique Cards */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          6 techniques tactiques (Clara Gold Framework)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TACTICAL_TECHNIQUES.map((tech) => {
            const color = techniqueColors[tech.id] ?? '#0A66C2'
            const isActive = activeTechnique === tech.id

            return (
              <button
                key={tech.id}
                onClick={() => setActiveTechnique(isActive ? null : tech.id)}
                className="text-left rounded-xl border p-4 transition-all"
                style={{
                  borderColor: isActive ? color : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? color + '10' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <h4 className="text-xs font-mono font-semibold" style={{ color: isActive ? color : '#E8EAF0' }}>
                    {tech.labelFR}
                  </h4>
                </div>
                <p className="text-[10px] font-mono text-muted mb-2">{tech.description}</p>
                <p className="text-[9px] font-mono text-muted/60">{tech.usage}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Technique Detail */}
      {activeTechnique && (() => {
        const tech = TACTICAL_TECHNIQUES.find((t) => t.id === activeTechnique)!
        const color = techniqueColors[tech.id] ?? '#0A66C2'
        return (
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: color + '30', backgroundColor: color + '08' }}
          >
            <h3 className="text-sm font-sans font-semibold mb-2" style={{ color }}>
              {tech.labelFR}
            </h3>
            <p className="text-xs font-mono text-text/80 mb-3">{tech.description}</p>
            <div className="bg-white/[0.02] rounded-lg p-3 border border-border mb-3">
              <span className="text-[10px] font-mono text-muted block mb-1">Usage</span>
              <span className="text-[11px] font-mono text-text/70">{tech.usage}</span>
            </div>
            {tech.example && (
              <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
                <span className="text-[10px] font-mono text-muted block mb-1">Exemple</span>
                <pre className="text-[11px] font-mono text-text/70 whitespace-pre-wrap">{tech.example}</pre>
              </div>
            )}
          </div>
        )
      })()}

      {/* Proprietary Concepts */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Concepts propri\u00e9taires par entit\u00e9
        </label>
        <div className="bg-white/[0.02] border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2 text-muted text-[10px] uppercase">Entit\u00e9</th>
                <th className="text-left px-4 py-2 text-muted text-[10px] uppercase">FR</th>
                <th className="text-left px-4 py-2 text-muted text-[10px] uppercase">EN</th>
              </tr>
            </thead>
            <tbody>
              {PROPRIETARY_CONCEPTS.map((c) => (
                <tr key={c.entity} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 text-text/80 font-semibold">{c.entity}</td>
                  <td className="px-4 py-2 text-[#D4A843]">{c.fr}</td>
                  <td className="px-4 py-2 text-muted">{c.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Types */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Types de CTA
        </label>
        <div className="space-y-2">
          {CTA_TYPES.map((cta) => (
            <div key={cta.type} className="flex items-start gap-3 px-4 py-3 bg-white/[0.02] border border-border rounded-lg">
              <div className="min-w-[130px]">
                <span className="text-xs font-mono text-text/80 font-semibold">{cta.type}</span>
                <p className="text-[9px] font-mono text-muted">{cta.when}</p>
              </div>
              <span className="text-[11px] font-mono text-text/60 italic">"{cta.example}"</span>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Framework */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Framework carrousel (8-12 slides)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CAROUSEL_SLIDES.map((slide) => (
            <div
              key={slide.number}
              className="bg-white/[0.02] border border-border rounded-lg p-3 text-center"
            >
              <span className="text-lg font-sans font-bold text-[#0A66C2]/60">{slide.number}</span>
              <p className="text-[9px] font-mono text-muted mt-1">{slide.purpose}</p>
              <p className="text-[8px] font-mono text-muted/50 mt-0.5">max {slide.maxWords} mots</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-lg p-3">
          <p className="text-[10px] font-mono text-[#0A66C2]/70">
            Chaque slide: max 25 mots. Police lisible. Contraste fort.
          </p>
        </div>
      </div>

      {/* Editorial Mix */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Mix \u00e9ditorial recommand\u00e9 (3 posts/semaine)
        </label>
        <div className="flex gap-3">
          {Object.values(EDITORIAL_MIX).map((mix) => (
            <div
              key={mix.label}
              className="flex-1 bg-white/[0.02] border border-border rounded-xl p-4 text-center"
            >
              <span className="text-2xl font-sans font-bold text-text">{mix.pct}%</span>
              <p className="text-[10px] font-mono text-muted mt-1">{mix.label}</p>
              <p className="text-[9px] font-mono text-muted/50">Arch\u00e9type {mix.archetypes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
