export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-sm text-text-secondary">&copy; {new Date().getFullYear()} Meetlify. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yasirimran4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
              aria-label="GitHub yasirimran4"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.67 1.25 3.32.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.12 0 .3.2.66.79.55C20.71 21.38 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
              </svg>
              <span className="hidden sm:inline">yasirimran4</span>
            </a>

            <a
              href="https://linkedin.com/in/yasir-imran"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
              aria-label="LinkedIn yasir-imran"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.444-2.136 2.939v5.667H9.349V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.605 0 4.271 2.373 4.271 5.456v6.287zM5.337 7.433a2.062 2.062 0 11.001-4.124 2.062 2.062 0 01-.001 4.124zM6.943 20.452H3.734V9h3.209v11.452z" />
              </svg>
              <span className="hidden sm:inline">yasir-imran</span>
            </a>
          </div>

          <p className="text-sm text-text-secondary">Developed by <b>Yasir Imran</b>.</p>
        </div>
      </div>
    </footer>
  )
}
