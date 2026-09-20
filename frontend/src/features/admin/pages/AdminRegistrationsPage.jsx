import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import PageGuide from '../../../components/ui/PageGuide'
import SearchInput from '../../../components/ui/SearchInput'
import SelectField from '../../../components/ui/SelectField'
import Pagination from '../../../components/ui/Pagination'
import Card from '../../../components/ui/Card'
import LoadingState from '../../../components/ui/LoadingState'
import Alert from '../../../components/ui/Alert'
import { RegistrationsTable } from '../components/registrations/RegistrationsTable'
import { useGlobalRegistrations } from '../../../hooks/useGlobalRegistrations'
import { fetchAdminEvents } from '../../../services/eventService'
import { ADMIN_ROUTES } from '../../../constants/api'
import { normalizeEvents } from '../../../utils/events'

export default function AdminRegistrationsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [eventOptions, setEventOptions] = useState([{ value: 'all', label: 'All events' }])
  const {
    registrations,
    pagination,
    isLoading,
    error,
    params,
    pageSize,
    pageSizeOptions,
    updateParams,
    changePage,
    setPageSize,
  } = useGlobalRegistrations({ page: 1, limit: 10, search: '', eventId: '', status: '' })

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      try {
        const response = await fetchAdminEvents({ page: 1, limit: 100 })
        const events = normalizeEvents(response?.items ?? [])
        if (!isMounted) return

        setEventOptions([
          { value: 'all', label: 'All events' },
          ...events.map((event) => ({ value: String(event.id), label: event.title })),
        ])
      } catch {
        if (isMounted) {
          setEventOptions([{ value: 'all', label: 'All events' }])
        }
      }
    }

    loadEvents()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      updateParams({ search: searchInput })
    },
    [searchInput, updateParams],
  )

  const handleStatusChange = useCallback(
    (e) => {
      updateParams({ status: e.target.value })
    },
    [updateParams],
  )

  const handleEventChange = useCallback(
    (e) => {
      updateParams({ eventId: e.target.value })
    },
    [updateParams],
  )

  const selectedEventId = params.eventId && params.eventId !== 'all' ? params.eventId : ''

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registrations"
        description="Every attendee across all your events — search, filter, and jump to an event's registration list."
      />

      <PageGuide title="Two ways to view registrations">
        Use this page to browse <strong>all attendees</strong> at once. To see registrations for a
        specific event, filter by event below or go to{' '}
        <Link to={ADMIN_ROUTES.events} className="font-semibold underline underline-offset-2">
          Events
        </Link>{' '}
        and click the blue Registrations button on any row.
      </PageGuide>

      <Card>
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearch} className="w-full lg:max-w-sm">
            <SearchInput
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SelectField
              aria-label="Filter by event"
              value={selectedEventId || 'all'}
              onChange={handleEventChange}
              options={eventOptions}
              className="w-full sm:w-[220px]"
            />
            <SelectField
              aria-label="Filter by status"
              value={params.status || 'all'}
              onChange={handleStatusChange}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'pending', label: 'Pending reminder' },
                { value: 'reminder_sent', label: 'Reminder sent' },
              ]}
              className="w-full sm:w-[180px]"
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
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              start={pagination.start}
              end={pagination.end}
              pageSize={pageSize}
              pageSizeOptions={pageSizeOptions}
              onPageChange={changePage}
              onPageSizeChange={setPageSize}
              itemLabel="registrations"
            />
          </>
        )}
      </Card>
    </div>
  )
}
