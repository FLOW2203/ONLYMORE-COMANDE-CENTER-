'use client'

import Link from 'next/link'

const platforms = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: 'in',
    desc: 'B2B, thought leadership, networking pro',
    href: '/linkedin',
    features: ['Posts', 'Articles', 'Carrousels', 'Newsletters'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#FF0050',
    icon: '♪',
    desc: 'Contenu viral, Gen Z, format court',
    href: '/herald/tiktok',
    features: ['Scripts', 'Trends', 'Séries', 'Duets'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    icon: '◎',
    desc: 'Visuel, lifestyle, Reels & Stories',
    href: '/herald/instagram',
    features: ['Reels', 'Carrousels', 'Stories', 'Guides'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    icon: 'f',
    desc: 'Communauté, groupes, événements',
    href: '/herald/facebook',
    features: ['Posts', 'Groupes', 'Events', 'Lives'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    icon: '▶',
    desc: 'Contenu long, tutoriels, SEO vidéo',
    href: '/herald/youtube',
    features: ['Scripts', 'SEO', 'Shorts', 'Thumbnails'],
  },
  {
    id: 'x',
    name: 'X / Twitter',
    color: '#9BA3AF',
    icon: '𝕏',
    desc: 'Actualités, threads, conversations',
    href: '/herald/x',
    features: ['Tweets', 'Threads', 'Spaces', 'Sondages'],
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#FFFFFF',
    icon: '@',
    desc: 'Conversations authentiques, communauté',
    href: '/herald/threads',
    features: ['Posts', 'Réponses', 'Cross-post IG'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#E60023',
    icon: '📌',
    desc: 'Inspiration visuelle, trafic web, SEO',
    href: '/herald/pinterest',
    features: ['Épingles', 'Tableaux', 'Idea Pins'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    icon: '✆',
    desc: 'Messaging direct, newsletters',
    href: '/herald/whatsapp',
    features: ['Templates', 'Newsletters', 'Catalogues'],
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    color: '#FFFC00',
    icon: '👻',
    desc: 'Contenu éphémère, AR, Gen Z',
    href: '/herald/snapchat',
    features: ['Snaps', 'Spotlight', 'Lenses AR'],
  },
]

export default function HeraldPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs font-mono text-muted hover:text-text transition-colors">
                ← Calendrier
              </Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  HERALD <span className="text-[#00D4AA]">Social Media</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">
                  Hub d'Engagement et de Répartition des Actions sur les Leviers Digitaux — 10 plateformes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/osint"
                className="text-[9px] font-mono text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/20 px-2 py-1 rounded hover:bg-[#FF6B35]/20 transition-colors"
              >
                OSINT Prospector
              </Link>
              <Link
                href="/linkedin"
                className="text-[9px] font-mono text-[#0A66C2] bg-[#0A66C2]/10 border border-[#0A66C2]/20 px-2 py-1 rounded hover:bg-[#0A66C2]/20 transition-colors"
              >
                LinkedIn Strategy
              </Link>
              <Link
                href="/logo"
                className="text-[9px] font-mono text-[#D4A843] bg-[#D4A843]/10 border border-[#D4A843]/20 px-2 py-1 rounded hover:bg-[#D4A843]/20 transition-colors"
              >
                Logo Creator
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Platform Grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-sans font-bold text-text">10</span>
            <span className="text-[10px] font-mono text-muted leading-tight">plateformes<br />connectées</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-sans font-bold text-[#00D4AA]">HERALD</span>
            <span className="text-[10px] font-mono text-muted">Orchestrateur v1.0</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-3">
            {platforms.map((p) => (
              <span
                key={p.id}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {platforms.map((platform) => (
            <Link
              key={platform.id}
              href={platform.href}
              className="group relative border border-border rounded-xl p-5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 hover:border-opacity-30"
              style={{ '--platform-color': platform.color } as React.CSSProperties}
            >
              {/* Color accent */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-40 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: platform.color }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mb-3 border"
                style={{
                  backgroundColor: `${platform.color}15`,
                  borderColor: `${platform.color}30`,
                  color: platform.color,
                }}
              >
                {platform.icon}
              </div>

              {/* Info */}
              <h3 className="text-sm font-sans font-semibold text-text mb-1">{platform.name}</h3>
              <p className="text-[10px] font-mono text-muted mb-3 leading-relaxed">{platform.desc}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {platform.features.map((f) => (
                  <span
                    key={f}
                    className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: `${platform.color}20`,
                      color: `${platform.color}CC`,
                      backgroundColor: `${platform.color}08`,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <div className="absolute bottom-4 right-4 text-xs text-muted group-hover:text-text transition-colors">
                →
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-xs font-mono text-muted mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-border rounded-lg p-4 bg-white/[0.02]">
              <h3 className="text-sm font-sans font-semibold text-text mb-1">Campagne cross-platform</h3>
              <p className="text-[10px] font-mono text-muted">Créer un message adapté pour toutes les plateformes en une seule fois</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-white/[0.02]">
              <h3 className="text-sm font-sans font-semibold text-text mb-1">Calendrier éditorial</h3>
              <p className="text-[10px] font-mono text-muted">Planifier et synchroniser les publications sur toutes les plateformes</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-white/[0.02]">
              <h3 className="text-sm font-sans font-semibold text-text mb-1">Audit social media</h3>
              <p className="text-[10px] font-mono text-muted">Analyser la présence actuelle et identifier les opportunités</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted">
            ONLYMORE Group — HERALD Social Media Orchestrator v1.0
          </p>
          <div className="flex items-center gap-4 text-[9px] font-mono text-muted">
            <span>10 plateformes</span>
            <span>Stratégie unifiée</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
