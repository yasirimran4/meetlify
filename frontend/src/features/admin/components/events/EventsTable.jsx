import { Eye, Pencil, Trash2, UploadCloud } from 'lucide-react'
import Badge from '../../../../components/ui/Badge'
import Button from '../../../../components/ui/Button'
import EmptyState from '../../../../components/ui/EmptyState'
import { EVENT_STATUS } from '../../../../constants/events'
import { formatEventDate, formatNumber } from '../../../../utils/format'

export function EventsTable({
  events,
  registrationCounts,
  onView,
  onEdit,
  onPublish,
  onDelete,
}) {
  if (events.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No events found"
          description="Try adjusting your search or filters, or create a new event."
        />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-surface-subtle">
          <tr>
            {['Event', 'Status', 'Date', 'Registrations', 'Actions'].map((heading) => (
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
            const isDraft = event.status === EVENT_STATUS.DRAFT
            const isCompleted = event.status === EVENT_STATUS.COMPLETED

            return (
              <tr key={event.id} className="hover:bg-surface-muted/60 transition-colors group">
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onView(event)}
                    className="text-left font-semibold text-text-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                  >
                    {event.title}
                  </button>
                  <p className="mt-1 max-w-xl text-sm text-text-secondary line-clamp-2">{event.description}</p>
                </td>
                <td className="px-5 py-4 space-y-2">
                  <div>
                    <Badge status={event.status} />
                  </div>
                  {isCompleted && event.videoUrl ? (
                    <div>
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                        Recording Available
                      </span>
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm whitespace-nowrap text-text-secondary">
                  {formatEventDate(event.eventDateTime)}
                </td>
                <td className="px-5 py-4 text-sm text-text-primary">
                  {registrationCounts[event.id] == null
                    ? '—'
                    : formatNumber(registrationCounts[event.id])}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      fullWidth={false}
                      className="h-8 px-3 text-xs"
                      onClick={() => onView(event)}
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth={false}
                      className="h-8 px-3 text-xs"
                      onClick={() => onEdit(event)}
                      disabled={isCompleted}
                      title="Edit Event"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth={false}
                      className="h-8 px-3 text-xs"
                      onClick={() => onPublish(event)}
                      disabled={!isDraft}
                      title={isDraft ? "Publish Event" : "Already Published"}
                    >
                      <UploadCloud className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                      Publish
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth={false}
                      className="h-8 px-3 text-xs text-error hover:bg-error-muted hover:text-error hover:border-error-border"
                      onClick={() => onDelete(event)}
                      disabled={isCompleted}
                      title="Delete Event"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
