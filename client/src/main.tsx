import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './HomePage'
import { LanguageProvider } from './lib/i18n'
import { AuthProvider } from './lib/auth'
import { SmoothScroll } from './components/layout/SmoothScroll'
import './lib/firebase'
import './styles.css'
import './theme.css'
import 'lenis/dist/lenis.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><SmoothScroll><LanguageProvider><AuthProvider><App /></AuthProvider></LanguageProvider></SmoothScroll></React.StrictMode>)
