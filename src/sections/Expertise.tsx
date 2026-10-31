import { skillGroups } from '../content/skills'
import { site } from '../content/site'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Chip } from '../components/ui/Chip'

export function Expertise() {
  return (
    <Section id="expertise" eyebrow={site.sections.expertise.eyebrow} title={site.sections.expertise.title}>
      <div className="gap-5 [column-fill:balance] md:columns-2 lg:columns-3">
        {skillGroups.map((g) => (
          <Reveal key={g.id} className="mb-5 break-inside-avoid">
            <article className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-2xl text-text">{g.title}</h3>
              <p className="mt-2 text-sm text-muted">{g.how}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <Chip>{item}</Chip>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
