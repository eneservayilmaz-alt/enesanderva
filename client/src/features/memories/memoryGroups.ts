import type { Memory } from './memoryService'

export function formatMemoryDate(date: string, language: 'tr' | 'en'): string {
  const parts = memoryDateKey(date).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!parts) return date
  const [, year, month, day] = parts.map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return date
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(parsed)
}

export function memoryDateKey(date: string): string {
  const value = date.trim().toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ')
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:t.*)?$/)
  const numeric = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  const months = ['ocak','şubat','mart','nisan','mayıs','haziran','temmuz','ağustos','eylül','ekim','kasım','aralık']
  const written = value.match(/^(\d{1,2}) (\S+) (\d{4})$/)
  if (iso) return `${iso[1]}-${Number(iso[2])}-${Number(iso[3])}`
  if (numeric) return `${numeric[3]}-${Number(numeric[2])}-${Number(numeric[1])}`
  if (written && months.includes(written[2])) return `${written[3]}-${months.indexOf(written[2]) + 1}-${Number(written[1])}`
  return value
}

function memoryDateValue(key: string): number | null {
  const parts = key.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!parts) return null
  const [, year, month, day] = parts.map(Number)
  const value = Date.UTC(year, month - 1, day)
  const parsed = new Date(value)
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
    ? value
    : null
}

export function sortMemoriesByDateDescending(memories: Memory[]): Memory[] {
  return [...memories].sort((a, b) => {
    const aDate = memoryDateValue(memoryDateKey(a.date))
    const bDate = memoryDateValue(memoryDateKey(b.date))
    if (aDate !== bDate) {
      if (aDate === null) return 1
      if (bDate === null) return -1
      return bDate - aDate
    }
    return (a.createdAt ?? 0) - (b.createdAt ?? 0) || a.id.localeCompare(b.id)
  })
}

export function groupMemoriesByDate(memories: Memory[]): Memory[][] {
  const groups = new Map<string, Memory[]>()
  for (const memory of memories) {
    const key = memoryDateKey(memory.date) || memory.id
    const group = groups.get(key) || []
    group.push(memory)
    groups.set(key, group)
  }
  // Show the newest date group first; within each stack, leaf 01 remains the oldest addition.
  return Array.from(groups.entries())
    .map(([key, group]) => ({ key, group: group.sort((a, b) =>
      (a.createdAt ?? 0) - (b.createdAt ?? 0) || a.id.localeCompare(b.id),
    ) }))
    .sort((a, b) => {
      const aDate = memoryDateValue(a.key)
      const bDate = memoryDateValue(b.key)
      if (aDate === null || bDate === null) return aDate === bDate ? 0 : aDate === null ? 1 : -1
      return bDate - aDate
    })
    .map(({ group }) => group)
}
