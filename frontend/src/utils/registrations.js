export function normalizeRegistration(raw) {
  if (!raw) return null

  const currentRole = raw.currentRole ?? raw.current_role ?? ''
  const reminderSent = raw.reminderSent ?? raw.reminder_sent ?? false
  const createdAt = raw.createdAt ?? raw.created_at
  const eventTitle = raw.eventTitle ?? raw.event_title ?? ''

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
