import { Search } from 'lucide-react'

export default function SearchInput({
  id,
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border-input bg-surface pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        {...props}
      />
    </div>
  )
}
