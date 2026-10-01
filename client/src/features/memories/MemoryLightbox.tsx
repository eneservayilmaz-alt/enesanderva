import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import CloudinaryPhoto from '../../CloudinaryPhoto'
import { useLanguage } from '../../lib/i18n'
import type { Memory } from './memoryService'
import './memories.css'
import { formatMemoryDate } from './memoryGroups'

export function MemoryLightbox({ memory, memories = [memory], onClose }: { memory: Memory; memories?: Memory[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [selectedId, setSelectedId] = useState(memory.id)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const selectedIndex = Math.max(0, memories.findIndex((item) => item.id === selectedId))
  const selected = memories[selectedIndex] ?? memory
  const hasGallery = memories.length > 1
  const move = (direction: number) => setSelectedId(memories[(selectedIndex + direction + memories.length) % memories.length].id)
  const { t, language } = useLanguage()
  const dateLabel = formatMemoryDate(selected.date, language)
  useEffect(() => {
    dialog.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [selectedId])
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.showModal()
    return () => { document.body.style.overflow = overflow; opener?.focus() }
  }, [])
  return createPortal(<dialog ref={dialog} className="memory-lightbox" aria-label={selected.title} onKeyDown={(event) => {
    if (hasGallery && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <button className="memory-lightbox-close" onClick={onClose} aria-label={t('cancel')} autoFocus><X size={24} /></button>
    <figure>
      <div className="memory-lightbox-stage" onDragStart={(event) => event.preventDefault()} onTouchStart={(event) => {
        const touch = event.touches[0]
        touchStart.current = { x: touch.clientX, y: touch.clientY }
      }} onTouchCancel={() => { touchStart.current = null }} onTouchEnd={(event) => {
        const start = touchStart.current
        touchStart.current = null
        const touch = event.changedTouches[0]
        if (!hasGallery || !start || !touch) return
        const dx = touch.clientX - start.x
        const dy = touch.clientY - start.y
        if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
      }}>
        {selected.imageUrl ? <img src={selected.imageUrl} alt={selected.title} draggable={false} /> : selected.publicId ? <CloudinaryPhoto publicId={selected.publicId} alt={selected.title} uncropped /> : null}
        {hasGallery && <>
          <button className="memory-lightbox-nav memory-lightbox-prev" onClick={() => move(-1)} aria-label={t('previousPhoto')}><ChevronLeft size={24} /></button>
          <button className="memory-lightbox-nav memory-lightbox-next" onClick={() => move(1)} aria-label={t('nextPhoto')}><ChevronRight size={24} /></button>
        </>}
      </div>
      <figcaption aria-live="polite"><strong>{selected.title}</strong><span>{dateLabel}{hasGallery && ` · ${selectedIndex + 1} / ${memories.length}`}</span></figcaption>
      {hasGallery && <div className="memory-lightbox-thumbnails" role="group" aria-label={dateLabel}>
        {memories.map((item, index) => <button key={item.id} aria-label={`${item.title} — ${index + 1}/${memories.length}`} aria-current={item.id === selected.id ? 'true' : undefined} onClick={() => setSelectedId(item.id)}>
          {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : item.publicId ? <CloudinaryPhoto publicId={item.publicId} alt="" width={160} height={120} /> : <span>{index + 1}</span>}
        </button>)}
      </div>}
    </figure>
  </dialog>, document.body)
}
