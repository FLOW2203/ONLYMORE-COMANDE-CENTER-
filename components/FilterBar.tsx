'use client'

import { Marque, Plateforme, Statut } from '@/types/post'

const allMarques: Marque[] = ['ONLYMORE Group', 'COLHYBRI', 'CROWNIUM', 'DOJUKU SHINGI', 'ONLYMORE FINANCE']
const allPlateformes: Plateforme[] = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'X/Twitter', 'YouTube', 'Threads', 'Discord']
const allStatuts: Statut[] = ['Idée', 'En rédaction', 'Visuel en cours', 'Prêt à publier', 'Publié', 'Archivé']

const marqueColorMap: Record<string, string> = {
  'ONLYMORE Group': '#E8EAF0',
  'COLHYBRI': '#00D4AA',
  'CROWNIUM': '#FFD700',
  'DOJUKU SHINGI': '#FF6B35',
  'ONLYMORE FINANCE': '#7B61FF',
}

const platformColorMap: Record<string, string> = {
  'Facebook': '#1877F2',
  'Instagram': '#E1306C',
  'TikTok': '#69C9D0',
  'LinkedIn': '#0A66C2',
  'X/Twitter': '#9CA3AF',
  'YouTube': '#FF0000',
  'Threads': '#9CA3AF',
  'Discord': '#5865F2',
}

const statutColorMap: Record<string, string> = {
  'Idée': '#9CA3AF',
  'En rédaction': '#60A5FA',
  'Visuel en cours': '#A78BFA',
  'Prêt à publier': '#FBBF24',
  'Publié': '#34D399',
  'Archivé': '#F87171',
}

type Period = 'week' | 'month' | 'all'

interface FilterBarProps {
  selectedMarques: string[]
  setSelectedMarques: (v: string[]) => void
  selectedPlateformes: string[]
  setSelectedPlateformes: (v: string[]) => void
  selectedStatuts: string[]
  setSelectedStatuts: (v: string[]) => void
  period: Period
  setPeriod: (v: Period) => void
  view: 'calendar' | 'list'
  setView: (v: 'calendar' | 'list') => void
}

export default function FilterBar({
  selectedMarques, setSelectedMarques,
  selectedPlateformes, setSelectedPlateformes,
  selectedStatuts, setSelectedStatuts,
  period, setPeriod,
  view, setView,
}: FilterBarProps) {
  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item])
  }

  return (
    <div className="space-y-3 p-4 bg-surface border border-border rounded-xl">
      {/* Row 1: View toggle + Period */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border">
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${view === 'calendar' ? 'bg-white/10 text-text' : 'text-muted hover:text-text'}`}
          >
            Calendrier
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${view === 'list' ? 'bg-white/10 text-text' : 'text-muted hover:text-text'}`}
          >
            Liste
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border">
          {(['week', 'month', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${period === p ? 'bg-white/10 text-text' : 'text-muted hover:text-text'}`}
            >
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Tout'}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Marques */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Marque</span>
        {allMarques.map((m) => (
          <button
            key={m}
            onClick={() => toggleItem(selectedMarques, m, setSelectedMarques)}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all"
            style={{
              borderColor: selectedMarques.includes(m) ? marqueColorMap[m] : 'rgba(255,255,255,0.08)',
              backgroundColor: selectedMarques.includes(m) ? marqueColorMap[m] + '20' : 'transparent',
              color: selectedMarques.includes(m) ? marqueColorMap[m] : '#556',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Row 3: Plateformes */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Plateforme</span>
        {allPlateformes.map((p) => (
          <button
            key={p}
            onClick={() => toggleItem(selectedPlateformes, p, setSelectedPlateformes)}
            className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-mono font-bold border transition-all"
            style={{
              borderColor: selectedPlateformes.includes(p) ? platformColorMap[p] : 'rgba(255,255,255,0.08)',
              backgroundColor: selectedPlateformes.includes(p) ? platformColorMap[p] + '30' : 'transparent',
              color: selectedPlateformes.includes(p) ? platformColorMap[p] : '#556',
            }}
            title={p}
          >
            {p[0]}
          </button>
        ))}
      </div>

      {/* Row 4: Statuts */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Statut</span>
        {allStatuts.map((s) => (
          <button
            key={s}
            onClick={() => toggleItem(selectedStatuts, s, setSelectedStatuts)}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all flex items-center gap-1"
            style={{
              borderColor: selectedStatuts.includes(s) ? statutColorMap[s] : 'rgba(255,255,255,0.08)',
              backgroundColor: selectedStatuts.includes(s) ? statutColorMap[s] + '20' : 'transparent',
              color: selectedStatuts.includes(s) ? statutColorMap[s] : '#556',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statutColorMap[s] }} />
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
