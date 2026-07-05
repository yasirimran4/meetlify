import { Link } from 'react-router-dom'
import { PUBLIC_ROUTES } from '../../constants/api'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:p-10">
        <p className="text-7xl font-black tracking-tight text-primary sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-text-primary sm:text-3xl">Page not found</h1>
        <Link
          to={PUBLIC_ROUTES.home}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          Return to Home
        </Link>
      </div>
    </main>
  )
}
