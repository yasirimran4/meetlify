import { useState, useCallback, useEffect } from 'react'
import { fetchAllRegistrations } from '../services/registrationService'
import { PAGE_SIZE_OPTIONS } from '../constants/events'
import { parseApiError } from '../utils/apiError'
import { extractPagination, normalizePagination, normalizeRegistrations } from '../utils/registrations'

export function useGlobalRegistrations(initialParams = { page: 1, limit: 10 }) {
  const [data, setData] = useState({ items: [], pagination: normalizePagination(null, initialParams.limit) })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [params, setParams] = useState(initialParams)
  const pageSize = params.limit ?? PAGE_SIZE_OPTIONS[0]

  const loadRegistrations = useCallback(async (currentParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchAllRegistrations(currentParams)
      const payload = response ?? {}
      const pageData = extractPagination(payload)

      setData({
        items: normalizeRegistrations(payload),
        pagination: normalizePagination(pageData, currentParams.limit ?? PAGE_SIZE_OPTIONS[0]),
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

  const setPageSize = useCallback((nextSize) => {
    setParams((prev) => ({ ...prev, limit: nextSize, page: 1 }))
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
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    updateParams,
    changePage,
    setPageSize,
    reload,
  }
}
