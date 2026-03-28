'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { PublishQueueItem } from '@/types/engine'
import Link from 'next/link'

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  instagram: '#E1306C',
  google_business: '#4285F4',
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  published: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  queued: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  publishing: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  failed: { bg: 'bg-red-500/15', text: 'text-red-400' },
  cancelled: { bg: 'bg-gray-500/15', text: 'text-gray-400' },
}

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(now.setDate(diff))
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export default function EngineDashboard() {
  const [items, setItems] = useState<PublishQueueItem[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQueue()
    const channel = supabase
      .channel('queue-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'publish_queue' }, () => {
        fetchQueue()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchQueue() {
    setLoading(true)
    const { data } = await supabase
      .from('publish_queue')
      .select('*, merchants(*)')
      .order('scheduled_at', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const days: { date: Date; items: PublishQueueItem[] }[] = []

    for (let i = -startOffset; i <= lastDay.getDate() + (6 - ((lastDay.getDay() + 6) % 7)); i++) {
      const date = new Date(year, month, i + 1)
      const dateStr = date.toISOString().slice(0, 10)
      const dayItems = items.filter((it) => it.scheduled_at?.slice(0, 10) === dateStr)
      days.push({ date, items: dayItems })
    }
    return days
  }, [items, year, month])

  const weekRange = getWeekRange()
  const weekItems = items.filter((it) => {
    const d = new Date(it.scheduled_at)
    return d >= weekRange.start && d <= weekRange.end
  })

  const publishedThisWeek = weekItems.filter((it) => it.status === 'published').length
  const failedThisWeek = weekItems.filter((it) => it.status === 'failed').length
  const successRate = weekItems.length > 0
    ? Math.round((publishedThisWeek / weekItems.length) * 100)
    : 0

  const isCurrentMonth = (date: Date) => date.getMonth() === month
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10)
  }

  const monthNames = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-offwhite">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vue calendrier des publications planifiees</p>
        </div>
        <Link
          href="/engine/generate"
          className="px-4 py-2 bg-teal hover:bg-teal/80 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          + Nouveau Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-engine-surface border border-engine-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Cette semaine</p>
          <p className="text-2xl font-outfit font-bold text-offwhite mt-1">{weekItems.length}</p>
          <p className="text-xs text-gray-500">posts planifies</p>
        </div>
        <div className="bg-engine-surface border border-engine-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Publies</p>
          <p className="text-2xl font-outfit font-bold text-emerald-400 mt-1">{publishedThisWeek}</p>
          <p className="text-xs text-gray-500">cette semaine</p>
        </div>
        <div className="bg-engine-surface border border-engine-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Taux de succes</p>
          <p className="text-2xl font-outfit font-bold text-teal mt-1">{successRate}%</p>
          <p className="text-xs text-gray-500">publications reussies</p>
        </div>
        <div className="bg-engine-surface border border-engine-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">En echec</p>
          <p className="text-2xl font-outfit font-bold text-red-400 mt-1">{failedThisWeek}</p>
          <p className="text-xs text-gray-500">a verifier</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-engine-surface border border-engine-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-engine-border">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="text-gray-400 hover:text-offwhite transition-colors px-2 py-1"
          >
            ←
          </button>
          <h2 className="font-outfit font-semibold text-offwhite">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="text-gray-400 hover:text-offwhite transition-colors px-2 py-1"
          >
            →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-engine-border">
          {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 py-2 font-medium">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`min-h-[90px] p-2 border-b border-r border-engine-border ${
                !isCurrentMonth(day.date) ? 'opacity-30' : ''
              } ${isToday(day.date) ? 'bg-teal/5' : ''}`}
            >
              <p className={`text-xs mb-1 ${
                isToday(day.date) ? 'text-teal font-bold' : 'text-gray-500'
              }`}>
                {day.date.getDate()}
              </p>
              <div className="space-y-0.5">
                {day.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 group cursor-pointer"
                    title={item.content.slice(0, 100)}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PLATFORM_COLORS[item.platform] || '#666' }}
                    />
                    <span className="text-[10px] text-gray-400 truncate group-hover:text-offwhite transition-colors">
                      {item.content.slice(0, 25)}
                    </span>
                  </div>
                ))}
                {day.items.length > 3 && (
                  <p className="text-[10px] text-gray-500">+{day.items.length - 3} autres</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500 text-sm py-4">Chargement...</div>
      )}
    </div>
  )
}
