import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Check, Clapperboard, Film, LoaderCircle, Plus, Tv } from 'lucide-react'
import { useLanguage } from './lib/i18n'
import { getWatchlist, type Kind, type WatchItem } from './features/watchlist/watchlistService'
import { getDataErrorKey } from './lib/dataErrors'

const filters = [
  { id: 'all', label: 'Hepsi' },
  { id: 'series', label: 'Diziler' },
  { id: 'movie', label: 'Filmler' },
] as const

function SeriesAndFilms() {
  const { t } = useLanguage()
  const [items, setItems] = useState<WatchItem[]>([])
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<Kind>('series')
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState<Record<string, { season: number; episode: number }>>({})

  useEffect(() => {
    let cancelled = false
    getWatchlist()
      .then((data) => { if (!cancelled) setItems(data) })
      .catch((cause: unknown) => { if (!cancelled) setError(t(getDataErrorKey(cause))) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [t])

  const shownItems = useMemo(() => filter === 'all' ? items : items.filter((item) => item.kind === filter), [filter, items])
  const countFor = (key: (typeof filters)[number]['id']) => key === 'all' ? items.length : items.filter((item) => item.kind === key).length

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle, kind, status: 'planned', season: kind === 'series' ? 1 : null, episode: kind === 'series' ? 1 : null }),
      })
      const created = await response.json()
      if (!response.ok) throw new Error(t('saveError'))
      setItems((current) => [created as WatchItem, ...current])
      setTitle('')
      setAdding(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('saveError'))
    } finally { setSaving(false) }
  }

  async function updateItem(item: WatchItem, changes: Partial<WatchItem>) {
    setError('')
    try {
      const response = await fetch(`/api/watchlist/${encodeURIComponent(item.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })
      const updated = await response.json()
      if (!response.ok) throw new Error(t('updateError'))
      setItems((current) => current.map((entry) => entry.id === item.id ? updated as WatchItem : entry))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('updateError'))
    }
  }

  function readProgress(item: WatchItem) {
    return progress[item.id] || { season: item.season || 1, episode: item.episode || 1 }
  }

  return <section className="watchlist section-pad" id="dizi-filmler">
    <div className="watchlist-heading">
      <div><span className="watchlist-eyebrow">{t('mediaEyebrow')}</span><h2>{t('mediaTitle')}<span className="accent">.</span></h2></div>
      <button className="add-watch-item" onClick={() => setAdding((value) => !value)}><Plus size={15} /> {t('add')}</button>
    </div>
    {adding && <form className="watchlist-add-form" onSubmit={addItem}>
      <label className="media-label" htmlFor="media-title">{t('titleLabel')}</label>
      <input id="media-title" required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={t('titlePlaceholder')} />
      <div className="media-kind-choice"><label><input type="radio" name="media-kind" checked={kind === 'series'} onChange={() => setKind('series')} /> {t('seriesOne')}</label><label><input type="radio" name="media-kind" checked={kind === 'movie'} onChange={() => setKind('movie')} /> {t('movie')}</label></div>
      <button className="add-watch-item" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={15} /> : <Plus size={15} />} {t('save')}</button>
    </form>}
    <div className="watchlist-layout grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-14">
      <aside className="watchlist-sidebar" aria-label="İzleme listesi filtreleri">
        <span className="sidebar-title">{t('library')}</span>
        {filters.map((entry) => <button key={entry.id} onClick={() => setFilter(entry.id)} className={`sidebar-filter ${filter === entry.id ? 'selected' : ''}`}><span>{entry.id === 'movie' ? <Film size={15} /> : entry.id === 'series' ? <Tv size={15} /> : <Clapperboard size={15} />}{entry.id === 'movie' ? t('films') : entry.id === 'series' ? t('series') : t('all')}</span><small>{countFor(entry.id).toString().padStart(2, '0')}</small></button>)}
        <div className="sidebar-note"><span>{t('evenings')}</span><HeartMark /><p>{t('eveningsCopy')}</p></div>
      </aside>
      <div className="watchlist-main">
        <div className="watchlist-list-head"><span>{filter === 'movie' ? t('films') : filter === 'series' ? t('series') : t('ourList')}</span><span>{shownItems.length.toString().padStart(2, '0')} {t('entries')}</span></div>
        {error && <p className="watchlist-error" role="status">{error}</p>}
        {loading ? <div className="watchlist-empty"><LoaderCircle className="spin" size={20} /><span>{t('loading')}</span></div> : error && shownItems.length === 0 ? null : shownItems.length === 0 ? <div className="watchlist-empty"><Clapperboard size={23} /><strong>{t('emptyTitle')}</strong><span>{t('emptyCopy')}</span><button className="text-link" onClick={() => setAdding(true)}>{t('firstEntry')} <Plus size={15} /></button></div> : <div className="watch-item-list">
          {shownItems.map((item, index) => {
            const currentProgress = readProgress(item)
            return <article className="watch-item" key={item.id}>
              <span className="watch-item-number">{(index + 1).toString().padStart(2, '0')}</span>
              <div className="watch-item-info"><div className="watch-item-titleline"><span className="watch-item-icon">{item.kind === 'series' ? <Tv size={15} /> : <Film size={15} />}</span><h3>{item.title}</h3></div><span className={`watch-status watch-status--${item.status}`}>{item.status === 'completed' ? <><Check size={12} /> {t('finished')}</> : item.status === 'watching' ? t('ongoing') : t('planned')}</span>
                {item.kind === 'series' && <div className="episode-controls"><label>{t('season')} <select aria-label={`${item.title} ${t('season').toLowerCase()}`} value={currentProgress.season} onChange={(event) => setProgress((current) => ({ ...current, [item.id]: { ...currentProgress, season: Number(event.target.value) } }))}>{Array.from({ length: 30 }, (_, i) => i + 1).map((number) => <option key={number} value={number}>{number}</option>)}</select></label><label>{t('episode')} <select aria-label={`${item.title} ${t('episode').toLowerCase()}`} value={currentProgress.episode} onChange={(event) => setProgress((current) => ({ ...current, [item.id]: { ...currentProgress, episode: Number(event.target.value) } }))}>{Array.from({ length: 100 }, (_, i) => i + 1).map((number) => <option key={number} value={number}>{number}</option>)}</select></label><button className="progress-save" onClick={() => updateItem(item, { ...currentProgress, status: 'watching' })}>{t('saveProgress')}</button></div>}
              </div>
              <button className={`watched-toggle ${item.status === 'completed' ? 'is-complete' : ''}`} onClick={() => updateItem(item, { status: item.status === 'completed' ? 'watching' : 'completed' })}>{item.status === 'completed' ? <><Check size={14} /> {t('finishedButton')}</> : t('markFinished')}</button>
            </article>
          })}
        </div>}
      </div>
    </div>
  </section>
}

function HeartMark() { return <span className="sidebar-heart">♥</span> }

export default SeriesAndFilms
