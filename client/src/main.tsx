import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './HomePage'
import { LanguageProvider } from './lib/i18n'
import { AuthProvider } from './lib/auth'
import './lib/firebase'
import './styles.css'
import './theme.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><LanguageProvider><AuthProvider><App /></AuthProvider></LanguageProvider></React.StrictMode>)
