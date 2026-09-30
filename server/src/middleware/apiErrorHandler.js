function classifyError(error) {
  const code = String(error?.code ?? '')
  const message = String(error?.message ?? '')

  if (/default credentials|unable to detect a project id/i.test(message)) {
    return { status: 503, code: 'FIREBASE_CREDENTIALS_MISSING' }
  }
  if (['FIREBASE_CREDENTIALS_INVALID', 'app/invalid-credential', '16'].includes(code)) {
    return { status: 503, code: 'FIREBASE_CREDENTIALS_INVALID' }
  }
  if (['7', 'permission-denied'].includes(code)) {
    return { status: 403, code: 'FIREBASE_PERMISSION_DENIED' }
  }
  if (['5', 'not-found'].includes(code)) {
    return { status: 503, code: 'FIRESTORE_NOT_FOUND' }
  }
  if (['4', '14', 'unavailable', 'deadline-exceeded'].includes(code)) {
    return { status: 503, code: 'FIREBASE_UNAVAILABLE' }
  }
  return { status: 500, code: 'API_ERROR' }
}

export function apiErrorHandler(error, _request, response, _next) {
  const failure = classifyError(error)
  console.error(`[api] ${failure.code}`)
  response.status(failure.status).json({ code: failure.code, error: 'İstek tamamlanamadı.' })
}
