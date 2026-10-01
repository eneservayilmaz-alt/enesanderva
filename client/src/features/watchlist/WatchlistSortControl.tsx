import { useLanguage } from '../../lib/i18n'
import type { WatchlistSort } from './watchlistSort'

export function WatchlistSortControl({ value, onChange }: { value: WatchlistSort; onChange: (value: WatchlistSort) => void }) {
  const { t } = useLanguage()
  return <label className="watchlist-sort"><span>{t('sortBy')}</span><select value={value} onChange={(event) => onChange(event.target.value as WatchlistSort)}>
    <option value="title-asc">{t('sortTitleAsc')}</option>
    <option value="title-desc">{t('sortTitleDesc')}</option>
    <option value="enes-desc">{t('sortEnesDesc')}</option>
    <option value="erva-desc">{t('sortErvaDesc')}</option>
  </select></label>
}
