import { ArrowRight } from 'lucide-react'
import { site } from '../content/site'
import { projects } from '../content/projects'
import { Button } from '../components/ui/Button'
import { Diagram } from '../components/diagrams/Diagram'

const featured = projects[0]

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-130px] h-[480px] lg:top-[-88px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="mx-auto grid max-w-[1120px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-accent">{site.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="font-display text-5xl leading-[1.04] text-text sm:text-6xl lg:text-6xl"
          >
            {site.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{site.hero.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#work">
              View My Work
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <Button href="#contact" variant="secondary">
              Discuss a Project
            </Button>
          </div>

          {featured && (
            <a
              href={featured.href}
              className="group mt-10 flex max-w-xl flex-col gap-1 rounded-xl border border-line px-4 py-3 transition-colors hover:border-accent/50"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Featured case study</span>
              <span className="text-text">{featured.title}</span>
              <span className="flex flex-wrap items-center gap-x-3 text-sm text-muted">
                {featured.facts?.map((f) => (
                  <span key={f.label}>
                    {f.value} {f.label.toLowerCase()}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 text-accent">
                  Read the case study
                  <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </a>
          )}
        </div>

        {featured?.architecture && (
          <div className="rounded-2xl border border-line/70 p-4 sm:p-5 w-full lg:ml-auto lg:max-w-[420px]">
            <Diagram
              nodes={featured.architecture.nodes}
              edges={featured.architecture.edges}
              caption={featured.architecture.caption}
              label="Architecture diagram of the multi-clinic healthcare platform"
            />
          </div>
        )}
      </div>
    </section>
  )
}
