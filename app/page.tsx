'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Post } from '@/types/post'
import CalendarView from '@/components/CalendarView'
import ListView from '@/components/ListView'
import FilterBar from '@/components/FilterBar'
import { PostDetailModal } from '@/components/PostCard'

type Period = 'week' | 'month' | 'all'

const marqueColorInline: Record<string, string> = {
  'ONLYMORE Group': '#E8EAF0',
  'COLHYBRI': '#00D4AA',
  'CROWNIUM': '#FFD700',
  'DOJUKU SHINGI': '#FF6B35',
  'ONLYMORE FINANCE': '#7B61FF',
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // Filters
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [period, setPeriod] = useState<Period>('month')
  const [selectedMarques, setSelectedMarques] = useState<string[]>([])
  const [selectedPlateformes, setSelectedPlateformes] = useState<string[]>([])
  const [selectedStatuts, setSelectedStatuts] = useState<string[]>([])

  // Calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date())

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
        setLastSync(new Date())
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let result = posts

    if (selectedMarques.length > 0) {
      result = result.filter((p) => selectedMarques.includes(p.marque))
    }
    if (selectedPlateformes.length > 0) {
      result = result.filter((p) => p.plateformes.some((pl) => selectedPlateformes.includes(pl)))
    }
    if (selectedStatuts.length > 0) {
      result = result.filter((p) => selectedStatuts.includes(p.statut))
    }

    if (period !== 'all') {
      const now = new Date()
      if (period === 'week') {
        const startOfWeek = new Date(now)
        const day = startOfWeek.getDay()
        const diff = day === 0 ? 6 : day - 1
        startOfWeek.setDate(startOfWeek.getDate() - diff)
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 7)
        result = result.filter((p) => {
          if (!p.datePublication) return false
          const d = new Date(p.datePublication)
          return d >= startOfWeek && d < endOfWeek
        })
      } else {
        const y = currentDate.getFullYear()
        const m = currentDate.getMonth()
        const start = new Date(y, m, 1)
        const end = new Date(y, m + 1, 1)
        result = result.filter((p) => {
          if (!p.datePublication) return false
          const d = new Date(p.datePublication)
          return d >= start && d < end
        })
      }
    }

    return result
  }, [posts, selectedMarques, selectedPlateformes, selectedStatuts, period, currentDate])

  // Stats
  const stats = useMemo(() => {
    const now = new Date()
    const monthPosts = posts.filter((p) => {
      if (!p.datePublication) return false
      const d = new Date(p.datePublication)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const published = monthPosts.filter((p) => p.publie).length
    const pending = monthPosts.filter((p) => !p.publie).length

    const byMarque: Record<string, number> = {}
    for (const p of monthPosts) {
      if (p.marque) byMarque[p.marque] = (byMarque[p.marque] ?? 0) + 1
    }

    return { total: monthPosts.length, published, pending, byMarque }
  }, [posts])

  const monthLabel = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                ONLYMORE <span className="text-muted font-normal">Social Calendar</span>
              </h1>
              <p className="text-[10px] font-mono text-muted mt-0.5">
                Calendrier éditorial — Source: Notion
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastSync && (
                <span className="text-[10px] font-mono text-muted">
                  Sync: {lastSync.toLocaleTimeString('fr-FR')}
                </span>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono text-text transition-colors disabled:opacity-50"
              >
                <span className={loading ? 'animate-spin' : ''}>↻</span>
                Sync Notion
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-sans font-bold text-text">{stats.total}</span>
              <span className="text-[10px] font-mono text-muted leading-tight">posts<br />ce mois</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-sans font-bold text-green-400">{stats.published}</span>
              <span className="text-[10px] font-mono text-muted">publiés</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-sans font-bold text-yellow-400">{stats.pending}</span>
              <span className="text-[10px] font-mono text-muted">en attente</span>
            </div>
            <div className="w-px h-8 bg-border" />
            {/* Mini brand breakdown */}
            <div className="flex items-center gap-3">
              {Object.entries(stats.byMarque).map(([marque, count]) => (
                <div key={marque} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: marqueColorInline[marque] ?? '#E8EAF0' }}
                  />
                  <span className="text-[10px] font-mono text-muted">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-4">
        {/* Filters */}
        <FilterBar
          selectedMarques={selectedMarques}
          setSelectedMarques={setSelectedMarques}
          selectedPlateformes={selectedPlateformes}
          setSelectedPlateformes={setSelectedPlateformes}
          selectedStatuts={selectedStatuts}
          setSelectedStatuts={setSelectedStatuts}
          period={period}
          setPeriod={setPeriod}
          view={view}
          setView={setView}
        />

        {/* Calendar navigation */}
        {view === 'calendar' && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="px-3 py-1 rounded-lg border border-border text-xs font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
            >
              ← Précédent
            </button>
            <h2 className="text-sm font-sans font-medium text-text capitalize">{monthLabel}</h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="px-3 py-1 rounded-lg border border-border text-xs font-mono text-muted hover:text-text hover:bg-white/[0.03] transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* Content */}
        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin text-2xl mb-2">↻</div>
              <p className="text-xs font-mono text-muted">Chargement depuis Notion...</p>
            </div>
          </div>
        ) : view === 'calendar' ? (
          <CalendarView posts={filteredPosts} currentDate={currentDate} onPostClick={setSelectedPost} />
        ) : (
          <ListView posts={filteredPosts} onPostClick={setSelectedPost} />
        )}
      </div>

      {/* Modal */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </main>
  )
}
