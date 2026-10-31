import type { NavItem } from './types'

export interface Site {
  /** Public address of the site, no trailing slash. Used for share previews, canonical links and the sitemap. */
  url: string
  name: string
  title: string
  description: string
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
  contact: { heading: string; intro: string }
  sections: Record<'work' | 'services' | 'expertise' | 'process' | 'about', { eyebrow: string; title: string }>
  ctas: Record<'work' | 'services' | 'process', { text: string; button: string }>
}

export const site: Site = {
  url: 'https://rohit-portfolio-cn7.pages.dev',
  name: 'Rohit Raman',
  title: 'Rohit Raman — Java Backend Developer for Freelance Projects',
  description:
    'Java backend developer in Bengaluru. I build secure APIs, microservices and databases for healthcare and fintech products, and keep them running.',
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
    eyebrow: 'Java backend developer · Bengaluru, India',
    headline: 'Backend systems that hold up in production.',
    sub: "I'm Rohit Raman. I design and build secure APIs, microservices and databases for healthcare and fintech products, and I stay on to keep them running.",
  },
  about: {
    paragraphs: [
      "I'm a Java backend developer based in Bengaluru. I build the part of a product that users never see but always depend on: the APIs, the data model, sign-in and permissions, and the services that tie them together. Most of my work is in healthcare and fintech, where mistakes are expensive.",
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
    services: { eyebrow: 'Services', title: 'What I can build and fix for you' },
    expertise: { eyebrow: 'Expertise', title: 'The tools I work with, and what I use them for' },
    process: { eyebrow: 'Process', title: 'How a project runs' },
    about: { eyebrow: 'About', title: 'Software built to be relied on' },
  },
  ctas: {
    work: { text: 'Have a similar system in mind?', button: 'Tell me about it' },
    services: { text: 'Not sure which one you need?', button: 'Describe the problem' },
    process: { text: 'Ready to talk it through?', button: 'Start with a short conversation' },
  },
  contact: {
    heading: "Tell me what you're building.",
    intro:
      "Share what the product does, what is broken or missing, and any dates that matter. I'll reply by email with questions or a suggested next step.",
  },
}
