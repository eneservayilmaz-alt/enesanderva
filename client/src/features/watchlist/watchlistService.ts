import { DataLoadError } from '../../lib/dataErrors'

export type Kind = 'series' | 'movie'
export type Status = 'planned' | 'watching' | 'completed'

export type WatchItem = {
  id: string
  title: string
  kind: Kind
  status: Status
  season?: number
  episode?: number
}

export async function getWatchlist(signal?: AbortSignal): Promise<WatchItem[]> {
  let response: Response
  try {
    response = await fetch('/api/watchlist', { signal })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new DataLoadError('API_UNAVAILABLE')
  }

  let items: unknown
  try {
    items = await response.json()
  } catch {
    throw new DataLoadError('API_UNAVAILABLE')
  }
  if (!response.ok) {
    const code = items && typeof items === 'object' && 'code' in items ? String(items.code) : 'API_ERROR'
    throw new DataLoadError(code)
  }
  if (!Array.isArray(items)) throw new DataLoadError('API_UNAVAILABLE')
  return items as WatchItem[]
}
