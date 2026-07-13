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

export function normalizeRegistrations(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeRegistration).filter(Boolean)
  }

  if (payload && typeof payload === 'object') {
    const items = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.data?.items)
        ? payload.data.items
        : []

    return items.map(normalizeRegistration).filter(Boolean)
  }

  return []
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
