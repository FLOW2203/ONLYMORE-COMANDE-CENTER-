import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { PublishQueueItem } from '@/types/engine'

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  instagram: '#E1306C',
  google_business: '#4285F4',
}

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const start = new Date(now)
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export default function Dashboard() {
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
  const isToday = (date: Date) => date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)

  const monthNames = ['Janvier','Fevrier','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Decembre']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-offwhite m-0">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vue calendrier des publications planifiees</p>
        </div>
        <Link
          to="/generate"
          className="px-4 py-2 bg-teal hover:bg-teal/80 text-white rounded-lg text-sm font-semibold transition-colors no-underline"
        >
          + Nouveau Post
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cette semaine', value: weekItems.length, sub: 'posts planifies', color: 'text-offwhite' },
          { label: 'Publies', value: publishedThisWeek, sub: 'cette semaine', color: 'text-emerald-400' },
          { label: 'Taux de succes', value: `${successRate}%`, sub: 'publications reussies', color: 'text-teal' },
          { label: 'En echec', value: failedThisWeek, sub: 'a verifier', color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="bg-engine-surface border border-engine-border rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider m-0">{s.label}</p>
            <p className={`text-2xl font-[family-name:var(--font-outfit)] font-bold ${s.color} mt-1 m-0`}>{s.value}</p>
            <p className="text-xs text-gray-500 m-0">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-engine-surface border border-engine-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-engine-border">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="text-gray-400 hover:text-offwhite transition-colors px-2 py-1 bg-transparent border-none cursor-pointer text-base">
            &larr;
          </button>
          <h2 className="font-[family-name:var(--font-outfit)] font-semibold text-offwhite m-0 text-base">
            {monthNames[month]} {year}
          </h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="text-gray-400 hover:text-offwhite transition-colors px-2 py-1 bg-transparent border-none cursor-pointer text-base">
            &rarr;
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-engine-border">
          {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d) => (
            <div key={d} className="text-center text-xs text-gray-500 py-2 font-medium">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`min-h-[90px] p-2 border-b border-r border-engine-border ${
                !isCurrentMonth(day.date) ? 'opacity-30' : ''
              } ${isToday(day.date) ? 'bg-teal/5' : ''}`}
            >
              <p className={`text-xs mb-1 m-0 ${isToday(day.date) ? 'text-teal font-bold' : 'text-gray-500'}`}>
                {day.date.getDate()}
              </p>
              <div className="space-y-0.5">
                {day.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-1 group cursor-pointer" title={item.content.slice(0, 100)}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[item.platform] || '#666' }} />
                    <span className="text-[10px] text-gray-400 truncate group-hover:text-offwhite transition-colors">
                      {item.content.slice(0, 25)}
                    </span>
                  </div>
                ))}
                {day.items.length > 3 && (
                  <p className="text-[10px] text-gray-500 m-0">+{day.items.length - 3} autres</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="text-center text-gray-500 text-sm py-4">Chargement...</div>}
    </div>
  )
}
