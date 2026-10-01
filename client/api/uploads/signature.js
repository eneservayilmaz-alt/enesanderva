import { createHash } from 'node:crypto'

export default async function uploadSignature(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return response.status(401).json({ error: 'Admin oturumu gerekli.' })
  const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME
  const cloudKey = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET
  if (!apiKey || !cloudName || !cloudKey || !secret) return response.status(503).json({ code: 'UPLOAD_NOT_CONFIGURED', error: 'Görsel yükleme servisi yapılandırılmamış.' })
  try {
    const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(10000) })
    if (!authResponse.ok) return response.status(401).json({ error: 'Admin oturumu geçersiz. Yeniden giriş yapın.' })
    const { users } = await authResponse.json()
    if (users?.[0]?.email !== 'enes@erva.com') return response.status(403).json({ error: 'Bu işlem için admin izni gerekli.' })
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = 'bizim-anilarimiz'
    const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex')
    return response.status(200).json({ cloudName, apiKey: cloudKey, timestamp, folder, signature })
  } catch {
    return response.status(502).json({ error: 'Görsel yükleme servisine şu an ulaşılamıyor.' })
  }
}
