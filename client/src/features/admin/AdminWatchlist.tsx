import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Trash2, Plus, LoaderCircle, Pencil, X } from 'lucide-react'
import { collection, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useLanguage } from '../../lib/i18n'
import { getDataErrorKey } from '../../lib/dataErrors'
import { getWatchlist, type Kind, type WatchItem } from '../watchlist/watchlistService'
import { MediaTable } from '../watchlist/MediaTable'
import { StarRating } from '../watchlist/StarRating'
import { ImageSearch } from '../watchlist/ImageSearch'
import { sortWatchlist } from '../watchlist/watchlistSort'

const emptyFields = { title: '', kind: 'series' as Kind, enesRating: 0, ervaRating: 0, imageUrl: '', season: 1, episode: 1 }
export function AdminWatchlist() {
  const { t } = useLanguage()
  const [items, setItems] = useState<WatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<WatchItem | null>(null)
  const [deleting, setDeleting] = useState<WatchItem | null>(null)
  const [fields, setFields] = useState(emptyFields)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const dialog = useRef<HTMLElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const busy = useRef(false)
  busy.current = saving

  useEffect(() => {
    const controller = new AbortController()
    getWatchlist(controller.signal).then(setItems).catch((cause) => { if (!controller.signal.aborted) setError(t(getDataErrorKey(cause))) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [t])

  useEffect(() => {
    if (!editorOpen && !deleting) return
    opener.current = document.activeElement as HTMLElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector<HTMLElement>('input,button')?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy.current) { setEditorOpen(false); setDeleting(null) }
      if (event.key !== 'Tab') return
      const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]') || [])
      const first = elements[0], last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); opener.current?.focus() }
  }, [editorOpen, deleting])

  const openEditor = (item?: WatchItem) => {
    setEditing(item || null)
    setFields(item ? { title: item.title, kind: item.kind, enesRating: item.enesRating || 0, ervaRating: item.ervaRating || 0, imageUrl: item.imageUrl || '', season: item.season || 1, episode: item.episode || 1 } : emptyFields)
    setError(''); setEditorOpen(true)
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    if (saving || !fields.title.trim()) return
    if (fields.kind !== 'movie' && (!Number.isInteger(fields.season) || fields.season < 1 || !Number.isInteger(fields.episode) || fields.episode < 1)) { setError(t('invalidProgress')); return }
    if (fields.imageUrl && !/^https?:\/\//i.test(fields.imageUrl.trim())) { setError(t('invalidImageUrl')); return }
    setSaving(true); setError('')
    const values = { ...fields, title: fields.title.trim(), imageUrl: fields.imageUrl.trim(), season: fields.kind !== 'movie' ? fields.season : null, episode: fields.kind !== 'movie' ? fields.episode : null }
    try {
      if (editing) {
        await updateDoc(doc(db, 'watchlist', editing.id), values)
        setItems((previous) => previous.map((item) => item.id === editing.id ? { ...item, ...values } : item))
      } else {
        const record = { ...values, status: 'planned' as const, createdAt: new Date().toISOString() }
        const reference = await addDoc(collection(db, 'watchlist'), record)
        setItems((previous) => [{ id: reference.id, ...record }, ...previous])
      }
      setEditorOpen(false)
    } catch (cause) { setError(`${t('saveError')} ${t(getDataErrorKey(cause))}`) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting || saving) return
    setSaving(true); setError('')
    try {
      await deleteDoc(doc(db, 'watchlist', deleting.id))
      setItems((previous) => previous.filter((item) => item.id !== deleting.id)); setDeleting(null)
    } catch (cause) { setError(t(getDataErrorKey(cause))) }
    finally { setSaving(false) }
  }

  const cycleStatus = async (item: WatchItem) => {
    setSaving(true); setError('')
    const status = item.status === 'planned' ? 'watching' : item.status === 'watching' ? 'completed' : 'planned'
    try {
      await updateDoc(doc(db, 'watchlist', item.id), { status })
      setItems((previous) => previous.map((entry) => entry.id === item.id ? { ...entry, status } : entry))
    } catch (cause) { setError(t(getDataErrorKey(cause))) }
    finally { setSaving(false) }
  }

  return <section>
    <div className="admin-section-header"><h1>{t('navMedia')}<span className="accent">.</span></h1><button className="admin-add-btn" onClick={() => openEditor()}><Plus size={16} /> {t('add')}</button></div>
    {error && !editorOpen && !deleting && <p className="admin-form-error" role="alert">{error}</p>}
    {loading ? <p className="admin-loading"><LoaderCircle className="spin" size={18} /> {t('loading')}</p> : items.length === 0 ? <p className="admin-empty">{t('emptyTitle')}</p> : <MediaTable items={sortWatchlist(items)} showKind busy={saving} onStatusChange={cycleStatus} renderActions={(item) => <div className="admin-row-actions"><button className="admin-edit-btn" disabled={saving} aria-label={t('edit')} onClick={() => openEditor(item)}><Pencil size={14} /></button><button className="admin-delete-btn" disabled={saving} aria-label={t('delete')} onClick={() => { setError(''); setDeleting(item) }}><Trash2 size={14} /></button></div>} />}

    {editorOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditorOpen(false) }}><section ref={dialog} className="admin-modal media-editor-modal" role="dialog" aria-modal="true" aria-labelledby="media-editor-title">
      <button className="admin-modal-close" disabled={saving} onClick={() => setEditorOpen(false)} aria-label={t('cancel')}><X size={18} /></button>
      <h2 id="media-editor-title">{editing ? t('editMedia') : t('add')}</h2>
      <form onSubmit={save}><fieldset disabled={saving} className="media-editor-fields">
        <label><span>{t('titleLabel')}</span><input required maxLength={100} value={fields.title} onChange={(event) => setFields({ ...fields, title: event.target.value })} placeholder={t('titlePlaceholder')} /></label>
        <div className="admin-form-row">{(['series', 'movie', 'anime'] as const).map((kind) => <label className="admin-radio" key={kind}><input type="radio" name="kind" checked={fields.kind === kind} onChange={() => setFields({ ...fields, kind })} /> {t(kind === 'series' ? 'seriesOne' : kind)}</label>)}</div>
        {fields.kind !== 'movie' && <div className="media-editor-progress"><h3>{t('seasonEpisode')}</h3><label><span>{t('season')}</span><input type="number" inputMode="numeric" required min={1} step={1} value={fields.season || ''} onChange={(event) => setFields({ ...fields, season: Number(event.target.value) })} /></label><label><span>{t('episode')}</span><input type="number" inputMode="numeric" required min={1} step={1} value={fields.episode || ''} onChange={(event) => setFields({ ...fields, episode: Number(event.target.value) })} /></label></div>}
        <StarRating name={t('enesRating')} value={fields.enesRating} onChange={(enesRating) => setFields({ ...fields, enesRating })} disabled={saving} />
        <StarRating name={t('ervaRating')} value={fields.ervaRating} onChange={(ervaRating) => setFields({ ...fields, ervaRating })} disabled={saving} />
        <ImageSearch title={fields.title} value={fields.imageUrl} onChange={(imageUrl) => setFields((current) => ({ ...current, imageUrl }))} />
      </fieldset>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-modal-actions"><button type="button" disabled={saving} className="admin-cancel-btn" onClick={() => setEditorOpen(false)}>{t('cancel')}</button><button type="submit" className="admin-save-btn" disabled={saving}>{saving && <LoaderCircle className="spin" size={15} />}{t('save')}</button></div></form>
    </section></div>}
    {deleting && <div className="admin-modal-backdrop"><section ref={dialog} className="admin-modal admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="media-delete-title"><h2 id="media-delete-title">{t('deleteConfirmTitle')}</h2><p>{t('adminDeleteConfirm')}</p>{error && <p role="alert" className="admin-form-error">{error}</p>}<div className="admin-modal-actions"><button disabled={saving} className="admin-cancel-btn" onClick={() => setDeleting(null)}>{t('cancel')}</button><button disabled={saving} className="admin-confirm-delete" onClick={handleDelete}>{t('confirmDelete')}</button></div></section></div>}
  </section>
}
