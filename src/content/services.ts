import type { Service } from './types'

/** Each service is written from the client's side: their problem, then what they get. */
export const services: Service[] = [
  {
    id: 'backend',
    title: 'Java and Spring Boot backend development',
    problem: 'You need a backend for a new product, or to take over one that has outgrown its first version.',
    outcome:
      'A tested Spring Boot service with a clear structure, ready to deploy and easy for the next developer to extend.',
    icon: 'server',
    projectType: 'Backend or API build',
  },
  {
    id: 'api',
    title: 'REST API development and integration',
    problem: 'Your apps need an API, or they need to talk to other systems and partners.',
    outcome: 'Documented REST APIs and reliable integrations, with the failure cases handled and not only the happy path.',
    icon: 'plug',
    projectType: 'Integration',
  },
  {
    id: 'database',
    title: 'Database design and optimization',
    problem: 'Your data model is hard to change, or your queries are slow and getting slower.',
    outcome: 'A schema that fits the business, and queries that are measured first and then tuned.',
    icon: 'database',
    projectType: 'Backend or API build',
  },
  {
    id: 'auth',
    title: 'Authentication and authorization',
    problem: 'People can see or change things they should not, or sign-in is hard to manage.',
    outcome: 'Role-based access enforced on the server, so each person reaches only what their role allows.',
    icon: 'shield',
    projectType: 'Backend or API build',
  },
  {
    id: 'fixes',
    title: 'Bug fixing in existing applications',
    problem: 'Something in your live application is broken and nobody is sure why.',
    outcome: 'The cause found, fixed properly, and covered by a test so it stays fixed.',
    icon: 'bug',
    projectType: 'Bug fix or maintenance',
  },
  {
    id: 'performance',
    title: 'Backend performance improvements',
    problem: 'It works, but it is slow or struggles when more people use it.',
    outcome: 'Slow endpoints and queries measured, then tuned, with the before and after shown to you.',
    icon: 'gauge',
    projectType: 'Bug fix or maintenance',
  },
  {
    id: 'deploy',
    title: 'Deployment and maintenance',
    problem: 'It runs on a laptop but not reliably in production, or nobody looks after it once it has launched.',
    outcome: 'A repeatable deployment, a documented environment, and ongoing fixes and changes after launch.',
    icon: 'rocket',
    projectType: 'Bug fix or maintenance',
  },
]
