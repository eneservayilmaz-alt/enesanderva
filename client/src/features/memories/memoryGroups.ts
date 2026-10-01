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

export function groupMemoriesByDate(memories: Memory[]): Memory[][] {
  const groups = new Map<string, Memory[]>()
  for (const memory of memories) {
    const key = memoryDateKey(memory.date) || memory.id
    const group = groups.get(key) || []
    group.push(memory)
    groups.set(key, group)
  }
  // The oldest addition is leaf 01, which the stack places in front.
  return Array.from(groups.values(), (group) => group.sort((a, b) =>
    (a.createdAt ?? 0) - (b.createdAt ?? 0) || a.id.localeCompare(b.id),
  ))
}
