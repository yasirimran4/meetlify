import { useEffect } from 'react'

export function useDismissOnOutsideClick(ref, isOpen, onDismiss) {
  useEffect(() => {
    if (!isOpen) return undefined

    function handlePointerDown(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onDismiss()
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onDismiss, ref])
}
