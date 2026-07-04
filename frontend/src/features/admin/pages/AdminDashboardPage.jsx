import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import LoadingState from '../../../components/ui/LoadingState'
import PageHeader from '../../../components/ui/PageHeader'
import DashboardMetrics from '../components/dashboard/DashboardMetrics'
import RecentEventsTable from '../components/dashboard/RecentEventsTable'
import UpcomingEventsList from '../components/dashboard/UpcomingEventsList'
import { ADMIN_ROUTES } from '../../../constants/api'
import { useDashboardData } from '../../../hooks/useDashboardData'

export default function AdminDashboardPage() {
  const {
    stats,
    upcomingEvents,
    recentEvents,
    registrationCounts,
    isLoading,
    error,
    reload,
  } = useDashboardData()

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert title="Unable to load dashboard" message={error} />
        <Button fullWidth={false} onClick={reload}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Admin"
        description="Here is what's happening across your events today."
        actions={
          <>
            <Button variant="outline" fullWidth={false} className="px-4" disabled>
              View Analytics
            </Button>
            <Button fullWidth={false} className="px-4" disabled>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create New Event
            </Button>
          </>
        }
      />

      <DashboardMetrics stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <RecentEventsTable
          events={recentEvents}
          registrationCounts={registrationCounts}
        />
        <UpcomingEventsList events={upcomingEvents} />
      </div>

      <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-4 text-sm text-text-secondary">
        Analytics charts and activity feeds will be added when the corresponding backend
        endpoints are available.{' '}
        <Link to={ADMIN_ROUTES.events} className="font-medium text-primary hover:underline">
          Manage events
        </Link>
      </div>
    </div>
  )
}
