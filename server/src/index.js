import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { apiErrorHandler } from './middleware/apiErrorHandler.js'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

const app = express()
const port = Number(process.env.PORT || 4000)
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '32kb' }))

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true })

function getDatabase() {
  if (!getApps().length) {
    const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    let credential
    try {
      credential = credentials ? cert(JSON.parse(credentials)) : applicationDefault()
    } catch {
      const error = new Error('Firebase credentials could not be initialized.')
      error.code = 'FIREBASE_CREDENTIALS_INVALID'
      throw error
    }
    initializeApp({ credential })
  }
  return getFirestore()
}

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))

app.get('/api/uploads/signature', (_request, response) => {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env
  if (!cloudName || !apiKey || !apiSecret) return response.status(503).json({ error: 'Cloudinary henüz yapılandırılmadı.' })
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'bizim-anilarimiz'
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret)
  response.json({ cloudName, apiKey, timestamp, folder, signature })
})

app.get('/api/memories', async (_request, response, next) => {
  try {
    const snapshot = await getDatabase().collection('memories').orderBy('createdAt', 'desc').get()
    response.json(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
  } catch (error) { next(error) }
})

app.post('/api/memories', async (request, response, next) => {
  try {
    const { title, date, note, imageUrl, publicId } = request.body
    if (!title || !imageUrl || !publicId) return response.status(400).json({ error: 'Başlık ve yüklenmiş görsel bilgileri gerekli.' })
    const record = { title, date: date || null, note: note || '', imageUrl, publicId, createdAt: new Date().toISOString() }
    const created = await getDatabase().collection('memories').add(record)
    response.status(201).json({ id: created.id, ...record })
  } catch (error) { next(error) }
})

app.get('/api/watchlist', async (_request, response, next) => {
  try {
    const snapshot = await getDatabase().collection('watchlist').orderBy('createdAt', 'desc').get()
    response.json(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
  } catch (error) { next(error) }
})

app.post('/api/watchlist', async (request, response, next) => {
  try {
    const { title, kind, status = 'planned', season, episode } = request.body
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) return response.status(400).json({ error: 'Başlık 1–100 karakter arasında olmalı.' })
    if (!['series', 'movie'].includes(kind)) return response.status(400).json({ error: 'Tür dizi veya film olmalı.' })
    if (!['planned', 'watching', 'completed'].includes(status)) return response.status(400).json({ error: 'Geçersiz izleme durumu.' })
    const record = {
      title: title.trim(), kind, status,
      season: kind === 'series' ? Math.max(1, Number(season) || 1) : null,
      episode: kind === 'series' ? Math.max(1, Number(episode) || 1) : null,
      createdAt: new Date().toISOString(),
    }
    const created = await getDatabase().collection('watchlist').add(record)
    response.status(201).json({ id: created.id, ...record })
  } catch (error) { next(error) }
})

app.patch('/api/watchlist/:id', async (request, response, next) => {
  try {
    const { id } = request.params
    const { status, season, episode } = request.body
    const changes = {}
    if (status !== undefined) {
      if (!['planned', 'watching', 'completed'].includes(status)) return response.status(400).json({ error: 'Geçersiz izleme durumu.' })
      changes.status = status
    }
    if (season !== undefined || episode !== undefined) {
      if (!Number.isInteger(Number(season)) || Number(season) < 1 || !Number.isInteger(Number(episode)) || Number(episode) < 1) return response.status(400).json({ error: 'Sezon ve bölüm 1 veya üzeri tam sayı olmalı.' })
      changes.season = Number(season)
      changes.episode = Number(episode)
      changes.status = 'watching'
    }
    if (Object.keys(changes).length === 0) return response.status(400).json({ error: 'Güncellenecek bir alan gönderilmedi.' })
    const reference = getDatabase().collection('watchlist').doc(id)
    const document = await reference.get()
    if (!document.exists) return response.status(404).json({ error: 'Kayıt bulunamadı.' })
    await reference.update(changes)
    response.json({ id: document.id, ...document.data(), ...changes })
  } catch (error) { next(error) }
})

app.use(apiErrorHandler)

app.listen(port, () => console.log(`Anılar API ${port} portunda hazır.`))
