import { useEffect, useState, type PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Check, Film, LoaderCircle, Tv } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import { getDataErrorKey } from '../../lib/dataErrors'
import { getWatchlist, type WatchItem } from './watchlistService'
import { navigateTo } from '../../lib/auth'
import './watchlist-preview.css'

const PREVIEW_LIMIT = 3
const DETAIL_URL = '/dizi-filmler'

function positionPreview(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== 'mouse') return
  const width = Math.min(360, Math.max(240, window.innerWidth * .24))
  const height = width * .8
  const x = Math.max(16, Math.min(event.clientX + 28 + width <= window.innerWidth - 16 ? event.clientX + 28 : event.clientX - width - 28, window.innerWidth - width - 16))
  const y = Math.max(height / 2 + 16, Math.min(event.clientY, window.innerHeight - height / 2 - 16))
  event.currentTarget.style.setProperty('--preview-x', `${x}px`)
  event.currentTarget.style.setProperty('--preview-y', `${y}px`)
}

export function WatchlistPreview() {
  const { t } = useLanguage()
  const [items, setItems] = useState<WatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    const controller = new AbortController()

    getWatchlist(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setItems(data)
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setError(cause)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return (
    <section className="watchlist-preview section-pad" aria-labelledby="watchlist-preview-title">
      <div className="watch-preview-heading flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="watchlist-preview-title">{t('mediaTitle')}<span className="accent">.</span><sup className="archive-count" aria-label={`${items.length} ${t('entries')}`}>{loading || error ? '—' : String(items.length).padStart(2, '0')}</sup></h2>
          <p>{t('eveningsCopy')}</p>
        </div>
        <a className="text-link archive-browse-link" href={DETAIL_URL} onClick={event => { event.preventDefault(); navigateTo(DETAIL_URL) }}>{t('allMedia')} <ArrowRight size={15} /></a>
      </div>

      {loading ? (
        <p className="watch-preview-message" role="status"><LoaderCircle className="spin" size={18} aria-hidden="true" />{t('loading')}</p>
      ) : error ? (
        <p className="watch-preview-message" role="status">{t(getDataErrorKey(error))}</p>
      ) : items.length === 0 ? (
        <div className="watch-preview-message"><strong>{t('emptyTitle')}</strong><p>{t('emptyCopy')}</p></div>
      ) : (
        <div className="watch-preview-list">
          {items.slice(0, PREVIEW_LIMIT).map((item, index) => (
            <a className="watch-preview-link" href={DETAIL_URL} onPointerEnter={positionPreview} onPointerMove={positionPreview} onClick={(e) => { e.preventDefault(); navigateTo(DETAIL_URL) }} key={item.id}>
              <span className="watch-preview-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="watch-preview-content">
                {item.imageUrl && <img className="watch-preview-poster" src={item.imageUrl} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />}
                <div className="watch-preview-text">
                <span className="watch-preview-kind">
                  {item.kind === 'series' ? <Tv size={16} aria-hidden="true" /> : <Film size={16} aria-hidden="true" />}
                  {item.kind === 'anime' ? t('anime') : item.kind === 'series' ? t('seriesOne') : t('movie')}
                </span>
                <h3>{item.title}</h3>
                {item.kind !== 'movie' && <p className="watch-preview-progress">{t('season')} {item.season || 1} · {t('episode')} {item.episode || 1}</p>}
                </div>
              </div>
              <span className="watch-preview-status">
                {item.status === 'completed' && <Check size={14} aria-hidden="true" />}
                {item.status === 'completed' ? t('finished') : item.status === 'watching' ? t('ongoing') : t('planned')}
              </span>
              <ArrowUpRight className="watch-preview-arrow" size={22} aria-hidden="true" />
              <span className="watch-hover-preview" aria-hidden="true">
                <span className="watch-hover-cover">
                  <span className="watch-hover-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{item.kind === 'anime' ? t('animeOne') : item.kind === 'series' ? t('seriesOne') : t('movie')}</span></span>
                  <span className="watch-hover-title">{item.title}</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
      <div className="memories-foot"><span>{t('moreMemories')}</span><span>{loading || error ? '—' : String(items.length).padStart(2, '0')} {t('entries')}</span></div>
    </section>
  )
}
