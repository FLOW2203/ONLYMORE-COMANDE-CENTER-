import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050810',
        surface: 'rgba(255,255,255,0.03)',
        border: 'rgba(255,255,255,0.08)',
        text: '#E8EAF0',
        muted: '#556',
        colhybri: '#00D4AA',
        crownium: '#FFD700',
        dojuku: '#FF6B35',
        finance: '#7B61FF',
        onlymore: '#E8EAF0',
        facebook: '#1877F2',
        instagram: '#E1306C',
        linkedin: '#0A66C2',
        twitter: '#14171A',
        youtube: '#FF0000',
        tiktok: '#010101',
        threads: '#101010',
        discord: '#5865F2',
        teal: '#0D7377',
        gold: '#D4A843',
        offwhite: '#F5F0E8',
        ink: '#1A1A2A',
        'engine-bg': '#0F1117',
        'engine-surface': '#181B25',
        'engine-border': 'rgba(13,115,119,0.25)',
      },
      fontFamily: {
        mono: ["'Courier New'", 'monospace'],
        sans: ["'Inter'", 'sans-serif'],
        outfit: ["'Outfit'", 'sans-serif'],
        jakarta: ["'Plus Jakarta Sans'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
