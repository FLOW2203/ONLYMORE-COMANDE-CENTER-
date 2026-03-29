import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Workflow, WorkflowRun } from '@/types/engine'

const TYPE_LABELS: Record<string, string> = {
  publish_linkedin: 'Publication LinkedIn',
  publish_facebook: 'Publication Facebook',
  generate_content: 'Generation de contenu',
  fetch_reviews: 'Collecte avis Google',
  custom: 'Personnalise',
}

const RUN_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  success: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  failed: { bg: 'bg-red-500/15', text: 'text-red-400' },
  running: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  pending: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  skipped: { bg: 'bg-gray-500/15', text: 'text-gray-400' },
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [runs, setRuns] = useState<Record<string, WorkflowRun[]>>({})
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => { fetchWorkflows() }, [])

  async function fetchWorkflows() {
    setLoading(true)
    const { data: wf } = await supabase.from('workflows').select('*').order('created_at', { ascending: false })
    const workflowList = wf || []
    setWorkflows(workflowList)

    const runsMap: Record<string, WorkflowRun[]> = {}
    for (const w of workflowList) {
      const { data: r } = await supabase.from('workflow_runs').select('*').eq('workflow_id', w.id).order('created_at', { ascending: false }).limit(10)
      runsMap[w.id] = r || []
    }
    setRuns(runsMap)
    setLoading(false)
  }

  async function toggleWorkflow(id: string, currentActive: boolean) {
    await supabase.from('workflows').update({ is_active: !currentActive, updated_at: new Date().toISOString() }).eq('id', id)
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, is_active: !currentActive } : w)))
  }

  function formatDate(d: string | null) {
    if (!d) return '-'
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-offwhite m-0">Workflows</h1>
        <p className="text-sm text-gray-500 mt-1">{workflows.length} workflows configures</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Chargement...</div>
      ) : workflows.length === 0 ? (
        <div className="bg-engine-surface border border-engine-border rounded-xl p-8 text-center">
          <p className="text-gray-400 m-0">Aucun workflow configure</p>
          <p className="text-gray-500 text-xs mt-2 m-0">Les workflows seront crees automatiquement lors du deploiement des Edge Functions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => {
            const lastRun = runs[wf.id]?.[0] || null
            const wfRuns = runs[wf.id] || []
            const isExpanded = expandedId === wf.id
            return (
              <div key={wf.id} className="bg-engine-surface border border-engine-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : wf.id)}>
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={(e) => { e.stopPropagation(); toggleWorkflow(wf.id, wf.is_active) }}
                      className={`w-10 h-5 rounded-full relative transition-colors border-none cursor-pointer ${wf.is_active ? 'bg-teal' : 'bg-gray-600'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${wf.is_active ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-offwhite text-sm m-0">{wf.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 m-0">
                        {TYPE_LABELS[wf.type] || wf.type}
                        {wf.cron_schedule && <span className="ml-2 font-mono text-gray-600">({wf.cron_schedule})</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {lastRun && (
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${RUN_STATUS_STYLES[lastRun.status]?.bg || ''} ${RUN_STATUS_STYLES[lastRun.status]?.text || ''}`}>{lastRun.status}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5 m-0">{formatDate(lastRun.created_at)}</p>
                      </div>
                    )}
                    <span className={`text-gray-500 text-xs transition-transform ${isExpanded ? 'rotate-180 inline-block' : ''}`}>{'\u25BC'}</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-engine-border">
                    <div className="p-3 bg-black/20">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 m-0">10 derniers runs</p>
                      {wfRuns.length === 0 ? (
                        <p className="text-xs text-gray-600 py-2 m-0">Aucune execution</p>
                      ) : (
                        <div className="space-y-1">
                          {wfRuns.map((run) => (
                            <div key={run.id} className="flex items-center gap-3 text-xs py-1.5 px-2 rounded hover:bg-white/[0.03]">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${RUN_STATUS_STYLES[run.status]?.bg || ''} ${RUN_STATUS_STYLES[run.status]?.text || ''}`}>{run.status}</span>
                              <span className="text-gray-500">{formatDate(run.created_at)}</span>
                              {run.duration_ms && <span className="text-gray-600">{run.duration_ms}ms</span>}
                              {run.error_message && <span className="text-red-400/70 truncate max-w-[300px]">{run.error_message}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
