'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/engine', label: 'Dashboard', icon: '◆' },
  { href: '/engine/queue', label: 'Queue', icon: '▶' },
  { href: '/engine/workflows', label: 'Workflows', icon: '⚙' },
  { href: '/engine/generate', label: 'Generer', icon: '✦' },
  { href: '/engine/reviews', label: 'Reputation', icon: '★' },
]

export default function EngineLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-engine-bg font-jakarta">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-engine-surface border-r border-engine-border flex flex-col z-40">
        <div className="p-5 border-b border-engine-border">
          <Link href="/engine" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <span className="text-white font-outfit font-bold text-sm">OM</span>
            </div>
            <div>
              <h1 className="font-outfit font-bold text-offwhite text-sm tracking-wide">ONLYMORE</h1>
              <p className="text-[10px] text-gold tracking-widest uppercase">Engine</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-teal/15 text-teal font-semibold'
                    : 'text-gray-400 hover:text-offwhite hover:bg-white/5'
                }`}
              >
                <span className={`text-base ${isActive ? 'text-teal' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-engine-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-offwhite transition-colors"
          >
            <span>←</span>
            <span>Social Calendar</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen">
        <div className="p-6 max-w-[1400px] mx-auto">{children}</div>
      </main>

      {/* Mobile sidebar toggle */}
      <style jsx global>{`
        @media (max-width: 768px) {
          aside { width: 100%; position: relative; }
          main { margin-left: 0; }
          .flex.min-h-screen { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}
