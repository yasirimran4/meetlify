import { useState, useEffect } from 'react'
import PublicEventCard from './PublicEventCard'
import LoadingState from '../../../components/ui/LoadingState'
import EmptyState from '../../../components/ui/EmptyState'

export default function EventsListSection({ title, description, fetchMethod, isPast }) {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true)
        const response = await fetchMethod({ page: 1, limit: 6 })
        setEvents(response?.items || [])
      } catch (err) {
        setError('Failed to load events. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [fetchMethod])

  return (
    <section id={isPast ? 'past-events' : 'events'} className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{title}</h2>
          {description && <p className="mt-6 text-lg leading-8 text-text-secondary">{description}</p>}
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          {isLoading ? (
            <div className="py-12">
              <LoadingState message="Loading events..." />
            </div>
          ) : error ? (
            <div className="py-12">
              <EmptyState title="Oops!" description={error} />
            </div>
          ) : events.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No events found" description="Check back later for more events!" />
            </div>
          ) : (
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
              {events.map((event) => (
                <PublicEventCard key={event.id} event={event} isPast={isPast} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
