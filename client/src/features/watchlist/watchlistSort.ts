import type { WatchItem } from './watchlistService'

export type WatchlistSort = 'title-asc' | 'title-desc' | 'enes-desc' | 'erva-desc' | 'enes-asc' | 'erva-asc'
const titleOrder = new Intl.Collator('tr', { sensitivity: 'base', numeric: true })

export function sortWatchlist(items: readonly WatchItem[], sort: WatchlistSort = 'title-asc'): WatchItem[] {
  return [...items].sort((a, b) => {
    const alphabetical = titleOrder.compare(a.title, b.title)
    if (sort === 'title-desc') return -alphabetical
    if (sort.startsWith('enes-') || sort.startsWith('erva-')) {
      const field = sort.startsWith('enes-') ? 'enesRating' : 'ervanurRating'
      const left = a[field] || 0, right = b[field] || 0
      if (!left && right) return 1
      if (left && !right) return -1
      return (sort.endsWith('asc') ? left - right : right - left) || alphabetical
    }
    return alphabetical
  })
}
