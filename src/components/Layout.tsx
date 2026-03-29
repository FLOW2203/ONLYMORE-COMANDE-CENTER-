import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '\u25C6' },
  { to: '/queue', label: 'Queue', icon: '\u25B6' },
  { to: '/workflows', label: 'Workflows', icon: '\u2699' },
  { to: '/generate', label: 'Generer', icon: '\u2726' },
  { to: '/reviews', label: 'Reputation', icon: '\u2605' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-engine-bg font-[family-name:var(--font-jakarta)]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-engine-surface border-r border-engine-border flex flex-col z-40 max-md:relative max-md:w-full max-md:border-r-0 max-md:border-b">
        <div className="p-5 border-b border-engine-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <span className="text-white font-[family-name:var(--font-outfit)] font-bold text-sm">OM</span>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-outfit)] font-bold text-offwhite text-sm tracking-wide m-0">ONLYMORE</h1>
              <p className="text-[10px] text-gold tracking-widest uppercase m-0">Engine</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 max-md:flex max-md:flex-row max-md:space-y-0 max-md:gap-1 max-md:overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all no-underline max-md:whitespace-nowrap ${
                  isActive
                    ? 'bg-teal/15 text-teal font-semibold'
                    : 'text-gray-400 hover:text-offwhite hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 min-h-screen max-md:ml-0">
        <div className="p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
