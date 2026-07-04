import api from './api'
import { ADMIN_API, EVENT_API } from '../constants/api'
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

export async function fetchEvent(eventId) {
  const response = await api.get(EVENT_API.single(eventId))
  return unwrapApiData(response)
}

export async function fetchEventRegistrations(eventId, { page = 1, limit = 10 } = {}) {
  const response = await api.get(ADMIN_API.eventRegistrations(eventId), {
    params: { page, limit },
  })
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

export async function uploadRecordingUrl(eventId, videoUrl) {
  const response = await api.patch(ADMIN_API.uploadVideoUrl(eventId), null, {
    params: { video_url: videoUrl },
  })
  return unwrapApiData(response)
}

export async function deleteEvent(eventId) {
  const response = await api.delete(ADMIN_API.deleteEvent(eventId))
  return unwrapApiData(response)
}

export async function createEvent(eventData) {
  const response = await api.post(ADMIN_API.createEvent, eventData)
  return unwrapApiData(response)
}

export async function updateEvent(eventId, eventData) {
  const response = await api.put(ADMIN_API.updateEvent(eventId), eventData)
  return unwrapApiData(response)
}

export async function uploadThumbnail(file) {
  const formData = new FormData()
  formData.append('thumbnail', file)
  const response = await api.post(ADMIN_API.uploadThumbnail, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return unwrapApiData(response)
}
