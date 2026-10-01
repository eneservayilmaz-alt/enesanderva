import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Trash2, Plus, LoaderCircle, Pencil, X, ImagePlus } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { MemoryDateInput } from './MemoryDateInput'
import { getDataErrorKey } from '../../lib/dataErrors'
import CloudinaryPhoto from '../../CloudinaryPhoto'
import '../watchlist/media-table.css'
import './admin-memory-table.css'

type Memory = { id: string; title: string; date: string; note: string; imageUrl: string; publicId: string; createdAt: string }
type MemoryFields = { title: string; date: string; note: string; imageUrl: string; publicId: string }
const emptyFields: MemoryFields = { title: '', date: '', note: '', imageUrl: '', publicId: '' }

export function AdminMemories() {
  const { t } = useLanguage()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Memory | null>(null)
  const [fields, setFields] = useState<MemoryFields>(emptyFields)
  const [uploadError, setUploadError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [deleting, setDeleting] = useState<Memory | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const snap = await getDocs(query(collection(db, 'memories'), orderBy('createdAt', 'desc')))
      setMemories(snap.docs.map((entry) => ({ id: entry.id, ...entry.data() } as Memory)))
    } catch (error) { setLoadError(t(getDataErrorKey(error))) } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  const openAdd = () => {
    setEditing(null)
    setFields(emptyFields)
    setUploadError('')
    setEditorOpen(true)
  }

  const openEdit = (memory: Memory) => {
    setEditing(memory)
    setFields({ title: memory.title || '', date: memory.date || '', note: memory.note || '', imageUrl: memory.imageUrl || '', publicId: memory.publicId || '' })
    setUploadError('')
    setEditorOpen(true)
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadError(t('imageOnly')); return }
    if (file.size > 10 * 1024 * 1024) { setUploadError(t('imageTooLarge')); return }

    setUploading(true)
    setUploadError('')
    try {
      const signatureResponse = await fetch('/api/uploads/signature')
      if (!signatureResponse.ok) throw new Error(t('imageUploadFailed'))
      const signature = await signatureResponse.json() as { cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string }
      const form = new FormData()
      form.append('file', file)
      form.append('api_key', signature.apiKey)
      form.append('timestamp', String(signature.timestamp))
      form.append('folder', signature.folder)
      form.append('signature', signature.signature)
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: 'POST', body: form })
      const result = await response.json() as { secure_url?: string; public_id?: string; error?: { message?: string } }
      if (!response.ok || !result.secure_url || !result.public_id) throw new Error(result.error?.message || t('imageUploadFailed'))
      setFields((current) => ({ ...current, imageUrl: result.secure_url!, publicId: result.public_id! }))
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : t('imageUploadFailed'))
    } finally { setUploading(false) }
  }

  const handleSave = async () => {
    if (!fields.title.trim() || !fields.imageUrl.trim() || uploading) return
    setSaving(true)
    const values = { title: fields.title.trim(), date: fields.date.trim(), note: fields.note.trim(), imageUrl: fields.imageUrl.trim(), publicId: fields.publicId }
    try {
      if (editing) {
        await updateDoc(doc(db, 'memories', editing.id), values)
        setMemories((prev) => prev.map((memory) => memory.id === editing.id ? { ...memory, ...values } : memory))
      } else {
        const record = { ...values, createdAt: new Date().toISOString() }
        const ref = await addDoc(collection(db, 'memories'), record)
        setMemories((prev) => [{ id: ref.id, ...record }, ...prev])
      }
      setEditorOpen(false)
    } catch (error) {
      setUploadError(getDataErrorKey(error) === 'dataPermissionDenied' ? t('memoryWriteDenied') : error instanceof Error ? error.message : t('saveError'))
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    await deleteDoc(doc(db, 'memories', deleting.id))
    setMemories((prev) => prev.filter((memory) => memory.id !== deleting.id))
    setDeleting(null)
  }

  const changeImageUrl = (imageUrl: string) => setFields((current) => ({ ...current, imageUrl, publicId: '' }))

  return (
    <section>
      <div className="admin-section-header">
        <h1>{t('navMemories')}<span className="accent">.</span></h1>
        <button className="admin-add-btn" onClick={openAdd}><Plus size={16} /> {t('add')}</button>
      </div>

      {loadError && <p className="admin-form-error" role="alert">{loadError}</p>}
      {loading ? <p className="admin-loading"><LoaderCircle className="spin" size={18} /> {t('loadingMemories')}</p> :
      memories.length === 0 ? <p className="admin-empty">{t('emptyMemories')}</p> :
      <div className="media-table has-actions admin-memory-table" role="table" aria-label={t('navMemories')}>
        <div className="media-table-header media-table-grid" role="row"><span role="columnheader">{t('mediaNameImage')}</span><span role="columnheader">{t('adminMemoryDate')}</span><span role="columnheader">{t('actions')}</span></div>
        {memories.map((memory) => (
          <div className="media-table-row media-table-grid" role="row" key={memory.id}>
            <div className="media-title-cell" role="cell" data-label={t('mediaNameImage')}><div className="media-cell-value media-title-content">
              {memory.publicId ? <CloudinaryPhoto publicId={memory.publicId} alt={memory.title} width={160} height={160} /> : memory.imageUrl ? <img src={memory.imageUrl} alt={memory.title} loading="lazy" /> : <span className="admin-memory-no-image"><ImagePlus size={20} /></span>}
              <div><h3>{memory.title}</h3></div>
            </div></div>
            <div role="cell" data-label={t('adminMemoryDate')}><div className="media-cell-value admin-memory-date">{memory.date || '—'}</div></div>
            <div className="media-actions-cell" role="cell" data-label={t('actions')}><div className="media-cell-value admin-row-actions"><button className="admin-edit-btn" aria-label={`${t('edit')}: ${memory.title}`} onClick={() => openEdit(memory)}><Pencil size={14} /></button><button className="admin-delete-btn" aria-label={`${t('delete')}: ${memory.title}`} onClick={() => setDeleting(memory)}><Trash2 size={14} /></button></div></div>
          </div>
        ))}
      </div>}

      {editorOpen && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !uploading && !saving) setEditorOpen(false) }}>
        <section className="admin-modal admin-memory-modal" role="dialog" aria-modal="true" aria-labelledby="memory-editor-title">
          <button className="admin-modal-close" onClick={() => setEditorOpen(false)} aria-label={t('cancel')} disabled={uploading || saving}><X size={18} /></button>
          <h2 id="memory-editor-title">{editing ? t('editMemory') : t('addMemory')}</h2>

          <label><span>{t('adminMemoryImage')}</span><input type="url" value={fields.imageUrl} onChange={(event) => changeImageUrl(event.target.value)} placeholder="https://..." /></label>
          {fields.imageUrl && <img className="admin-memory-preview" src={fields.imageUrl} alt={t('memoryImagePreview')} />}
          {!editing && <>
            <input ref={fileInput} className="admin-file-input" type="file" accept="image/*" onChange={uploadImage} />
            <button className="admin-image-picker" type="button" onClick={() => fileInput.current?.click()} disabled={uploading}><ImagePlus size={16} />{uploading ? <><LoaderCircle className="spin" size={15} /> {t('uploadingImage')}</> : t('chooseImage')}</button>
          </>}
          <label><span>{t('adminMemoryTitle')}</span><input value={fields.title} onChange={(event) => setFields({ ...fields, title: event.target.value })} /></label>
          <MemoryDateInput label={t('adminMemoryDate')} value={fields.date} onChange={date => setFields(current => ({ ...current, date }))} dates={memories.map(memory => memory.date)} placeholder={t('memoryDatePlaceholder')} />
          <label><span>{t('adminMemoryNote')}</span><textarea rows={3} value={fields.note} onChange={(event) => setFields({ ...fields, note: event.target.value })} /></label>
          {uploadError && <p className="admin-form-error" role="alert">{uploadError}</p>}
          <div className="admin-modal-actions"><button className="admin-cancel-btn" onClick={() => setEditorOpen(false)} disabled={uploading || saving}>{t('cancel')}</button><button className="admin-save-btn" onClick={handleSave} disabled={saving || uploading || !fields.title.trim() || !fields.imageUrl.trim()}>{saving ? '...' : editing ? t('save') : t('add')}</button></div>
        </section>
      </div>}

      {deleting && <div className="admin-modal-backdrop"><section className="admin-modal admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="memory-delete-title"><h2 id="memory-delete-title">{t('deleteConfirmTitle')}</h2><p>{t('adminDeleteConfirm')}</p><div className="admin-modal-actions"><button className="admin-cancel-btn" onClick={() => setDeleting(null)}>{t('cancel')}</button><button className="admin-confirm-delete" onClick={handleDelete}>{t('confirmDelete')}</button></div></section></div>}
    </section>
  )
}
