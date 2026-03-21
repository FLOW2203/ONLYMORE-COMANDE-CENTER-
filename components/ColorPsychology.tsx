'use client'

import { useState } from 'react'
import { COLOR_PSYCHOLOGY, COLOR_HARMONIES, DESIGN_PRINCIPLES, ONLYMORE_BRAND_COLORS } from '@/lib/logo-data'

export default function ColorPsychology() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [showOnlymore, setShowOnlymore] = useState(false)

  const activeColor = COLOR_PSYCHOLOGY.find((c) => c.name === selectedColor)

  return (
    <div className="space-y-6">
      {/* Color Grid */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Psychologie des couleurs
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {COLOR_PSYCHOLOGY.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
              className={`text-left rounded-xl border overflow-hidden transition-all ${
                selectedColor === color.name ? 'border-white/30 ring-1 ring-white/10' : 'border-border hover:border-white/20'
              }`}
            >
              <div className="h-12" style={{ backgroundColor: color.hex }} />
              <div className="p-2.5 bg-white/[0.02]">
                <p className="text-xs font-mono text-text font-semibold">{color.name}</p>
                <p className="text-[9px] font-mono text-muted mt-0.5">{color.hex}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Detail */}
      {activeColor && (
        <div
          className="border rounded-xl p-5 space-y-3"
          style={{ borderColor: activeColor.hex + '40', backgroundColor: activeColor.hex + '08' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: activeColor.hex }} />
            <div>
              <h3 className="text-base font-sans font-semibold text-text">{activeColor.name}</h3>
              <p className="text-[10px] font-mono text-muted">{activeColor.hex}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/[0.03] rounded-lg p-3 border border-border">
              <span className="text-muted font-mono text-[10px] block mb-1">\u00c9motions</span>
              <span className="text-xs text-text/80 font-sans">{activeColor.emotions}</span>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 border border-border">
              <span className="text-muted font-mono text-[10px] block mb-1">Industries</span>
              <span className="text-xs text-text/80 font-sans">{activeColor.industries}</span>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 border border-border">
              <span className="text-muted font-mono text-[10px] block mb-1">Attention</span>
              <span className="text-xs text-yellow-400/80 font-sans">{activeColor.warning}</span>
            </div>
          </div>
        </div>
      )}

      {/* Color Harmony Methods */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          M\u00e9thodes d'harmonie chromatique
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COLOR_HARMONIES.map((h) => (
            <div key={h.id} className="bg-white/[0.02] border border-border rounded-lg p-3">
              <h5 className="text-xs font-mono text-text/80 font-semibold mb-1">{h.label}</h5>
              <p className="text-[10px] font-mono text-muted mb-1">{h.how}</p>
              <p className="text-[9px] font-mono text-[#D4A843]/70">{h.when}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Palette Rules */}
      <div className="bg-[#D4A843]/5 border border-[#D4A843]/20 rounded-xl p-4">
        <h4 className="text-xs font-mono font-semibold text-[#D4A843] mb-3">R\u00e8gles palette</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-text/70">
          <div className="flex items-start gap-2">
            <span className="text-[#D4A843] mt-0.5">1.</span>
            <span>Palette primaire: 1-2 couleurs max pour le logo</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#D4A843] mt-0.5">2.</span>
            <span>Palette \u00e9tendue: 3-5 couleurs pour le syst\u00e8me de marque</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#D4A843] mt-0.5">3.</span>
            <span>Toujours inclure une version monochrome (N&B)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#D4A843] mt-0.5">4.</span>
            <span>Ratio de contraste minimum 4.5:1 (WCAG AA)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#D4A843] mt-0.5">5.</span>
            <span>Tester sur fond blanc, noir, gris, photo, gradient</span>
          </div>
        </div>
      </div>

      {/* ONLYMORE Brand Colors */}
      <div>
        <button
          onClick={() => setShowOnlymore(!showOnlymore)}
          className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase tracking-wider mb-3 hover:text-text transition-colors"
        >
          <span className={`transition-transform ${showOnlymore ? 'rotate-90' : ''}`}>&#9656;</span>
          Couleurs ONLYMORE Group
        </button>
        {showOnlymore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(ONLYMORE_BRAND_COLORS).map(([entity, colors]) => (
              <div key={entity} className="bg-white/[0.02] border border-border rounded-xl overflow-hidden">
                <div className="flex h-8">
                  <div className="flex-1" style={{ backgroundColor: colors.primary }} />
                  <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
                </div>
                <div className="p-3">
                  <h5 className="text-xs font-mono text-text/80 font-semibold mb-1">{entity}</h5>
                  <div className="flex gap-3">
                    <span
                      className="text-[9px] font-mono cursor-pointer hover:opacity-80"
                      style={{ color: colors.primary }}
                      onClick={() => navigator.clipboard.writeText(colors.primary)}
                      title="Copier"
                    >
                      {colors.primary}
                    </span>
                    <span
                      className="text-[9px] font-mono cursor-pointer hover:opacity-80"
                      style={{ color: colors.secondary }}
                      onClick={() => navigator.clipboard.writeText(colors.secondary)}
                      title="Copier"
                    >
                      {colors.secondary}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Design Principles */}
      <div>
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-3">
          Les 10 lois du design de logo
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DESIGN_PRINCIPLES.map((principle, idx) => (
            <div key={principle.id} className="bg-white/[0.02] border border-border rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-[#D4A843] font-bold min-w-[20px]">{idx + 1}.</span>
                <div>
                  <h5 className="text-xs font-mono text-text/80 font-semibold">{principle.title}</h5>
                  <p className="text-[10px] font-mono text-muted mt-0.5">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geometric Construction Tips */}
      <div className="bg-white/[0.02] border border-border rounded-xl p-4">
        <h4 className="text-xs font-mono text-text/80 font-semibold mb-3">Construction g\u00e9om\u00e9trique: Le Nombre d'Or (\u03c6 = 1.618)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono text-muted">
          <div>
            <span className="text-text/70 block mb-1">Dimensionnement</span>
            <p>Si l'ic\u00f4ne fait 100px, le texte: 100/1.618 \u2248 62px</p>
          </div>
          <div>
            <span className="text-text/70 block mb-1">Espacement</span>
            <p>Gap ic\u00f4ne-texte = petit \u00e9l\u00e9ment / 1.618</p>
          </div>
          <div>
            <span className="text-text/70 block mb-1">Cercles de Fibonacci</span>
            <p>r = 10, 16, 26, 42, 68... pour les courbes</p>
          </div>
          <div>
            <span className="text-text/70 block mb-1">Corrections optiques</span>
            <p>Cercles +2-3% au-del\u00e0 de la grille, traits H -5% \u00e9paisseur</p>
          </div>
        </div>
      </div>
    </div>
  )
}
