const STATUS_STYLES = {
  draft: 'bg-violet-50 text-violet-700 ring-violet-200',
  published: 'bg-sky-50 text-sky-700 ring-sky-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

const STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  completed: 'Completed',
}

export default function Badge({ status, className = '' }) {
  const normalized = String(status ?? 'draft').toLowerCase()
  const styles = STATUS_STYLES[normalized] ?? STATUS_STYLES.draft
  const label = STATUS_LABELS[normalized] ?? normalized

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        styles,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
