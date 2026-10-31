import { ArrowUp, ExternalLink, Mail } from 'lucide-react'
import { site } from '../../content/site'

const linkClass =
  'inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition-colors hover:text-text'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl text-text">{site.name}</p>
          <p className="text-sm text-muted">
            {site.role} · {site.location}
          </p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6">
          <li>
            <a href={`mailto:${site.email}`} className={linkClass}>
              <Mail aria-hidden="true" className="size-4" />
              Email
            </a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </a>
          </li>
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
              LinkedIn
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </a>
          </li>
          <li>
            <a href="#top" className={linkClass}>
              <ArrowUp aria-hidden="true" className="size-4" />
              Back to top
            </a>
          </li>
        </ul>
      </div>
      <p className="mx-auto max-w-[1120px] px-4 pb-8 text-xs text-muted sm:px-6">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  )
}
