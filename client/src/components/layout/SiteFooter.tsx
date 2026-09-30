import { Heart } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'
import { navigateTo } from '../../lib/auth'

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="footer section-pad">
      <div className="footer-top">
        <span>{t('footerLine')}</span>
        <Heart size={19} fill="currentColor" aria-hidden="true" />
      </div>
      <p>{t('footerTitle')} <em>{t('footerEnd')}</em></p>
      <div className="footer-bottom">
        <a className="wordmark" href="/" onClick={(e) => { e.preventDefault(); navigateTo('/') }}>{t('brand')}<span className="wordmark-dot">.</span></a>
        <span>{t('footerSign')}</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('top')}</button>
      </div>
    </footer>
  )
}
