import type { ReactNode } from 'react'

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted">
      {children}
    </span>
  )
}
