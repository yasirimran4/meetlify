import { ExternalLink, MapPin, UserRound } from 'lucide-react'
import Card, { CardBody, CardHeader } from '../../../../components/ui/Card'
import { formatEventDate } from '../../../../utils/format'

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle text-text-secondary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <div className="mt-1 text-sm text-text-primary">{children}</div>
      </div>
    </div>
  )
}

export default function EventOverviewTab({ event }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-text-primary">Event information</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          {event.thumbnailUrl ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <img
                src={event.thumbnailUrl}
                alt={`${event.title} cover`}
                className="aspect-video w-full object-cover"
              />
            </div>
          ) : null}

          <div>
            <p className="text-sm font-medium text-text-secondary">Description</p>
            <p className="mt-2 text-sm leading-relaxed text-text-primary">{event.description}</p>
          </div>

          <div className="divide-y divide-border">
            <DetailRow icon={UserRound} label="Speaker">
              {event.speakerName}
            </DetailRow>
            <DetailRow icon={MapPin} label="Google Meet">
              {event.meetingLink ? (
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                >
                  Join meeting
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                '—'
              )}
            </DetailRow>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-text-primary">Quick metadata</h3>
        </CardHeader>
        <CardBody className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-text-secondary">Event date & time</p>
            <p className="mt-1 text-text-primary">{formatEventDate(event.eventDateTime)}</p>
          </div>
          <div>
            <p className="font-medium text-text-secondary">Platform</p>
            <p className="mt-1 text-text-primary">Google Meet</p>
          </div>
          <div>
            <p className="font-medium text-text-secondary">Created</p>
            <p className="mt-1 text-text-primary">{formatEventDate(event.createdAt)}</p>
          </div>
          <div>
            <p className="font-medium text-text-secondary">Last updated</p>
            <p className="mt-1 text-text-primary">{formatEventDate(event.updatedAt)}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
