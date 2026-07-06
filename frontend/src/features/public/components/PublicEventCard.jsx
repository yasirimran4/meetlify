import { CalendarDays, User, PlayCircle } from 'lucide-react'
import { formatEventDate } from '../../../utils/format'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'

export default function PublicEventCard({ event, isPast }) {
  const hasRecording = isPast && event.video_url

  return (
    <Link to={`/events/${event.id}`} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary/50">
        <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
        {event.thumbnail_url ? (
          <img
            src={event.thumbnail_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 shadow-sm"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-subtle">
            <CalendarDays className="h-12 w-12 text-text-muted" />
          </div>
        )}
        {/* removed dark gradient overlay to preserve thumbnail colors */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-end">
          {hasRecording && (
            <Badge variant="success" className="gap-1 shadow-sm">
              <PlayCircle className="h-3 w-3" />
              Recording Available
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary flex-1">{event.description}</p>
        
        <div className="mt-4 space-y-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-text-muted" />
            <span className="truncate">{formatEventDate(event.event_date_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-text-muted" />
            <span className="truncate">{event.speaker_name}</span>
          </div>
        </div>
      </div>
      </Card>
    </Link>
  )
}
