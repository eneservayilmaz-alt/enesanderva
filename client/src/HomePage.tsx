import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowDown, ArrowRight, Heart, Menu, Moon, Sun, X } from 'lucide-react'
import SeriesAndFilms from './SeriesAndFilms'
import { useLanguage } from './lib/i18n'
import { MemoryArchivePage } from './features/memories/MemoryArchivePage'
import { MemoryDayStack } from './features/memories/MemoryDayStack'
import { groupMemoriesByDate } from './features/memories/memoryGroups'
import { useMemories } from './features/memories/useMemories'
import { WatchlistPreview } from './features/watchlist/WatchlistPreview'
import { SiteFooter } from './components/layout/SiteFooter'
import { getDataErrorKey } from './lib/dataErrors'
import { useAuth, navigateTo } from './lib/auth'
import { LoginPage } from './LoginPage'
import { AdminPage } from './AdminPage'
import { db } from './lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

type Theme = 'dark' | 'light'

const pageMotion = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.11 } } }
const sectionMotion: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } } }

const PAGES = ['hakkimizda', 'anilarimiz', 'dizi-filmler', 'giris'] as const
const ADMIN_SUBS = ['hakkimizda', 'anilarimiz', 'dizi-filmler'] as const
type AboutContent = { tr?: { first?: string; second?: string; copy1?: string; copy2?: string }; en?: { first?: string; second?: string; copy1?: string; copy2?: string } }

function currentPage(): string {
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '')
  if (path === '' || path === '/') return 'home'
  if (path === 'login') return 'giris'
  if (PAGES.includes(path as any)) return path
  if (path === 'admin') return 'admin'
  for (const sub of ADMIN_SUBS) {
    if (path === `admin/${sub}`) return `admin/${sub}`
  }
  return 'home'
}

