export function normalizeRegistration(raw) {
  if (!raw) return null

  const currentRole = raw.currentRole ?? raw.current_role ?? ''
  const reminderSent = raw.reminderSent ?? raw.reminder_sent ?? false
  const createdAt = raw.createdAt ?? raw.created_at
  const eventTitle = raw.eventTitle ?? raw.event_title ?? ''
  const eventId = raw.eventId ?? raw.event_id ?? null

  return {
    id: raw.id,
    name: raw.name ?? '',
    email: raw.email ?? '',
    currentRole,
    current_role: currentRole,
    organization: raw.organization ?? '',
    semester: raw.semester ?? '',
    reminderSent: Boolean(reminderSent),
    reminder_sent: Boolean(reminderSent),
    createdAt,
    created_at: createdAt,
    eventId,
    event_id: eventId,
    eventTitle,
    event_title: eventTitle,
  }
}

function extractRegistrationsArray(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.registrations)) return payload.registrations
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.data?.items)) return payload.data.items
  if (Array.isArray(payload.data?.registrations)) return payload.data.registrations

  if (payload.data && typeof payload.data === 'object') {
    return extractRegistrationsArray(payload.data)
  }

  return []
}

export function extractPagination(payload) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  return payload.pagination ?? payload.data?.pagination ?? null
}

export function normalizePagination(pageData, pageSize) {
  if (!pageData) {
    return {
      page: 1,
      totalPages: 1,
      totalItems: 0,
      hasNext: false,
      hasPrevious: false,
      start: 0,
      end: 0,
    }
  }

  const totalItems = pageData.total_items ?? pageData.totalItems ?? 0
  const currentPage = pageData.page ?? 1
  const limit = pageData.limit ?? pageSize ?? 10
  const start = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, totalItems)

  return {
    page: currentPage,
    totalPages: pageData.total_pages ?? pageData.totalPages ?? 1,
    totalItems,
    hasNext: pageData.has_next ?? pageData.hasNext ?? false,
    hasPrevious: pageData.has_previous ?? pageData.hasPrevious ?? false,
    start,
    end,
  }
}

export function normalizeRegistrations(payload) {
  const items = extractRegistrationsArray(payload)
  return items.map(normalizeRegistration).filter(Boolean)
}

export function filterRegistrations(registrations, query) {
  const term = query.trim().toLowerCase()
  if (!term) return registrations

  return registrations.filter((registration) =>
    [registration.name, registration.email, registration.organization, registration.currentRole]
      .join(' ')
      .toLowerCase()
      .includes(term),
  )
}
