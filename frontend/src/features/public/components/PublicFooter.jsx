export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} Meetlify. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Contact</a>
          <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}
