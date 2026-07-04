import { useCallback, useEffect, useState } from 'react'
import {
  fetchDashboardStats,
  fetchEventAnalytics,
  fetchAdminEvents,
} from '../services/eventService'
import { parseApiError } from '../utils/apiError'
import { normalizeEvents } from '../utils/events'

export function useDashboardData() {
  const [stats, setStats] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [registrationCounts, setRegistrationCounts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [statsData, upcomingResponse, recentResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchAdminEvents({ page: 1, limit: 4, status: 'published' }),
        fetchAdminEvents({ page: 1, limit: 6 }),
      ])

      const upcoming = normalizeEvents(upcomingResponse?.items ?? [])
      const recent = normalizeEvents(recentResponse?.items ?? [])

      setStats(statsData)
      setUpcomingEvents(upcoming)
      setRecentEvents(recent)

      const counts = {}
      await Promise.all(
        recent.map(async (event) => {
          try {
            const analytics = await fetchEventAnalytics(event.id)
            counts[event.id] = analytics?.registrations ?? 0
          } catch {
            counts[event.id] = null
          }
        }),
      )
      setRegistrationCounts(counts)
    } catch (loadError) {
      setError(parseApiError(loadError).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return {
    stats,
    upcomingEvents,
    recentEvents,
    registrationCounts,
    isLoading,
    error,
    reload: loadDashboard,
  }
}
