import { Check, ExternalLink, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../../../../components/ui/EmptyState'
import { ADMIN_ROUTES } from '../../../../constants/api'
import { formatEventDate } from '../../../../utils/format'

export function RegistrationsTable({ registrations }) {
  const safeRegistrations = Array.isArray(registrations) ? registrations : []

  if (safeRegistrations.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No registrations found"
          description="Try adjusting your search or filters, or check back after attendees sign up."
        />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-surface-subtle">
          <tr>
            {['Attendee', 'Event', 'Contact', 'Semester', 'Registered', 'Status', ''].map(
              (heading) => (
                <th
                  key={heading || 'actions'}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-text-secondary uppercase"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {safeRegistrations.map((reg) => {
            const eventId = reg.eventId ?? reg.event_id
            const eventTitle = reg.eventTitle ?? reg.event_title

            return (
              <tr key={reg.id} className="hover:bg-surface-muted/60 transition-colors group">
                <td className="px-5 py-4">
                  <p className="font-semibold text-text-primary">{reg.name}</p>
                  <p className="mt-1 text-xs text-text-secondary">{reg.current_role ?? reg.currentRole}</p>
                </td>
                <td className="px-5 py-4">
                  {eventId ? (
                    <Link
                      to={ADMIN_ROUTES.eventRegistrations(eventId)}
                      className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      {eventTitle || 'View event'}
                    </Link>
                  ) : (
                    <p className="text-sm text-text-primary">{eventTitle || 'N/A'}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                    <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <a
                      href={`mailto:${reg.email}`}
                      className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                    >
                      {reg.email}
                    </a>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary">
                  {reg.semester || '—'}
                </td>
                <td className="px-5 py-4 text-sm whitespace-nowrap text-text-secondary">
                  {formatEventDate(reg.created_at ?? reg.createdAt)}
                </td>
                <td className="px-5 py-4">
                  {reg.reminder_sent ?? reg.reminderSent ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-success-muted/20 px-2 py-1 text-xs font-medium text-success-text ring-1 ring-inset ring-success-border/20">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Reminder sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-warning-muted/20 px-2 py-1 text-xs font-medium text-warning-text ring-1 ring-inset ring-warning-border/20">
                      Pending reminder
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {eventId ? (
                    <Link
                      to={ADMIN_ROUTES.eventRegistrations(eventId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900"
                    >
                      View list
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
