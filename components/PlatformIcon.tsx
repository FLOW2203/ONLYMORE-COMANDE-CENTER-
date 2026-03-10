'use client'

import { Plateforme } from '@/types/post'

const platformConfig: Record<Plateforme, { color: string; icon: string }> = {
  'Facebook': { color: '#1877F2', icon: 'f' },
  'Instagram': { color: '#E1306C', icon: 'IG' },
  'TikTok': { color: '#69C9D0', icon: 'TT' },
  'LinkedIn': { color: '#0A66C2', icon: 'in' },
  'X/Twitter': { color: '#9CA3AF', icon: 'X' },
  'YouTube': { color: '#FF0000', icon: 'YT' },
  'Threads': { color: '#9CA3AF', icon: '@' },
  'Discord': { color: '#5865F2', icon: 'DC' },
}

export default function PlatformIcon({ plateforme }: { plateforme: Plateforme }) {
  const config = platformConfig[plateforme] ?? { color: '#9CA3AF', icon: '?' }

  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-[8px] font-mono font-bold"
      style={{ backgroundColor: config.color + '30', color: config.color }}
      title={plateforme}
    >
      {config.icon}
    </span>
  )
}
