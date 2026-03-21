'use client'

import { useState } from 'react'
import { COMMENT_STRUCTURE, COMMENT_DONTS } from '@/lib/linkedin-strategy'

export default function CommentStrategy() {
  const [commentSections, setCommentSections] = useState<string[]>(['', '', ''])
  const [copied, setCopied] = useState(false)

  const updateSection = (idx: number, value: string) => {
    const updated = [...commentSections]
    updated[idx] = value
    setCommentSections(updated)
  }

  const fullComment = commentSections.filter(Boolean).join('\n')
  const hasEmDash = fullComment.includes('\u2014')

  const handleCopy = () => {
    navigator.clipboard.writeText(fullComment)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Comment Objectives */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Objectifs d'un commentaire
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Visibilit\u00e9', desc: 'Top comments d\'un post viral' },
            { label: 'Networking', desc: 'Pont vers l\'auteur du post' },
            { label: 'Positionnement', desc: 'Montrer l\'expertise ONLYMORE' },
            { label: 'Redirection', desc: 'Ramener vers COLHYBRI/etc.' },
          ].map((obj) => (
            <div key={obj.label} className="bg-white/[0.02] border border-border rounded-lg p-3 text-center">
              <span className="text-xs font-mono text-[#0A66C2] font-semibold">{obj.label}</span>
              <p className="text-[9px] font-mono text-muted mt-1">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Structure */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Structure d'un bon commentaire
        </label>
        <div className="bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-xl p-4 space-y-2">
          {COMMENT_STRUCTURE.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#0A66C2] text-xs font-mono font-bold min-w-[20px]">{i + 1}.</span>
              <span className="text-[11px] font-mono text-text/70">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Composer */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
          Composer un commentaire
        </label>
        {[
          { placeholder: 'Valider le point central du post (pas "super post !")', hint: 'Reformuler en montrant que vous avez lu et compris' },
          { placeholder: 'Perspective unique, exemple personnel', hint: 'Connecter \u00e0 l\'exp\u00e9rience ONLYMORE naturellement' },
          { placeholder: 'Question ou ouverture vers l\'auteur', hint: 'Cr\u00e9er un pont pour continuer la conversation' },
        ].map((section, i) => (
          <div key={i}>
            <textarea
              value={commentSections[i]}
              onChange={(e) => updateSection(i, e.target.value)}
              placeholder={section.placeholder}
              rows={2}
              className="w-full bg-white/[0.02] border border-border rounded-lg px-4 py-3 text-sm text-text font-sans placeholder:text-muted/50 focus:outline-none focus:border-[#0A66C2]/50 resize-none transition-colors"
            />
            <p className="text-[9px] font-mono text-muted mt-0.5 ml-1">{section.hint}</p>
          </div>
        ))}
      </div>

      {/* Comment Preview */}
      {fullComment.trim() && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider">
              Aper\u00e7u commentaire
            </label>
            <div className="flex items-center gap-3">
              {hasEmDash && (
                <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                  Em dash d\u00e9tect\u00e9
                </span>
              )}
              <span className="text-[10px] font-mono text-muted">{fullComment.length} car.</span>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0A66C2]/30 flex items-center justify-center text-[#0A66C2] text-[10px] font-bold">
                FG
              </div>
              <div>
                <p className="text-xs font-sans font-semibold text-text">Florent Gibert</p>
                <p className="text-[9px] font-mono text-muted">Founder & CEO, ONLYMORE Group</p>
              </div>
            </div>
            <div className="text-sm font-sans text-text/90 whitespace-pre-wrap leading-relaxed pl-10">
              {fullComment}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          disabled={!fullComment.trim()}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-[#0A66C2] text-white hover:bg-[#0A66C2]/80'
          }`}
        >
          {copied ? 'Copi\u00e9!' : 'Copier le commentaire'}
        </button>
        <button
          onClick={() => setCommentSections(['', '', ''])}
          className="px-4 py-2 rounded-lg border border-border text-xs font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
        >
          R\u00e9initialiser
        </button>
      </div>

      {/* Example Comment */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-2">
          Exemple de commentaire (sur un post Clara Gold / Trust Graph)
        </label>
        <div className="bg-white/[0.02] border border-border rounded-xl p-4">
          <p className="text-[11px] font-mono text-text/70 whitespace-pre-wrap leading-relaxed">La confiance comme seule ressource rare, c'est exactement le shift qu'on observe dans le commerce local.
Quand les algorithmes peuvent tout atteindre, seul le lien de quartier reste non-r\u00e9plicable.
C'est pour \u00e7a qu'on construit COLHYBRI : l'infra de solidarit\u00e9 locale, pas de reach.
Clara, est-ce que Gigi adresse aussi les micro-communaut\u00e9s physiques ?</p>
        </div>
      </div>

      {/* Don'ts */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
        <h4 className="text-xs font-mono font-semibold text-red-400 mb-3">Ce qu'il faut \u00e9viter</h4>
        <ul className="space-y-1.5">
          {COMMENT_DONTS.map((item, i) => (
            <li key={i} className="text-[11px] font-mono text-text/60 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
