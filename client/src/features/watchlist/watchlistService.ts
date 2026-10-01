import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { sortWatchlist } from './watchlistSort'

export type Kind = 'series' | 'movie' | 'anime'
export type Status = 'planned' | 'watching' | 'completed'

export type WatchItem = {
  id: string
  title: string
  kind: Kind
  status: Status
  season?: number | null
  episode?: number | null
  enesRating?: number
  ervaRating?: number
  imageUrl?: string
  createdAt?: string
}

export async function getWatchlist(signal?: AbortSignal): Promise<WatchItem[]> {
  signal?.throwIfAborted()
  const snapshot = await getDocs(query(collection(db, 'watchlist'), orderBy('createdAt', 'desc')))
  signal?.throwIfAborted()
  return sortWatchlist(snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id } as WatchItem)))
}

export async function updateWatchItem(id: string, changes: Partial<WatchItem>) {
  await updateDoc(doc(db, 'watchlist', id), changes)
}
