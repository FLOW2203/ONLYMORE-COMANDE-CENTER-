import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ONLYMORE Social Calendar',
  description: 'Calendrier éditorial ONLYMORE Group — Vue temps réel des posts depuis Notion',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
