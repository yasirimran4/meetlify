import { Link, useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import Badge from '../../../../components/ui/Badge'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import EmptyState from '../../../../components/ui/EmptyState'
import { ADMIN_ROUTES } from '../../../../constants/api'
import { formatEventDate, formatNumber } from '../../../../utils/format'

export default function RecentEventsTable({ events, registrationCounts }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Recent Events</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Click a registration count to open that event&apos;s attendee list.
          </p>
        </div>
        <Link
          to={ADMIN_ROUTES.events}
          className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Manage events
        </Link>
      </CardHeader>

      {events.length === 0 ? (
        <CardBody>
          <EmptyState
            title="No events yet"
            description="Create or publish events to see them listed here."
          />
        </CardBody>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-subtle">
              <tr>
                {['Title', 'Date', 'Status', 'Registrations'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-text-secondary uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {events.map((event) => {
                const speakerNames = Array.isArray(event?.speakers) && event.speakers.length > 0
                  ? event.speakers
                  : event?.speakerName
                    ? [event.speakerName]
                    : []
                const registrationCount = registrationCounts[event.id]

                return (
                  <tr key={event.id} className="hover:bg-surface-muted/60">
                    <td className="px-5 py-4">
                      <Link
                        to={ADMIN_ROUTES.eventDetails(event.id)}
                        className="font-medium text-text-primary hover:text-primary"
                      >
                        {event.title}
                      </Link>
                      <p className="mt-1 text-sm text-text-secondary">
                        {speakerNames.length > 0 ? speakerNames.join(', ') : '—'}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {formatEventDate(event.eventDateTime)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={event.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(ADMIN_ROUTES.eventRegistrations(event.id))}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                      >
                        <Users className="h-4 w-4" aria-hidden="true" />
                        {registrationCount == null ? '—' : formatNumber(registrationCount)}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
