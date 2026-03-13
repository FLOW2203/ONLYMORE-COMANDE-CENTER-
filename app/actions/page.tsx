'use client'

import { useState, useMemo } from 'react'
import { Action } from '@/types/action'
import { ACTIONS, filialeColors } from '@/lib/actions'
import ActionsFilterBar from '@/components/ActionsFilterBar'
import ActionsTable from '@/components/ActionsTable'

export default function ActionsPage() {
  // State: all 53 actions loaded from static data
  const [actions] = useState<Action[]>(ACTIONS)

  // Filter state
  const [selectedFiliales, setSelectedFiliales] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuts, setSelectedStatuts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<'date' | 'filiale'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // Filtered + sorted actions
  const filteredActions = useMemo(() => {
    let result = actions

    if (selectedFiliales.length > 0) {
      result = result.filter((a) => selectedFiliales.includes(a.filiale))
    }
    if (selectedCategories.length > 0) {
      result = result.filter((a) => selectedCategories.includes(a.categorie))
    }
    if (selectedStatuts.length > 0) {
      result = result.filter((a) => selectedStatuts.includes(a.statut))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) =>
        a.titre.toLowerCase().includes(q) ||
        a.filiale.toLowerCase().includes(q) ||
        a.categorie.toLowerCase().includes(q)
      )
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortField === 'date') {
        const cmp = a.date.localeCompare(b.date)
        return sortDir === 'desc' ? -cmp : cmp
      }
      const cmp = a.filiale.localeCompare(b.filiale)
      return sortDir === 'desc' ? -cmp : cmp
    })

    return result
  }, [actions, selectedFiliales, selectedCategories, selectedStatuts, searchQuery, sortField, sortDir])

  // Stats
  const stats = useMemo(() => {
    const total = actions.length
    const done = actions.filter((a) => a.statut === '✅').length
    const inProgress = actions.filter((a) => a.statut === '🔄').length
    const planned = actions.filter((a) => a.statut === '📅').length

    const byFiliale: Record<string, { total: number; done: number }> = {}
    for (const a of actions) {
      if (!byFiliale[a.filiale]) byFiliale[a.filiale] = { total: 0, done: 0 }
      byFiliale[a.filiale].total++
      if (a.statut === '✅') byFiliale[a.filiale].done++
    }

    const byCategorie: Record<string, number> = {}
    for (const a of actions) {
      byCategorie[a.categorie] = (byCategorie[a.categorie] ?? 0) + 1
    }

    return { total, done, inProgress, planned, byFiliale, byCategorie }
  }, [actions])

  const completionRate = Math.round((stats.done / stats.total) * 100)

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                ONLYMORE <span className="text-muted font-normal">Commande Center</span>
              </h1>
              <p className="text-[10px] font-mono text-muted mt-0.5">
                Suivi des actions — 5 filiales, {stats.total} actions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="px-3 py-1.5 rounded-lg border border-border bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono text-muted hover:text-text transition-colors"
              >
                Social Calendar
              </a>
              <div className="flex items-center gap-1.5 bg-white/[0.03] rounded-lg p-0.5 border border-border">
                <button
                  onClick={() => { setSortField('date'); setSortDir(sortDir === 'desc' ? 'asc' : 'desc') }}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${sortField === 'date' ? 'bg-white/10 text-text' : 'text-muted hover:text-text'}`}
                >
                  Date {sortField === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </button>
                <button
                  onClick={() => { setSortField('filiale'); setSortDir(sortDir === 'desc' ? 'asc' : 'desc') }}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${sortField === 'filiale' ? 'bg-white/10 text-text' : 'text-muted hover:text-text'}`}
                >
                  Filiale {sortField === 'filiale' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-sans font-bold text-text">{stats.total}</span>
              <span className="text-[10px] font-mono text-muted leading-tight">actions<br />totales</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-sans font-bold text-green-400">✅ {stats.done}</span>
              <span className="text-[10px] font-mono text-muted">terminées</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-sans font-bold text-blue-400">🔄 {stats.inProgress}</span>
              <span className="text-[10px] font-mono text-muted">en cours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-sans font-bold text-yellow-400">📅 {stats.planned}</span>
              <span className="text-[10px] font-mono text-muted">planifiées</span>
            </div>
            <div className="w-px h-8 bg-border" />
            {/* Completion bar */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-green-400">{completionRate}%</span>
            </div>
            <div className="w-px h-8 bg-border" />
            {/* Mini filiale breakdown */}
            <div className="flex items-center gap-3">
              {Object.entries(stats.byFiliale).map(([filiale, data]) => (
                <div key={filiale} className="flex items-center gap-1" title={`${filiale}: ${data.done}/${data.total}`}>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: filialeColors[filiale] ?? '#E8EAF0' }}
                  />
                  <span className="text-[10px] font-mono text-muted">{data.done}/{data.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-4">
        {/* Filters */}
        <ActionsFilterBar
          selectedFiliales={selectedFiliales}
          setSelectedFiliales={setSelectedFiliales}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedStatuts={selectedStatuts}
          setSelectedStatuts={setSelectedStatuts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-muted">
            {filteredActions.length} action{filteredActions.length !== 1 ? 's' : ''} affichée{filteredActions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Table */}
        <ActionsTable actions={filteredActions} />
      </div>
    </main>
  )
}
