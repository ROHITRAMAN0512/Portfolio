import type { ReactNode } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
}

/** Fades and lifts its children in once, when they scroll into view. */
export function Reveal({ children, className }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
