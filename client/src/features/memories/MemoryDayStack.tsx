import { useState, type CSSProperties } from 'react'
import { ArrowUpRight, Heart } from 'lucide-react'
import CloudinaryPhoto from '../../CloudinaryPhoto'
import { MemoryLightbox } from './MemoryLightbox'
import type { Memory } from './memoryService'
import './memories.css'
import { useLanguage } from '../../lib/i18n'
import { formatMemoryDate } from './memoryGroups'

export function MemoryDayStack({ memories, index }: { memories: Memory[]; index: number }) {
  const [selected, setSelected] = useState<Memory | null>(null)
  const { language } = useLanguage()
  const dateLabel = formatMemoryDate(memories[0].date, language)
  const step = Math.min(26, 78 / Math.max(1, memories.length - 1))
  return <article className={`memory-card memory-day-card ${index === 0 ? 'memory-card--large' : ''}`}>
    <div className="memory-day-stack" style={{ '--stack-space': `${step * (memories.length - 1)}px` } as CSSProperties}>
      {memories.map((memory, leaf) => <button key={memory.id} className="memory-leaf memory-photo" onClick={() => setSelected(memory)} aria-label={`${memory.title} — ${dateLabel} (${leaf + 1}/${memories.length})`} style={{ '--leaf-offset': `${leaf * step}px`, '--leaf-angle': `${Math.min(leaf * .7, 4)}deg`, '--leaf-order': memories.length - leaf } as CSSProperties}>
        {memory.publicId ? <CloudinaryPhoto publicId={memory.publicId} alt={memory.title} width={1200} height={900} className="memory-cloudinary-image" /> : memory.imageUrl ? <img src={memory.imageUrl} alt={memory.title} className="memory-cloudinary-image" loading="lazy" /> : <span className="memory-image-placeholder" />}
        <span className="photo-index">{String(leaf + 1).padStart(2, '0')}</span>
        <span className="photo-heart"><Heart size={15} /></span>
        <span className="photo-title">{memory.title}</span>
      </button>)}
    </div>
    <div className="memory-caption"><span>{dateLabel}</span><span className="memory-day-count">{memories.length > 1 && <span>{String(memories.length).padStart(2, '0')}</span>}<ArrowUpRight size={15} /></span></div>
    {memories.length > 1 && <div className="memory-leaf-picker" role="group" aria-label={dateLabel}>{memories.map((memory, leaf) => <button key={memory.id} onClick={() => setSelected(memory)} aria-label={`${memory.title} — ${leaf + 1}/${memories.length}`}>{String(leaf + 1).padStart(2, '0')}</button>)}</div>}
    {selected && <MemoryLightbox memory={selected} memories={memories} onClose={() => setSelected(null)} />}
  </article>
}
