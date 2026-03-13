import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ONLYMORE Commande Center',
  description: 'Centre de commande ONLYMORE Group — Calendrier éditorial + Suivi des actions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
