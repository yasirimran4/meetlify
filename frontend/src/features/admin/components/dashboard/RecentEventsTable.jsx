import { Link } from 'react-router-dom'
import Badge from '../../../../components/ui/Badge'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import EmptyState from '../../../../components/ui/EmptyState'
import { ADMIN_ROUTES } from '../../../../constants/api'
import { formatEventDate, formatNumber } from '../../../../utils/format'

export default function RecentEventsTable({ events, registrationCounts }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Recent Events</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Latest events across upcoming and completed schedules.
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
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">{event.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">{event.speakerName}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {formatEventDate(event.eventDateTime)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={event.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-text-primary">
                    {registrationCounts[event.id] == null
                      ? '—'
                      : formatNumber(registrationCounts[event.id])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
