import { useEffect, useState } from 'react'
import { subscribeToMemories, type Memory } from './memoryService'

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => subscribeToMemories(
    (items) => {
      setMemories(items)
      setLoading(false)
      setError(null)
    },
    (cause) => {
      const code = 'code' in cause ? String(cause.code) : 'unknown'
      console.warn(`[memories] ${code}`)
      setError(cause)
      setLoading(false)
    },
  ), [])

  return { memories, loading, error, count: memories.length }
}
