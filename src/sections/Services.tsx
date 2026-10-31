import { Boxes, Database, Plug, Rocket, Server, ShieldCheck, Wrench, type LucideIcon } from 'lucide-react'
import { services } from '../content/services'
import { site } from '../content/site'
import type { ServiceIcon } from '../content/types'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Cta } from '../components/ui/Cta'

const icons: Record<ServiceIcon, LucideIcon> = {
  server: Server,
  plug: Plug,
  database: Database,
  boxes: Boxes,
  shield: ShieldCheck,
  wrench: Wrench,
  rocket: Rocket,
}

export function Services() {
  return (
    <Section id="services" eyebrow={site.sections.services.eyebrow} title={site.sections.services.title}>
      <ul className="divide-y divide-line border-y border-line">
        {services.map((s, i) => {
          const Icon = icons[s.icon]
          return (
            <li key={s.id}>
              <Reveal className="grid gap-4 py-7 md:grid-cols-[auto_1fr_1.3fr] md:items-start md:gap-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted md:hidden">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display text-2xl leading-snug text-text md:pt-1.5 md:text-3xl">{s.title}</h3>
                <p className="text-muted md:pt-2">{s.benefit}</p>
              </Reveal>
            </li>
          )
        })}
      </ul>
      <Cta text={site.ctas.services.text} button={site.ctas.services.button} />
    </Section>
  )
}
