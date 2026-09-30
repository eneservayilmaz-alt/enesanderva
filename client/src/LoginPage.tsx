import { useState, useEffect, type FormEvent } from 'react'
import { Heart, Lock } from 'lucide-react'
import { useLanguage } from './lib/i18n'
import { useAuth, navigateTo } from './lib/auth'

export function LoginPage() {
  const { t } = useLanguage()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigateTo('/admin')
  }, [isAuthenticated])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const success = await login(email, password)
    setSubmitting(false)
    if (success) {
      navigateTo('/admin')
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="login-page">
      <div className={`login-card${shake ? ' login-shake' : ''}`}>
        <div className="login-icon">
          <Lock size={24} />
        </div>
        <h1>{t('loginTitle')}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>{t('loginEmail')}</span>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(false) }} required autoFocus />
          </label>
          <label>
            <span>{t('loginPassword')}</span>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false) }} required />
          </label>
          {error && <p className="login-error">{t('loginError')}</p>}
          <button type="submit" disabled={submitting}>{submitting ? '...' : t('loginButton')}</button>
          <a className="login-home-link" href="/" onClick={(event) => { event.preventDefault(); navigateTo('/') }}>{t('backToHome')}</a>
        </form>
        <span className="login-brand"><Heart size={11} fill="currentColor" /> {t('brand')}</span>
      </div>
    </div>
  )
}
