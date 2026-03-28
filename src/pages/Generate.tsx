import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Entity, Platform } from '@/types/engine'

const ENTITIES: { value: Entity; label: string; color: string }[] = [
  { value: 'ONLYMORE', label: 'ONLYMORE Group', color: '#E8EAF0' },
  { value: 'COLHYBRI', label: 'COLHYBRI', color: '#00D4AA' },
  { value: 'CROWNIUM', label: 'CROWNIUM', color: '#FFD700' },
  { value: 'DOJUKU', label: 'DOJUKU SHINGI', color: '#FF6B35' },
  { value: 'PLUMAYA', label: 'PLUMAYA', color: '#7B61FF' },
]

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { value: 'facebook', label: 'Facebook', color: '#1877F2' },
  { value: 'instagram', label: 'Instagram', color: '#E1306C' },
]

const CATEGORIES = ['promo', 'engagement', 'seasonal', 'review_response']

export default function Generate() {
  const [topic, setTopic] = useState('')
  const [entity, setEntity] = useState<Entity>('ONLYMORE')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['linkedin'])
  const [category, setCategory] = useState('engagement')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [scheduled, setScheduled] = useState(false)

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  }

  async function handleGenerate() {
    if (!topic || selectedPlatforms.length === 0) return
    setGenerating(true)
    setGeneratedContent({})
    setScheduled(false)

    const results: Record<string, string> = {}
    for (const platform of selectedPlatforms) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: { merchant_id: null, platform, category, custom_prompt: `Entite : ${entity}. Sujet : ${topic}` },
        })
        if (error) results[platform] = `[Erreur] ${error.message}`
        else if (data?.content) results[platform] = data.content
        else results[platform] = '[Aucun contenu genere]'
      } catch {
        results[platform] = `[Erreur de connexion a l'Edge Function]`
      }
    }
    setGeneratedContent(results)
    setGenerating(false)
  }

  async function handleSchedule() {
    if (!scheduleDate || Object.keys(generatedContent).length === 0) return
    setScheduling(true)
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()

    for (const [platform, content] of Object.entries(generatedContent)) {
      if (content.startsWith('[')) continue
      await supabase.from('publish_queue').insert({
        platform, content, scheduled_at: scheduledAt, status: 'queued',
        metadata: { entity, category, topic, auto_generated: true },
      })
    }
    setScheduling(false)
    setScheduled(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-offwhite m-0">Generateur de contenu</h1>
        <p className="text-sm text-gray-500 mt-1">Generez du contenu IA pour vos publications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-engine-surface border border-engine-border rounded-xl p-5 space-y-5">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Sujet / Topic</label>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Decrivez le sujet du post..."
              className="w-full bg-engine-bg border border-engine-border rounded-lg px-3 py-2 text-sm text-offwhite placeholder-gray-600 outline-none focus:border-teal resize-none h-24 box-border" />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Entite</label>
            <div className="flex flex-wrap gap-2">
              {ENTITIES.map((e) => (
                <button key={e.value} onClick={() => setEntity(e.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                    entity === e.value ? 'border-teal bg-teal/10 text-teal' : 'border-engine-border text-gray-400 hover:border-gray-500 bg-transparent'
                  }`}>
                  <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: e.color }} />
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Plateformes</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p.value} onClick={() => togglePlatform(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                    selectedPlatforms.includes(p.value) ? 'border-teal bg-teal/10 text-teal' : 'border-engine-border text-gray-400 hover:border-gray-500 bg-transparent'
                  }`}>
                  <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: p.color }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Categorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="bg-engine-bg border border-engine-border text-offwhite rounded-lg px-3 py-2 text-sm outline-none focus:border-teal">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Date</label>
              <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full bg-engine-bg border border-engine-border rounded-lg px-3 py-2 text-sm text-offwhite outline-none focus:border-teal box-border" />
            </div>
            <div className="w-28">
              <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Heure</label>
              <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full bg-engine-bg border border-engine-border rounded-lg px-3 py-2 text-sm text-offwhite outline-none focus:border-teal box-border" />
            </div>
          </div>

          <button onClick={handleGenerate} disabled={generating || !topic || selectedPlatforms.length === 0}
            className="w-full py-2.5 bg-teal hover:bg-teal/80 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-semibold transition-colors border-none cursor-pointer">
            {generating ? 'Generation en cours...' : 'Generer le contenu'}
          </button>
        </div>

        <div className="space-y-4">
          {Object.keys(generatedContent).length === 0 && !generating && (
            <div className="bg-engine-surface border border-engine-border rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm m-0">Le contenu genere apparaitra ici</p>
            </div>
          )}
          {generating && (
            <div className="bg-engine-surface border border-engine-border rounded-xl p-8 text-center">
              <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm m-0">Generation IA en cours...</p>
            </div>
          )}
          {Object.entries(generatedContent).map(([platform, content]) => {
            const pInfo = PLATFORMS.find((p) => p.value === platform)
            return (
              <div key={platform} className="bg-engine-surface border border-engine-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-engine-border">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pInfo?.color || '#666' }} />
                  <span className="text-sm font-semibold text-offwhite">{pInfo?.label || platform}</span>
                </div>
                <div className="p-4"><p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed m-0">{content}</p></div>
              </div>
            )
          })}
          {Object.keys(generatedContent).length > 0 && !scheduled && (
            <button onClick={handleSchedule} disabled={scheduling || !scheduleDate}
              className="w-full py-2.5 bg-gold hover:bg-gold/80 disabled:bg-gray-700 disabled:text-gray-500 text-ink rounded-lg text-sm font-semibold transition-colors border-none cursor-pointer">
              {scheduling ? 'Planification...' : 'Planifier les publications'}
            </button>
          )}
          {scheduled && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-emerald-400 text-sm font-medium m-0">Posts planifies avec succes !</p>
              <p className="text-emerald-400/60 text-xs mt-1 m-0">Visible dans la queue de publication</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
