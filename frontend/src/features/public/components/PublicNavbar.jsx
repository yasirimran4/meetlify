import { Link } from 'react-router-dom'
import { ADMIN_ROUTES } from '../../../constants/api'

export default function PublicNavbar() {
  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-text-primary tracking-tight">Meetlify</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/events" className="text-md font-medium text-text-secondary hover:text-text-primary transition-colors">
              Events
            </Link>
            <Link
              to={ADMIN_ROUTES.login}
              className="text-md font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
