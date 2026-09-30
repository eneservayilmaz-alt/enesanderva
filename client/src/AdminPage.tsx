import { useState } from 'react'
import { Heart, Home, Image, Tv, LogOut, Menu, X, Info, Moon, Sun } from 'lucide-react'
import { useLanguage } from './lib/i18n'
import { useAuth, navigateTo } from './lib/auth'
import { AdminMemories } from './features/admin/AdminMemories'
import { AdminWatchlist } from './features/admin/AdminWatchlist'
import { AdminAbout } from './features/admin/AdminAbout'

type AdminTab = 'dashboard' | 'hakkimizda' | 'anilarimiz' | 'dizi-filmler'

export function AdminPage({ subPage, theme, setTheme }: { subPage?: string; theme: 'dark' | 'light'; setTheme: (theme: 'dark' | 'light') => void }) {
  const { t, language, setLanguage } = useLanguage()
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const tab: AdminTab = subPage === 'hakkimizda' ? 'hakkimizda' : subPage === 'anilarimiz' ? 'anilarimiz' : subPage === 'dizi-filmler' ? 'dizi-filmler' : 'dashboard'

  return (
    <div className="admin-shell">
      <button className="admin-menu-toggle" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? t('closeMenu') : t('openMenu')}>{sidebarOpen ? <X size={19} /> : <Menu size={19} />}</button>
      {sidebarOpen && <button className="admin-sidebar-backdrop" aria-label={t('closeMenu')} onClick={() => setSidebarOpen(false)} />}
      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <span className="admin-sidebar-brand"><Heart size={11} fill="currentColor" /> {t('brand')}</span>
        <nav className="admin-sidebar-nav">
          <a className={`admin-nav-item${tab === 'dashboard' ? ' active' : ''}`} href="/admin" onClick={(e) => { e.preventDefault(); setSidebarOpen(false); navigateTo('/admin') }}><Home size={16} /> {t('adminTitle')}</a>
          <a className={`admin-nav-item${tab === 'hakkimizda' ? ' active' : ''}`} href="/admin/hakkimizda" onClick={(e) => { e.preventDefault(); setSidebarOpen(false); navigateTo('/admin/hakkimizda') }}><Info size={16} /> {t('navAbout')}</a>
          <a className={`admin-nav-item${tab === 'anilarimiz' ? ' active' : ''}`} href="/admin/anilarimiz" onClick={(e) => { e.preventDefault(); setSidebarOpen(false); navigateTo('/admin/anilarimiz') }}><Image size={16} /> {t('navMemories')}</a>
          <a className={`admin-nav-item${tab === 'dizi-filmler' ? ' active' : ''}`} href="/admin/dizi-filmler" onClick={(e) => { e.preventDefault(); setSidebarOpen(false); navigateTo('/admin/dizi-filmler') }}><Tv size={16} /> {t('navMedia')}</a>
        </nav>
        <div className="admin-sidebar-controls">
          <button className="header-control" onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')} aria-label={t('languageLabel')}>{language === 'tr' ? 'EN' : 'TR'}</button>
          <button className="header-control" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('themeLabel') : t('themeDarkLabel')}>{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}</button>
        </div>
        <button className="admin-logout" onClick={logout}><LogOut size={14} /> {t('adminLogout')}</button>
        <span className="admin-sidebar-user">{user?.email}</span>
      </aside>
      <main className="admin-main section-pad">
        {tab === 'dashboard' && <section>
          <h1>{t('adminTitle')}<span className="accent">.</span></h1>
          <p className="admin-welcome">{t('adminWelcome')}</p>
          <div className="admin-cards">
            <a className="admin-card" href="/admin/hakkimizda" onClick={(e) => { e.preventDefault(); navigateTo('/admin/hakkimizda') }}><Info size={22} /><span>{t('navAbout')}</span></a>
            <a className="admin-card" href="/admin/anilarimiz" onClick={(e) => { e.preventDefault(); navigateTo('/admin/anilarimiz') }}><Image size={22} /><span>{t('navMemories')}</span></a>
            <a className="admin-card" href="/admin/dizi-filmler" onClick={(e) => { e.preventDefault(); navigateTo('/admin/dizi-filmler') }}><Tv size={22} /><span>{t('navMedia')}</span></a>
          </div>
        </section>}
        {tab === 'hakkimizda' && <AdminAbout />}
        {tab === 'anilarimiz' && <AdminMemories />}
        {tab === 'dizi-filmler' && <AdminWatchlist />}
      </main>
    </div>
  )
}
