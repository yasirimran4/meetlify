export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} Meetlify. All rights reserved.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href="https://github.com/yasirimran4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            GitHub (yasirimran4)
          </a>
          <a
            href="https://linkedin.com/in/yasir-imran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            LinkedIn (yasir-imran)
          </a>
        </div>
        <p className="mt-4 text-sm text-text-secondary">Developed by Yasir Imran.</p>
      </div>
    </footer>
  )
}
