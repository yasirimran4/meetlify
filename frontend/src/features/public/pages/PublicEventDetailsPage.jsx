import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, MapPin, User, PlayCircle, Clock, ArrowRight } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import { Link } from 'react-router-dom'
import { usePublicEvent } from '../../../hooks/usePublicEvent'
import { formatEventDate } from '../../../utils/format'
import Button from '../../../components/ui/Button'
import LoadingState from '../../../components/ui/LoadingState'
import EmptyState from '../../../components/ui/EmptyState'

export default function PublicEventDetailsPage() {
  const { eventId } = useParams()
  const { event, isLoading, error } = usePublicEvent(eventId)

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
          <EmptyState title="Event not found" description="The event you are looking for does not exist or has been removed." />
        </div>
        <PublicFooter />
      </div>
    )
  }

  const isCompleted = event.status === 'completed'
  const hasRecording = isCompleted && event.video_url

  return (
    <div className="min-h-screen flex flex-col bg-surface selection:bg-primary/30">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-surface-muted border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">{event.title}</h1>
                
                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-text-muted" />
                    <span>{formatEventDate(event.event_date_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-text-muted" />
                    <span>{event.speaker_name}</span>
                  </div>
                  {!isCompleted && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-text-muted" />
                      <span>Online Event</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                {isCompleted ? (
                  hasRecording ? (
                    <a href={event.video_url} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full sm:w-auto gap-2">
                        <PlayCircle className="h-5 w-5" />
                        Watch Recording
                      </Button>
                    </a>
                  ) : (
                    <Button size="lg" variant="secondary" disabled className="w-full sm:w-auto">
                      Event Has Ended
                    </Button>
                  )
                ) : (
                  <Link to={`/events/${eventId}/register`} className="w-full sm:w-auto block">
                    <button className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group">
                      Register Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {event.thumbnail_url && (
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-subtle border border-border shadow-sm">
                  <img src={event.thumbnail_url} alt={event.title} className="h-full w-full object-cover" />
                </div>
              )}
              
              <section>
                <h2 className="text-2xl font-bold text-text-primary mb-4">Event Overview</h2>
                <div className="prose prose-slate max-w-none text-text-secondary">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <section className="bg-surface-muted rounded-xl p-6 border border-border">
                <h3 className="font-bold text-text-primary mb-4">Event Details</h3>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-text-muted flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" /> Date & Time
                    </dt>
                    <dd className="font-medium text-text-primary pl-6">{formatEventDate(event.event_date_time)}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" /> Organizer / Speaker
                    </dt>
                    <dd className="font-medium text-text-primary pl-6">{event.speaker_name}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4" /> Meeting Link
                    </dt>
                    <dd className="font-medium text-text-primary pl-6">
                      <a href={event.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {event.meeting_link}
                      </a>
                    </dd>
                  </div>
                  {isCompleted && event.video_url && (
                    <div>
                      <dt className="text-text-muted flex items-center gap-2 mb-1">
                        <PlayCircle className="h-4 w-4" /> Recording Link
                      </dt>
                      <dd className="font-medium text-text-primary pl-6">
                        <a href={event.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                          {event.video_url}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            </div>

          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
