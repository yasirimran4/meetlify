import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No data yet',
  description = 'There is nothing to display right now.',
  action = null,
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-text-secondary">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
      {action}
    </div>
  )
}
