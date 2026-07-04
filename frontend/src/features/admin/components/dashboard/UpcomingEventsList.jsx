import { Link } from 'react-router-dom'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import EmptyState from '../../../../components/ui/EmptyState'
import { ADMIN_ROUTES } from '../../../../constants/api'
import { formatEventDate, formatShortDate, truncateText } from '../../../../utils/format'

export default function UpcomingEventsList({ events }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Upcoming Events</h3>
          <p className="mt-1 text-sm text-text-secondary">Events scheduled next on the platform.</p>
        </div>
        <Link
          to={ADMIN_ROUTES.events}
          className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          View all
        </Link>
      </CardHeader>
      <CardBody className="space-y-4 p-0">
        {events.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No upcoming events"
              description="Published upcoming events will appear here."
            />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((event) => {
              const dateParts = formatShortDate(event.eventDateTime)

              return (
                <li key={event.id} className="flex gap-4 px-5 py-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-surface-subtle text-center">
                    <span className="text-[10px] font-semibold tracking-wide text-text-secondary">
                      {dateParts.month}
                    </span>
                    <span className="text-lg font-bold leading-none text-text-primary">
                      {dateParts.day}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text-primary">{event.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {formatEventDate(event.eventDateTime)}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {truncateText(event.description, 72)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
