import { LoaderCircle } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import { getDataErrorKey } from '../../lib/dataErrors'
import { MemoryCard } from './MemoryCard'
import type { Memory } from './memoryService'

type MemoryArchivePageProps = {
  memories: Memory[]
  loading: boolean
  error: Error | null
  count: number
}

export function MemoryArchivePage({ memories, loading, error, count }: MemoryArchivePageProps) {
  const { t } = useLanguage()

  return <section className="archive-page section-pad">
    <div className="memories-heading archive-heading">
      <h1>{t('memoriesTitle')}<span className="accent">.</span><span className="archive-count">{String(count).padStart(2, '0')}</span></h1>
      <p>{t('memoryNote')}</p>
    </div>
    {loading ? <div className="archive-empty"><LoaderCircle className="spin" size={20} />{t('loadingMemories')}</div> : error ? <div className="archive-empty" role="status">{t(getDataErrorKey(error))}</div> : count === 0 ? <div className="archive-empty">{t('emptyMemories')}</div> : <div className="memory-grid archive-grid">
      {memories.map((memory, index) => <MemoryCard key={memory.id} memory={memory} index={index} />)}
    </div>}
    <div className="memories-foot"><span>{t('moreMemories')}</span><span>{String(count).padStart(2, '0')} {t('entries')}</span></div>
  </section>
}
