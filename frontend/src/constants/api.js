export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const AUTH_ENDPOINTS = {
  login: '/api/v1/auth/login',
  refresh: '/api/v1/auth/refresh',
}

export const ADMIN_API = {
  dashboard: '/api/v1/admin/events/dashboard',
  events: '/api/v1/admin/events',
  eventRegistrations: (eventId) => `/api/v1/admin/events/${eventId}/registrations`,
  eventAnalytics: (eventId) => `/api/v1/admin/events/${eventId}/analytics`,
  publishEvent: (eventId) => `/api/v1/admin/events/${eventId}/publish`,
  completeEvent: (eventId) => `/api/v1/admin/events/${eventId}/complete`,
  uploadVideoUrl: (eventId) => `/api/v1/admin/events/${eventId}/upload-video-url`,
  deleteEvent: (eventId) => `/api/v1/admin/events/${eventId}`,
  createEvent: '/api/v1/admin/events',
  updateEvent: (eventId) => `/api/v1/admin/events/${eventId}`,
  uploadThumbnail: '/api/v1/admin/events/upload-thumbnail',
  allRegistrations: '/api/v1/admin/registrations',
}

export const EVENT_API = {
  upcoming: '/api/v1/events/upcoming',
  completed: '/api/v1/events/completed',
  single: (eventId) => `/api/v1/events/${eventId}`,
  register: (eventId) => `/api/v1/events/${eventId}/register`,
}

export const STORAGE_KEYS = {
  accessToken: 'meetlify_access_token',
  refreshToken: 'meetlify_refresh_token',
}

export const ADMIN_ROUTES = {
  login: '/admin/login',
  dashboard: '/admin',
  events: '/admin/events',
  eventCreate: '/admin/events/new',
  eventDetails: (eventId) => `/admin/events/${eventId}`,
  eventEdit: (eventId) => `/admin/events/${eventId}/edit`,
  registrations: '/admin/registrations',
  profile: '/admin/profile',
}

export const PUBLIC_ROUTES = {
  home: '/',
}
