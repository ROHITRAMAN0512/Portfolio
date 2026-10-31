import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
}

/** Modal built on the native <dialog>: focus trap, Esc and top layer come free. */
export function Dialog({ open, onClose, labelledBy, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const openRef = useRef(open)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const el = ref.current
    if (!el) return
    openRef.current = open
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  // Esc closes the native dialog and fires "close"; tell the parent only if it
  // still thinks the dialog is open (a programmatic close must not echo back).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleClose = () => {
      if (openRef.current) onCloseRef.current()
    }
    el.addEventListener('close', handleClose)
    return () => el.removeEventListener('close', handleClose)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto w-[min(94vw,880px)] max-w-none rounded-2xl border border-line bg-surface p-0 text-text backdrop:bg-black/70"
    >
      <div className="relative max-h-[88vh] overflow-y-auto overscroll-contain p-5 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-text"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        {children}
      </div>
    </dialog>
  )
}
