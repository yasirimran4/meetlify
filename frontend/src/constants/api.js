export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const AUTH_ENDPOINTS = {
  login: '/api/v1/auth/login',
  refresh: '/api/v1/auth/refresh',
}

export const STORAGE_KEYS = {
  accessToken: 'meetlify_access_token',
  refreshToken: 'meetlify_refresh_token',
}

export const ADMIN_ROUTES = {
  login: '/admin/login',
  dashboard: '/admin',
}

export const PUBLIC_ROUTES = {
  home: '/',
}
