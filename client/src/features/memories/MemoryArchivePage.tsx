import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../../lib/i18n'
import { getDataErrorKey } from '../../lib/dataErrors'
import { MemoryCard } from './MemoryCard'
import type { Memory } from './memoryService'
import { MemoryLightbox } from './MemoryLightbox'
import { useRecordFocus } from '../../lib/useRecordFocus'
import { sortMemoriesByDateDescending } from './memoryGroups'

const ARCHIVE_PAGE_SIZE = 20

type MemoryArchivePageProps = {
  memories: Memory[]
  loading: boolean
  error: Error | null
  count: number
}

export function MemoryArchivePage({ memories, loading, error, count }: MemoryArchivePageProps) {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<Memory | null>(null)
  const [visibleCount, setVisibleCount] = useState(ARCHIVE_PAGE_SIZE)
  const orderedMemories = sortMemoriesByDateDescending(memories)
  const visibleMemories = orderedMemories.slice(0, visibleCount)
  useRecordFocus(!loading && !error, 'memory-')

  return <section className="archive-page section-pad">
    <div className="memories-heading archive-heading">
      <h1>{t('memoriesTitle')}<span className="accent">.</span><span className="archive-count">{String(count).padStart(2, '0')}</span></h1>
      <p>{t('memoryNote')}</p>
    </div>
    {loading ? <div className="archive-empty"><LoaderCircle className="spin" size={20} />{t('loadingMemories')}</div> : error ? <div className="archive-empty" role="status">{t(getDataErrorKey(error))}</div> : count === 0 ? <div className="archive-empty">{t('emptyMemories')}</div> : <>
      <div className="memory-grid archive-grid">
        {visibleMemories.map((memory, index) => <MemoryCard key={memory.id} memory={memory} index={index} onOpen={() => setSelected(memory)} />)}
      </div>
      {visibleCount < orderedMemories.length && <button className="archive-load-more" type="button" onClick={() => setVisibleCount(current => Math.min(current + ARCHIVE_PAGE_SIZE, orderedMemories.length))}>{t('showMore')}</button>}
    </>}
    <div className="memories-foot"><span>{t('moreMemories')}</span><span>{String(count).padStart(2, '0')} {t('entries')}</span></div>
    {selected && <MemoryLightbox memory={selected} memories={orderedMemories} onClose={() => setSelected(null)} />}
  </section>
}
