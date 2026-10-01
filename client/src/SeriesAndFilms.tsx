import { useEffect, useMemo, useState } from 'react'
import { Clapperboard, Film, LoaderCircle, Tv } from 'lucide-react'
import { useLanguage } from './lib/i18n'
import { getWatchlist, type WatchItem } from './features/watchlist/watchlistService'
import { getDataErrorKey } from './lib/dataErrors'

import { MediaTable } from './features/watchlist/MediaTable'
import { sortWatchlist, type WatchlistSort } from './features/watchlist/watchlistSort'
import { WatchlistSortControl } from './features/watchlist/WatchlistSortControl'
import { useRecordFocus } from './lib/useRecordFocus'

const filters = [
  { id: 'all', label: 'Hepsi' },
  { id: 'series', label: 'Diziler' },
  { id: 'movie', label: 'Filmler' },
  { id: 'anime', label: 'Animeler' },
] as const

function SeriesAndFilms() {
  const { t } = useLanguage()
  const [items, setItems] = useState<WatchItem[]>([])
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')
  const [sort, setSort] = useState<WatchlistSort>('title-asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useRecordFocus(!loading && !error, 'watch-item-')

  useEffect(() => {
    let cancelled = false
    getWatchlist()
      .then((data) => { if (!cancelled) setItems(data) })
      .catch((cause: unknown) => { if (!cancelled) setError(t(getDataErrorKey(cause))) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [t])

  const shownItems = useMemo(() => sortWatchlist(filter === 'all' ? items : items.filter((item) => item.kind === filter), sort), [filter, items, sort])
  const countFor = (key: (typeof filters)[number]['id']) => key === 'all' ? items.length : items.filter((item) => item.kind === key).length

  return <section className="watchlist section-pad" id="dizi-filmler">
    <div className="watchlist-heading">
      <div><span className="watchlist-eyebrow">{t('mediaEyebrow')}</span><h2>{t('mediaTitle')}<span className="accent">.</span><sup className="archive-count" aria-label={`${items.length} ${t('entries')}`}>{loading || error ? '—' : String(items.length).padStart(2, '0')}</sup></h2></div>
      <div className="watchlist-sort-desktop"><WatchlistSortControl value={sort} onChange={setSort} /></div>
    </div>
    <div className="watchlist-layout grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-14">
      <aside className="watchlist-sidebar" aria-label="İzleme listesi filtreleri">
        <span className="sidebar-title">{t('library')}</span>
        {filters.map((entry) => <button key={entry.id} onClick={() => setFilter(entry.id)} className={`sidebar-filter ${filter === entry.id ? 'selected' : ''}`}><span>{entry.id === 'movie' ? <Film size={15} /> : entry.id === 'series' ? <Tv size={15} /> : <Clapperboard size={15} />}{entry.id === 'anime' ? t('anime') : entry.id === 'movie' ? t('films') : entry.id === 'series' ? t('series') : t('all')}</span><small>{countFor(entry.id).toString().padStart(2, '0')}</small></button>)}
        <div className="sidebar-note"><span>{t('evenings')}</span><HeartMark /><p>{t('eveningsCopy')}</p></div>
      </aside>
      <div className="watchlist-main">
        <div className="watchlist-sort-mobile"><WatchlistSortControl value={sort} onChange={setSort} /></div>
        <div className="watchlist-list-head"><span>{filter === 'anime' ? t('anime') : filter === 'movie' ? t('films') : filter === 'series' ? t('series') : t('ourList')}</span><span>{shownItems.length.toString().padStart(2, '0')} {t('entries')}</span></div>
        {error && <p className="watchlist-error" role="status">{error}</p>}
        {loading ? <div className="watchlist-empty"><LoaderCircle className="spin" size={20} /><span>{t('loading')}</span></div> : error && shownItems.length === 0 ? null : shownItems.length === 0 ? <div className="watchlist-empty"><Clapperboard size={23} /><strong>{t('emptyTitle')}</strong><span>{t('emptyCopy')}</span></div> : <MediaTable items={shownItems} showKind={filter === 'all'} />}
      </div>
    </div>
  </section>
}

function HeartMark() { return <span className="sidebar-heart">♥</span> }

export default SeriesAndFilms
