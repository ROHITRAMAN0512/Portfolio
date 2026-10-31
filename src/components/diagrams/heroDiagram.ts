import type { ArchEdge, ArchNode } from '../../content/types'

/** A generic reference setup, NOT the clinic system (see spec section 3). */
export const heroDiagram: {
  nodes: ArchNode[]
  edges: ArchEdge[]
  /** Node ids the travelling request dot visits, in order. */
  flow: string[]
  caption: string
} = {
  caption: 'A typical setup I build',
  nodes: [
    { id: 'client', label: 'Client apps', sub: 'Web · Mobile', note: 'Your web or mobile app sends requests to the API.', x: 15, y: 50, kind: 'client' },
    { id: 'api', label: 'API', sub: 'Spring Boot', note: 'REST endpoints that check each request and run your business rules.', x: 38, y: 50, kind: 'api' },
    { id: 'auth', label: 'Auth', sub: 'Spring Security · JWT / Keycloak', note: 'Checks who is calling and what they are allowed to do.', x: 38, y: 17, kind: 'api' },
    { id: 'delivery', label: 'Delivery', sub: 'Docker · AWS', note: 'Packaged in containers and deployed to the cloud.', x: 38, y: 84, kind: 'infra' },
    { id: 'services', label: 'Services', sub: 'Business logic', note: 'The code that does the real work, split along business lines.', x: 62, y: 50, kind: 'api' },
    { id: 'db', label: 'Database', sub: 'PostgreSQL · MySQL', note: 'Stores your data safely, with a design that keeps queries fast.', x: 85, y: 28, kind: 'data' },
    { id: 'events', label: 'Events', sub: 'Kafka', note: 'Lets other parts of the system react to changes without waiting.', x: 85, y: 72, kind: 'data' },
  ],
  edges: [
    { from: 'client', to: 'api' },
    { from: 'api', to: 'auth' },
    { from: 'api', to: 'services' },
    { from: 'services', to: 'db' },
    { from: 'services', to: 'events' },
    { from: 'delivery', to: 'api' },
  ],
  flow: ['client', 'api', 'services', 'db'],
}
