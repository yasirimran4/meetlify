export function normalizeEventStatus(status) {
  if (!status) return 'draft'
  return String(status).toLowerCase()
}

export function normalizeEvent(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    title: raw.title ?? '',
    description: raw.description ?? '',
    speakerName: raw.speaker_name ?? '',
    status: normalizeEventStatus(raw.status),
    eventDateTime: raw.event_date_time,
    meetingLink: raw.meeting_link,
    thumbnailUrl: raw.thumbnail_url,
    videoUrl: raw.video_url,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export function normalizeEvents(items) {
  if (!Array.isArray(items)) return []
  return items.map(normalizeEvent).filter(Boolean)
}

export function sortEvents(events, sortBy) {
  const sorted = [...events]

  switch (sortBy) {
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime(),
      )
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime(),
      )
  }
}

export function filterEventsByStatus(events, statusFilter) {
  if (!statusFilter || statusFilter === 'all') return events
  return events.filter((event) => event.status === statusFilter)
}

export function paginateItems(items, page, pageSize) {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize

  return {
    items: items.slice(start, end),
    pagination: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrevious: safePage > 1,
      start: totalItems === 0 ? 0 : start + 1,
      end: Math.min(end, totalItems),
    },
  }
}
