import { useCallback, useEffect, useState } from 'react'
import {
  deleteEvent,
  fetchEventAnalytics,
  fetchAdminEvents,
  publishEvent,
} from '../services/eventService'
import { PAGE_SIZE_OPTIONS } from '../constants/events'
import { parseApiError } from '../utils/apiError'
import { normalizeEvents, sortEvents } from '../utils/events'

export function useEventsData() {
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
    start: 0,
    end: 0,
  })
  const [registrationCounts, setRegistrationCounts] = useState({})
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, sortBy, pageSize])

  const loadEvents = useCallback(
    async ({ showLoader = true } = {}) => {
      if (showLoader) setIsLoading(true)
      else setIsRefreshing(true)

      setError(null)

      try {
        const response = await fetchAdminEvents({
          page,
          limit: pageSize,
          search: debouncedSearch,
          status: statusFilter,
        })

        const normalizedItems = sortEvents(normalizeEvents(response?.items ?? []), sortBy)
        const pageData = response?.pagination ?? {}

        const totalItems = pageData.total_items ?? 0
        const currentPage = pageData.page ?? page
        const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
        const end = Math.min(currentPage * pageSize, totalItems)

        setEvents(normalizedItems)
        setPagination({
          page: currentPage,
          pageSize,
          totalItems,
          totalPages: pageData.total_pages ?? 1,
          hasNext: pageData.has_next ?? false,
          hasPrevious: pageData.has_previous ?? false,
          start,
          end,
        })
      } catch (loadError) {
        setError(parseApiError(loadError).message)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [page, pageSize, debouncedSearch, statusFilter, sortBy],
  )

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    let cancelled = false

    async function loadRegistrationCounts() {
      const counts = {}

      await Promise.all(
        events.map(async (event) => {
          try {
            const analytics = await fetchEventAnalytics(event.id)
            counts[event.id] = analytics?.registrations ?? 0
          } catch {
            counts[event.id] = null
          }
        }),
      )

      if (!cancelled) {
        setRegistrationCounts((current) => ({ ...current, ...counts }))
      }
    }

    if (events.length > 0) {
      loadRegistrationCounts()
    }

    return () => {
      cancelled = true
    }
  }, [events])

  const handlePublish = useCallback(
    async (eventId) => {
      setActionError(null)
      setActionMessage(null)

      try {
        await publishEvent(eventId)
        setActionMessage('Event published successfully.')
        await loadEvents({ showLoader: false })
      } catch (publishError) {
        setActionError(parseApiError(publishError).message)
      }
    },
    [loadEvents],
  )

  const handleDelete = useCallback(
    async (eventId) => {
      setActionError(null)
      setActionMessage(null)

      try {
        await deleteEvent(eventId)
        setActionMessage('Event deleted successfully.')
        await loadEvents({ showLoader: false })
      } catch (deleteError) {
        setActionError(parseApiError(deleteError).message)
      }
    },
    [loadEvents],
  )

  return {
    events,
    pagination,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    pageSize,
    setPageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isLoading,
    isRefreshing,
    error,
    actionError,
    actionMessage,
    registrationCounts,
    reload: () => loadEvents({ showLoader: false }),
    publishEvent: handlePublish,
    deleteEvent: handleDelete,
  }
}
