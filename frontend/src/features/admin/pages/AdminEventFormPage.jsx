import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import LoadingState from '../../../components/ui/LoadingState'
import EventForm from '../components/events/EventForm'
import { ADMIN_ROUTES } from '../../../constants/api'
import { createEvent, fetchEvent, updateEvent, uploadThumbnail } from '../../../services/eventService'
import { normalizeEvent } from '../../../utils/events'
import { parseApiError } from '../../../utils/apiError'

export default function AdminEventFormPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(eventId)

  const [initialData, setInitialData] = useState(null)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    async function loadEvent() {
      if (!isEditing) return
      setIsLoading(true)
      try {
        const data = await fetchEvent(eventId)
        setInitialData(normalizeEvent(data))
      } catch (err) {
        setApiError(parseApiError(err).message)
      } finally {
        setIsLoading(false)
      }
    }
    loadEvent()
  }, [eventId, isEditing])

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      let thumbnailUrl = initialData?.thumbnailUrl || ''
      let thumbnailPublicId = initialData?.thumbnailPublicId || ''

      if (formData.thumbnail instanceof File) {
        const uploadRes = await uploadThumbnail(formData.thumbnail)
        thumbnailUrl = uploadRes.url
        thumbnailPublicId = uploadRes.public_id
      }

      // Prepare payload exactly as CreateEventRequest expects
      const payload = {
        title: formData.title,
        description: formData.description,
        speaker_name: formData.speakerName,
        meeting_link: formData.meetingLink,
        event_date_time: new Date(formData.eventDateTime).toISOString(),
        thumbnail_url: thumbnailUrl,
        thumbnail_public_id: thumbnailPublicId,
      }

      if (isEditing) {
        await updateEvent(eventId, payload)
        navigate(ADMIN_ROUTES.eventDetails(eventId), { replace: true })
      } else {
        const newEvent = await createEvent(payload)
        navigate(ADMIN_ROUTES.eventDetails(newEvent.id), { replace: true })
      }
    } catch (err) {
      setApiError(parseApiError(err).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading event details..." />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Events', to: ADMIN_ROUTES.events },
          { label: isEditing ? (initialData?.title || 'Edit Event') : 'New Event' },
        ]}
      />

      <PageHeader
        title={isEditing ? 'Edit Event' : 'Create Event'}
        description={
          isEditing
            ? 'Update the details for this event.'
            : 'Fill out the details below to schedule a new event.'
        }
      />

      <EventForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        apiError={apiError}
      />
    </div>
  )
}
