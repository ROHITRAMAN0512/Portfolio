import { ArrowRight } from 'lucide-react'
import { projects } from '../content/projects'
import { site } from '../content/site'
import { useHashDialog } from '../hooks/useHashDialog'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Chip } from '../components/ui/Chip'
import { Button } from '../components/ui/Button'
import { Cta } from '../components/ui/Cta'
import { Dialog } from '../components/ui/Dialog'
import { CaseStudy, CASE_STUDY_TITLE_ID } from '../components/CaseStudy'

const projectIds = projects.map((p) => p.id)

export function Work() {
  const { activeId, open, close } = useHashDialog(projectIds)
  const active = projects.find((p) => p.id === activeId)

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
                  <Button onClick={() => open(p.id)}>
                    <span>
                      Open case study<span className="sr-only">: {p.title}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </div>
              {p.facts && p.facts.length > 0 && (
                <dl className="grid grid-cols-1 gap-3 self-center min-[400px]:grid-cols-3 md:grid-cols-1">
                  {p.facts.map((f) => (
                    <div key={f.label} className="rounded-xl border border-line bg-surface-2 p-4">
                      <dd className="font-display text-3xl text-text">{f.value}</dd>
                      <dt className="mt-1 text-xs text-muted">{f.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      <Cta text={site.ctas.work.text} button={site.ctas.work.button} />

      <Dialog open={active !== undefined} onClose={close} labelledBy={CASE_STUDY_TITLE_ID}>
        {active && <CaseStudy project={active} />}
      </Dialog>
    </Section>
  )
}
