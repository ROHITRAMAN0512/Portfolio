import { ExternalLink, Mail, MapPin } from 'lucide-react'
import { site } from '../content/site'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { ContactForm } from '../components/ContactForm'

const linkClass =
  'inline-flex min-h-11 items-center gap-2 text-text underline-offset-4 transition-colors hover:text-accent hover:underline'

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title={site.contact.heading}>
      <p className="-mt-4 mb-10 max-w-2xl text-muted md:-mt-6 md:mb-12 md:text-lg">{site.contact.intro}</p>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <Reveal>
          <ContactForm />
        </Reveal>
        <Reveal>
          <aside aria-label="Other ways to reach me" className="space-y-6">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Prefer email?</h3>
              <a href={`mailto:${site.email}`} className={`${linkClass} mt-2 break-all text-lg`}>
                <Mail aria-hidden="true" className="size-5 shrink-0" />
                {site.email}
              </a>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Elsewhere</h3>
              <ul className="mt-2">
                <li>
                  <a href={site.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    GitHub
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    LinkedIn
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </li>
              </ul>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {site.location}
            </p>
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}
