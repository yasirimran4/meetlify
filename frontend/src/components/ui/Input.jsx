import { AlertCircle } from 'lucide-react'

export default function Input({
  id,
  type = 'text',
  error,
  endAdornment,
  className = '',
  ...props
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'h-11 w-full rounded-lg border bg-surface px-3 text-sm text-text-primary',
          'placeholder:text-text-muted transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
          error
            ? 'border-error focus-visible:border-error focus-visible:ring-error/20'
            : 'border-border-input',
          endAdornment ? 'pr-16' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {endAdornment ? (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endAdornment}</div>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}
