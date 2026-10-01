import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import CloudinaryPhoto from '../../CloudinaryPhoto'
import { useLanguage } from '../../lib/i18n'
import type { Memory } from './memoryService'
import './memories.css'

export function MemoryLightbox({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { t } = useLanguage()
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.showModal()
    return () => { document.body.style.overflow = overflow; opener?.focus() }
  }, [])
  return createPortal(<dialog ref={dialog} className="memory-lightbox" aria-label={memory.title} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <button className="memory-lightbox-close" onClick={onClose} aria-label={t('cancel')} autoFocus><X size={24} /></button>
    <figure>
      {memory.imageUrl ? <img src={memory.imageUrl} alt={memory.title} /> : memory.publicId ? <CloudinaryPhoto publicId={memory.publicId} alt={memory.title} uncropped /> : null}
      <figcaption><strong>{memory.title}</strong><span>{memory.date}</span></figcaption>
    </figure>
  </dialog>, document.body)
}
