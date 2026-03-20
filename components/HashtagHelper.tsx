'use client'

import { useState } from 'react'
import { EntityKey } from '@/types/linkedin'
import { HASHTAG_LIBRARY, SEMANTIC_CLUSTERS } from '@/lib/linkedin-strategy'

const entityColors: Record<string, string> = {
  COLHYBRI: '#00D4AA',
  'DOJUKU SHINGI': '#FF6B35',
  CROWNIUM: '#FFD700',
  'ONLYMORE FINANCE': '#7B61FF',
  'ONLYMORE Group': '#E8EAF0',
  Founder: '#0A66C2',
}

export default function HashtagHelper() {
  const [activeEntity, setActiveEntity] = useState<EntityKey | null>(null)

  return (
    <div className="space-y-6">
      {/* Rules Summary */}
      <div className="bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-xl p-4">
        <h4 className="text-xs font-mono font-semibold text-[#0A66C2] mb-3">Règles Hashtag 2026</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-text/70">
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">+</span>
            <span>2 à 3 hashtags par post (sweet spot)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">+</span>
            <span>0 hashtags acceptable en commentaire</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">+</span>
            <span>Mix 1 broad + 1-2 niche</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">+</span>
            <span>Placer en fin de post</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">-</span>
            <span>Jamais plus de 5 (spam detection)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 mt-0.5">-</span>
            <span>Varier les sets entre les posts</span>
          </div>
        </div>
      </div>

      {/* Entity Selector */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Bibliothèque par entité
        </label>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(Object.keys(HASHTAG_LIBRARY) as EntityKey[]).map((entity) => (
            <button
              key={entity}
              onClick={() => setActiveEntity(activeEntity === entity ? null : entity)}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all"
              style={{
                borderColor: activeEntity === entity ? entityColors[entity] : 'rgba(255,255,255,0.08)',
                backgroundColor: activeEntity === entity ? entityColors[entity] + '20' : 'transparent',
                color: activeEntity === entity ? entityColors[entity] : '#556',
              }}
            >
              {entity}
            </button>
          ))}
        </div>

        {/* Entity Hashtags */}
        {activeEntity && (
          <div className="bg-white/[0.02] border border-border rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-sans font-medium text-text">{activeEntity}</h4>
            <div className="space-y-2">
              {(['broad', 'niche', 'geo'] as const).map((category) => (
                <div key={category} className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-mono text-muted uppercase w-12">{category}</span>
                  {HASHTAG_LIBRARY[activeEntity][category].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono border border-border text-text/80 bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors"
                      onClick={() => navigator.clipboard.writeText(tag)}
                      title="Cliquer pour copier"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Library Grid */}
        {!activeEntity && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(HASHTAG_LIBRARY) as [EntityKey, typeof HASHTAG_LIBRARY[EntityKey]][]).map(([entity, tags]) => (
              <div
                key={entity}
                className="bg-white/[0.02] border border-border rounded-lg p-3 hover:border-white/20 transition-colors cursor-pointer"
                onClick={() => setActiveEntity(entity)}
              >
                <h5
                  className="text-xs font-mono font-semibold mb-2"
                  style={{ color: entityColors[entity] }}
                >
                  {entity}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {[...tags.broad, ...tags.niche.slice(0, 2)].map((tag) => (
                    <span key={tag} className="text-[9px] font-mono text-muted bg-white/[0.03] px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO/GEO Context */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Clusters sémantiques (SEO/GEO)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(SEMANTIC_CLUSTERS).map(([cluster, keywords]) => (
            <div key={cluster} className="bg-white/[0.02] border border-border rounded-lg p-3">
              <h5 className="text-[10px] font-mono text-text/80 font-semibold mb-2">{cluster}</h5>
              <div className="flex flex-wrap gap-1">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[9px] font-mono text-muted bg-white/[0.03] px-1.5 py-0.5 rounded cursor-pointer hover:text-text transition-colors"
                    onClick={() => navigator.clipboard.writeText(kw)}
                    title="Cliquer pour copier"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Hashtags Matter */}
      <div className="bg-white/[0.02] border border-border rounded-xl p-4">
        <h4 className="text-xs font-mono text-text/80 font-semibold mb-2">Pourquoi garder les hashtags?</h4>
        <ul className="space-y-1.5 text-[11px] font-mono text-muted">
          <li>SEO: Mots-clés pour le moteur de recherche interne LinkedIn</li>
          <li>GEO: LinkedIn indexé par LLMs (ChatGPT, Perplexity, Gemini). Usage cohérent renforce la reconnaissance d'entité</li>
          <li>Cohérence: #COLHYBRI + #fintech entraîne les systèmes AI à associer ONLYMORE Group à ces sujets</li>
          <li>Cross-platform: Google indexe les posts LinkedIn. Les hashtags contribuent aux snippets SERP</li>
          <li>+30% d'engagement avec des hashtags stratégiques vs. sans hashtags</li>
        </ul>
      </div>
    </div>
  )
}
