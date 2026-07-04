import { forwardRef } from 'react'

const Textarea = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={`w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-50 ${
          error
            ? 'border-error text-error placeholder:text-error/60 focus:border-error focus:ring-error/20'
            : 'border-border focus:border-primary focus:ring-primary/20 hover:border-text-secondary/30'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
