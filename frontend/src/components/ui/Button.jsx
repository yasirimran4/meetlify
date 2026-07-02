import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary/30',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-subtle',
}

const sizes = {
  md: 'h-11 px-4 text-sm',
  sm: 'h-9 px-3 text-sm',
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || isLoading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-lg font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
