import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, CalendarDays, MapPin } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import { usePublicEvent } from '../../../hooks/usePublicEvent'
import { formatEventDate } from '../../../utils/format'
import { registerForEvent } from '../../../services/eventService'
import { parseApiError } from '../../../utils/apiError'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Label from '../../../components/ui/Label'
import SelectField from '../../../components/ui/SelectField'
import Alert from '../../../components/ui/Alert'
import LoadingState from '../../../components/ui/LoadingState'
import EmptyState from '../../../components/ui/EmptyState'

export default function PublicEventRegistrationPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { event, isLoading, error } = usePublicEvent(eventId)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_role: '',
    organization: '',
    semester: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingState message="Loading event details..." />
        </div>
        <PublicFooter />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState title="Event not found" description="The event you are trying to register for does not exist." />
        </div>
        <PublicFooter />
      </div>
    )
  }

  if (event.status === 'completed') {
    return (
      <div className="min-h-screen flex flex-col bg-surface">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            title="Registration Closed" 
            description="This event has already completed. You cannot register for past events." 
          />
        </div>
        <PublicFooter />
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      await registerForEvent(eventId, formData)
      setSuccess(true)
    } catch (err) {
      setSubmitError(parseApiError(err).message || 'Failed to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface selection:bg-primary/30">
      <PublicNavbar />
      
      <main className="flex-1 bg-surface-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          <Link to={`/events/${eventId}`} className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Event Details
          </Link>

          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            
            {/* Event Summary Header */}
            <div className="flex flex-col sm:flex-row bg-surface-subtle border-b border-border p-6 gap-6 items-center sm:items-start">
              {event.thumbnail_url ? (
                <img 
                  src={event.thumbnail_url} 
                  alt={event.title} 
                  className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-sm"
                />
              ) : (
                <div className="w-full sm:w-32 h-32 bg-border flex items-center justify-center rounded-xl shadow-sm">
                  <CalendarDays className="w-8 h-8 text-text-muted" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-text-primary">{event.title}</h1>
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-text-secondary">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{formatEventDate(event.event_date_time)}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Online Event</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form / Success State */}
            <div className="p-6 sm:p-10">
              {success ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-6">
                    <CheckCircle className="h-10 w-10 text-success" />
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary mb-4">Registration Successful!</h2>
                  <p className="text-lg text-text-secondary mb-10 max-w-md mx-auto">
                    You have successfully registered for <strong>{event.title}</strong>. We will send the event details and meeting link to your registered email one day before the event.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => navigate('/events')}
                    className="group w-full sm:w-auto rounded-full px-6 py-3 bg-primary text-white hover:bg-primary/90 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md inline-flex items-center justify-center gap-2"
                  >
                    Explore Events
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-text-primary">Complete Your Registration</h2>
                    <p className="mt-2 text-text-secondary">Please fill in your details below to secure your spot.</p>
                  </div>

                  {submitError && <Alert variant="error" message={submitError} className="mb-8" />}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-error">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          minLength={3}
                          placeholder="Yasir Imran"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-error">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="yasir@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <SelectField
                          id="current_role"
                          name="current_role"
                          label={<span>Current Role <span className="text-error">*</span></span>}
                          value={formData.current_role}
                          onChange={handleChange}
                          required
                          options={[
                            { value: '', label: 'Select your role' },
                            { value: 'Student', label: 'Student' },
                            { value: 'Industry Professional', label: 'Industry Professional' },
                            { value: 'Lecturer', label: 'Lecturer' },
                            { value: 'Faculty member', label: 'Faculty member' },
                            { value: 'Other', label: 'Other' },
                          ]}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization (Optional)</Label>
                        <Input
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="e.g. PUCIT"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <SelectField
                        id="semester"
                        name="semester"
                        label={<span>Semester <span className="text-error">*</span></span>}
                        value={formData.semester}
                        onChange={handleChange}
                        required
                        options={[
                          { value: '', label: 'Select semester' },
                          { value: '1st', label: '1st Semester' },
                          { value: '2nd', label: '2nd Semester' },
                          { value: '3rd', label: '3rd Semester' },
                          { value: '4th', label: '4th Semester' },
                          { value: '5th', label: '5th Semester' },
                          { value: '6th', label: '6th Semester' },
                          { value: '7th', label: '7th Semester' },
                          { value: '8th', label: '8th Semester' },
                          { value: 'Not applicable', label: 'Not applicable' },
                        ]}
                      />
                    </div>
                    
                    <div className="pt-6 border-t border-border">
                      <Button type="submit" size="lg" className="w-full py-2" isLoading={isSubmitting}>
                        Confirm Registration
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
            
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
