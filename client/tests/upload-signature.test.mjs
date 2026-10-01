import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import handler from '../api/uploads/signature.js'

const savedFetch = globalThis.fetch
const keys = ['FIREBASE_API_KEY', 'VITE_FIREBASE_API_KEY', 'CLOUDINARY_CLOUD_NAME', 'VITE_CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
const saved = keys.map(key => process.env[key])
const response = () => ({ code: 0, body: null, headers: {}, setHeader(key, value) { this.headers[key] = value }, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } })
try {
  for (const key of keys) delete process.env[key]
  let res = response()
  await handler({ method: 'GET', headers: {} }, res)
  assert.equal(res.code, 401)
  const req = { method: 'GET', headers: { authorization: 'Bearer test-token' } }
  res = response(); await handler(req, res); assert.equal(res.code, 503)
  Object.assign(process.env, { FIREBASE_API_KEY: 'test-project', CLOUDINARY_CLOUD_NAME: 'test-cloud', CLOUDINARY_API_KEY: 'test-key', CLOUDINARY_API_SECRET: 'test-secret' })
  globalThis.fetch = async () => ({ ok: false })
  res = response(); await handler(req, res); assert.equal(res.code, 401)
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ users: [{ email: 'other@example.com' }] }) })
  res = response(); await handler(req, res); assert.equal(res.code, 403)
  globalThis.fetch = async (url, options) => {
    assert.equal(JSON.parse(options.body).idToken, 'test-token')
    assert.ok(url.startsWith('https://identitytoolkit.googleapis.com/'))
    return { ok: true, json: async () => ({ users: [{ email: 'eneservanur@admin.com' }] }) }
  }
  res = response(); await handler(req, res); assert.equal(res.code, 200)
  assert.equal(res.body.signature, createHash('sha1').update(`folder=bizim-anilarimiz&timestamp=${res.body.timestamp}test-secret`).digest('hex'))
  assert.equal(res.headers['Cache-Control'], 'no-store')
  assert.ok(!JSON.stringify(res.body).includes('test-secret'))
  globalThis.fetch = async () => { throw new Error('network') }
  res = response(); await handler(req, res); assert.equal(res.code, 502)
  res = response(); await handler({ ...req, method: 'POST' }, res); assert.equal(res.code, 405)
  console.log('Upload authentication, configuration, signature and failure checks passed')
} finally {
  globalThis.fetch = savedFetch
  keys.forEach((key, index) => saved[index] === undefined ? delete process.env[key] : process.env[key] = saved[index])
}