function HomePage() {
  const { language, setLanguage, t } = useLanguage()
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('eae-theme') === 'light' ? 'light' : 'dark')
  const [page, setPage] = useState(currentPage)
  const { memories: savedMemories, count: memoryCount, loading: memoriesLoading, error: memoriesError } = useMemories()
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)

  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = language
    document.title = language === 'tr' ? 'Bizim Anılarımız — Birlikte, hep.' : 'Our Little Archive — Together, always.'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0C0C0B' : '#F1EFE7')
    localStorage.setItem('eae-theme', theme)
  }, [language, theme])

  useEffect(() => {
    getDoc(doc(db, 'siteContent', 'about')).then((snapshot) => {
      if (snapshot.exists()) setAboutContent(snapshot.data() as AboutContent)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const syncPage = () => {
      setPage(currentPage())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('popstate', syncPage)
    return () => window.removeEventListener('popstate', syncPage)
  }, [])

  // Admin guard: redirect to login if not authenticated
  useEffect(() => {
    if (authLoading) return
    if (page.startsWith('admin') && !isAuthenticated) {
      navigateTo('/giris')
    }
  }, [page, isAuthenticated, authLoading])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    setMenuOpen(false)
    navigateTo(path)
  }

  const scrollToEl = (target: string) => { setMenuOpen(false); document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }) }

  const isAdmin = page.startsWith('admin')
  const adminSub = page.startsWith('admin/') ? page.replace('admin/', '') : undefined
  const showChrome = page !== 'giris' && !isAdmin

  if (authLoading && page.startsWith('admin')) return <div className="login-page"><div className="login-card"><p>...</p></div></div>

  return <main className="site-shell">
    <AnimatePresence mode="wait">
      <motion.div className="language-page" key={`${language}-${page}`} variants={pageMotion} initial="hidden" animate="show" exit={{ opacity: 0, y: -8 }}>
        {showChrome && <header className="site-header flex items-center justify-between px-[7.2%] max-md:px-[6%]">
          <a className="wordmark flex items-center gap-2" href="/" onClick={(e) => go(e, '/')} aria-label={t('brand')}><span className="wordmark-heart inline-flex"><Heart size={15} fill="currentColor" /></span>{t('brand')}<span className="wordmark-dot">.</span></a>
          <nav className="desktop-nav flex items-center gap-9 max-md:hidden" aria-label={t('mainNav')}>
            <a className={`nav-link ${page === 'hakkimizda' ? 'active' : ''}`} href="/hakkimizda" onClick={(e) => go(e, '/hakkimizda')}>{t('navAbout')}</a>
            <a className={`nav-link ${page === 'anilarimiz' ? 'active' : ''}`} href="/anilarimiz" onClick={(e) => go(e, '/anilarimiz')}>{t('navMemories')}</a>
            <a className={`nav-link ${page === 'dizi-filmler' ? 'active' : ''}`} href="/dizi-filmler" onClick={(e) => go(e, '/dizi-filmler')}>{t('navMedia')}</a>
          </nav>
          <div className="header-controls flex items-center gap-2">
            <button className="header-control" onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')} aria-label={t('languageLabel')} title={t('languageLabel')}>{language === 'tr' ? 'EN' : 'TR'}</button>
            <button className="header-control" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('themeLabel') : t('themeDarkLabel')} title={theme === 'dark' ? t('themeLabel') : t('themeDarkLabel')}>{theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}</button>
          </div>
          <button className="mobile-menu hidden max-md:block" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav flex flex-col" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><a onClick={(e) => go(e, '/hakkimizda')} href="/hakkimizda">{t('navAbout')}</a><a onClick={(e) => go(e, '/anilarimiz')} href="/anilarimiz">{t('navMemories')}</a><a onClick={(e) => go(e, '/dizi-filmler')} href="/dizi-filmler">{t('navMedia')}</a></motion.nav>}</AnimatePresence>
        </header>}

        {page === 'home' && <>
        <motion.section className="hero hero-viewport" id="top" variants={sectionMotion}>
          <div className="hero-meta"><span>{t('heroMeta')}</span><span>{t('heroAside')}</span></div>
          <motion.h1 initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } }}>
            <motion.span className="hero-title-line" variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}>{t('heroFirst')}</motion.span>
            <motion.em className="hero-title-line" variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}>{t('heroSecond')}</motion.em>
          </motion.h1>
          <div className="hero-bottom">
            <p>{t('heroCopy')}</p>
            <button className="round-link" onClick={() => scrollToEl('#anilarimiz')} aria-label={t('scroll')}><ArrowDown size={18} /></button>
            <span className="hero-note">{t('heroNote')} <Heart size={12} fill="currentColor" /></span>
          </div>
          <span className="hero-edge-label">{t('scroll')}</span>
        </motion.section>

        <motion.section className="memories section-pad" id="anilarimiz" variants={sectionMotion}>
          <div className="section-kicker"><span>{t('navMemories').toLocaleUpperCase(language === 'tr' ? 'tr-TR' : 'en-US')}</span><span>{t('memoryAside')}</span></div>
          <div className="memories-heading flex items-end justify-between max-md:block"><h2>{t('memoriesTitle')}<span className="accent">.</span><sup className="archive-count">{String(memoryCount).padStart(2, '0')}</sup></h2><div className="memories-heading-actions"><p>{t('memoryNote')}</p><a className="text-link archive-browse-link" href="/anilarimiz" onClick={(e) => go(e, '/anilarimiz')}>{t('allMemories')} <ArrowRight size={15} /></a></div></div>
          {memoriesLoading ? <div className="archive-empty home-memory-empty">{t('loadingMemories')}</div> : memoriesError ? <div className="archive-empty home-memory-empty" role="status">{t(getDataErrorKey(memoriesError))}</div> : savedMemories.length > 0 ? <div className="memory-grid home-memory-grid">
            {groupMemoriesByDate(savedMemories).slice(0, 3).map((memories, index) => <MemoryDayStack key={memories[0].id} memories={memories} index={index} />)}
          </div> : <div className="archive-empty home-memory-empty">{t('emptyMemories')}</div>}
          <div className="memories-foot"><span>{t('moreMemories')}</span><span>{String(memoryCount).padStart(2, '0')} {t('entries')}</span></div>
        </motion.section>

        <WatchlistPreview />

        </>}
        {page === 'giris' && <LoginPage />}
        {isAdmin && isAuthenticated && <AdminPage subPage={adminSub} theme={theme} setTheme={setTheme} />}
        {page === 'anilarimiz' && <MemoryArchivePage memories={savedMemories} loading={memoriesLoading} error={memoriesError} count={memoryCount} />}
        {page === 'dizi-filmler' && <SeriesAndFilms />}
        {page === 'hakkimizda' && <motion.section className="about-page section-pad" variants={sectionMotion}>
          <h1>{aboutContent?.[language]?.first || t('aboutFirst')}<br /><em>{aboutContent?.[language]?.second || t('aboutSecond')}</em></h1>
          <div className="about-page-copy"><p>{aboutContent?.[language]?.copy1 || t('aboutCopy1')}</p><p>{aboutContent?.[language]?.copy2 || t('aboutCopy2')}</p></div>
          <div className="stats-row"><div><strong>∞</strong><span>{t('statOne')}</span></div><div><strong>02</strong><span>{t('statTwo')}</span></div><span className="stats-mark">{t('together')}</span></div>
        </motion.section>}
        {showChrome && <SiteFooter />}
      </motion.div>
    </AnimatePresence>
  </main>
}

export default HomePage
