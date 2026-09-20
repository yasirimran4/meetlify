export default function PageGuide({ title, children, className = '' }) {
  return (
    <div
      className={[
        'rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-950',
        className,
      ].join(' ')}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? 'mt-1 text-sky-900/90' : ''}>{children}</div>
    </div>
  )
}
