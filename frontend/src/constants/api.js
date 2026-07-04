export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const AUTH_ENDPOINTS = {
  login: '/api/v1/auth/login',
  refresh: '/api/v1/auth/refresh',
}

export const ADMIN_API = {
  dashboard: '/api/v1/admin/events/dashboard',
  events: '/api/v1/admin/events',
  eventAnalytics: (eventId) => `/api/v1/admin/events/${eventId}/analytics`,
  publishEvent: (eventId) => `/api/v1/admin/events/${eventId}/publish`,
  deleteEvent: (eventId) => `/api/v1/admin/events/${eventId}`,
}

export const EVENT_API = {
  upcoming: '/api/v1/events/upcoming',
  completed: '/api/v1/events/completed',
  single: (eventId) => `/api/v1/events/${eventId}`,
}

export const STORAGE_KEYS = {
  accessToken: 'meetlify_access_token',
  refreshToken: 'meetlify_refresh_token',
}

export const ADMIN_ROUTES = {
  login: '/admin/login',
  dashboard: '/admin',
  events: '/admin/events',
  profile: '/admin/profile',
}

export const PUBLIC_ROUTES = {
  home: '/',
}
