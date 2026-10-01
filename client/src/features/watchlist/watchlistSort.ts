import type { WatchItem } from './watchlistService'

export type WatchlistSort = 'title-asc' | 'title-desc' | 'enes-desc' | 'erva-desc'
const titleOrder = new Intl.Collator('tr', { sensitivity: 'base', numeric: true })

export function sortWatchlist(items: readonly WatchItem[], sort: WatchlistSort = 'title-asc'): WatchItem[] {
  return [...items].sort((a, b) => {
    const alphabetical = titleOrder.compare(a.title, b.title)
    if (sort === 'title-desc') return -alphabetical
    if (sort === 'enes-desc') return (b.enesRating || 0) - (a.enesRating || 0) || alphabetical
    if (sort === 'erva-desc') return (b.ervaRating || 0) - (a.ervaRating || 0) || alphabetical
    return alphabetical
  })
}
