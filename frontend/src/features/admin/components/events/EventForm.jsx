import { useState, useEffect } from 'react'
import Button from '../../../../components/ui/Button'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import Label from '../../../../components/ui/Label'
import Textarea from '../../../../components/ui/Textarea'
import ImageUpload from '../../../../components/ui/ImageUpload'
import Alert from '../../../../components/ui/Alert'

function formatDateTimeForInput(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function normalizeNameList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item ?? '').trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }
  return []
}

const DEFAULT_ORGANIZERS = ['Dr. Zobia Suhail']

export default function EventForm({ initialData, onSubmit, isLoading, apiError }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speakers: [''],
    organizers: DEFAULT_ORGANIZERS,
    meetingLink: '',
    eventDateTime: '',
    thumbnail: null,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      const speakerValues = normalizeNameList(initialData.speakers.length ? initialData.speakers : initialData.speakerName)
      const organizerValues = normalizeNameList(initialData.organizers.length ? initialData.organizers : DEFAULT_ORGANIZERS)

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        speakers: speakerValues.length ? speakerValues : [''],
        organizers: organizerValues.length ? organizerValues : DEFAULT_ORGANIZERS,
        meetingLink: initialData.meetingLink || '',
        eventDateTime: formatDateTimeForInput(initialData.eventDateTime),
        thumbnail: initialData.thumbnailUrl || null,
      })
    }
  }, [initialData])

  const addNameField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), ''] }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const updateNameField = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const removeNameField = (field, index) => {
    setFormData((prev) => {
      const currentList = prev[field] || []
      if (currentList.length <= 1) {
        return { ...prev, [field]: [''] }
      }
      return { ...prev, [field]: currentList.filter((_, itemIndex) => itemIndex !== index) }
    })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters.'
    }
    if (!formData.description || formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters.'
    }

    const speakers = formData.speakers.map((name) => name.trim()).filter(Boolean)
    if (speakers.length === 0) {
      newErrors.speakers = 'At least one speaker name is required.'
    }

    if (speakers.some((name) => name.length < 2)) {
      newErrors.speakers = 'Speaker names must be at least 2 characters.'
    }

    if (!formData.meetingLink || !/^https?:\/\/.+/.test(formData.meetingLink)) {
      newErrors.meetingLink = 'Must be a valid URL starting with http:// or https://'
    }
    if (!formData.eventDateTime) {
      newErrors.eventDateTime = 'Event date and time is required.'
    } else {
      const eventDate = new Date(formData.eventDateTime)
      if (eventDate <= new Date()) {
        newErrors.eventDateTime = 'Event date and time must be in the future.'
      }
    }
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail image is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleThumbnailChange = (file) => {
    setFormData((prev) => ({ ...prev, thumbnail: file }))
    if (errors.thumbnail) {
      setErrors((prev) => ({ ...prev, thumbnail: null }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && <Alert title="Error" message={apiError} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-text-primary">General Information</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Masterclass: Next.js App Router"
                  value={formData.title}
                  onChange={handleChange('title')}
                  error={errors.title}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the event..."
                  rows={6}
                  value={formData.description}
                  onChange={handleChange('description')}
                  error={errors.description}
                  disabled={isLoading}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-text-primary">Logistics</h3>
            </CardHeader>
            <CardBody className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Speakers</Label>
                </div>
                <div className="space-y-3">
                  {(formData.speakers || []).map((speaker, index) => (
                    <div key={`speaker-${index}`} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          id={`speaker-${index}`}
                          placeholder="e.g. Jane Doe"
                          value={speaker}
                          onChange={(e) => updateNameField('speakers', index, e.target.value)}
                          error={errors.speakers && index === 0 ? errors.speakers : null}
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="!h-11 shrink-0"
                        onClick={() => removeNameField('speakers', index)}
                        disabled={isLoading || (formData.speakers || []).length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => addNameField('speakers')}
                  disabled={isLoading}
                >
                  + Add Speaker
                </Button>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Organizers</Label>
                </div>
                <div className="space-y-3">
                  {(formData.organizers || []).map((organizer, index) => (
                    <div key={`organizer-${index}`} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          id={`organizer-${index}`}
                          placeholder="e.g. Dr. Zobia Suhail"
                          value={organizer}
                          onChange={(e) => updateNameField('organizers', index, e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="!h-11 shrink-0"
                        onClick={() => removeNameField('organizers', index)}
                        disabled={isLoading || (formData.organizers || []).length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => addNameField('organizers')}
                  disabled={isLoading}
                >
                  + Add Organizer
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="eventDateTime">Date & Time</Label>
                  <Input
                    id="eventDateTime"
                    type="datetime-local"
                    value={formData.eventDateTime}
                    onChange={handleChange('eventDateTime')}
                    error={errors.eventDateTime}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meetingLink">Meeting Link (Google Meet, Zoom, etc.)</Label>
                <Input
                  id="meetingLink"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={formData.meetingLink}
                  onChange={handleChange('meetingLink')}
                  error={errors.meetingLink}
                  disabled={isLoading}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-text-primary">Event Thumbnail</h3>
            </CardHeader>
            <CardBody>
              <ImageUpload
                value={formData.thumbnail}
                onChange={handleThumbnailChange}
                error={errors.thumbnail}
                disabled={isLoading}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          fullWidth={false}
          className="px-6"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {initialData ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}
