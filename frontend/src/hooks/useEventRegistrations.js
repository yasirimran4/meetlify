import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchEventRegistrations } from '../services/eventService'
import { PAGE_SIZE_OPTIONS } from '../constants/events'
import { parseApiError } from '../utils/apiError'
import { extractPagination, filterRegistrations, normalizeRegistrations } from '../utils/registrations'

export function useEventRegistrations(eventId) {
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
    start: 0,
    end: 0,
  })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadRegistrations = useCallback(async () => {
    if (!eventId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchEventRegistrations(eventId, { page, limit: pageSize })
      const items = normalizeRegistrations(response)
      const pageData = extractPagination(response) ?? {}

      const totalItems = pageData.total_items ?? 0
      const currentPage = pageData.page ?? page
      const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
      const end = Math.min(currentPage * pageSize, totalItems)

      setRegistrations(items)
      setPagination({
        page: currentPage,
        totalPages: pageData.total_pages ?? 1,
        totalItems,
        hasNext: pageData.has_next ?? false,
        hasPrevious: pageData.has_previous ?? false,
        start,
        end,
      })
    } catch (loadError) {
      setError(parseApiError(loadError).message)
    } finally {
      setIsLoading(false)
    }
  }, [eventId, page, pageSize])

  useEffect(() => {
    loadRegistrations()
  }, [loadRegistrations])

  const filteredRegistrations = useMemo(
    () => filterRegistrations(registrations, search),
    [registrations, search],
  )

  return {
    registrations: filteredRegistrations,
    pagination,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isLoading,
    error,
    reload: loadRegistrations,
  }
}
