import type { ReactNode } from 'react'
import { Check, Film, Tv } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import type { WatchItem } from './watchlistService'
import { StarRating } from './StarRating'
import './media-table.css'
import { navigateTo } from '../../lib/auth'
import '../../lib/record-focus.css'

export function MediaTable({ items, showKind, onStatusChange, renderActions, busy = false }: {
  items: WatchItem[]; showKind: boolean; onStatusChange?: (item: WatchItem) => void;
  renderActions?: (item: WatchItem) => ReactNode; busy?: boolean;
}) {
  const { t } = useLanguage()
  const showProgress = items.some((item) => item.kind !== 'movie')
  return <div className={`media-table ${showKind ? 'has-kind' : ''} ${renderActions ? 'has-actions' : ''} ${showProgress ? 'has-progress' : ''}`} role="table" aria-label={t('ourList')}>
    <div className="media-table-header media-table-grid" role="row">
      {showKind && <span role="columnheader">{t('adminType')}</span>}
      <span role="columnheader">{t('mediaNameImage')}</span><span role="columnheader">{t('ratings')}</span>{showProgress && <span role="columnheader">{t('seasonEpisode')}</span>}<span role="columnheader">{t('adminStatus')}</span>
      {renderActions && <span role="columnheader">{t('actions')}</span>}
    </div>
    {items.map((item) => <div className={`media-table-row media-table-grid ${renderActions ? '' : 'record-focus'}`} id={renderActions ? undefined : `watch-item-${item.id}`} tabIndex={renderActions ? undefined : -1} role="row" key={item.id}>
      {showKind && <div className="media-type-cell" role="cell" data-label={t('adminType')}><div className="media-cell-value">{t(item.kind === 'series' ? 'seriesOne' : item.kind === 'anime' ? 'animeOne' : 'movie')}</div></div>}
      <div className="media-title-cell" role="cell" data-label={t('mediaNameImage')}>{renderActions ? <a className="media-cell-value media-title-content admin-record-link" href={`/dizi-filmler?focus=${encodeURIComponent(item.id)}`} onClick={event => { event.preventDefault(); navigateTo(`/dizi-filmler?focus=${encodeURIComponent(item.id)}`) }}>
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />}
        <div><h3>{item.kind === 'movie' ? <Film size={15} /> : <Tv size={15} />}{item.title}</h3></div>
      </a> : <div className="media-cell-value media-title-content">
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />}
        <div><h3>{item.kind === 'movie' ? <Film size={15} /> : <Tv size={15} />}{item.title}</h3>
        </div>
      </div>}</div>
      <div className="media-ratings-cell" role="cell" data-label={t('ratings')}><div className="media-cell-value"><StarRating name={t('enesRating')} value={item.enesRating} /><StarRating name={t('ervanurRating')} value={item.ervanurRating} /></div></div>
      {showProgress && <div className="media-progress-cell" role="cell" data-label={t('seasonEpisode')}><div className="media-cell-value media-progress-values">{item.kind === 'movie' ? <span aria-label={t('notApplicable')}>—</span> : <><span>{t('season')} <strong>{item.season ?? 1}</strong></span><span>{t('episode')} <strong>{item.episode ?? 1}</strong></span></>}</div></div>}
      <div className="media-status-cell" role="cell" data-label={t('adminStatus')}><div className="media-cell-value"><button className={`media-status-badge admin-status--${item.status}`} disabled={!onStatusChange || busy} onClick={() => onStatusChange?.(item)}>
        {item.status === 'completed' && <Check size={13} />}{t(item.status === 'completed' ? 'finished' : item.status === 'watching' ? 'ongoing' : 'planned')}
      </button></div></div>
      {renderActions && <div className="media-actions-cell" role="cell" data-label={t('actions')}><div className="media-cell-value">{renderActions(item)}</div></div>}
    </div>)}
  </div>
}
