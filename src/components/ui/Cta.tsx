import { ArrowRight } from 'lucide-react'
import { Button } from './Button'

interface CtaProps {
  text: string
  button: string
  href?: string
}

/** Closing call to action at the end of a section. */
export function Cta({ text, button, href = '#contact' }: CtaProps) {
  return (
    <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between md:mt-16">
      <p className="font-display text-2xl text-text">{text}</p>
      <Button href={href}>
        {button}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  )
}
