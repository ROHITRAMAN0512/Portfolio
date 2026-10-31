import { ArrowRight } from 'lucide-react'
import { site } from '../content/site'
import { Button } from '../components/ui/Button'
import { Diagram } from '../components/diagrams/Diagram'
import { heroDiagram } from '../components/diagrams/heroDiagram'

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12%] h-[480px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="mx-auto grid max-w-[1120px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-accent">{site.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="font-display text-5xl leading-[1.04] text-text sm:text-6xl"
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
              Let&apos;s Discuss Your Project
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface/60 p-4 sm:p-6">
          <Diagram
            nodes={heroDiagram.nodes}
            edges={heroDiagram.edges}
            flow={heroDiagram.flow}
            caption={heroDiagram.caption}
            label="Architecture diagram of a typical backend setup"
            animate
          />
        </div>
      </div>
    </section>
  )
}
