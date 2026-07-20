import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Alert from '../../../components/ui/Alert'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import LoadingState from '../../../components/ui/LoadingState'
import Tabs, { TabPanel } from '../../../components/ui/Tabs'
import EventAnalyticsTab from '../components/event-details/EventAnalyticsTab'
import EventDetailsHeader from '../components/event-details/EventDetailsHeader'
import EventOverviewTab from '../components/event-details/EventOverviewTab'
import EventRecordingTab from '../components/event-details/EventRecordingTab'
import EventRegistrationsTab from '../components/event-details/EventRegistrationsTab'
import EventSummaryCards from '../components/event-details/EventSummaryCards'
import { ADMIN_ROUTES } from '../../../constants/api'
import { EVENT_DETAIL_TABS, EVENT_STATUS } from '../../../constants/events'
import { useEventDetails } from '../../../hooks/useEventDetails'
import { useEventRegistrations } from '../../../hooks/useEventRegistrations'

export default function AdminEventDetailsPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(EVENT_DETAIL_TABS.OVERVIEW)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    event,
    analytics,
    isLoading,
    error,
    actionError,
    actionMessage,
    isPublishing,
    isCompleting,
    isDeleting,
    isSavingRecording,
    publishEvent,
    completeEvent,
    deleteEvent,
    saveRecording,
  } = useEventDetails(eventId)

  const registrationsState = useEventRegistrations(eventId)

  const tabs = useMemo(
    () => [
      { id: EVENT_DETAIL_TABS.OVERVIEW, label: 'Overview' },
      { id: EVENT_DETAIL_TABS.REGISTRATIONS, label: 'Registrations' },
      { id: EVENT_DETAIL_TABS.ANALYTICS, label: 'Analytics' },
      {
        id: EVENT_DETAIL_TABS.RECORDING,
        label: 'Recording',
        disabled: event?.status !== EVENT_STATUS.COMPLETED,
      },
    ],
    [event?.status],
  )

  async function handleConfirmDelete() {
    const deleted = await deleteEvent()
    if (deleted) {
      navigate(ADMIN_ROUTES.events, { replace: true })
    }
    setShowDeleteDialog(false)
  }

  if (isLoading) {
    return <LoadingState message="Loading event details..." />
  }

  if (error || !event) {
    return (
      <div className="space-y-4">
        <Alert
          title="Unable to load event"
          message={error ?? 'This event could not be found.'}
        />
        <Button fullWidth={false} onClick={() => navigate(ADMIN_ROUTES.events)}>
          Back to events
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Events', to: ADMIN_ROUTES.events },
          { label: event.title },
        ]}
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

      <EventDetailsHeader
        event={event}
        onEdit={() => navigate(ADMIN_ROUTES.eventEdit(eventId))}
        onPublish={publishEvent}
        onComplete={completeEvent}
        onDelete={() => setShowDeleteDialog(true)}
        isPublishing={isPublishing}
        isCompleting={isCompleting}
      />

      <EventSummaryCards analytics={analytics} event={event} />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.OVERVIEW} className="pt-6">
        <EventOverviewTab event={event} />
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.REGISTRATIONS} className="pt-6">
        <EventRegistrationsTab
          registrations={registrationsState.registrations}
          pagination={registrationsState.pagination}
          search={registrationsState.search}
          onSearchChange={(inputEvent) => registrationsState.setSearch(inputEvent.target.value)}
          page={registrationsState.page}
          onPageChange={registrationsState.setPage}
          pageSize={registrationsState.pageSize}
          onPageSizeChange={(nextSize) => {
            registrationsState.setPageSize(nextSize)
            registrationsState.setPage(1)
          }}
          pageSizeOptions={registrationsState.pageSizeOptions}
          isLoading={registrationsState.isLoading}
          error={registrationsState.error}
          onRetry={registrationsState.reload}
        />
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.ANALYTICS} className="pt-6">
        <EventAnalyticsTab
          analytics={analytics}
          event={event}
          recentRegistrations={registrationsState.registrations.slice(0, 5)}
          isLoading={false}
        />
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.RECORDING} className="pt-6">
        <EventRecordingTab
          event={event}
          onSave={saveRecording}
          isSaving={isSavingRecording}
          actionMessage={actionMessage}
        />
      </TabPanel>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete event"
        description={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
        confirmLabel="Delete event"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}
