'use client'

import { useState } from 'react'
import { LinkedInPostType, EntityKey } from '@/types/linkedin'
import { POST_TEMPLATES, HASHTAG_LIBRARY, SLOGANS } from '@/lib/linkedin-strategy'

const entityColors: Record<string, string> = {
  COLHYBRI: '#00D4AA',
  'DOJUKU SHINGI': '#FF6B35',
  CROWNIUM: '#FFD700',
  'ONLYMORE FINANCE': '#7B61FF',
  'ONLYMORE Group': '#E8EAF0',
  Founder: '#0A66C2',
}

export default function LinkedInComposer() {
  const [selectedType, setSelectedType] = useState<LinkedInPostType>('thought-leadership')
  const [selectedEntity, setSelectedEntity] = useState<EntityKey>('ONLYMORE Group')
  const [sections, setSections] = useState<string[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])

  const template = POST_TEMPLATES.find((t) => t.id === selectedType)!
  const entityHashtags = HASHTAG_LIBRARY[selectedEntity]

  const updateSection = (index: number, value: string) => {
    const updated = [...sections]
    updated[index] = value
    setSections(updated)
  }

  const toggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter((h) => h !== tag))
    } else if (selectedHashtags.length < 3) {
      setSelectedHashtags([...selectedHashtags, tag])
    }
  }

  const fullText = sections.filter(Boolean).join('\n\n') + (selectedHashtags.length > 0 ? '\n\n' + selectedHashtags.join(' ') : '')

  const charCount = fullText.length
  const hashtagCount = (fullText.match(/#\w+/g) || []).length
  const hasEmDash = fullText.includes('\u2014')
  const hasExternalLink = /https?:\/\/[^\s]+/.test(fullText)

  const handleReset = () => {
    setSections([])
    setSelectedHashtags([])
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText)
  }

  return (
    <div className="space-y-6">
      {/* Template & Entity Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Post Type */}
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
            Type de post
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POST_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedType(t.id); setSections([]); setSelectedHashtags([]) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  selectedType === t.id
                    ? 'bg-[#0A66C2]/20 border-[#0A66C2] text-[#0A66C2]'
                    : 'border-border text-muted hover:text-text hover:bg-white/[0.03]'
                }`}
              >
                {t.labelFR}
              </button>
            ))}
          </div>
        </div>

        {/* Entity */}
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
            Entité / Marque
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
      </div>

      {/* Composer Sections */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
          Composition ({template.labelFR})
        </label>
        {template.sections.map((section, i) => (
          <div key={`${selectedType}-${i}`} className="relative">
            <textarea
              value={sections[i] || ''}
              onChange={(e) => updateSection(i, e.target.value)}
              placeholder={section.placeholder}
              rows={i === 0 ? 2 : 3}
              className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-3 text-sm text-text font-sans placeholder:text-muted/50 focus:outline-none focus:border-[#0A66C2]/50 resize-none transition-colors"
            />
            <p className="text-[9px] font-mono text-muted mt-0.5 ml-1">{section.hint}</p>
          </div>
        ))}
      </div>

      {/* Hashtag Picker */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Hashtags ({selectedHashtags.length}/3)
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono text-muted w-12">Broad</span>
            {entityHashtags.broad.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleHashtag(tag)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  selectedHashtags.includes(tag)
                    ? 'bg-[#0A66C2]/20 border-[#0A66C2] text-[#0A66C2]'
                    : 'border-border text-muted hover:text-text'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono text-muted w-12">Niche</span>
            {entityHashtags.niche.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleHashtag(tag)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  selectedHashtags.includes(tag)
                    ? 'bg-[#0A66C2]/20 border-[#0A66C2] text-[#0A66C2]'
                    : 'border-border text-muted hover:text-text'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono text-muted w-12">Geo</span>
            {entityHashtags.geo.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleHashtag(tag)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                  selectedHashtags.includes(tag)
                    ? 'bg-[#0A66C2]/20 border-[#0A66C2] text-[#0A66C2]'
                    : 'border-border text-muted hover:text-text'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slogan Insert */}
      {SLOGANS[selectedEntity] && (
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-muted">Tagline:</span>
          <button
            onClick={() => {
              const lastIdx = template.sections.length - 1
              const current = sections[lastIdx] || ''
              updateSection(lastIdx, current + (current ? '\n\n' : '') + SLOGANS[selectedEntity].fr)
            }}
            className="px-2 py-0.5 rounded text-[10px] font-mono border border-border text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
          >
            {SLOGANS[selectedEntity].fr}
          </button>
          <button
            onClick={() => {
              const lastIdx = template.sections.length - 1
              const current = sections[lastIdx] || ''
              updateSection(lastIdx, current + (current ? '\n\n' : '') + SLOGANS[selectedEntity].en)
            }}
            className="px-2 py-0.5 rounded text-[10px] font-mono border border-border text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
          >
            {SLOGANS[selectedEntity].en}
          </button>
        </div>
      )}

      {/* Live Preview */}
      {fullText.trim() && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider">
              Aperçu
            </label>
            <div className="flex items-center gap-3">
              {/* Inline warnings */}
              {hasEmDash && (
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                  Em dash détecté
                </span>
              )}
              {hasExternalLink && (
                <span className="text-[9px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                  Lien externe détecté
                </span>
              )}
              {hashtagCount > 3 && (
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                  {hashtagCount} hashtags (max 3)
                </span>
              )}
              <span className="text-[10px] font-mono text-muted">{charCount} car.</span>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-border rounded-xl p-5">
            {/* Simulated LinkedIn header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0A66C2]/30 flex items-center justify-center text-[#0A66C2] text-sm font-bold">
                FG
              </div>
              <div>
                <p className="text-sm font-sans font-semibold text-text">Florent Gibert</p>
                <p className="text-[10px] font-mono text-muted">Founder & CEO, ONLYMORE Group</p>
              </div>
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
          className="px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-xs font-mono hover:bg-[#0A66C2]/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Copier le texte
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-border text-xs font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
