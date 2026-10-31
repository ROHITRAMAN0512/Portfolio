import type { Service } from './types'

export const services: Service[] = [
  {
    id: 'backend',
    title: 'Backend application development',
    benefit: 'A solid server-side foundation for your product, built to be tested, deployed and extended.',
    icon: 'server',
  },
  {
    id: 'api',
    title: 'REST API development and integration',
    benefit:
      'Clean, documented APIs for your apps, plus reliable connections to the third-party services you depend on.',
    icon: 'plug',
  },
  {
    id: 'database',
    title: 'Database design and optimization',
    benefit: 'A data model that fits your business, and queries that stay fast as the data grows.',
    icon: 'database',
  },
  {
    id: 'microservices',
    title: 'Microservices development',
    benefit:
      'Services split along real business boundaries, talking to each other through clear contracts and events when it helps.',
    icon: 'boxes',
  },
  {
    id: 'auth',
    title: 'Authentication and authorization',
    benefit: 'Secure sign-in and role-based access, so each user sees and changes only what they should.',
    icon: 'shield',
  },
  {
    id: 'fixes',
    title: 'Bug fixing and performance improvements',
    benefit:
      'Find the cause, fix it properly, and add a test so it stays fixed. Slow endpoints and queries get measured, then tuned.',
    icon: 'wrench',
  },
  {
    id: 'deploy',
    title: 'Deployment, maintenance and technical support',
    benefit:
      'Containerised deployment, environment setup and ongoing help, so the application stays up after launch.',
    icon: 'rocket',
  },
]
