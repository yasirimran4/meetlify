import Card from '../../../../components/ui/Card'
import EmptyState from '../../../../components/ui/EmptyState'
import LoadingState from '../../../../components/ui/LoadingState'
import Pagination from '../../../../components/ui/Pagination'
import SearchInput from '../../../../components/ui/SearchInput'
import Alert from '../../../../components/ui/Alert'
import Button from '../../../../components/ui/Button'
import { formatEventDate } from '../../../../utils/format'

function RegistrationStatusBadge({ reminderSent }) {
  return reminderSent ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 ring-inset">
      Reminder sent
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200 ring-inset">
      Registered
    </span>
  )
}

export default function EventRegistrationsTab({
  registrations,
  pagination,
  search,
  onSearchChange,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  isLoading,
  error,
  onRetry,
}) {
  if (isLoading) {
    return <LoadingState message="Loading registrations..." />
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Alert title="Unable to load registrations" message={error} />
        <Button fullWidth={false} onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <div className="border-b border-border p-4 sm:p-5">
        <SearchInput
          id="registrations-search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search registrations..."
        />
        {search ? (
          <p className="mt-2 text-xs text-text-secondary">
            Search filters the current page of registrations.
          </p>
        ) : null}
      </div>

      {registrations.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="No registrations found"
            description={
              search
                ? 'Try a different search term on this page.'
                : 'Registrations will appear here once attendees sign up.'
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-subtle">
              <tr>
                {['Attendee', 'Organization', 'Role', 'Status', 'Registered'].map((heading) => (
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
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-text-primary">{registration.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">{registration.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {registration.organization}
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {registration.currentRole}
                  </td>
                  <td className="px-5 py-4">
                    <RegistrationStatusBadge reminderSent={registration.reminderSent} />
                  </td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap text-text-secondary">
                    {formatEventDate(registration.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        start={pagination.start}
        end={pagination.end}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        itemLabel="registrations"
      />
    </Card>
  )
}
