export default function Card({ children, className = '' }) {
  return (
    <div
      className={[
        'rounded-xl border border-border bg-surface shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`border-b border-border px-5 py-4 ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}
