import { STORAGE_KEYS } from '../constants/api'

function getStorage(persistent) {
  return persistent ? localStorage : sessionStorage
}

export function saveTokens({ accessToken, refreshToken, rememberMe = false }) {
  const storage = getStorage(rememberMe)
  storage.setItem(STORAGE_KEYS.accessToken, accessToken)
  storage.setItem(STORAGE_KEYS.refreshToken, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  sessionStorage.removeItem(STORAGE_KEYS.accessToken)
  sessionStorage.removeItem(STORAGE_KEYS.refreshToken)
}

export function getAccessToken() {
  return (
    localStorage.getItem(STORAGE_KEYS.accessToken) ??
    sessionStorage.getItem(STORAGE_KEYS.accessToken)
  )
}
