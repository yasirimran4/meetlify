import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import LoadingState from '../../../components/ui/LoadingState'
import PageHeader from '../../../components/ui/PageHeader'
import Pagination from '../../../components/ui/Pagination'
import EventsToolbar from '../components/events/EventsToolbar'
import { EventsTable } from '../components/events/EventsTable'
import { useEventsData } from '../../../hooks/useEventsData'
import { ADMIN_ROUTES } from '../../../constants/api'

export default function AdminEventsPage() {
  const navigate = useNavigate()
  const {
    events,
    pagination,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    setPage,
    pageSize,
    setPageSize,
    pageSizeOptions,
    isLoading,
    isRefreshing,
    error,
    actionError,
    actionMessage,
    registrationCounts,
    reload,
    publishEvent,
    deleteEvent,
  } = useEventsData()

  const [pendingDeleteEvent, setPendingDeleteEvent] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleView(event) {
    navigate(ADMIN_ROUTES.eventDetails(event.id))
  }

  function handleCreate() {
    navigate(ADMIN_ROUTES.eventCreate)
  }

  function handleEdit(event) {
    navigate(ADMIN_ROUTES.eventEdit(event.id))
  }

  function handlePublish(event) {
    publishEvent(event.id)
  }

  function handleDeleteRequest(event) {
    setPendingDeleteEvent(event)
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteEvent) return

    setIsDeleting(true)
    await deleteEvent(pendingDeleteEvent.id)
    setIsDeleting(false)
    setPendingDeleteEvent(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage and monitor all platform events."
        actions={
          <Button fullWidth={false} className="px-4" onClick={handleCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Event
          </Button>
        }
      />

      {actionMessage ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {actionMessage}
        </div>
      ) : null}

      {actionError ? <Alert title="Action failed" message={actionError} /> : null}

      {error ? (
        <div className="space-y-3">
          <Alert title="Unable to load events" message={error} />
          <Button fullWidth={false} onClick={reload}>
            Try again
          </Button>
        </div>
      ) : (
        <Card>
          <EventsToolbar
            search={search}
            onSearchChange={(event) => setSearch(event.target.value)}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onRefresh={reload}
            isRefreshing={isRefreshing}
          />

          {isLoading ? (
            <div className="p-6">
              <LoadingState message="Loading events..." />
            </div>
          ) : (
            <>
              <EventsTable
                events={events}
                registrationCounts={registrationCounts}
                onView={handleView}
                onEdit={handleEdit}
                onPublish={handlePublish}
                onDelete={handleDeleteRequest}
              />

              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                start={pagination.start}
                end={pagination.end}
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                onPageChange={setPage}
                onPageSizeChange={(nextSize) => {
                  setPageSize(nextSize)
                  setPage(1)
                }}
              />
            </>
          )}
        </Card>
      )}


      <ConfirmDialog
        isOpen={Boolean(pendingDeleteEvent)}
        title="Delete event"
        description={
          pendingDeleteEvent
            ? `Are you sure you want to delete "${pendingDeleteEvent.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete event"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteEvent(null)}
      />
    </div>
  )
}
