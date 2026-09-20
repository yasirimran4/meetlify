import { ClipboardCheck, Users, Video } from 'lucide-react'
import Card, { CardBody } from '../../../../components/ui/Card'
import { EVENT_DETAIL_TABS, EVENT_STATUS } from '../../../../constants/events'
import { formatNumber } from '../../../../utils/format'

const cards = [
  {
    key: 'registrations',
    label: 'Registrations',
    icon: Users,
    accent: 'text-sky-600 bg-sky-50',
    tab: EVENT_DETAIL_TABS.REGISTRATIONS,
    hint: 'View attendee list',
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: ClipboardCheck,
    accent: 'text-amber-600 bg-amber-50',
    tab: EVENT_DETAIL_TABS.ANALYTICS,
    hint: 'View analytics',
  },
  {
    key: 'recording',
    label: 'Recording',
    icon: Video,
    accent: 'text-violet-600 bg-violet-50',
    tab: EVENT_DETAIL_TABS.RECORDING,
    hint: 'Manage recording',
  },
]

export default function EventSummaryCards({ analytics, event, onNavigateTab }) {
  const registrationCount = analytics?.registrations ?? 0
  const isCompleted = event?.status === EVENT_STATUS.COMPLETED
  const hasRecording = Boolean(event?.videoUrl)

  const values = {
    registrations: formatNumber(registrationCount),
    attendance: 'Not tracked',
    recording: isCompleted ? (hasRecording ? 'Available' : 'Not added') : 'After completion',
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, accent, tab, hint }) => {
        const isRecordingCard = key === 'recording'
        const isDisabled = isRecordingCard && !isCompleted

        return (
          <Card key={key} className={isDisabled ? 'opacity-80' : ''}>
            <button
              type="button"
              onClick={() => !isDisabled && onNavigateTab?.(tab)}
              disabled={isDisabled}
              className={[
                'w-full text-left transition-colors',
                isDisabled ? 'cursor-not-allowed' : 'hover:bg-surface-subtle/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset rounded-xl',
              ].join(' ')}
            >
              <CardBody className="flex items-start justify-between gap-3 p-5">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                    {values[key]}
                  </p>
                  {!isDisabled ? (
                    <p className="mt-2 text-xs font-medium text-primary">{hint} →</p>
                  ) : (
                    <p className="mt-2 text-xs text-text-muted">Available after completion</p>
                  )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </CardBody>
            </button>
          </Card>
        )
      })}
    </div>
  )
}
