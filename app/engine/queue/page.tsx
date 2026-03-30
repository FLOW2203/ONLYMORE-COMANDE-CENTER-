'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PublishQueueItem, Platform, QueueStatus } from '@/types/engine'

const STATUS_STYLES: Record<QueueStatus, { bg: string; text: string; label: string }> = {
  published: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Publie' },
  queued: { bg: 'bg-amber-500/15', text: 'text-amber-400', label: 'En attente' },
  publishing: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Publication...' },
  failed: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Echoue' },
  cancelled: { bg: 'bg-gray-500/15', text: 'text-gray-400', label: 'Annule' },
}

const PLATFORM_LABELS: Record<Platform, { label: string; color: string }> = {
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  facebook: { label: 'Facebook', color: '#1877F2' },
  instagram: { label: 'Instagram', color: '#E1306C' },
  google_business: { label: 'Google', color: '#4285F4' },
}

export default function QueuePage() {
  const [items, setItems] = useState<PublishQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<PublishQueueItem | null>(null)

  useEffect(() => {
    fetchItems()
    const channel = supabase
      .channel('queue-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'publish_queue' }, () => {
        fetchItems()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase
      .from('publish_queue')
      .select('*, merchants(*)')
      .order('scheduled_at', { ascending: false })
      .limit(200)
    setItems(data || [])
    setLoading(false)
  }

  async function rescheduleItem(id: string) {
    const newDate = prompt('Nouvelle date (YYYY-MM-DD HH:mm)')
    if (!newDate) return
    await supabase
      .from('publish_queue')
      .update({ scheduled_at: new Date(newDate).toISOString(), status: 'queued', updated_at: new Date().toISOString() })
      .eq('id', id)
    fetchItems()
  }

  async function deleteItem(id: string) {
    if (!confirm('Supprimer ce post de la queue ?')) return
    await supabase.from('publish_queue').delete().eq('id', id)
    fetchItems()
    setSelectedItem(null)
  }

  async function retryItem(id: string) {
    await supabase
      .from('publish_queue')
      .update({ status: 'queued', error_message: null, updated_at: new Date().toISOString() })
      .eq('id', id)
    fetchItems()
  }

  const filtered = items.filter((it) => {
    if (filterPlatform !== 'all' && it.platform !== filterPlatform) return false
    if (filterStatus !== 'all' && it.status !== filterStatus) return false
    return true
  })

  function formatDate(d: string | null) {
    if (!d) return '-'
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-2xl font-bold text-offwhite">Queue de publication</h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} posts dans la queue</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="bg-engine-surface border border-engine-border text-offwhite rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
        >
          <option value="all">Toutes les plateformes</option>
          {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-engine-surface border border-engine-border text-offwhite rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_STYLES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-engine-surface border border-engine-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-engine-border text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Plateforme</th>
                <th className="text-left px-4 py-3">Entite</th>
                <th className="text-left px-4 py-3">Contenu</th>
                <th className="text-left px-4 py-3">Planifie</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Retries</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Chargement...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">Aucun post dans la queue</td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const platform = PLATFORM_LABELS[item.platform] || { label: item.platform, color: '#666' }
                  const status = STATUS_STYLES[item.status] || STATUS_STYLES.queued
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-engine-border hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: platform.color }}
                          />
                          <span className="text-offwhite">{platform.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {item.merchants?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-[300px] truncate">
                        {item.content.slice(0, 60)}{item.content.length > 60 ? '...' : ''}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(item.scheduled_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.retry_count}/{item.max_retries}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {item.status === 'failed' && (
                            <button
                              onClick={() => retryItem(item.id)}
                              className="text-xs text-teal hover:text-teal/80 transition-colors"
                            >
                              Republier
                            </button>
                          )}
                          {(item.status === 'queued' || item.status === 'failed') && (
                            <button
                              onClick={() => rescheduleItem(item.id)}
                              className="text-xs text-gold hover:text-gold/80 transition-colors"
                            >
                              Replanifier
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-engine-surface border border-engine-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-outfit font-semibold text-offwhite text-lg">Detail du post</h3>
              <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-offwhite">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase">Plateforme</p>
                <p className="text-offwhite">{PLATFORM_LABELS[selectedItem.platform]?.label || selectedItem.platform}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Contenu</p>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedItem.content}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Planifie pour</p>
                <p className="text-offwhite">{formatDate(selectedItem.scheduled_at)}</p>
              </div>
              {selectedItem.error_message && (
                <div>
                  <p className="text-gray-500 text-xs uppercase">Erreur</p>
                  <p className="text-red-400 text-xs font-mono bg-red-500/10 rounded-lg p-2 mt-1">
                    {selectedItem.error_message}
                  </p>
                </div>
              )}
              {selectedItem.external_post_id && (
                <div>
                  <p className="text-gray-500 text-xs uppercase">Post ID externe</p>
                  <p className="text-gray-400 font-mono text-xs">{selectedItem.external_post_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
