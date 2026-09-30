import { useEffect, useState } from 'react'
import { Trash2, Plus, LoaderCircle, Pencil, X } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../../lib/firebase'

type WatchItem = { id: string; title: string; kind: string; status: string; season: number | null; episode: number | null; createdAt: string }

export function AdminWatchlist() {
  const { t } = useLanguage()
  const [items, setItems] = useState<WatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<'series' | 'movie'>('series')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<WatchItem | null>(null)
  const [deleting, setDeleting] = useState<WatchItem | null>(null)
  const [editFields, setEditFields] = useState({ title: '', kind: 'series' as 'series' | 'movie' })

  const load = async () => {
    setLoading(true)
    const snap = await getDocs(query(collection(db, 'watchlist'), orderBy('createdAt', 'desc')))
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WatchItem)))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleting) return
    await deleteDoc(doc(db, 'watchlist', deleting.id))
    setItems((prev) => prev.filter((item) => item.id !== deleting.id))
    setDeleting(null)
  }

  const openEdit = (item: WatchItem) => { setEditing(item); setEditFields({ title: item.title, kind: item.kind === 'movie' ? 'movie' : 'series' }) }

  const saveEdit = async () => {
    if (!editing || !editFields.title.trim()) return
    setSaving(true)
    const update = { title: editFields.title.trim(), kind: editFields.kind, season: editFields.kind === 'series' ? editing.season || 1 : null, episode: editFields.kind === 'series' ? editing.episode || 1 : null }
    await updateDoc(doc(db, 'watchlist', editing.id), update)
    setItems((prev) => prev.map((item) => item.id === editing.id ? { ...item, ...update } : item))
    setEditing(null)
    setSaving(false)
  }

  const handleAdd = async () => {
    if (!title.trim()) return
    setSaving(true)
    const record = { title: title.trim(), kind, status: 'planned' as const, season: kind === 'series' ? 1 : null, episode: kind === 'series' ? 1 : null, createdAt: new Date().toISOString() }
    const ref = await addDoc(collection(db, 'watchlist'), record)
    setItems((prev) => [{ id: ref.id, ...record }, ...prev])
    setTitle(''); setShowForm(false); setSaving(false)
  }

  const cycleStatus = async (item: WatchItem) => {
    const next = item.status === 'planned' ? 'watching' : item.status === 'watching' ? 'completed' : 'planned'
    await updateDoc(doc(db, 'watchlist', item.id), { status: next })
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: next } : i))
  }

  return (
    <section>
      <div className="admin-section-header">
        <h1>{t('navMedia')}<span className="accent">.</span></h1>
        <button className="admin-add-btn" onClick={() => setShowForm(!showForm)}><Plus size={16} /> {t('add')}</button>
      </div>

      {showForm && <div className="admin-form">
        <label><span>{t('titleLabel')}</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('titlePlaceholder')} /></label>
        <div className="admin-form-row">
          <label className="admin-radio"><input type="radio" name="kind" checked={kind === 'series'} onChange={() => setKind('series')} /> {t('seriesOne')}</label>
          <label className="admin-radio"><input type="radio" name="kind" checked={kind === 'movie'} onChange={() => setKind('movie')} /> {t('movie')}</label>
        </div>
        <button className="admin-save-btn" onClick={handleAdd} disabled={saving}>{saving ? '...' : t('save')}</button>
      </div>}

      {loading ? <p className="admin-loading"><LoaderCircle className="spin" size={18} /> {t('loading')}</p> :
      items.length === 0 ? <p className="admin-empty">{t('emptyTitle')}</p> :
      <div className="admin-table">
        <div className="admin-table-head"><span>#</span><span>{t('titleLabel')}</span><span>{t('adminType')}</span><span>{t('adminStatus')}</span><span></span></div>
        {items.map((item, i) => (
          <div className="admin-table-row" key={item.id}>
            <span className="admin-row-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="admin-row-title">{item.title}</span>
            <span className="admin-row-kind">{item.kind === 'series' ? t('seriesOne') : t('movie')}</span>
            <button className={`admin-status-btn admin-status--${item.status}`} onClick={() => cycleStatus(item)}>
              {item.status === 'completed' ? t('finished') : item.status === 'watching' ? t('ongoing') : t('planned')}
            </button>
            <div className="admin-row-actions"><button className="admin-edit-btn" aria-label={t('edit')} onClick={() => openEdit(item)}><Pencil size={14} /></button><button className="admin-delete-btn" aria-label={t('delete')} onClick={() => setDeleting(item)}><Trash2 size={14} /></button></div>
          </div>
        ))}
      </div>}
      {editing && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(null) }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="media-edit-title"><button className="admin-modal-close" onClick={() => setEditing(null)} aria-label={t('cancel')}><X size={18} /></button><h2 id="media-edit-title">{t('editMedia')}</h2><label><span>{t('titleLabel')}</span><input value={editFields.title} onChange={(e) => setEditFields({ ...editFields, title: e.target.value })} /></label><div className="admin-form-row"><label className="admin-radio"><input type="radio" checked={editFields.kind === 'series'} onChange={() => setEditFields({ ...editFields, kind: 'series' })} /> {t('seriesOne')}</label><label className="admin-radio"><input type="radio" checked={editFields.kind === 'movie'} onChange={() => setEditFields({ ...editFields, kind: 'movie' })} /> {t('movie')}</label></div><div className="admin-modal-actions"><button className="admin-cancel-btn" onClick={() => setEditing(null)}>{t('cancel')}</button><button className="admin-save-btn" onClick={saveEdit} disabled={saving}>{saving ? '...' : t('save')}</button></div></section></div>}
      {deleting && <div className="admin-modal-backdrop"><section className="admin-modal admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="media-delete-title"><h2 id="media-delete-title">{t('deleteConfirmTitle')}</h2><p>{t('adminDeleteConfirm')}</p><div className="admin-modal-actions"><button className="admin-cancel-btn" onClick={() => setDeleting(null)}>{t('cancel')}</button><button className="admin-confirm-delete" onClick={handleDelete}>{t('confirmDelete')}</button></div></section></div>}
    </section>
  )
}
