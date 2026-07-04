export function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function isTokenValid(token) {
  if (!token) return false

  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return true

  return payload.exp * 1000 > Date.now()
}
