import type { CaseStudy } from './types'

/**
 * Case study for the multi-clinic healthcare platform.
 *
 * Publishing rules (see docs/superpowers/specs/2026-10-31-portfolio-v2-design.md):
 * client outcomes and high-level decisions only. No access-control internals, no
 * weaknesses, no secrets or configuration, no client or employer names, and only
 * numbers that were counted against the code (tests enforce this).
 */
export const healthcareCaseStudy: CaseStudy = {
  id: 'healthcare',
  title: 'Multi-clinic healthcare platform',
  tagline: 'One system that takes a patient from registration to prescription, billing and lab results.',
  status: 'Deployed for client testing · refined over several feedback rounds',
  facts: [
    { label: 'Role-based portals', value: '3' },
    { label: 'Login roles', value: '4' },
  ],
  sections: [
    { id: 'problem', title: 'The problem' },
    { id: 'outcomes', title: 'What it lets the clinic do' },
    { id: 'architecture', title: 'Architecture at a glance' },
    { id: 'role', title: 'My role' },
    { id: 'decisions', title: 'Four engineering decisions' },
    { id: 'flow', title: 'How a visit flows' },
    { id: 'testing', title: 'How it was tested' },
    { id: 'stack', title: 'Stack and delivery' },
  ],
  problem: [
    'A private clinic group needed one system for its front desk, doctors and lab. A patient should be registered once and then carried through appointment, vitals, consultation, prescription, billing and lab results, with each clinic working separately day to day.',
    'It also had to produce the printed paperwork the clinics already use, and to be loaded with the clinics’ existing patients, medicines and test price lists.',
  ],
  capabilities: [
    {
      title: 'Register and find patients',
      detail:
        'Register at the front desk or load a spreadsheet. One shared rule recognises people who are already in the system, so the same person is not entered twice.',
    },
    {
      title: 'Book appointments',
      detail:
        'Bookings follow the doctor’s working days and hours and refuse past dates and double bookings. Rescheduling or cancelling keeps the doctor’s queue correct.',
    },
    {
      title: 'Run the waiting room',
      detail:
        'Vitals are entered at check-in, with BMI calculated and values range-checked, and the patient joins the right doctor’s queue.',
    },
    {
      title: 'Consult and prescribe',
      detail:
        'Doctors work from their own queue and write prescriptions, which print in the clinic’s own layout, including on pre-printed pads.',
    },
    {
      title: 'Bill',
      detail:
        'Consultations, lab tests and clinic services are billed with one-way payment states. Bills print in the clinic’s own format, with numbers that run in order for each clinic and year.',
    },
    {
      title: 'Run the lab',
      detail:
        'Samples are scheduled and collected, orders move through processing to completed, and reports are uploaded against the order. Results are held back until the visit is billed.',
    },
    {
      title: 'Administer',
      detail:
        'Admins manage clinics, staff logins, price lists and bulk loads of patients, medicines and lab tests. Patient imports preview before anything is saved.',
    },
  ],
  architecture: {
    intro:
      'Three React portals (front desk, doctor and lab) talk to one Java and Spring Boot API, which keeps everything in PostgreSQL. Every request passes through the same layers.',
    layers: [
      {
        title: 'Sign-in and roles',
        detail:
          'Four roles: admin, receptionist, doctor and lab technician. The server checks who is calling and what their role allows, and each portal admits only its own staff.',
      },
      {
        title: 'Clinic separation',
        detail:
          'The server works out which clinic a request belongs to and keeps day-to-day data separate for each clinic. Admins can see across clinics.',
      },
      {
        title: 'Feature modules',
        detail:
          'Patients, appointments, billing, lab, prescriptions and the rest each own their code and their rules, so a change in one place stays in that place.',
      },
      {
        title: 'Database and files',
        detail: 'PostgreSQL stores the data. Uploaded reports and documents are served only to signed-in staff.',
      },
    ],
  },
  role: {
    summary: 'Sole engineer on the project, from the first data model to the client feedback rounds.',
    responsibilities: [
      'Designed the data model and the REST API.',
      'Built the three portals with React and TypeScript.',
      'Implemented sign-in, roles and the clinic separation.',
      'Built the printable prescriptions and bills in the clinics’ own layouts.',
      'Built the bulk loading of patients, medicines and lab tests.',
      'Wrote the unit tests for the billing, booking, lab and patient rules.',
      'Packaged the API as a Docker image and deployed it, with the database and portals, for client testing.',
      'Ran the client feedback rounds and shipped the changes they asked for.',
    ],
  },
  decisions: [
    {
      title: 'Keeping clinics apart without trusting every screen',
      problem:
        'Several clinics share one system, and staff should work only on their own clinic’s day-to-day data.',
      chose:
        'I made the separation automatic on the server, for every request, instead of leaving it to each screen to remember. I kept a patient’s history visible across clinics for continuity of care, and limited edits to the clinic that owns the record.',
      tradeoff:
        'Fewer places to forget a check, but every new feature has to be checked against the separation. After the first build I reviewed the access controls and fixed the issues I found.',
    },
    {
      title: 'Bills and lab results that cannot go backwards',
      problem: 'Money and lab results must stay trustworthy once they have been recorded.',
      chose:
        'Bills and lab orders move forward through fixed states. A paid or cancelled bill cannot be reopened, cancelling needs a reason, and a payment-method correction records who changed it and why. Bill numbers run in order for each clinic and year, and lab results are held back until the visit is billed.',
      tradeoff:
        'Mistakes need an explicit correction path instead of quietly editing history, which is one more rule to explain to staff.',
    },
    {
      title: 'Printing on the clinic’s own paper',
      problem: 'The clinics wanted prescriptions and bills that look like the paperwork they already use.',
      chose:
        'I generate printable pages on the server in each clinic’s layout, with a mode for pre-printed pads, and let staff print from the browser.',
      tradeoff:
        'Printing from a browser depends on each printer, so the pad layout has adjustable offsets and guide lines rather than a promise of a perfect match.',
    },
    {
      title: 'One definition of “same patient”',
      problem:
        'Duplicate patients creep in from the form, from edits and from spreadsheet imports, and they make bills and histories unreliable.',
      chose:
        'One shared rule, based on mobile number, name and date of birth, is used everywhere. Family members who share a phone number are allowed, and an import skips people it already knows instead of overwriting them.',
      tradeoff:
        'The rule is deliberately strict, so unusual cases are skipped for a person to check rather than merged automatically.',
    },
  ],
  flow: [
    {
      title: 'Register or find the patient',
      detail:
        'The shared same-person rule checks mobile number, name and date of birth before a new record is created.',
    },
    {
      title: 'Book the appointment',
      detail:
        'Rules check the doctor’s days and hours and block past dates and double bookings. Cancelling clears the booking from the doctor’s queue.',
      states: ['Scheduled', 'Completed', 'Cancelled'],
    },
    {
      title: 'Check in',
      detail: 'Vitals are recorded and range-checked, and the patient joins the doctor’s queue.',
      states: ['Waiting', 'With doctor', 'Done'],
    },
    {
      title: 'Consult and prescribe',
      detail:
        'The doctor writes one prescription per visit. Saving again updates it instead of creating a duplicate, and it prints in the clinic’s layout.',
    },
    {
      title: 'Bill',
      detail:
        'Items are added and a payment method chosen. A bill only moves forward, and cancelling needs a reason.',
      states: ['Pending', 'Paid', 'Cancelled'],
    },
    {
      title: 'Lab work, if ordered',
      detail:
        'Sample collection can be scheduled before billing. Once billed, the order is released to the lab, and results are held back until then.',
      states: ['Scheduled', 'Ordered', 'Sample collected', 'Processing', 'Completed'],
    },
  ],
  testing: {
    summary: 'I tested the rules that matter most to the clinics, in layers.',
    items: [
      '355 backend unit tests (counted 31 Oct 2026), concentrated on billing, booking, lab booking, patient rules and imports.',
      'A scripted end-to-end walk-through of the API for the main visit flow.',
      'Manual testing rounds across all three portals, and the client’s own feedback rounds.',
      'A review of the access controls after the first build, with the issues I found fixed.',
    ],
    next: [
      'Automated tests around permissions and clinic separation, so those rules are re-checked on every change.',
      'Continuous integration, so every change builds and tests itself.',
      'Automated tests for the portals’ screens.',
      'Versioned database migrations managed by a tool.',
    ],
  },
  stack: [
    { group: 'Backend', items: ['Java 21', 'Spring Boot 3', 'Spring Security', 'Spring Data JPA'] },
    { group: 'Data', items: ['PostgreSQL'] },
    { group: 'Frontend', items: ['React', 'TypeScript', 'Vite'] },
    { group: 'Delivery', items: ['Docker'] },
    { group: 'Client testing environment', items: ['Neon', 'Render', 'Cloudflare Pages'] },
  ],
}
