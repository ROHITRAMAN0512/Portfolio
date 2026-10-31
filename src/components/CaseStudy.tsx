import { Check, ExternalLink } from 'lucide-react'
import type { Project } from '../content/types'
import { projectBlocks, type ProjectBlock } from '../lib/projectBlocks'
import { Chip } from './ui/Chip'
import { Button } from './ui/Button'
import { Diagram } from './diagrams/Diagram'

export const CASE_STUDY_TITLE_ID = 'case-study-title'

const subhead = 'mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent'

function Block({ project, block }: { project: Project; block: ProjectBlock }) {
  switch (block) {
    case 'problem':
      return (
        <section>
          <h4 className={subhead}>The problem</h4>
          <p className="text-muted">{project.problem}</p>
        </section>
      )
    case 'role':
      return (
        <section>
          <h4 className={subhead}>My role</h4>
          <p className="text-muted">{project.role}</p>
        </section>
      )
    case 'features':
      return (
        <section>
          <h4 className={subhead}>Key features</h4>
          <ul className="space-y-3">
            {project.features.map((f) => (
              <li key={f} className="flex gap-3 text-muted">
                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>
      )
    case 'facts':
      return (
        <dl className="grid grid-cols-3 gap-3">
          {project.facts?.map((f) => (
            <div key={f.label} className="rounded-xl border border-line bg-surface-2 p-4">
              <dd className="font-display text-3xl text-text">{f.value}</dd>
              <dt className="mt-1 text-xs text-muted">{f.label}</dt>
            </div>
          ))}
        </dl>
      )
    case 'architecture':
      return project.architecture ? (
        <section>
          <h4 className={subhead}>Architecture</h4>
          <div className="rounded-xl border border-line bg-bg/40 p-4">
            <Diagram
              nodes={project.architecture.nodes}
              edges={project.architecture.edges}
              caption={project.architecture.caption}
              label={`${project.title} architecture diagram`}
            />
          </div>
        </section>
      ) : null
    case 'stack':
      return (
        <section>
          <h4 className={subhead}>Technology</h4>
          <dl className="space-y-3">
            {project.stack.map((g) => (
              <div key={g.group} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <dt className="w-24 shrink-0 text-sm text-text">{g.group}</dt>
                <dd className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <Chip key={item}>{item}</Chip>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )
    case 'media':
      return (
        <section>
          <h4 className={subhead}>Screens</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.media?.map((m) => (
              <figure key={m.src}>
                <img src={m.src} alt={m.alt} loading="lazy" className="w-full rounded-xl border border-line" />
                {m.caption && <figcaption className="mt-2 text-xs text-muted">{m.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )
    case 'links':
      return (
        <section className="flex flex-wrap gap-3">
          {project.links?.map((l) => (
            <Button key={l.href} href={l.href} variant="secondary" external>
              {l.label}
              <ExternalLink aria-hidden="true" className="size-4" />
            </Button>
          ))}
        </section>
      )
  }
}

export function CaseStudy({ project }: { project: Project }) {
  return (
    <article>
      {project.status && <p className="mb-3 pr-12 font-mono text-xs text-accent">{project.status}</p>}
      <h3 id={CASE_STUDY_TITLE_ID} className="pr-12 font-display text-3xl leading-tight text-text sm:text-4xl">
        {project.title}
      </h3>
      <p className="mt-3 text-lg text-muted">{project.tagline}</p>
      <div className="mt-8 space-y-8">
        {projectBlocks(project).map((block) => (
          <Block key={block} project={project} block={block} />
        ))}
      </div>
    </article>
  )
}
