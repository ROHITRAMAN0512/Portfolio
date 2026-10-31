import type { Project } from './types'

/**
 * Featured projects. To add one, append an object here (and optionally put
 * images under public/projects/<id>/). Any optional field left out simply
 * does not render.
 */
export const projects: Project[] = [
  {
    id: 'healthcare',
    title: 'Multi-clinic healthcare platform',
    tagline: 'One system that takes a patient from registration to prescription, billing and lab results.',
    status: 'Deployed to the cloud · validated with the client over several feedback rounds',
    problem:
      "A private clinic group needed one system for its front desk, doctors and lab, with each clinic seeing only its own operations.",
    role: 'Backend and full-stack engineer: API and database design, authorization, document generation, deployment, and client feedback cycles.',
    facts: [
      { label: 'Role-based portals', value: '3' },
      { label: 'Staff roles', value: '5' },
      { label: 'Deployable API', value: '1' },
    ],
    features: [
      'Full patient journey: registration, appointment, vitals, queue, consultation, prescription, billing, lab and records.',
      'Role-based access with JWT sign-in. Five roles see different data, not the same data with buttons hidden.',
      "Clinic-scoped operations: staff are limited to their own clinic's appointments, queue, billing and lab orders, while admins see across clinics.",
      "Prescriptions and bills rendered on the server to match the client's printed letterhead.",
      'Lab flow: scheduled sample collection, orders released to the lab, and report upload.',
      'Bulk import of patients, medicines and lab tests from Excel, with a preview step before anything is saved.',
      'A security pass run against my own API as a low-privilege user. The cross-clinic access gaps it found were fixed and re-tested.',
    ],
    stack: [
      { group: 'Backend', items: ['Java 21', 'Spring Boot', 'Spring Security (JWT)', 'Spring Data JPA'] },
      { group: 'Data', items: ['PostgreSQL'] },
      { group: 'Frontend', items: ['React', 'TypeScript', 'Vite'] },
      { group: 'Delivery', items: ['Docker', 'Managed PostgreSQL', 'Container hosting', 'Static hosting'] },
    ],
    architecture: {
      caption: 'A single deployable API, organised by feature.',
      nodes: [
        { id: 'fd', label: 'Front desk portal', sub: 'React', note: 'Registration, appointments, vitals and billing.', x: 11, y: 20, kind: 'client' },
        { id: 'doc', label: 'Doctor portal', sub: 'React', note: 'Queue, consultation and prescriptions.', x: 11, y: 50, kind: 'client' },
        { id: 'lab', label: 'Lab portal', sub: 'React', note: 'Test orders, samples and reports.', x: 11, y: 80, kind: 'client' },
        { id: 'api', label: 'REST API', sub: 'Spring Boot', note: 'One application that every portal talks to.', x: 36, y: 50, kind: 'api' },
        { id: 'auth', label: 'Sign-in and roles', sub: 'Spring Security · JWT', note: 'Checks who is calling and what their role allows.', x: 62, y: 20, kind: 'api' },
        { id: 'scope', label: 'Clinic scope', sub: 'Per request', note: "Limits staff to their own clinic's data.", x: 62, y: 50, kind: 'api' },
        { id: 'modules', label: 'Feature modules', sub: 'Patients · billing · labs', note: 'Each feature owns its own controller, service and data access.', x: 62, y: 80, kind: 'api' },
        { id: 'db', label: 'PostgreSQL', sub: 'Single database', note: 'Stores patients, visits, bills, lab orders and records.', x: 88, y: 50, kind: 'data' },
      ],
      edges: [
        { from: 'fd', to: 'api' },
        { from: 'doc', to: 'api' },
        { from: 'lab', to: 'api' },
        { from: 'api', to: 'auth' },
        { from: 'auth', to: 'scope' },
        { from: 'scope', to: 'modules' },
        { from: 'modules', to: 'db' },
      ],
    },
  },
]
