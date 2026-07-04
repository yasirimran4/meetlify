import {
  CalendarDays,
  ExternalLink,
  Pencil,
  Trash2,
  UploadCloud,
  Video,
} from 'lucide-react'
import Badge from '../../../../components/ui/Badge'
import Button from '../../../../components/ui/Button'
import { EVENT_STATUS } from '../../../../constants/events'
import { formatEventDate } from '../../../../utils/format'

export default function EventDetailsHeader({
  event,
  onEdit,
  onPublish,
  onDelete,
  isPublishing,
}) {
  const isDraft = event.status === EVENT_STATUS.DRAFT
  const isCompleted = event.status === EVENT_STATUS.COMPLETED

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 gap-4">
        {event.thumbnailUrl ? (
          <div className="hidden shrink-0 overflow-hidden rounded-xl border border-border bg-surface-subtle sm:block sm:h-24 sm:w-36">
            <img
              src={event.thumbnailUrl}
              alt={`${event.title} thumbnail`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge status={event.status} />
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {event.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
            <time dateTime={event.eventDateTime}>{formatEventDate(event.eventDateTime)}</time>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          fullWidth={false}
          className="px-4"
          onClick={onEdit}
          disabled={isCompleted}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit
        </Button>

        {isDraft ? (
          <Button
            fullWidth={false}
            className="px-4"
            onClick={onPublish}
            isLoading={isPublishing}
            disabled={isPublishing}
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Publish
          </Button>
        ) : (
          <Button variant="outline" fullWidth={false} className="px-4" disabled>
            Unpublish unavailable
          </Button>
        )}

        <Button
          variant="outline"
          fullWidth={false}
          className="px-4 text-error hover:bg-error-muted"
          onClick={onDelete}
          disabled={isCompleted}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </Button>

        {event.meetingLink ? (
          <a
            href={event.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Video className="h-4 w-4" aria-hidden="true" />
            Google Meet
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </div>
  )
}
