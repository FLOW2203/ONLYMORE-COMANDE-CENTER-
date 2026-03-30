'use client'

import { Post, Statut } from '@/types/post'
import StatusBadge from './StatusBadge'
import PlatformIcon from './PlatformIcon'

interface ListViewProps {
  posts: Post[]
  onPostClick: (post: Post) => void
}

const marqueColorInline: Record<string, string> = {
  'ONLYMORE Group': '#E8EAF0',
  'COLHYBRI': '#00D4AA',
  'CROWNIUM': '#FFD700',
  'DOJUKU SHINGI': '#FF6B35',
  'ONLYMORE FINANCE': '#7B61FF',
}

export default function ListView({ posts, onPostClick }: ListViewProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            {['Date', 'Titre', 'Marque', 'Plateforme', 'Type', 'Statut', 'Agent', 'Publié'].map((h) => (
              <th key={h} className="text-left py-3 px-3 text-[10px] font-mono text-muted uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              onClick={() => onPostClick(post)}
              className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              <td className="py-2.5 px-3 font-mono text-muted whitespace-nowrap">
                {post.datePublication?.slice(0, 10) ?? '—'}
              </td>
              <td className="py-2.5 px-3 text-text font-sans max-w-[200px] truncate">
                {post.titre || 'Sans titre'}
              </td>
              <td className="py-2.5 px-3 whitespace-nowrap">
                {post.marque && (
                  <span className="font-mono text-[10px]" style={{ color: marqueColorInline[post.marque] ?? '#E8EAF0' }}>
                    {post.marque}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-3">
                <div className="flex gap-0.5">
                  {post.plateformes.map((p) => (
                    <PlatformIcon key={p} plateforme={p} />
                  ))}
                </div>
              </td>
              <td className="py-2.5 px-3 font-mono text-muted whitespace-nowrap">{post.typeContenu || '—'}</td>
              <td className="py-2.5 px-3">
                <StatusBadge statut={post.statut as Statut} />
              </td>
              <td className="py-2.5 px-3 font-mono text-muted whitespace-nowrap">{post.agent || '—'}</td>
              <td className="py-2.5 px-3 text-center">
                {post.publie ? (
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                ) : (
                  <span className="inline-block w-2 h-2 rounded-full bg-white/10" />
                )}
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={8} className="py-12 text-center text-muted font-mono text-sm">
                Aucun post trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
