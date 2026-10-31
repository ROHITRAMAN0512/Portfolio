import { site } from '../content/site'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'

export function About() {
  const [lead, ...rest] = site.about.paragraphs
  return (
    <Section id="about" eyebrow={site.sections.about.eyebrow} title={site.sections.about.title}>
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <Reveal className="space-y-5">
          <p className="text-lg leading-relaxed text-text md:text-xl">{lead}</p>
          {rest.map((p) => (
            <p key={p} className="leading-relaxed text-muted md:text-lg">
              {p}
            </p>
          ))}
        </Reveal>
        <ul className="space-y-4">
          {site.about.values.map((v) => (
            <li key={v.title}>
              <Reveal className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-2xl text-text">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
