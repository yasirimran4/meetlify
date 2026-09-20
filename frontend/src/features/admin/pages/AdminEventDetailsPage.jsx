import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  BarChart3,
  LayoutGrid,
  Users,
  Video,
} from 'lucide-react'
import Alert from '../../../components/ui/Alert'
import Breadcrumb from '../../../components/ui/Breadcrumb'
import Button from '../../../components/ui/Button'
import ConfirmDialog from '../../../components/ui/ConfirmDialog'
import LoadingState from '../../../components/ui/LoadingState'
import Tabs, { TabPanel, TabSectionHeader } from '../../../components/ui/Tabs'
import EventAnalyticsTab from '../components/event-details/EventAnalyticsTab'
import EventDetailsHeader from '../components/event-details/EventDetailsHeader'
import EventOverviewTab from '../components/event-details/EventOverviewTab'
import EventRecordingTab from '../components/event-details/EventRecordingTab'
import EventRegistrationsTab from '../components/event-details/EventRegistrationsTab'
import EventSummaryCards from '../components/event-details/EventSummaryCards'
import { ADMIN_ROUTES } from '../../../constants/api'
import { EVENT_DETAIL_TABS, EVENT_STATUS } from '../../../constants/events'
import { getEventDetailTabFromSearch } from '../../../constants/navigation'
import { useEventDetails } from '../../../hooks/useEventDetails'
import { useEventRegistrations } from '../../../hooks/useEventRegistrations'

export default function AdminEventDetailsPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => getEventDetailTabFromSearch(searchParams))
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
  const registrationCount = analytics?.registrations ?? registrationsState.pagination.totalItems ?? 0

  const handleTabChange = useCallback((nextTab) => {
    setActiveTab(nextTab)
    setSearchParams(nextTab === EVENT_DETAIL_TABS.OVERVIEW ? {} : { tab: nextTab }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    const tabFromUrl = getEventDetailTabFromSearch(searchParams)
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams, activeTab])

  useEffect(() => {
    if (!event) return

    if (
      activeTab === EVENT_DETAIL_TABS.RECORDING &&
      event.status !== EVENT_STATUS.COMPLETED
    ) {
      handleTabChange(EVENT_DETAIL_TABS.OVERVIEW)
    }
  }, [event, activeTab, handleTabChange])

  function handleViewRegistrations() {
    handleTabChange(EVENT_DETAIL_TABS.REGISTRATIONS)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const tabs = useMemo(
    () => [
      {
        id: EVENT_DETAIL_TABS.OVERVIEW,
        label: 'Overview',
        icon: LayoutGrid,
        description: 'Event details, speakers, and meeting link',
      },
      {
        id: EVENT_DETAIL_TABS.REGISTRATIONS,
        label: 'Registrations',
        icon: Users,
        badge: registrationCount > 0 ? registrationCount : null,
        description: 'Attendees who signed up for this event',
      },
      {
        id: EVENT_DETAIL_TABS.ANALYTICS,
        label: 'Analytics',
        icon: BarChart3,
        description: 'Registration trends and insights',
      },
      {
        id: EVENT_DETAIL_TABS.RECORDING,
        label: 'Recording',
        icon: Video,
        disabled: event?.status !== EVENT_STATUS.COMPLETED,
        description: 'Upload and manage the event recording',
      },
    ],
    [event?.status, registrationCount],
  )

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]

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
        registrationCount={registrationCount}
        onViewRegistrations={handleViewRegistrations}
        onEdit={() => navigate(ADMIN_ROUTES.eventEdit(eventId))}
        onPublish={publishEvent}
        onComplete={completeEvent}
        onDelete={() => setShowDeleteDialog(true)}
        isPublishing={isPublishing}
        isCompleting={isCompleting}
      />

      <EventSummaryCards
        analytics={analytics}
        event={event}
        onNavigateTab={handleTabChange}
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Event sections</h2>
            <p className="text-sm text-text-secondary">
              Switch between overview, registrations, analytics, and recording.
            </p>
          </div>
          {activeTab !== EVENT_DETAIL_TABS.REGISTRATIONS ? (
            <Button
              variant="outline"
              fullWidth={false}
              className="border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100"
              onClick={handleViewRegistrations}
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              View registrations ({registrationCount})
            </Button>
          ) : null}
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={handleTabChange}
          variant="pill"
        />
      </div>

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.OVERVIEW} className="pt-2">
        <TabSectionHeader
          title={activeTabMeta.label}
          description={activeTabMeta.description}
        />
        <EventOverviewTab event={event} />
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.REGISTRATIONS} className="pt-2">
        <TabSectionHeader
          title="Registrations"
          description="Everyone who registered for this event. Search by name or email."
          action={
            <Button
              variant="outline"
              fullWidth={false}
              onClick={() => navigate(ADMIN_ROUTES.registrations)}
            >
              View all registrations
            </Button>
          }
        />
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

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.ANALYTICS} className="pt-2">
        <TabSectionHeader
          title="Analytics"
          description="Registration performance and recent sign-ups for this event."
        />
        <EventAnalyticsTab
          analytics={analytics}
          event={event}
          recentRegistrations={registrationsState.registrations.slice(0, 5)}
          isLoading={false}
        />
      </TabPanel>

      <TabPanel activeTab={activeTab} tabId={EVENT_DETAIL_TABS.RECORDING} className="pt-2">
        <TabSectionHeader
          title="Recording"
          description="Add a recording link after the event is marked completed."
        />
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
