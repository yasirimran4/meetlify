import { useCallback, useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import SearchInput from '../../../components/ui/SearchInput'
import SelectField from '../../../components/ui/SelectField'
import Pagination from '../../../components/ui/Pagination'
import Card from '../../../components/ui/Card'
import LoadingState from '../../../components/ui/LoadingState'
import Alert from '../../../components/ui/Alert'
import { RegistrationsTable } from '../components/registrations/RegistrationsTable'
import { useGlobalRegistrations } from '../../../hooks/useGlobalRegistrations'

export default function AdminRegistrationsPage() {
  const [searchInput, setSearchInput] = useState('')
  const {
    registrations,
    pagination,
    isLoading,
    error,
    updateParams,
    changePage,
  } = useGlobalRegistrations({ page: 1, limit: 10, search: '', status: '' })

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      updateParams({ search: searchInput })
    },
    [searchInput, updateParams]
  )

  const handleStatusChange = useCallback(
    (e) => {
      updateParams({ status: e.target.value })
    },
    [updateParams]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registrations"
        description="Manage everyone who has registered across all your events."
      />

      <Card>
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="w-full sm:max-w-xs">
            <SearchInput
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-3">
            <SelectField
              aria-label="Filter by status"
              onChange={handleStatusChange}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending Reminder' },
                { value: 'reminder_sent', label: 'Reminder Sent' },
              ]}
              className="w-[160px]"
            />
          </div>
        </div>

        {error && (
          <div className="p-4">
            <Alert variant="error" title="Failed to load registrations" message={error} />
          </div>
        )}

        {isLoading ? (
          <div className="p-12">
            <LoadingState message="Loading registrations..." />
          </div>
        ) : (
          <>
            <RegistrationsTable registrations={registrations} />
            {pagination && pagination.total_pages > 1 && (
              <div className="border-t border-border px-5 py-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.total_pages}
                  onPageChange={changePage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
