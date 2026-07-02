import { AlertCircle, X } from 'lucide-react'

export default function Alert({ title, message, onDismiss, className = '' }) {
  return (
    <div
      role="alert"
      className={[
        'flex items-start gap-3 rounded-lg border border-error-border bg-error-muted px-4 py-3',
        className,
      ].join(' ')}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-semibold text-error">{title}</p> : null}
        <p className={`text-sm text-error ${title ? 'mt-0.5' : ''}`}>{message}</p>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
