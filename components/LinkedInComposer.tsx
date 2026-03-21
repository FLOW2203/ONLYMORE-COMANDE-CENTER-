'use client'

import { useState } from 'react'
import { StoryArchetype, EntityKey } from '@/types/linkedin'
import {
  ARCHETYPE_TEMPLATES,
  HASHTAG_LIBRARY,
  SLOGANS,
  HOOK_PATTERNS,
  CTA_TYPES,
  INFRA_PLAY_EXAMPLES,
  PROPRIETARY_CONCEPTS,
} from '@/lib/linkedin-strategy'

const entityColors: Record<string, string> = {
  COLHYBRI: '#00D4AA',
  'DOJUKU SHINGI': '#FF6B35',
  CROWNIUM: '#FFD700',
  'ONLYMORE FINANCE': '#7B61FF',
  'ONLYMORE Group': '#E8EAF0',
  Founder: '#0A66C2',
}

const archetypeColors: Record<StoryArchetype, string> = {
  'wound-lesson': '#ED64A6',
  'underdog-victory': '#48BB78',
  'revelation': '#ECC94B',
  'infrastructure-play': '#0A66C2',
}

export default function LinkedInComposer() {
  const [selectedArchetype, setSelectedArchetype] = useState<StoryArchetype>('wound-lesson')
  const [selectedEntity, setSelectedEntity] = useState<EntityKey>('ONLYMORE Group')
  const [sections, setSections] = useState<string[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [showExample, setShowExample] = useState(false)
  const [copied, setCopied] = useState(false)

  const template = ARCHETYPE_TEMPLATES.find((t) => t.id === selectedArchetype)!
  const entityHashtags = HASHTAG_LIBRARY[selectedEntity]
  const accentColor = archetypeColors[selectedArchetype]

  const updateSection = (index: number, value: string) => {
    const updated = [...sections]
    updated[index] = value
    setSections(updated)
  }

  const toggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter((h) => h !== tag))
    } else if (selectedHashtags.length < 5) {
      setSelectedHashtags([...selectedHashtags, tag])
    }
  }

  const fullText = sections.filter(Boolean).join('\n\n') +
    (selectedHashtags.length > 0 ? '\n\n' + selectedHashtags.join(' ') : '')

  const charCount = fullText.length
  const hashtagCount = (fullText.match(/#\w+/g) || []).length
  const hasEmDash = fullText.includes('\u2014')
  const hasExternalLink = /https?:\/\/[^\s]+/.test(fullText)
  const startsWithJe = /^(je |j')/i.test(fullText.trim())
  const hasConditional = ['pourrait', 'devrait', 'peut-\u00eatre'].some((c) => fullText.toLowerCase().includes(c))

  const handleReset = () => {
    setSections([])
    setSelectedHashtags([])
    setCopied(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Archetype Selection */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Arch\u00e9type narratif
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ARCHETYPE_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelectedArchetype(t.id); setSections([]); setSelectedHashtags([]); setShowExample(false) }}
              className="text-left p-3 rounded-xl border transition-all"
              style={{
                borderColor: selectedArchetype === t.id ? archetypeColors[t.id] : 'rgba(255,255,255,0.08)',
                backgroundColor: selectedArchetype === t.id ? archetypeColors[t.id] + '10' : 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: archetypeColors[t.id] }}
                />
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: selectedArchetype === t.id ? archetypeColors[t.id] : '#E8EAF0' }}
                >
                  {t.labelFR}
                </span>
              </div>
              <p className="text-[9px] font-mono text-muted">{t.tagline}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Archetype Context */}
      <div
        className="rounded-xl p-4 border"
        style={{ borderColor: accentColor + '30', backgroundColor: accentColor + '08' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-mono font-semibold" style={{ color: accentColor }}>
            {template.label}
          </h4>
          <button
            onClick={() => setShowExample(!showExample)}
            className="text-[9px] font-mono text-muted hover:text-text transition-colors"
          >
            {showExample ? 'Masquer' : 'Voir'} l'exemple
          </button>
        </div>
        <p className="text-[10px] font-mono text-text/60 mb-1">{template.bestFor}</p>
        {showExample && (
          <div className="mt-3 bg-white/[0.03] rounded-lg p-3 border border-border">
            <p className="text-[10px] font-mono text-muted italic whitespace-pre-wrap">
              {selectedArchetype === 'infrastructure-play' && INFRA_PLAY_EXAMPLES[selectedEntity]
                ? INFRA_PLAY_EXAMPLES[selectedEntity]
                : template.exampleAngle}
            </p>
          </div>
        )}
      </div>

      {/* Entity Selector */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Entit\u00e9 / Marque
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(HASHTAG_LIBRARY) as EntityKey[]).map((entity) => (
            <button
              key={entity}
              onClick={() => { setSelectedEntity(entity); setSelectedHashtags([]) }}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all"
              style={{
                borderColor: selectedEntity === entity ? entityColors[entity] : 'rgba(255,255,255,0.08)',
                backgroundColor: selectedEntity === entity ? entityColors[entity] + '20' : 'transparent',
                color: selectedEntity === entity ? entityColors[entity] : '#556',
              }}
            >
              {entity}
            </button>
          ))}
        </div>
      </div>

      {/* Hook Patterns Reference */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Patterns de hook
        </label>
        <div className="flex flex-wrap gap-2">
          {HOOK_PATTERNS.map((hp) => (
            <button
              key={hp.id}
              onClick={() => {
                if (!sections[0]) updateSection(0, hp.example)
              }}
              className="group px-2.5 py-1 rounded-lg text-[10px] font-mono border border-border text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
              title={hp.example}
            >
              {hp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Composer Sections */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
          Composition ({template.labelFR})
        </label>
        {template.sections.map((section, i) => (
          <div key={`${selectedArchetype}-${i}`} className="relative">
            <textarea
              value={sections[i] || ''}
              onChange={(e) => updateSection(i, e.target.value)}
              placeholder={section.placeholder}
              rows={i === 0 ? 2 : selectedArchetype === 'infrastructure-play' && i === 3 ? 4 : 3}
              className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-3 text-sm text-text font-sans placeholder:text-muted/50 focus:outline-none resize-none transition-colors"
              style={{ borderColor: sections[i] ? accentColor + '30' : undefined }}
            />
            <p className="text-[9px] font-mono text-muted mt-0.5 ml-1">{section.hint}</p>
          </div>
        ))}
      </div>

      {/* Concept Propri\u00e9taire Insert (for Infrastructure Play) */}
      {selectedArchetype === 'infrastructure-play' && (
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
            Concepts propri\u00e9taires
          </label>
          <div className="flex flex-wrap gap-2">
            {PROPRIETARY_CONCEPTS.filter(
              (c) => c.entity === selectedEntity || selectedEntity === 'ONLYMORE Group' || selectedEntity === 'Founder'
            ).map((c) => (
              <button
                key={c.entity + c.fr}
                onClick={() => {
                  const idx = template.sections.length - 2
                  const current = sections[idx] || ''
                  if (!current.includes(c.fr)) {
                    updateSection(idx, current + (current ? '\n' : '') + `${c.entity} construit l'infrastructure pour ce monde :\nle ${c.fr.toLowerCase()}.`)
                  }
                }}
                className="px-2 py-0.5 rounded text-[10px] font-mono border border-border text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-text/70">{c.entity}:</span> {c.fr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA Patterns */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Type de CTA
        </label>
        <div className="flex flex-wrap gap-2">
          {CTA_TYPES.map((cta) => (
            <button
              key={cta.type}
              onClick={() => {
                const lastIdx = template.sections.length - 1
                const current = sections[lastIdx] || ''
                if (!current) updateSection(lastIdx, cta.example)
              }}
              className="group relative px-2.5 py-1 rounded-lg text-[10px] font-mono border border-border text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
              title={`${cta.when}: ${cta.example}`}
            >
              {cta.type}
            </button>
          ))}
        </div>
      </div>

      {/* Hashtag Picker */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Hashtags ({selectedHashtags.length}/5, en fin de post)
        </label>
        <div className="space-y-2">
          {(['broad', 'niche', 'geo'] as const).map((category) => (
            <div key={category} className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono text-muted w-12">{category}</span>
              {entityHashtags[category].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleHashtag(tag)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono border transition-all"
                  style={{
                    borderColor: selectedHashtags.includes(tag) ? accentColor : 'rgba(255,255,255,0.08)',
                    backgroundColor: selectedHashtags.includes(tag) ? accentColor + '20' : 'transparent',
                    color: selectedHashtags.includes(tag) ? accentColor : '#556',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Slogan Insert */}
      {SLOGANS[selectedEntity] && (
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-muted">Tagline:</span>
          {[SLOGANS[selectedEntity].fr, SLOGANS[selectedEntity].en].map((slogan) => (
            <button
              key={slogan}
              onClick={() => {
                const lastIdx = template.sections.length - 1
                const current = sections[lastIdx] || ''
                updateSection(lastIdx, current + (current ? '\n\n' : '') + slogan)
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono border border-border text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
            >
              {slogan}
            </button>
          ))}
        </div>
      )}

      {/* Live Preview */}
      {fullText.trim() && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider">
              Aper\u00e7u
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {hasEmDash && (
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                  Em dash d\u00e9tect\u00e9
                </span>
              )}
              {startsWithJe && (
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                  Commence par "Je"
                </span>
              )}
              {hasConditional && (
                <span className="text-[9px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                  Conditionnel d\u00e9tect\u00e9
                </span>
              )}
              {hasExternalLink && (
                <span className="text-[9px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                  Lien externe
                </span>
              )}
              {hashtagCount > 5 && (
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                  {hashtagCount} hashtags (max 5)
                </span>
              )}
              <span className="text-[10px] font-mono text-muted">{charCount} car.</span>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: accentColor + '30', color: accentColor }}
              >
                FG
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-text">Florent Gibert</p>
                <p className="text-[10px] font-mono text-muted">Founder & CEO, ONLYMORE Group</p>
              </div>
              <span
                className="ml-auto text-[8px] font-mono px-2 py-0.5 rounded-full border"
                style={{ borderColor: accentColor + '40', color: accentColor }}
              >
                {template.labelFR}
              </span>
            </div>
            <div className="text-sm font-sans text-text/90 whitespace-pre-wrap leading-relaxed">
              {fullText}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          disabled={!fullText.trim()}
          className="px-4 py-2 rounded-lg text-xs font-mono transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: copied ? '#34D39930' : accentColor,
            color: copied ? '#34D399' : '#fff',
            borderColor: copied ? '#34D39950' : undefined,
            border: copied ? '1px solid' : undefined,
          }}
        >
          {copied ? 'Copi\u00e9!' : 'Copier le texte'}
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
