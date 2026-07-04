import api from './api'
import { ADMIN_API } from '../constants/api'
import { unwrapApiData } from '../utils/apiResponse'

export async function fetchDashboardStats() {
  const response = await api.get(ADMIN_API.dashboard)
  return unwrapApiData(response)
}

export async function fetchAdminEvents({ page = 1, limit = 10, search = '', status = '' } = {}) {
  const params = { page, limit }

  if (search) params.search = search
  if (status && status !== 'all') params.status = status

  const response = await api.get(ADMIN_API.events, { params })
  return unwrapApiData(response)
}

export async function fetchEventAnalytics(eventId) {
  const response = await api.get(ADMIN_API.eventAnalytics(eventId))
  return unwrapApiData(response)
}

export async function publishEvent(eventId) {
  const response = await api.patch(ADMIN_API.publishEvent(eventId))
  return unwrapApiData(response)
}

export async function deleteEvent(eventId) {
  const response = await api.delete(ADMIN_API.deleteEvent(eventId))
  return unwrapApiData(response)
}
