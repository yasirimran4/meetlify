import api from './api'
import { ADMIN_API } from '../constants/api'
import { unwrapApiData } from '../utils/apiResponse'

export async function fetchAllRegistrations({ page = 1, limit = 10, search = '', eventId = '', status = '' } = {}) {
  const params = { page, limit }
  if (search) params.search = search
  if (eventId && eventId !== 'all') params.event_id = eventId
  if (status && status !== 'all') params.status = status

  const response = await api.get(ADMIN_API.allRegistrations, { params })
  return unwrapApiData(response)
}
