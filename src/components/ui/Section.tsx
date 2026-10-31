import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  eyebrow?: string
  children: ReactNode
}

export function Section({ id, title, eyebrow, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line/60 py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        {eyebrow && (
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        )}
        <h2
          id={`${id}-title`}
          className="max-w-3xl font-display text-4xl leading-[1.1] text-text md:text-5xl"
        >
          {title}
        </h2>
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  )
}
