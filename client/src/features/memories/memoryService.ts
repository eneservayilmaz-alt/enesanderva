import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export type Memory = {
  id: string
  title: string
  date: string
  imageUrl: string
  publicId: string
}

function toMemory(id: string, value: Record<string, unknown>): Memory {
  const timestamp = value.createdAt as { toDate?: () => Date } | undefined
  const createdAt = timestamp?.toDate?.()
  const date = typeof value.date === 'string'
    ? value.date
    : createdAt?.toLocaleDateString('tr-TR') ?? ''

  return {
    id,
    title: typeof value.title === 'string' ? value.title : 'Birlikte güzel bir an',
    date,
    imageUrl: typeof value.imageUrl === 'string' ? value.imageUrl : '',
    publicId: typeof value.publicId === 'string' ? value.publicId : '',
  }
}

export function subscribeToMemories(
  onChange: (memories: Memory[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(collection(db, 'memories'), (snapshot) => {
    onChange(snapshot.docs.map((entry) => toMemory(entry.id, entry.data())))
  }, (error) => onError?.(error))
}
