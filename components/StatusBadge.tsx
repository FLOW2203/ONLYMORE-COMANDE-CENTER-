'use client'

import { Statut } from '@/types/post'

const statusColors: Record<Statut, string> = {
  'Idée': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'En rédaction': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Visuel en cours': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Prêt à publier': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Publié': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Archivé': 'bg-red-500/20 text-red-300 border-red-500/30',
}

const statusDots: Record<Statut, string> = {
  'Idée': 'bg-gray-400',
  'En rédaction': 'bg-blue-400',
  'Visuel en cours': 'bg-purple-400',
  'Prêt à publier': 'bg-yellow-400',
  'Publié': 'bg-green-400',
  'Archivé': 'bg-red-400',
}

export default function StatusBadge({ statut, dotOnly = false }: { statut: Statut; dotOnly?: boolean }) {
  if (dotOnly) {
    return <span className={`inline-block w-2 h-2 rounded-full ${statusDots[statut] ?? 'bg-gray-400'}`} title={statut} />
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${statusColors[statut] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[statut] ?? 'bg-gray-400'}`} />
      {statut}
    </span>
  )
}
