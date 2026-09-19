import { LayoutDashboard, CalendarDays, Users } from 'lucide-react'
import { ADMIN_ROUTES } from './api'
import { EVENT_DETAIL_TABS } from './events'

export const ADMIN_NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: ADMIN_ROUTES.dashboard,
    icon: LayoutDashboard,
    end: true,
    description: 'Overview of events and activity',
  },
  {
    label: 'Events',
    to: ADMIN_ROUTES.events,
    icon: CalendarDays,
    end: false,
    description: 'Create and manage events',
  },
  {
    label: 'Registrations',
    to: ADMIN_ROUTES.registrations,
    icon: Users,
    end: true,
    description: 'All attendees in one place',
  },
]

export function getAdminPageTitle(pathname) {
  if (pathname === ADMIN_ROUTES.registrations) return 'Registrations'
  if (pathname === ADMIN_ROUTES.eventCreate) return 'Create Event'
  if (pathname.endsWith('/edit')) return 'Edit Event'
  if (pathname.startsWith(`${ADMIN_ROUTES.events}/`) && pathname !== ADMIN_ROUTES.events) {
    return 'Event Details'
  }
  if (pathname.startsWith(ADMIN_ROUTES.events)) return 'Events'
  if (pathname === ADMIN_ROUTES.dashboard) return 'Dashboard'
  if (pathname.startsWith(ADMIN_ROUTES.profile)) return 'Profile'

  const match = ADMIN_NAV_ITEMS.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to),
  )

  return match?.label ?? 'Admin'
}

export function getEventDetailTabFromSearch(searchParams) {
  const tab = searchParams.get('tab')
  const validTabs = Object.values(EVENT_DETAIL_TABS)
  return validTabs.includes(tab) ? tab : EVENT_DETAIL_TABS.OVERVIEW
}
