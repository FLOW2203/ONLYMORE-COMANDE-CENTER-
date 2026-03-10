'use client'

import { useMemo } from 'react'
import { Post } from '@/types/post'
import PostCard from './PostCard'

interface CalendarViewProps {
  posts: Post[]
  currentDate: Date
  onPostClick: (post: Post) => void
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

function getStartPadding(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday start
}

export default function CalendarView({ posts, currentDate, onPostClick }: CalendarViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const days = useMemo(() => getDaysInMonth(year, month), [year, month])
  const startPadding = useMemo(() => getStartPadding(year, month), [year, month])

  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {}
    for (const post of posts) {
      if (post.datePublication) {
        const key = post.datePublication.slice(0, 10)
        if (!map[key]) map[key] = []
        map[key].push(post)
      }
    }
    return map
  }, [posts])

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="w-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-[10px] font-mono text-muted uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {/* Empty cells for padding */}
        {Array.from({ length: startPadding }).map((_, i) => (
          <div key={`pad-${i}`} className="min-h-[100px] bg-white/[0.01] rounded-lg" />
        ))}

        {/* Day cells */}
        {days.map((date) => {
          const key = date.toISOString().slice(0, 10)
          const dayPosts = postsByDate[key] ?? []
          const isToday = key === today

          return (
            <div
              key={key}
              className={`min-h-[100px] p-1.5 rounded-lg border transition-colors ${
                isToday
                  ? 'border-finance/40 bg-finance/[0.03]'
                  : 'border-border bg-white/[0.01] hover:bg-white/[0.02]'
              }`}
            >
              <div className={`text-[11px] font-mono mb-1 ${isToday ? 'text-finance font-bold' : 'text-muted'}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayPosts.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} compact onClick={() => onPostClick(post)} />
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-[9px] text-muted font-mono text-center">
                    +{dayPosts.length - 3} autres
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
