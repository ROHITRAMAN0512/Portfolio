import type { SkillGroup } from './types'

/**
 * Skills the clinic case study actually shows, mapped to a keyword that must
 * appear in it (a test checks this). Anything not listed here is a skill from
 * other work and is deliberately not tagged.
 */
export const caseStudyEvidence: Record<string, string> = {
  Java: 'Java 21',
  'Spring Boot': 'Spring Boot',
  'Spring Security': 'Spring Security',
  PostgreSQL: 'PostgreSQL',
  'REST APIs': 'REST API',
  'Database design': 'data model',
  Authentication: 'sign-in',
  'Role-based access control': 'roles',
  Docker: 'Docker',
  Deployment: 'deployed',
  'Healthcare technology': 'clinic',
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'core',
    title: 'Core',
    how: 'The foundation for most of what I build: services, APIs and the security around them.',
    items: ['Java', 'Spring Boot', 'Spring Security'],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    how: 'Deciding how a system is split up, and how its parts talk to each other.',
    items: ['REST APIs', 'Microservices', 'Event-driven design'],
  },
  {
    id: 'data',
    title: 'Data',
    how: 'Schemas that fit the business, and queries that hold up as data grows.',
    items: ['PostgreSQL', 'MySQL', 'Database design'],
  },
  {
    id: 'messaging',
    title: 'Messaging',
    how: 'Event streams that let parts of a system react to changes without waiting on each other.',
    items: ['Kafka'],
  },
  {
    id: 'identity',
    title: 'Identity and access',
    how: 'Single sign-in, roles and permissions that keep each user inside their own data.',
    items: ['Keycloak', 'Authentication', 'Role-based access control'],
  },
  {
    id: 'delivery',
    title: 'Delivery',
    how: 'Packaging, configuring and shipping applications so they run the same everywhere.',
    items: ['AWS', 'Docker', 'Deployment'],
  },
  {
    id: 'domains',
    title: 'Domains',
    how: 'Experience with the data, rules and risks of healthcare and financial products.',
    items: ['Healthcare technology', 'FHIR', 'Fintech'],
  },
]
