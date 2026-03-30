import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { GoogleReview } from '@/types/engine'

function Stars({ rating }: { rating: number }) {
  return <span className="text-gold">{Array.from({ length: 5 }, (_, i) => (i < rating ? '\u2605' : '\u2606')).join('')}</span>
}

export default function Reviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => { fetchReviews() }, [])

  async function fetchReviews() {
    setLoading(true)
    const { data } = await supabase.from('google_reviews').select('*, merchants(*)').order('review_date', { ascending: false }).limit(100)
    setReviews(data || [])
    setLoading(false)
  }

  async function approveReply(review: GoogleReview) {
    if (!review.ai_suggested_reply) return
    await supabase.from('google_reviews').update({
      ai_reply_approved: true, reply_text: review.ai_suggested_reply,
      reply_date: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq('id', review.id)
    fetchReviews()
  }

  async function saveEditedReply(reviewId: string) {
    await supabase.from('google_reviews').update({ ai_suggested_reply: editText, updated_at: new Date().toISOString() }).eq('id', reviewId)
    setEditingId(null)
    setEditText('')
    fetchReviews()
  }

  function startEdit(review: GoogleReview) {
    setEditingId(review.id)
    setEditText(review.ai_suggested_reply || '')
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return reviews
    if (filter === 'positive') return reviews.filter((r) => r.rating >= 4)
    if (filter === 'negative') return reviews.filter((r) => r.rating <= 2)
    if (filter === 'no_reply') return reviews.filter((r) => !r.reply_text)
    if (filter === 'attention') return reviews.filter((r) => r.needs_attention)
    return reviews
  }, [reviews, filter])

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'
  const repliedCount = reviews.filter((r) => r.reply_text).length
  const replyRate = reviews.length > 0 ? Math.round((repliedCount / reviews.length) * 100) : 0
  const negativeCount = reviews.filter((r) => r.rating <= 2).length
  const attentionCount = reviews.filter((r) => r.needs_attention).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-offwhite m-0">Reputation Locale</h1>
        <p className="text-sm text-gray-500 mt-1">Gestion des avis Google et reponses IA</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Note moyenne', value: avgRating, extra: <Stars rating={Math.round(Number(avgRating))} />, color: 'text-gold', sub: '' },
          { label: 'Taux de reponse', value: `${replyRate}%`, extra: null, color: 'text-teal', sub: `${repliedCount}/${reviews.length} avis` },
          { label: 'Avis negatifs', value: negativeCount, extra: null, color: 'text-red-400', sub: '1-2 etoiles' },
          { label: 'A traiter', value: attentionCount, extra: null, color: 'text-amber-400', sub: 'necessite attention' },
        ].map((s) => (
          <div key={s.label} className="bg-engine-surface border border-engine-border rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider m-0">{s.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-2xl font-[family-name:var(--font-outfit)] font-bold ${s.color} m-0`}>{s.value}</p>
              {s.extra}
            </div>
            {s.sub && <p className="text-xs text-gray-500 m-0">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Tous' }, { value: 'positive', label: 'Positifs (4-5)' },
          { value: 'negative', label: 'Negatifs (1-2)' }, { value: 'no_reply', label: 'Sans reponse' },
          { value: 'attention', label: 'A traiter' },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
              filter === f.value ? 'border-teal bg-teal/10 text-teal' : 'border-engine-border text-gray-400 hover:border-gray-500 bg-transparent'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-engine-surface border border-engine-border rounded-xl p-8 text-center">
          <p className="text-gray-400 m-0">Aucun avis Google trouve</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-engine-surface border border-engine-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                      {(review.author_name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-offwhite m-0">{review.author_name || 'Anonyme'}</p>
                      <div className="flex items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="text-[10px] text-gray-500">{review.review_date ? new Date(review.review_date).toLocaleDateString('fr-FR') : ''}</span>
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-gray-300 mb-3 leading-relaxed m-0">{review.comment}</p>}

                  {review.reply_text && (
                    <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 mb-3">
                      <p className="text-[10px] text-teal uppercase tracking-wider mb-1 m-0">Reponse publiee</p>
                      <p className="text-xs text-gray-300 m-0">{review.reply_text}</p>
                    </div>
                  )}

                  {review.ai_suggested_reply && !review.reply_text && (
                    <div className="bg-gold/5 border border-gold/20 rounded-lg p-3">
                      <p className="text-[10px] text-gold uppercase tracking-wider mb-1 m-0">Reponse IA suggeree</p>
                      {editingId === review.id ? (
                        <div className="space-y-2">
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-engine-bg border border-engine-border rounded-lg px-3 py-2 text-xs text-offwhite outline-none focus:border-teal resize-none h-20 box-border" />
                          <div className="flex gap-2">
                            <button onClick={() => saveEditedReply(review.id)} className="px-3 py-1 bg-teal text-white rounded text-xs font-medium border-none cursor-pointer">Sauvegarder</button>
                            <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs border-none cursor-pointer">Annuler</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-gray-300 mb-2 m-0">{review.ai_suggested_reply}</p>
                          <div className="flex gap-2">
                            <button onClick={() => approveReply(review)} className="px-3 py-1 bg-teal hover:bg-teal/80 text-white rounded text-xs font-medium transition-colors border-none cursor-pointer">Approuver</button>
                            <button onClick={() => startEdit(review)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors border-none cursor-pointer">Modifier</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1">
                  {review.sentiment && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      review.sentiment === 'positive' ? 'bg-emerald-500/15 text-emerald-400'
                        : review.sentiment === 'negative' ? 'bg-red-500/15 text-red-400'
                        : 'bg-gray-500/15 text-gray-400'
                    }`}>{review.sentiment}</span>
                  )}
                  {review.needs_attention && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">attention</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
