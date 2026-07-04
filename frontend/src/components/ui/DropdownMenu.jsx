import { useRef, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useDismissOnOutsideClick } from '../../hooks/useDismissOnOutsideClick'

export default function DropdownMenu({ triggerLabel = 'Open actions menu', items }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useDismissOnOutsideClick(menuRef, isOpen, () => setIsOpen(false))

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={triggerLabel}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-1 min-w-44 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setIsOpen(false)
                item.onClick?.()
              }}
              className={[
                'flex w-full items-center px-3 py-2 text-left text-sm transition-colors',
                item.destructive
                  ? 'text-error hover:bg-error-muted'
                  : 'text-text-primary hover:bg-surface-subtle',
                item.disabled ? 'cursor-not-allowed opacity-50' : '',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
