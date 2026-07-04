import { RefreshCw } from 'lucide-react'
import { STATUS_FILTER_OPTIONS, SORT_OPTIONS } from '../../../../constants/events'

export default function EventsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onRefresh,
  isRefreshing,
}) {
  return (
    <div className="grid gap-3 border-b border-border px-4 py-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto] lg:items-end">
      <div>
        <label htmlFor="events-search" className="mb-2 block text-sm font-medium text-text-primary">
          Search
        </label>
        <input
          id="events-search"
          type="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search events..."
          className="h-10 w-full rounded-lg border border-border-input bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </div>

      <SelectField
        label="Status"
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
        options={STATUS_FILTER_OPTIONS}
      />

      <SelectField
        label="Sort"
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
        options={SORT_OPTIONS}
      />

      <div className="flex items-end">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-60 lg:w-10"
          aria-label="Refresh events"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="lg:hidden">Refresh</span>
        </button>
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-border-input bg-surface px-3 text-sm text-text-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
