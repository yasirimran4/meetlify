import { useCallback, useEffect, useState } from 'react'
import {
  deleteEvent,
  fetchEvent,
  fetchEventAnalytics,
  publishEvent,
  uploadRecordingUrl,
} from '../services/eventService'
import { parseApiError } from '../utils/apiError'
import { normalizeEvent } from '../utils/events'

export function useEventDetails(eventId) {
  const [event, setEvent] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingRecording, setIsSavingRecording] = useState(false)

  const loadEventDetails = useCallback(async () => {
    if (!eventId) return

    setIsLoading(true)
    setError(null)

    try {
      const [eventData, analyticsData] = await Promise.all([
        fetchEvent(eventId),
        fetchEventAnalytics(eventId),
      ])

      setEvent(normalizeEvent(eventData))
      setAnalytics(analyticsData)
    } catch (loadError) {
      setError(parseApiError(loadError).message)
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadEventDetails()
  }, [loadEventDetails])

  const handlePublish = useCallback(async () => {
    setActionError(null)
    setActionMessage(null)
    setIsPublishing(true)

    try {
      const updatedEvent = await publishEvent(eventId)
      setEvent(normalizeEvent(updatedEvent))
      setActionMessage('Event published successfully.')
      await loadEventDetails()
    } catch (publishError) {
      setActionError(parseApiError(publishError).message)
    } finally {
      setIsPublishing(false)
    }
  }, [eventId, loadEventDetails])

  const handleDelete = useCallback(async () => {
    setActionError(null)
    setActionMessage(null)
    setIsDeleting(true)

    try {
      await deleteEvent(eventId)
      return true
    } catch (deleteError) {
      setActionError(parseApiError(deleteError).message)
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [eventId])

  const handleSaveRecording = useCallback(
    async (videoUrl) => {
      setActionError(null)
      setActionMessage(null)
      setIsSavingRecording(true)

      try {
        const updatedEvent = await uploadRecordingUrl(eventId, videoUrl)
        setEvent(normalizeEvent(updatedEvent))
        setActionMessage('Recording URL saved successfully.')
        return true
      } catch (saveError) {
        setActionError(parseApiError(saveError).message)
        return false
      } finally {
        setIsSavingRecording(false)
      }
    },
    [eventId],
  )

  return {
    event,
    analytics,
    isLoading,
    error,
    actionError,
    actionMessage,
    isPublishing,
    isDeleting,
    isSavingRecording,
    reload: loadEventDetails,
    publishEvent: handlePublish,
    deleteEvent: handleDelete,
    saveRecording: handleSaveRecording,
    clearActionFeedback: () => {
      setActionError(null)
      setActionMessage(null)
    },
  }
}
