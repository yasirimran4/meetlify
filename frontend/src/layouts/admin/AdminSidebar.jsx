import { NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '../../constants/navigation'
import { ADMIN_ROUTES } from '../../constants/api'
import { useAuth } from '../../contexts/AuthContext'

function navLinkClassName({ isActive }, collapsed) {
  return [
    'group flex items-center rounded-lg text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
    collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
    isActive
      ? 'bg-sidebar-active text-sidebar-text-active'
      : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active',
  ].join(' ')
}

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate(ADMIN_ROUTES.login, { replace: true })
  }

  function handleNavClick() {
    onCloseMobile?.()
  }

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-text transition-all duration-300 lg:static lg:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        aria-label="Admin navigation"
      >
        <div
          className={[
            'flex h-16 items-center border-b border-sidebar-border',
            collapsed ? 'justify-center px-2' : 'justify-between px-4',
          ].join(' ')}
        >
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-sidebar-text-active">Meetlify</p>
              <p className="truncate text-xs text-sidebar-text">Event Admin</p>
            </div>
          ) : (
            <span className="text-sm font-bold text-sidebar-text-active" aria-hidden="true">
              M
            </span>
          )}

          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              title={collapsed ? label : undefined}
              className={(state) => navLinkClassName(state, collapsed)}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed ? <span>{label}</span> : null}
              {collapsed ? <span className="sr-only">{label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-sidebar-border px-3 py-4">
          <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : undefined}
            className={[
              'flex w-full items-center rounded-lg text-sm font-medium text-sidebar-text transition-colors',
              'hover:bg-sidebar-hover hover:text-sidebar-text-active',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
              collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
            ].join(' ')}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed ? <span>Sign Out</span> : null}
            {collapsed ? <span className="sr-only">Sign Out</span> : null}
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className={[
              'hidden w-full items-center rounded-lg text-sm font-medium text-sidebar-text transition-colors lg:flex',
              'hover:bg-sidebar-hover hover:text-sidebar-text-active',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
              collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
            ].join(' ')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
