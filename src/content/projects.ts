import type { Project } from './types'

/**
 * Projects shown as cards on the home page. The full story of each lives in its
 * own case-study file (see caseStudy.ts) and page. Facts must be counted against
 * the real code before they are published.
 */
export const projects: Project[] = [
  {
    id: 'healthcare',
    title: 'Multi-clinic healthcare platform',
    tagline: 'One system that takes a patient from registration to prescription, billing and lab results.',
    status: 'Deployed for client testing · refined over several feedback rounds',
    href: '/work/healthcare/',
    facts: [
      { label: 'Role-based portals', value: '3' },
      { label: 'Login roles', value: '4' },
    ],
    stack: [
      { group: 'Backend', items: ['Java 21', 'Spring Boot 3', 'Spring Security', 'Spring Data JPA'] },
      { group: 'Data', items: ['PostgreSQL'] },
      { group: 'Frontend', items: ['React', 'TypeScript', 'Vite'] },
    ],
    architecture: {
      caption: 'How the healthcare platform fits together',
      nodes: [
        { id: 'fd', label: 'Front desk portal', sub: 'React', note: 'Registration, appointments, vitals and billing.', x: 17, y: 14, kind: 'client' },
        { id: 'doc', label: 'Doctor portal', sub: 'React', note: 'Queue, consultation and prescriptions.', x: 50, y: 14, kind: 'client' },
        { id: 'lab', label: 'Lab portal', sub: 'React', note: 'Test orders, samples and reports.', x: 83, y: 14, kind: 'client' },
        { id: 'api', label: 'REST API', sub: 'Spring Boot', note: 'One application that every portal talks to.', x: 50, y: 38, kind: 'api' },
        { id: 'auth', label: 'Sign-in and roles', sub: 'Spring Security', note: 'Checks who is calling and what their role allows.', x: 17, y: 62, kind: 'api' },
        { id: 'scope', label: 'Clinic scope', sub: 'Per request', note: 'Keeps day-to-day work separate for each clinic.', x: 50, y: 62, kind: 'api' },
        { id: 'modules', label: 'Feature modules', sub: 'Patients · billing · labs', note: 'Each feature owns its own controller, service and data access.', x: 83, y: 62, kind: 'api' },
        { id: 'db', label: 'PostgreSQL', sub: 'Single database', note: 'Stores patients, visits, bills, lab orders and records.', x: 50, y: 86, kind: 'data' },
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
