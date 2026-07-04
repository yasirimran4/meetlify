import { Loader2 } from 'lucide-react'

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface p-8 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-text-secondary" aria-hidden="true" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  )
}
