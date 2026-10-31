import { processSteps } from '../content/process'
import { site } from '../content/site'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'

export function Process() {
  return (
    <Section id="process" eyebrow={site.sections.process.eyebrow} title={site.sections.process.title}>
      <ol className="grid gap-8 lg:grid-cols-5 lg:gap-6">
        {processSteps.map((step, i) => (
          <li key={step.id}>
            <Reveal className="h-full border-t border-line pt-5">
              <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-display text-2xl text-text">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.detail}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
