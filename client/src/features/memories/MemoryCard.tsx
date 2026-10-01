import { ArrowUpRight, Heart } from 'lucide-react'
import CloudinaryPhoto from '../../CloudinaryPhoto'
import type { Memory } from './memoryService'
import { navigateTo } from '../../lib/auth'
import './memories.css'
import { useLanguage } from '../../lib/i18n'
import { formatMemoryDate } from './memoryGroups'

type MemoryCardProps = {
  memory: Memory
  index: number
  linkToArchive?: boolean
  onOpen?: () => void
}

export function MemoryCard({ memory, index, linkToArchive = false, onOpen }: MemoryCardProps) {
  const { language } = useLanguage()
  const dateLabel = formatMemoryDate(memory.date, language)
  const image = memory.publicId
    ? <CloudinaryPhoto publicId={memory.publicId} alt={memory.title} width={1200} height={900} className="memory-cloudinary-image" />
    : memory.imageUrl
      ? <img className="memory-cloudinary-image" src={memory.imageUrl} alt={memory.title} loading="lazy" />
      : <div className="memory-image-placeholder" aria-label="Fotoğraf bağlantısı bekleniyor" />

  const content = <>
    <div className="memory-photo">
      {image}
      <span className="photo-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="photo-heart"><Heart size={15} /></span>
      <span className="photo-title">{memory.title}</span>
    </div>
    <div className="memory-caption"><span>{dateLabel}</span><ArrowUpRight size={15} /></div>
  </>

  return <article className={`memory-card record-focus ${index === 0 ? 'memory-card--large' : ''}`} id={`memory-${memory.id}`} tabIndex={-1}>
    {onOpen ? <button className="memory-card-button" onClick={onOpen} aria-label={`${memory.title} — ${dateLabel}`}>{content}</button> : linkToArchive ? <a className="memory-card-link" href="/anilarimiz" onClick={(e) => { e.preventDefault(); navigateTo('/anilarimiz') }} aria-label={`${memory.title} — Biriktirdiklerimiz`}>{content}</a> : content}
  </article>
}
