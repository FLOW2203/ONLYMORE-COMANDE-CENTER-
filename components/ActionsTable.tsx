'use client'

import { Action } from '@/types/action'
import { filialeColors, categorieColors } from '@/lib/actions'

interface ActionsTableProps {
  actions: Action[]
}

export default function ActionsTable({ actions }: ActionsTableProps) {
  if (actions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xs font-mono text-muted">Aucune action trouvée</p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-white/[0.02]">
            <th className="px-4 py-2.5 text-[10px] font-mono font-medium text-muted uppercase tracking-wider">Date</th>
            <th className="px-4 py-2.5 text-[10px] font-mono font-medium text-muted uppercase tracking-wider">Filiale</th>
            <th className="px-4 py-2.5 text-[10px] font-mono font-medium text-muted uppercase tracking-wider">Catégorie</th>
            <th className="px-4 py-2.5 text-[10px] font-mono font-medium text-muted uppercase tracking-wider">Action</th>
            <th className="px-4 py-2.5 text-[10px] font-mono font-medium text-muted uppercase tracking-wider text-center">Statut</th>
            <th className="px-4 py-2.5 text-[10px] font-mono font-medium text-muted uppercase tracking-wider text-center">Lien</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr
              key={action.id}
              className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
            >
              <td className="px-4 py-2.5 text-[11px] font-mono text-muted whitespace-nowrap">
                {new Date(action.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
              </td>
              <td className="px-4 py-2.5">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border"
                  style={{
                    borderColor: filialeColors[action.filiale] + '40',
                    backgroundColor: filialeColors[action.filiale] + '15',
                    color: filialeColors[action.filiale],
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: filialeColors[action.filiale] }}
                  />
                  {action.filiale}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-mono"
                  style={{
                    backgroundColor: categorieColors[action.categorie] + '15',
                    color: categorieColors[action.categorie],
                  }}
                >
                  {action.categorie}
                </span>
              </td>
              <td className="px-4 py-2.5 text-[11px] font-sans text-text max-w-[400px]">
                {action.titre}
              </td>
              <td className="px-4 py-2.5 text-center text-sm">
                {action.statut}
              </td>
              <td className="px-4 py-2.5 text-center">
                {action.lien ? (
                  <a
                    href={action.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Ouvrir
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
