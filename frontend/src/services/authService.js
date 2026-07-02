import api from './api'
import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants/api'

export async function login(credentials) {
  const response = await api.post(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, credentials)
  return response.data
}
