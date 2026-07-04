export function formatEventDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatShortDate(value) {
  if (!value) return { month: '—', day: '—' }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { month: '—', day: '—' }

  return {
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase(),
    day: new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date),
  }
}

export function formatNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return '0'
  return new Intl.NumberFormat('en-US').format(Number(value))
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return '0%'
  return `${Math.round(Number(value))}%`
}

export function truncateText(text, maxLength = 80) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}
