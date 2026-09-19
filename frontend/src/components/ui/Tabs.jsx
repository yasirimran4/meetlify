import { LayoutGrid } from 'lucide-react'

export default function Tabs({ tabs, activeTab, onChange, className = '', variant = 'default' }) {
  const isPill = variant === 'pill'

  return (
    <div
      className={[
        className,
        isPill ? 'rounded-xl border border-border bg-surface p-2 shadow-sm' : '',
      ].join(' ')}
    >
      <div
        role="tablist"
        aria-label="Sections"
        className={[
          'flex gap-1 overflow-x-auto',
          isPill ? '' : 'border-b border-border',
        ].join(' ')}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isDisabled = tab.disabled
          const Icon = tab.icon ?? LayoutGrid

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(tab.id)}
              className={[
                'relative flex shrink-0 items-center gap-2 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                isPill
                  ? 'rounded-lg px-4 py-2.5 text-sm font-medium'
                  : 'px-4 py-3 text-sm font-medium',
                isActive
                  ? isPill
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary'
                  : isPill
                    ? 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                    : 'text-text-secondary hover:text-text-primary',
                isDisabled ? 'cursor-not-allowed opacity-50' : '',
              ].join(' ')}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
              {tab.badge != null ? (
                <span
                  className={[
                    'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
                    isActive && isPill
                      ? 'bg-white/20 text-primary-foreground'
                      : 'bg-sky-100 text-sky-700',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TabPanel({ activeTab, tabId, children, className = '' }) {
  if (activeTab !== tabId) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={className}
    >
      {children}
    </div>
  )
}

export function TabSectionHeader({ title, description, action = null }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
