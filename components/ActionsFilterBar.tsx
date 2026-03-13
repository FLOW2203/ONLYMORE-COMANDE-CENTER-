'use client'

import { FILIALES, CATEGORIES, STATUTS, filialeColors, categorieColors } from '@/lib/actions'

const statutColors: Record<string, string> = {
  '✅': '#34D399',
  '🔄': '#60A5FA',
  '📅': '#FBBF24',
}

interface ActionsFilterBarProps {
  selectedFiliales: string[]
  setSelectedFiliales: (v: string[]) => void
  selectedCategories: string[]
  setSelectedCategories: (v: string[]) => void
  selectedStatuts: string[]
  setSelectedStatuts: (v: string[]) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
}

export default function ActionsFilterBar({
  selectedFiliales, setSelectedFiliales,
  selectedCategories, setSelectedCategories,
  selectedStatuts, setSelectedStatuts,
  searchQuery, setSearchQuery,
}: ActionsFilterBarProps) {
  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item])
  }

  const hasFilters = selectedFiliales.length > 0 || selectedCategories.length > 0 || selectedStatuts.length > 0 || searchQuery.length > 0

  return (
    <div className="space-y-3 p-4 bg-surface border border-border rounded-xl">
      {/* Row 1: Search + Clear */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une action..."
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-white/[0.03] text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
        {hasFilters && (
          <button
            onClick={() => {
              setSelectedFiliales([])
              setSelectedCategories([])
              setSelectedStatuts([])
              setSearchQuery('')
            }}
            className="px-3 py-1.5 rounded-lg border border-border text-[10px] font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
          >
            Effacer filtres
          </button>
        )}
      </div>

      {/* Row 2: Filiales */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider min-w-[60px]">Filiale</span>
        {FILIALES.map((f) => (
          <button
            key={f}
            onClick={() => toggleItem(selectedFiliales, f, setSelectedFiliales)}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all"
            style={{
              borderColor: selectedFiliales.includes(f) ? filialeColors[f] : 'rgba(255,255,255,0.08)',
              backgroundColor: selectedFiliales.includes(f) ? filialeColors[f] + '20' : 'transparent',
              color: selectedFiliales.includes(f) ? filialeColors[f] : '#556',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Row 3: Catégories */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider min-w-[60px]">Catégorie</span>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => toggleItem(selectedCategories, c, setSelectedCategories)}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all"
            style={{
              borderColor: selectedCategories.includes(c) ? categorieColors[c] : 'rgba(255,255,255,0.08)',
              backgroundColor: selectedCategories.includes(c) ? categorieColors[c] + '20' : 'transparent',
              color: selectedCategories.includes(c) ? categorieColors[c] : '#556',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Row 4: Statuts */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider min-w-[60px]">Statut</span>
        {STATUTS.map((s) => (
          <button
            key={s.emoji}
            onClick={() => toggleItem(selectedStatuts, s.emoji, setSelectedStatuts)}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all flex items-center gap-1"
            style={{
              borderColor: selectedStatuts.includes(s.emoji) ? statutColors[s.emoji] : 'rgba(255,255,255,0.08)',
              backgroundColor: selectedStatuts.includes(s.emoji) ? statutColors[s.emoji] + '20' : 'transparent',
              color: selectedStatuts.includes(s.emoji) ? statutColors[s.emoji] : '#556',
            }}
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
