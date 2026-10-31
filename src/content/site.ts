import type { NavItem, PageKey, PageMeta } from './types'

const homeTitle = 'Rohit Raman — Java Backend Developer for Freelance Projects'
const homeDescription =
  'Java backend developer in Bengaluru. I build secure Spring Boot APIs and databases for healthcare and fintech products, and keep them running.'

export interface Site {
  /** Public address of the site, no trailing slash. Used for share previews, canonical links and the sitemap. */
  url: string
  name: string
  title: string
  description: string
  /** Per-page address, title and description (used for tags, sitemap and structured data). */
  pages: Record<PageKey, PageMeta>
  role: string
  location: string
  email: string
  linkedin: string
  github: string
  nav: NavItem[]
  hero: { eyebrow: string; headline: string; sub: string }
  about: {
    paragraphs: string[]
    values: { title: string; text: string }[]
  }
  contact: {
    heading: string
    intro: string
    /** The project types the form offers; each service preselects one of them. */
    projectTypes: string[]
    availability: string
    /** What a good first message includes. */
    include: string[]
  }
  sections: Record<'work' | 'services' | 'expertise' | 'process' | 'about', { eyebrow: string; title: string }>
}

export const site: Site = {
  url: 'https://rohit-portfolio-cn7.pages.dev',
  name: 'Rohit Raman',
  title: homeTitle,
  description: homeDescription,
  pages: {
    home: { path: '/', title: homeTitle, description: homeDescription, image: '/og-image.png' },
    healthcare: {
      path: '/work/healthcare/',
      image: '/og-healthcare.png',
      title: 'Healthcare platform case study — Rohit Raman',
      description:
        'How I built a multi-clinic healthcare platform: three role-based portals, one Java and Spring Boot API, and the engineering decisions behind it.',
    },
  },
  role: 'Java backend developer',
  location: 'Bengaluru, India',
  email: 'rohit6363126@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rohitraman05/',
  github: 'https://github.com/ROHITRAMAN0512',
  nav: [
    { id: 'work', label: 'Work' },
    { id: 'services', label: 'Services' },
    { id: 'expertise', label: 'Expertise' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    eyebrow: 'Java Backend Developer · Bengaluru, India',
    headline: 'Java backend development for products where mistakes are expensive.',
    sub: "I'm Rohit Raman. I design and build Spring Boot APIs, databases and role-based access for healthcare and fintech products, then test, deploy and maintain them.",
  },
  about: {
    paragraphs: [
      "I've been a professional backend developer since 2023, based in Bengaluru. I build the part of a product that users never see but always depend on: the APIs, the data model, sign-in and permissions, and the services that tie them together. I have worked on healthcare and fintech products.",
      'I start with the business problem, not the framework. I agree a small first milestone, ship it, and build from there. I choose plain, well-understood technology over clever technology, secure things by default, and leave tests and notes so the next developer can pick the work up.',
      'I also take on existing codebases: fixing bugs, speeding up slow queries, connecting third-party APIs, and keeping applications running after launch.',
    ],
    values: [
      {
        title: 'Reliable',
        text: 'I plan for failures, not just the happy path: bad input, slow dependencies, retries and rollbacks.',
      },
      {
        title: 'Maintainable',
        text: 'Clear modules, readable code and short notes for whoever works on it next.',
      },
      {
        title: 'Production-ready',
        text: 'Configuration, secrets, deployment and handover are part of the job, not an afterthought.',
      },
    ],
  },
  sections: {
    work: { eyebrow: 'Selected work', title: 'Featured work' },
    services: { eyebrow: 'Services', title: 'What you can hire me for' },
    expertise: { eyebrow: 'Expertise', title: 'What I work with' },
    process: { eyebrow: 'Process', title: 'How a project runs' },
    about: { eyebrow: 'About', title: 'Software built to be relied on' },
  },
  contact: {
    heading: "Tell me what you're building.",
    intro:
      "Tell me about the product and the problem. I'll reply by email with questions or a suggested next step.",
    projectTypes: ['Backend or API build', 'Integration', 'Bug fix or maintenance', 'Something else'],
    availability: 'Limited availability alongside a full-time role.',
    include: ['What the product does and who uses it', 'What is broken or missing', 'Any dates that matter'],
  },
}
