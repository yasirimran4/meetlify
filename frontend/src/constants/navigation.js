import { LayoutDashboard, CalendarDays, UserRound, Users } from 'lucide-react'
import { ADMIN_ROUTES } from './api'

export const ADMIN_NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: ADMIN_ROUTES.dashboard,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: 'Events',
    to: ADMIN_ROUTES.events,
    icon: CalendarDays,
    end: false,
  },
  {
    label: 'Registrations',
    to: ADMIN_ROUTES.registrations,
    icon: Users,
    end: false,
  },
  {
    label: 'Profile',
    to: ADMIN_ROUTES.profile,
    icon: UserRound,
    end: false,
  },
]

export function getAdminPageTitle(pathname) {
  const match = ADMIN_NAV_ITEMS.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to),
  )

  return match?.label ?? 'Admin'
}
