export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Event sections"
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isDisabled = tab.disabled

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
                'relative shrink-0 px-4 py-3 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
                isActive
                  ? 'text-text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary'
                  : 'text-text-secondary hover:text-text-primary',
                isDisabled ? 'cursor-not-allowed opacity-50' : '',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TabPanel({ id, activeTab, tabId, children, className = '' }) {
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
