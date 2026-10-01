import { useEffect, useState } from 'react'
import { LoaderCircle, Search } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'

type SearchImage = { title: string; url: string }
export function ImageSearch({ title, value, onChange }: { title: string; value: string; onChange: (url: string) => void }) {
  const { t } = useLanguage()
  const [search, setSearch] = useState(title)
  const [images, setImages] = useState<SearchImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { setSearch(title) }, [title])
  useEffect(() => {
    const controller = new AbortController()
    if (!search.trim()) { setImages([]); setError(''); setLoading(false); return }
    setLoading(true); setError(''); setImages([])
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ action: 'query', format: 'json', origin: '*', generator: 'search', gsrsearch: search.trim(), gsrlimit: '12', prop: 'pageimages', piprop: 'original', pilicense: 'any' })
        const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, { signal: controller.signal })
        if (!response.ok) throw new Error('search')
        const data = await response.json() as { error?: unknown; query?: { pages?: Record<string, { title: string; original?: { source: string }; index?: number }> } }
        if (data.error) throw new Error('search')
        if (!controller.signal.aborted) setImages(Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0)).flatMap((page) => page.original?.source ? [{ title: page.title, url: page.original.source }] : []))
      } catch { if (!controller.signal.aborted) setError(t('imageSearchError')) }
      finally { if (!controller.signal.aborted) setLoading(false) }
    }, 600)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [search, t])
  return <div className="media-image-search">
    <label><span><Search size={13} /> {t('imageSearch')}</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('imageSearchPlaceholder')} /></label>
    <p className="image-search-note">{t('imageSearchSource')}</p>
    {loading && <p role="status"><LoaderCircle className="spin" size={16} /> {t('loading')}</p>}
    {error && <p role="alert" className="admin-form-error">{error}</p>}
    {!loading && !error && search.trim() && images.length === 0 && <p role="status">{t('noImages')}</p>}
    <div className="image-search-grid">{images.map((image) => <button type="button" key={image.url} aria-label={image.title} aria-pressed={value === image.url} className={value === image.url ? 'selected' : ''} onClick={() => onChange(image.url)}><img src={image.url} alt={image.title} loading="lazy" referrerPolicy="no-referrer" /><span>{image.title}</span></button>)}</div>
    <label><span>{t('imageUrl')}</span><input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://…" /></label>
    {value && <div className="selected-media-image"><img src={value} alt={title} referrerPolicy="no-referrer" /><button type="button" className="admin-cancel-btn" onClick={() => onChange('')}>{t('removeImage')}</button></div>}
  </div>
}
