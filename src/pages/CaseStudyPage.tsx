import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { healthcareCaseStudy as study } from '../content/caseStudy'
import { projects } from '../content/projects'
import { useActiveSection } from '../hooks/useActiveSection'
import { SkipLink } from '../components/layout/SkipLink'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Diagram } from '../components/diagrams/Diagram'

const sectionIds = study.sections.map((s) => s.id)
const architecture = projects.find((p) => p.id === study.id)?.architecture

const titleOf = (id: string) => study.sections.find((s) => s.id === id)?.title ?? id
const subhead = 'font-mono text-xs uppercase tracking-[0.18em] text-accent'

function CaseSection({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-10 first:pt-0 md:py-14">
      <h2 id={`${id}-title`} className="font-display text-3xl leading-tight text-text md:text-4xl">
        {titleOf(id)}
      </h2>
      <div className="mt-6 space-y-5 leading-relaxed text-muted md:text-lg">{children}</div>
    </section>
  )
}

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check aria-hidden="true" className="mt-1.5 size-4 shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function CaseStudyPage() {
  const active = useActiveSection(sectionIds)

  return (
    <div id="top">
      <SkipLink />
      <Header home={false} />
      <main id="main" tabIndex={-1} className="outline-none">
        <article className="mx-auto max-w-[1120px] px-4 pb-20 pt-8 sm:px-6 md:pt-12">
          <a
            href="/#work"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-text"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            All work
          </a>

          <header className="mt-4 max-w-3xl">
            <p className={subhead}>Case study</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] text-text md:text-6xl">{study.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{study.tagline}</p>
            <p className="mt-4 font-mono text-xs text-accent">{study.status}</p>
            <dl className="mt-8 flex flex-wrap gap-3">
              {study.facts.map((f) => (
                <div key={f.label} className="flex min-w-36 flex-col-reverse rounded-xl border border-line bg-surface px-5 py-4">
                  <dt className="mt-1 text-xs text-muted">{f.label}</dt>
                  <dd className="font-display text-3xl text-text">{f.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mt-12 grid gap-12 border-t border-line pt-12 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="On this page" className="hidden lg:block">
              <ol className="sticky top-24 space-y-1">
                {study.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={active === s.id ? 'true' : undefined}
                      className={`block rounded-md py-1.5 text-sm transition-colors ${
                        active === s.id ? 'text-accent' : 'text-muted hover:text-text'
                      }`}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="min-w-0 max-w-[720px] divide-y divide-line">
              <CaseSection id="problem">
                {study.problem.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </CaseSection>

              <CaseSection id="outcomes">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {study.capabilities.map((c) => (
                    <li key={c.title} className="rounded-2xl border border-line bg-surface p-5">
                      <h3 className="font-display text-xl text-text">{c.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed md:text-base">{c.detail}</p>
                    </li>
                  ))}
                </ul>
              </CaseSection>

              <CaseSection id="architecture">
                <p>{study.architecture.intro}</p>
                {architecture && (
                  <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-6">
                    <Diagram
                      nodes={architecture.nodes}
                      edges={architecture.edges}
                      caption={architecture.caption}
                      label="Architecture diagram of the multi-clinic healthcare platform"
                    />
                  </div>
                )}
                <dl className="space-y-5">
                  {study.architecture.layers.map((l) => (
                    <div key={l.title}>
                      <dt className="font-medium text-text">{l.title}</dt>
                      <dd className="mt-1">{l.detail}</dd>
                    </div>
                  ))}
                </dl>
              </CaseSection>

              <CaseSection id="role">
                <p className="text-text">{study.role.summary}</p>
                <Ticks items={study.role.responsibilities} />
              </CaseSection>

              <CaseSection id="decisions">
                <ol className="space-y-6">
                  {study.decisions.map((d, i) => (
                    <li key={d.title} className="rounded-2xl border border-line bg-surface p-6">
                      <p className={subhead}>Decision {i + 1}</p>
                      <h3 className="mt-2 font-display text-2xl leading-snug text-text">{d.title}</h3>
                      <div className="mt-5 space-y-4 text-base">
                        <div>
                          <h4 className="text-sm font-medium text-text">The problem</h4>
                          <p className="mt-1">{d.problem}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-text">What I chose</h4>
                          <p className="mt-1">{d.chose}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-text">The trade-off</h4>
                          <p className="mt-1">{d.tradeoff}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </CaseSection>

              <CaseSection id="flow">
                <ol className="space-y-6">
                  {study.flow.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-accent"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-medium text-text">{step.title}</h3>
                        <p className="mt-1 text-base">{step.detail}</p>
                        {step.states && (
                          <p className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-muted">Moves through</span>
                            {step.states.map((s) => (
                              <Chip key={s}>{s}</Chip>
                            ))}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </CaseSection>

              <CaseSection id="testing">
                <p>{study.testing.summary}</p>
                <Ticks items={study.testing.items} />
                <h3 className="pt-4 font-display text-2xl text-text">What I would add next</h3>
                <ul className="space-y-3">
                  {study.testing.next.map((item) => (
                    <li key={item} className="flex gap-3">
                      <ArrowRight aria-hidden="true" className="mt-1.5 size-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CaseSection>

              <CaseSection id="stack">
                <dl className="space-y-4">
                  {study.stack.map((g) => (
                    <div key={g.group} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                      <dt className="w-52 shrink-0 text-base text-text">{g.group}</dt>
                      <dd className="flex flex-wrap gap-2">
                        {g.items.map((item) => (
                          <Chip key={item}>{item}</Chip>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CaseSection>

              <div className="flex flex-col items-start gap-4 pt-12 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-display text-2xl text-text">Have a similar system in mind?</p>
                <Button href="/#contact">
                  Discuss a Project
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
