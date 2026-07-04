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
  
  // Format to YYYY-MM-DDThh:mm for datetime-local input
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function EventForm({ initialData, onSubmit, isLoading, apiError }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speakerName: '',
    meetingLink: '',
    eventDateTime: '',
    thumbnail: null,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        speakerName: initialData.speakerName || '',
        meetingLink: initialData.meetingLink || '',
        eventDateTime: formatDateTimeForInput(initialData.eventDateTime),
        thumbnail: initialData.thumbnailUrl || null,
      })
    }
  }, [initialData])

  const validate = () => {
    const newErrors = {}
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters.'
    }
    if (!formData.description || formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters.'
    }
    if (!formData.speakerName || formData.speakerName.length < 5) {
      newErrors.speakerName = 'Speaker name must be at least 5 characters.'
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
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="speakerName">Speaker Name</Label>
                  <Input
                    id="speakerName"
                    placeholder="e.g. Jane Doe"
                    value={formData.speakerName}
                    onChange={handleChange('speakerName')}
                    error={errors.speakerName}
                    disabled={isLoading}
                  />
                </div>
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
