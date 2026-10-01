import type { ReactNode } from 'react'
import { Check, Film, Tv } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import type { WatchItem } from './watchlistService'
import { StarRating } from './StarRating'

export function MediaTable({ items, showKind, onStatusChange, renderActions, busy = false }: {
  items: WatchItem[]; showKind: boolean; onStatusChange?: (item: WatchItem) => void;
  renderActions?: (item: WatchItem) => ReactNode; busy?: boolean;
}) {
  const { t } = useLanguage()
  return <div className={`media-table ${showKind ? 'has-kind' : ''} ${renderActions ? 'has-actions' : ''}`} role="table" aria-label={t('ourList')}>
    <div className="media-table-header media-table-grid" role="row">
      {showKind && <span role="columnheader">{t('adminType')}</span>}
      <span role="columnheader">{t('titleLabel')}</span><span role="columnheader">{t('ratings')}</span><span role="columnheader">{t('adminStatus')}</span>
      {renderActions && <span role="columnheader">{t('actions')}</span>}
    </div>
    {items.map((item) => <div className="media-table-row media-table-grid" role="row" key={item.id}>
      {showKind && <div className="media-type-cell" role="cell" data-label={t('adminType')}>{t(item.kind === 'series' ? 'seriesOne' : item.kind === 'anime' ? 'animeOne' : 'movie')}</div>}
      <div className="media-title-cell" role="cell">
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />}
        <div><h3>{item.kind === 'movie' ? <Film size={15} /> : <Tv size={15} />}{item.title}</h3>
          {item.kind !== 'movie' && <p className="media-progress">{t('season')} {item.season || 1} · {t('episode')} {item.episode || 1}</p>}
        </div>
      </div>
      <div className="media-ratings-cell" role="cell" data-label={t('ratings')}><StarRating name={t('enesRating')} value={item.enesRating} /><StarRating name={t('ervaRating')} value={item.ervaRating} /></div>
      <div className="media-status-cell" role="cell" data-label={t('adminStatus')}><button className={`media-status-badge admin-status--${item.status}`} disabled={!onStatusChange || busy} onClick={() => onStatusChange?.(item)}>
        {item.status === 'completed' && <Check size={13} />}{t(item.status === 'completed' ? 'finished' : item.status === 'watching' ? 'ongoing' : 'planned')}
      </button></div>
      {renderActions && <div className="media-actions-cell" role="cell" data-label={t('actions')}>{renderActions(item)}</div>}
    </div>)}
  </div>
}
