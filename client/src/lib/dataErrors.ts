export class DataLoadError extends Error {
  constructor(public readonly code: string) {
    super(code)
    this.name = 'DataLoadError'
  }
}

export function getDataErrorKey(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : ''

  switch (code) {
    case 'permission-denied':
    case 'unauthenticated':
    case 'FIREBASE_PERMISSION_DENIED':
      return 'dataPermissionDenied' as const
    case 'FIREBASE_CREDENTIALS_MISSING':
    case 'FIREBASE_CREDENTIALS_INVALID':
      return 'dataServerNotConfigured' as const
    case 'not-found':
    case 'FIRESTORE_NOT_FOUND':
      return 'dataDatabaseMissing' as const
    case 'unavailable':
    case 'deadline-exceeded':
    case 'FIREBASE_UNAVAILABLE':
      return 'dataUnavailable' as const
    case 'API_UNAVAILABLE':
      return 'dataApiUnavailable' as const
    default:
      return 'dataLoadFailed' as const
  }
}
