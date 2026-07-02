import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import dashboardPreview from '../assets/images/dashboard.png'
import { PUBLIC_ROUTES } from '../constants/api'

export default function AdminAuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-muted lg:grid lg:grid-cols-2">
      <aside className="hidden bg-surface-subtle px-8 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div>
          <p className="text-lg font-bold tracking-tight text-text-primary">Meetlify</p>
          <div className="mt-16 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary xl:text-5xl">
              The Modern Operating System for Virtual Events.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-text-secondary">
              Manage large-scale virtual gatherings with mathematical precision, real-time
              analytics, and seamless attendee workflows.
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-surface-muted px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-border-input" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-input" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-input" />
          </div>
          <img
            src={dashboardPreview}
            alt="Meetlify admin dashboard preview showing events overview and participant statistics"
            className="block w-full"
          />
        </div>
      </aside>

      <main className="flex min-h-screen flex-col px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-8 lg:hidden">
          <p className="text-lg font-bold tracking-tight text-text-primary">Meetlify</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-md">{children}</div>

          <Link
            to={PUBLIC_ROUTES.home}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to website
          </Link>
        </div>
      </main>
    </div>
  )
}
