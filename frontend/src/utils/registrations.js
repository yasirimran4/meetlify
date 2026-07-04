export function normalizeRegistration(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.name ?? '',
    email: raw.email ?? '',
    currentRole: raw.current_role ?? '',
    organization: raw.organization ?? '',
    semester: raw.semester ?? '',
    reminderSent: Boolean(raw.reminder_sent),
    createdAt: raw.created_at,
  }
}

export function normalizeRegistrations(items) {
  if (!Array.isArray(items)) return []
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
