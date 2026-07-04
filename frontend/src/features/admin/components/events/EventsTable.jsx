import Badge from '../../../../components/ui/Badge'
import DropdownMenu from '../../../../components/ui/DropdownMenu'
import EmptyState from '../../../../components/ui/EmptyState'
import { EVENT_STATUS } from '../../../../constants/events'
import { formatEventDate, formatNumber } from '../../../../utils/format'

export default function EventActionsMenu({ event, onView, onEdit, onPublish, onDelete }) {
  const isDraft = event.status === EVENT_STATUS.DRAFT
  const isCompleted = event.status === EVENT_STATUS.COMPLETED

  const items = [
    {
      key: 'view',
      label: 'View',
      onClick: () => onView(event),
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: () => onEdit(event),
      disabled: isCompleted,
    },
    {
      key: 'publish',
      label: 'Publish',
      onClick: () => onPublish(event),
      disabled: !isDraft,
    },
    {
      key: 'unpublish',
      label: 'Unpublish unavailable',
      onClick: () => {},
      disabled: true,
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => onDelete(event),
      destructive: true,
      disabled: isCompleted,
    },
  ]

  return (
    <DropdownMenu
      triggerLabel={`Actions for ${event.title}`}
      items={items}
    />
  )
}

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
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-surface-muted/60">
              <td className="px-5 py-4">
                <p className="font-semibold text-text-primary">{event.title}</p>
                <p className="mt-1 max-w-xl text-sm text-text-secondary">{event.description}</p>
              </td>
              <td className="px-5 py-4 space-y-2">
                <div>
                  <Badge status={event.status} />
                </div>
                {event.status === EVENT_STATUS.COMPLETED && event.videoUrl ? (
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
                <EventActionsMenu
                  event={event}
                  onView={onView}
                  onEdit={onEdit}
                  onPublish={onPublish}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
