import { ArrowRight } from 'lucide-react'
import { projects } from '../content/projects'
import { site } from '../content/site'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Chip } from '../components/ui/Chip'
import { Button } from '../components/ui/Button'

export function Work() {
  return (
    <Section id="work" eyebrow={site.sections.work.eyebrow} title={site.sections.work.title}>
      <div className="grid gap-6">
        {projects.map((p) => (
          <Reveal key={p.id}>
            <article className="grid gap-8 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/40 md:grid-cols-[1.4fr_1fr] md:p-8">
              <div>
                {p.status && <p className="font-mono text-xs text-accent">{p.status}</p>}
                <h3 className="mt-3 font-display text-3xl leading-tight text-text md:text-4xl">{p.title}</h3>
                <p className="mt-3 text-muted">{p.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack
                    .flatMap((g) => g.items)
                    .slice(0, 3)
                    .map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                </div>
                <div className="mt-6">
                  <Button href={p.href}>
                    <span>
                      Read the case study<span className="sr-only">: {p.title}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </div>
              {p.facts && p.facts.length > 0 && (
                <dl className="grid grid-cols-1 gap-3 self-center min-[400px]:grid-cols-2 md:grid-cols-1">
                  {p.facts.map((f) => (
                    <div key={f.label} className="flex flex-col-reverse rounded-xl border border-line bg-surface-2 p-4">
                      <dt className="mt-1 text-xs text-muted">{f.label}</dt>
                      <dd className="font-display text-3xl text-text">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
