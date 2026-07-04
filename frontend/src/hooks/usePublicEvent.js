import { useState, useCallback, useEffect } from 'react'
import { fetchEvent } from '../services/eventService'
import { parseApiError } from '../utils/apiError'

export function usePublicEvent(eventId) {
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadEvent = useCallback(async () => {
    if (!eventId) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchEvent(eventId)
      setEvent(data)
    } catch (err) {
      setError(parseApiError(err).message || 'Failed to load event details.')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadEvent()
  }, [loadEvent])

  return { event, isLoading, error, reload: loadEvent }
}
