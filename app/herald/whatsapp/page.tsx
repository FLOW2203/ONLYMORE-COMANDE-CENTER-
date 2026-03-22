'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'templates' | 'strategy' | 'checklist'

const tabs: { id: Tab; label: string; desc: string }[] = [
  { id: 'templates', label: 'Templates', desc: 'Créer des templates de messages WhatsApp Business' },
  { id: 'strategy', label: 'Stratégie', desc: 'Newsletters, automatisations et communication directe' },
  { id: 'checklist', label: 'Checklist', desc: 'Vérification avant envoi' },
]

const templateTypes = [
  { name: 'Bienvenue', category: 'Utilitaire', example: 'Bonjour [Prénom] ! Bienvenue chez ONLYMORE. Comment puis-je vous aider ?', tip: 'Premier message après opt-in' },
  { name: 'Newsletter', category: 'Marketing', example: 'Nouvelle semaine, nouvelle dose d\'inspiration. Voici les 3 actus à ne pas manquer...', tip: 'Max 2-3/semaine' },
  { name: 'Suivi', category: 'Utilitaire', example: 'Bonjour [Prénom], suite à notre échange, voici le récap...', tip: 'Après un call ou meeting' },
  { name: 'Promotion', category: 'Marketing', example: 'Offre exclusive pour nos abonnés WhatsApp : -20% jusqu\'à vendredi.', tip: 'Avec CTA clair et deadline' },
  { name: 'Rappel événement', category: 'Utilitaire', example: 'Rappel : notre webinaire commence dans 1h ! Voici le lien...', tip: 'J-1 et H-1' },
  { name: 'Feedback', category: 'Utilitaire', example: 'Comment s\'est passée votre expérience ? Notez de 1 à 5.', tip: 'Messages interactifs avec boutons' },
]

const checklistItems = [
  { cat: 'Message', items: ['Message court et actionnable', 'Personnalisation (prénom, contexte)', 'Un seul CTA par message', 'Emojis modérés pour la lisibilité'] },
  { cat: 'Conformité', items: ['Opt-in obtenu avant envoi', 'Option de désinscription claire', 'Respecte la fenêtre 24h', 'Conforme RGPD'] },
  { cat: 'Timing', items: ['Envoi entre 9h-19h', 'Max 2-3 messages/semaine', 'Pas d\'envoi le dimanche', 'Adapté au fuseau horaire'] },
]

export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState<Tab>('templates')
  const [message, setMessage] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (item: string) => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  const totalChecks = checklistItems.flatMap((c) => c.items).length
  const doneChecks = Object.values(checked).filter(Boolean).length

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/herald" className="text-xs font-mono text-muted hover:text-text transition-colors">← HERALD</Link>
              <div>
                <h1 className="text-lg font-sans font-semibold text-text tracking-tight">
                  WhatsApp <span className="text-[#25D366]">Business</span>
                </h1>
                <p className="text-[10px] font-mono text-muted mt-0.5">TEAM HERALD — Templates, Newsletters & Messaging</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-border w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-mono transition-colors ${activeTab === tab.id ? 'bg-[#25D366]/20 text-[#25D366]' : 'text-muted hover:text-text'}`}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <p className="text-xs font-mono text-muted mb-6">{tabs.find((t) => t.id === activeTab)?.desc}</p>

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-mono text-[#25D366] mb-1 block">COMPOSER UN MESSAGE</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Salutation personnalisée → Message principal → CTA unique"
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-xs font-mono text-text placeholder:text-muted/50 resize-none h-40" />
              <span className="text-[9px] font-mono text-muted">{message.length} caractères</span>

              {/* Preview bulle WhatsApp */}
              {message && (
                <div className="mt-4 bg-[#0B141A] rounded-xl p-4">
                  <div className="max-w-[80%] ml-auto bg-[#005C4B] rounded-xl rounded-tr-sm px-3 py-2">
                    <p className="text-xs text-white whitespace-pre-wrap">{message}</p>
                    <span className="text-[8px] text-white/40 float-right mt-1">14:32</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xs font-mono text-muted mb-3">Templates types</h3>
              <div className="space-y-2">
                {templateTypes.map((t) => (
                  <div key={t.name} className="border border-border rounded-lg p-3 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors"
                    onClick={() => setMessage(t.example)}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-text">{t.name}</span>
                      <span className="text-[8px] font-mono text-[#25D366] bg-[#25D366]/10 px-1.5 py-0.5 rounded">{t.category}</span>
                    </div>
                    <p className="text-[10px] font-mono text-muted mt-1">{t.example}</p>
                    <p className="text-[9px] font-mono text-[#25D366]/60 mt-1">{t.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 bg-white/[0.02]">
              <h3 className="text-xs font-mono text-muted mb-3">WhatsApp Business — Canaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><span className="text-xs font-sans font-semibold text-[#25D366]">Newsletters</span><p className="text-[10px] font-mono text-muted mt-1">Channels one-to-many. Taux d'ouverture 90%+. Max 2-3/semaine.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#25D366]">Messaging 1:1</span><p className="text-[10px] font-mono text-muted mt-1">Fenêtre 24h pour répondre. Templates pré-approuvés pour initier.</p></div>
                <div><span className="text-xs font-sans font-semibold text-[#25D366]">Catalogues</span><p className="text-[10px] font-mono text-muted mt-1">Présenter produits/services directement dans WhatsApp. Achats in-app.</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-[#25D366] rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted">{doneChecks}/{totalChecks}</span>
            </div>
            {checklistItems.map((cat) => (
              <div key={cat.cat} className="border border-border rounded-lg p-4 bg-white/[0.02]">
                <h3 className="text-xs font-sans font-semibold text-text mb-3">{cat.cat}</h3>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={checked[item] || false} onChange={() => toggleCheck(item)} className="w-3.5 h-3.5 rounded border-border accent-[#25D366]" />
                      <span className={`text-xs font-mono transition-colors ${checked[item] ? 'text-[#25D366] line-through' : 'text-muted group-hover:text-text'}`}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-border py-4 mt-8">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <p className="text-[9px] font-mono text-muted">ONLYMORE Group — WhatsApp Business — HERALD</p>
          <span className="text-[9px] font-mono text-muted">90% open rate — Personnel — RGPD compliant</span>
        </div>
      </footer>
    </main>
  )
}
