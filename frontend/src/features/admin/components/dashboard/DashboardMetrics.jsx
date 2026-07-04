import { CalendarDays, CheckCircle2, Clock3, Users } from 'lucide-react'
import Card, { CardBody } from '../../../../components/ui/Card'
import { formatNumber, formatPercent } from '../../../../utils/format'

const METRIC_CONFIG = [
  {
    key: 'total_events',
    label: 'Total Events',
    icon: CalendarDays,
    accent: 'text-sky-600 bg-sky-50',
  },
  {
    key: 'upcoming_events',
    label: 'Upcoming',
    icon: Clock3,
    accent: 'text-amber-600 bg-amber-50',
  },
  {
    key: 'total_registrations',
    label: 'Total Registrations',
    icon: Users,
    accent: 'text-violet-600 bg-violet-50',
  },
  {
    key: 'completion_rate',
    label: 'Completion Rate',
    icon: CheckCircle2,
    accent: 'text-emerald-600 bg-emerald-50',
  },
]

export default function DashboardMetrics({ stats }) {
  const completionRate =
    stats?.total_events > 0
      ? (stats.completed_events / stats.total_events) * 100
      : 0

  const values = {
    total_events: stats?.total_events ?? 0,
    upcoming_events: stats?.upcoming_events ?? 0,
    total_registrations: stats?.total_registrations ?? 0,
    completion_rate: completionRate,
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {METRIC_CONFIG.map(({ key, label, icon: Icon, accent }) => (
        <Card key={key}>
          <CardBody className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text-secondary">{label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                  {key === 'completion_rate'
                    ? formatPercent(values[key])
                    : formatNumber(values[key])}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
