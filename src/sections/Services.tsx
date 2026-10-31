import { ArrowRight, Bug, Database, Gauge, Plug, Rocket, Server, ShieldCheck, type LucideIcon } from 'lucide-react'
import { services } from '../content/services'
import { site } from '../content/site'
import type { ServiceIcon } from '../content/types'
import { projectTypePrefill } from '../lib/prefill'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'

const icons: Record<ServiceIcon, LucideIcon> = {
  server: Server,
  plug: Plug,
  database: Database,
  shield: ShieldCheck,
  bug: Bug,
  gauge: Gauge,
  rocket: Rocket,
}

const label = 'font-mono text-[11px] uppercase tracking-[0.18em] text-muted'

export function Services() {
  return (
    <Section id="services" eyebrow={site.sections.services.eyebrow} title={site.sections.services.title}>
      <ul className="divide-y divide-line border-y border-line">
        {services.map((s) => {
          const Icon = icons[s.icon]
          return (
            <li key={s.id}>
              <Reveal className="grid gap-5 py-8 md:grid-cols-[auto_1.1fr_1fr] md:gap-8">
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-line bg-surface-2 text-accent">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-snug text-text md:text-3xl">{s.title}</h3>
                  <p className={`${label} mt-4`}>When</p>
                  <p className="mt-1 text-muted">{s.problem}</p>
                </div>
                <div>
                  <p className={label}>You get</p>
                  <p className="mt-1 text-text">{s.outcome}</p>
                  <a
                    href="#contact"
                    onClick={() => projectTypePrefill.set(s.projectType)}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
                  >
                    Discuss this
                    <span className="sr-only">: {s.title}</span>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
