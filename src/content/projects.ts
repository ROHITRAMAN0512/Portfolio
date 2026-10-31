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
      { label: 'Login roles', value: '4' },
    ],
    features: [
      'Full patient journey: registration, appointment, vitals, queue, consultation, prescription, billing, lab and records.',
      'Four roles (admin, receptionist, doctor, lab technician) with permissions enforced on the server, and each portal admits only its own staff.',
      "Day-to-day work (appointments, queue, bills, lab orders) is kept separate for each clinic. A patient's history stays visible across clinics for continuity of care, and edits stay with the clinic that owns the record. Admins see across clinics.",
      "Prescriptions and bills rendered on the server to match the client's printed letterhead.",
      'Lab flow: scheduled sample collection, orders released to the lab once billed, and report upload.',
      'Bulk loading of patients (previewed before anything is saved), medicines and lab tests from Excel.',
      "After the first build I reviewed the system's access controls and fixed the issues I found.",
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
        { id: 'fd', label: 'Front desk portal', sub: 'React', note: 'Registration, appointments, vitals and billing.', x: 20, y: 14, kind: 'client' },
        { id: 'doc', label: 'Doctor portal', sub: 'React', note: 'Queue, consultation and prescriptions.', x: 50, y: 14, kind: 'client' },
        { id: 'lab', label: 'Lab portal', sub: 'React', note: 'Test orders, samples and reports.', x: 80, y: 14, kind: 'client' },
        { id: 'api', label: 'REST API', sub: 'Spring Boot', note: 'One application that every portal talks to.', x: 50, y: 38, kind: 'api' },
        { id: 'auth', label: 'Sign-in and roles', sub: 'Spring Security · JWT', note: 'Checks who is calling and what their role allows.', x: 20, y: 62, kind: 'api' },
        { id: 'scope', label: 'Clinic scope', sub: 'Per request', note: 'Keeps day-to-day work separate for each clinic.', x: 50, y: 62, kind: 'api' },
        { id: 'modules', label: 'Feature modules', sub: 'Patients · billing · labs', note: 'Each feature owns its own controller, service and data access.', x: 80, y: 62, kind: 'api' },
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
