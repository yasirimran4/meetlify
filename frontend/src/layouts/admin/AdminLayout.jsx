import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopNav from './AdminTopNav'

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function toggleSidebar() {
    setSidebarCollapsed((current) => !current)
  }

  function openMobileMenu() {
    setMobileMenuOpen(true)
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={closeMobileMenu}
        onToggleCollapse={toggleSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopNav
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onOpenMobileMenu={openMobileMenu}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
