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
      },
      fontFamily: {
        mono: ["'Courier New'", 'monospace'],
        sans: ["'Inter'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
