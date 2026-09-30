import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Check, LoaderCircle } from 'lucide-react'
import { db } from '../../lib/firebase'
import { getAboutDefaults, useLanguage } from '../../lib/i18n'

type LocaleContent = { first: string; second: string; copy1: string; copy2: string }
type Content = { tr: LocaleContent; en: LocaleContent }

export function AdminAbout() {
  const { t } = useLanguage()
  const [content, setContent] = useState<Content>({ tr: getAboutDefaults('tr'), en: getAboutDefaults('en') })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'siteContent', 'about')).then((snapshot) => {
      if (snapshot.exists()) setContent((current) => ({ ...current, ...(snapshot.data() as Partial<Content>) }))
    }).finally(() => setLoading(false))
  }, [])

  const change = (locale: 'tr' | 'en', field: keyof LocaleContent, value: string) => {
    setContent((current) => ({ ...current, [locale]: { ...current[locale], [field]: value } }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, 'siteContent', 'about'), content)
      setSaved(true)
    } finally { setSaving(false) }
  }

  if (loading) return <p className="admin-loading"><LoaderCircle className="spin" size={18} /> {t('loading')}</p>
  return <section>
    <div className="admin-section-header"><h1>{t('navAbout')}<span className="accent">.</span></h1></div>
    {(['tr', 'en'] as const).map((locale) => <div className="admin-form admin-about-form" key={locale}>
      <h2>{locale === 'tr' ? 'Türkçe' : 'English'}</h2>
      <label><span>{t('aboutHeading')}</span><input value={content[locale].first} onChange={(e) => change(locale, 'first', e.target.value)} /></label>
      <label><span>{t('aboutHeadingSecond')}</span><input value={content[locale].second} onChange={(e) => change(locale, 'second', e.target.value)} /></label>
      <label><span>{t('aboutParagraphOne')}</span><textarea value={content[locale].copy1} onChange={(e) => change(locale, 'copy1', e.target.value)} rows={4} /></label>
      <label><span>{t('aboutParagraphTwo')}</span><textarea value={content[locale].copy2} onChange={(e) => change(locale, 'copy2', e.target.value)} rows={3} /></label>
    </div>)}
    <button className="admin-save-btn admin-about-save" onClick={save} disabled={saving}>{saving ? '...' : saved ? <><Check size={14} /> {t('save')}</> : t('save')}</button>
  </section>
}
