import { Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import AdminLoginPage from './features/auth/pages/AdminLoginPage'
import AdminLayout from './layouts/admin/AdminLayout'
import AdminPlaceholderPage from './features/admin/pages/AdminPlaceholderPage'
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage'
import AdminEventsPage from './features/admin/pages/AdminEventsPage'
import AdminRegistrationsPage from './features/admin/pages/AdminRegistrationsPage'
import AdminEventFormPage from './features/admin/pages/AdminEventFormPage'
import AdminEventDetailsPage from './features/admin/pages/AdminEventDetailsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import GuestRoute from './components/auth/GuestRoute'
import PublicLandingPage from './features/public/pages/PublicLandingPage'
import PublicEventsPage from './features/public/pages/PublicEventsPage'
import PublicEventDetailsPage from './features/public/pages/PublicEventDetailsPage'
import PublicEventRegistrationPage from './features/public/pages/PublicEventRegistrationPage'
import NotFound from './components/ui/NotFound'
import { ADMIN_ROUTES } from './constants/api'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/events/:eventId" element={<PublicEventDetailsPage />} />
        <Route path="/events/:eventId/register" element={<PublicEventRegistrationPage />} />
        <Route
          path={ADMIN_ROUTES.login}
          element={
            <GuestRoute>
              <AdminLoginPage />
            </GuestRoute>
          }
        />

        <Route
          path={ADMIN_ROUTES.dashboard}
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="events/new" element={<AdminEventFormPage />} />
          <Route path="events/:eventId" element={<AdminEventDetailsPage />} />
          <Route path="events/:eventId/edit" element={<AdminEventFormPage />} />
          <Route path="registrations" element={<AdminRegistrationsPage />} />
          <Route path="profile" element={<AdminPlaceholderPage title="Profile" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  )
}

export default App
