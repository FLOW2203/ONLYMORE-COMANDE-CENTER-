'use client'

import { Post, Statut, Marque } from '@/types/post'
import StatusBadge from './StatusBadge'
import PlatformIcon from './PlatformIcon'

const marqueColors: Record<string, string> = {
  'ONLYMORE Group': 'bg-[#E8EAF0]/10 text-[#E8EAF0] border-[#E8EAF0]/20',
  'COLHYBRI': 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20',
  'CROWNIUM': 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20',
  'DOJUKU SHINGI': 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20',
  'ONLYMORE FINANCE': 'bg-[#7B61FF]/10 text-[#7B61FF] border-[#7B61FF]/20',
}

export default function PostCard({ post, compact = false, onClick }: { post: Post; compact?: boolean; onClick?: () => void }) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left p-1.5 rounded-md bg-surface border border-border hover:border-white/20 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-1 mb-0.5">
          <StatusBadge statut={post.statut as Statut} dotOnly />
          <span className="text-[10px] text-text truncate font-sans leading-tight">{post.titre || 'Sans titre'}</span>
        </div>
        <div className="flex items-center gap-0.5 flex-wrap">
          {post.marque && (
            <span className={`inline-block px-1 py-px rounded text-[8px] font-mono border ${marqueColors[post.marque] ?? 'bg-white/5 text-white/50 border-white/10'}`}>
              {post.marque.split(' ')[0]}
            </span>
          )}
          {post.plateformes.slice(0, 3).map((p) => (
            <PlatformIcon key={p} plateforme={p} />
          ))}
          {post.plateformes.length > 3 && (
            <span className="text-[8px] text-muted">+{post.plateformes.length - 3}</span>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg bg-surface border border-border hover:border-white/20 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-sans text-text font-medium">{post.titre || 'Sans titre'}</h3>
        <StatusBadge statut={post.statut as Statut} />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {post.marque && (
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${marqueColors[post.marque] ?? 'bg-white/5 text-white/50 border-white/10'}`}>
            {post.marque}
          </span>
        )}
        <div className="flex gap-1">
          {post.plateformes.map((p) => (
            <PlatformIcon key={p} plateforme={p} />
          ))}
        </div>
        {post.typeContenu && (
          <span className="text-[10px] text-muted font-mono">{post.typeContenu}</span>
        )}
      </div>
    </button>
  )
}

export function PostDetailModal({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#0a0e1a] border border-border rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text text-lg">
          ✕
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-sans text-text font-semibold mb-2">{post.titre || 'Sans titre'}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge statut={post.statut as Statut} />
            {post.marque && (
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${marqueColors[post.marque] ?? 'bg-white/5 text-white/50 border-white/10'}`}>
                {post.marque}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
            <span className="text-muted font-mono block mb-1">Date</span>
            <span className="text-text">{post.datePublication ?? '—'}</span>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
            <span className="text-muted font-mono block mb-1">Type</span>
            <span className="text-text">{post.typeContenu || '—'}</span>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
            <span className="text-muted font-mono block mb-1">Pilier</span>
            <span className="text-text">{post.pilier || '—'}</span>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-3 border border-border">
            <span className="text-muted font-mono block mb-1">Agent</span>
            <span className="text-text">{post.agent || '—'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-muted font-mono text-xs mr-2">Plateformes</span>
          {post.plateformes.map((p) => (
            <PlatformIcon key={p} plateforme={p} />
          ))}
        </div>

        {post.captionFR && (
          <div className="mb-3">
            <h4 className="text-xs font-mono text-muted mb-1">Caption FR</h4>
            <p className="text-sm text-text/80 font-sans bg-white/[0.02] rounded-lg p-3 border border-border whitespace-pre-wrap">{post.captionFR}</p>
          </div>
        )}

        {post.captionEN && (
          <div className="mb-3">
            <h4 className="text-xs font-mono text-muted mb-1">Caption EN</h4>
            <p className="text-sm text-text/80 font-sans bg-white/[0.02] rounded-lg p-3 border border-border whitespace-pre-wrap">{post.captionEN}</p>
          </div>
        )}

        {post.hashtags && (
          <div className="mb-3">
            <h4 className="text-xs font-mono text-muted mb-1">Hashtags</h4>
            <p className="text-sm text-blue-400 font-sans">{post.hashtags}</p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-border">
          {post.lienCanva && (
            <a
              href={post.lienCanva}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-finance hover:underline"
            >
              Ouvrir dans Canva →
            </a>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {post.publie && <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded">PUBLIÉ</span>}
            {post.engagement > 0 && <span className="text-[10px] font-mono text-muted">{post.engagement} engagements</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
