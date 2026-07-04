import { useLocation } from 'react-router-dom'
import { Bell, HelpCircle, Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { getAdminPageTitle } from '../../constants/navigation'

export default function AdminTopNav({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileMenu,
}) {
  const location = useLocation()
  const pageTitle = getAdminPageTitle(location.pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onToggleSidebar}
        className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 lg:inline-flex"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </button>

      <h1 className="shrink-0 text-lg font-semibold text-text-primary">{pageTitle}</h1>

      <div className="mx-auto hidden w-full max-w-xl lg:block">
        <label htmlFor="global-search" className="sr-only">
          Global search
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            id="global-search"
            type="search"
            placeholder="Global search..."
            disabled
            className="h-10 w-full rounded-lg border border-border bg-surface-muted pl-10 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled
          className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error" aria-hidden="true" />
        </button>

        <button
          type="button"
          disabled
          className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 sm:inline-flex"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-3 border-l border-border pl-3 sm:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-text-primary">Admin User</p>
            <p className="text-xs text-text-secondary">Admin</p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            AU
          </div>
        </div>
      </div>
    </header>
  )
}
