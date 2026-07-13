import { useState, useCallback, useEffect } from 'react'
import { fetchAllRegistrations } from '../services/registrationService'
import { parseApiError } from '../utils/apiError'
import { normalizeRegistrations } from '../utils/registrations'

export function useGlobalRegistrations(initialParams = { page: 1, limit: 10 }) {
  const [data, setData] = useState({ items: [], pagination: null })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [params, setParams] = useState(initialParams)

  const loadRegistrations = useCallback(async (currentParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchAllRegistrations(currentParams)
      const payload = response ?? {}

      setData({
        items: normalizeRegistrations(payload),
        pagination: payload?.pagination ?? null,
      })
    } catch (err) {
      setError(parseApiError(err).message || 'Failed to fetch registrations')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRegistrations(params)
  }, [params, loadRegistrations])

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }))
  }, [])

  const changePage = useCallback((newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }, [])

  const reload = useCallback(() => {
    loadRegistrations(params)
  }, [params, loadRegistrations])

  return {
    registrations: data.items,
    pagination: data.pagination,
    isLoading,
    error,
    params,
    updateParams,
    changePage,
    reload,
  }
}
