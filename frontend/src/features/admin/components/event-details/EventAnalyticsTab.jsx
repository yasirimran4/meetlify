import { BarChart3, TrendingUp, Users } from 'lucide-react'
import Badge from '../../../../components/ui/Badge'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import EmptyState from '../../../../components/ui/EmptyState'
import LoadingState from '../../../../components/ui/LoadingState'
import { formatEventDate, formatNumber } from '../../../../utils/format'

export default function EventAnalyticsTab({ analytics, event, recentRegistrations, isLoading }) {
  if (isLoading) {
    return <LoadingState message="Loading analytics..." />
  }

  if (!analytics) {
    return (
      <EmptyState
        title="Analytics unavailable"
        description="Analytics data could not be loaded for this event."
      />
    )
  }

  const metrics = [
    {
      label: 'Total registrations',
      value: formatNumber(analytics.registrations ?? 0),
      icon: Users,
      accent: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'Conversion rate',
      value: 'Not available',
      icon: TrendingUp,
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Engagement score',
      value: 'Not available',
      icon: BarChart3,
      accent: 'text-violet-600 bg-violet-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label}>
            <CardBody className="flex items-start justify-between gap-3 p-5">
              <div>
                <p className="text-sm font-medium text-text-secondary">{label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-text-primary">Event status</h3>
          </CardHeader>
          <CardBody>
            <Badge status={analytics.status ?? event?.status} />
            <p className="mt-4 text-sm text-text-secondary">
              Detailed trend charts will be available when extended analytics endpoints are added
              to the backend.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-text-primary">Registration growth</h3>
          </CardHeader>
          <CardBody>
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface-subtle">
              <p className="text-sm text-text-secondary">Chart placeholder — backend data unavailable</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-text-primary">Recent registration activity</h3>
        </CardHeader>
        <CardBody>
          {recentRegistrations.length === 0 ? (
            <EmptyState
              title="No recent activity"
              description="Recent registrations will appear here once attendees sign up."
            />
          ) : (
            <ul className="divide-y divide-border">
              {recentRegistrations.map((registration) => (
                <li key={registration.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-text-primary">{registration.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">{registration.email}</p>
                  </div>
                  <time className="shrink-0 text-sm text-text-secondary">
                    {formatEventDate(registration.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
