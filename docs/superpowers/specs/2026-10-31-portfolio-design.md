# Freelance Portfolio Website — Design Spec

Date: 2026-10-31
Owner: Rohit Raman
Status: Draft for owner review (no code written yet)

## 1. Purpose and success

A public, single-page portfolio that Rohit can send to prospective freelance clients. A visitor should understand within one minute what he builds, believe it, and have an easy way to contact him.

Success looks like:

- A first-time visitor can say what Rohit does, which problems he solves, and how to hire him, without scrolling past the second section.
- Every button and link works. Nothing looks unfinished.
- The contact form works on day one, even before any third-party key is added (mailto fallback).
- The site is fast, readable on a phone, usable by keyboard, and passes the checks in sections 11 and 15.
- Rohit can add a new project by editing one data file.

## 2. What the owner told us, and what we assume

| Said by Rohit | Source |
|---|---|
| Java backend developer / SDE. Skills: Java, Spring Boot, Spring Security, microservices, REST APIs, MySQL, PostgreSQL, database design, Kafka, event-driven design, AWS, Docker, deployment, Keycloak, authentication, RBAC, healthcare tech, FHIR, fintech | Brief |
| Real healthcare project, deployed and used for client validation | Brief |
| Freelance work: bug fixing, backend development, API integrations, maintenance | Brief |
| Stack: React, TypeScript, Vite, Tailwind, Framer Motion, Lucide; Render hosting is acceptable | Brief + chat |
| Clinic project shown anonymously (no clinic name, no live portal links) | Chat, 31 Oct |
| Contact form via a form service | Chat, 31 Oct |
| No employer names, no resume figures | Chat, 31 Oct |

Assumptions to confirm (defaults apply if not changed):

- Contact email `rohit6363126@gmail.com`, LinkedIn `https://www.linkedin.com/in/rohitraman05/`, GitHub `https://github.com/ROHITRAMAN0512`, location Bengaluru. Taken from the owner's resume.
- No phone number or WhatsApp on the site.
- The owner's role on the clinic project is worded "Backend and full-stack engineer". No "built solo" claim.

## 3. Content rules

- Use only facts from the brief, the owner's files, and the chat. No invented clients, testimonials, results, percentages, response-time promises, ratings or years of experience.
- Counts are allowed only when they are verifiable facts about the owner's own system (for example "3 portals", "5 roles").
- The clinic project diagram and case study must match the real system: a single Spring Boot monolith with PostgreSQL and JWT. It has no message broker and no microservices. Kafka, Keycloak and AWS appear only in the skills section and the generic hero diagram, which is labelled "A typical setup I build", not "the clinic system".
- All copy lives in `src/content/`. Anything needing owner confirmation is listed in section 14.

## 4. Non-goals

No CMS, blog, backend of our own, user accounts, analytics or cookies (so no cookie banner), light/dark toggle (dark only), translations, testimonials or client logos, per-project sub-pages, public repos from the owner's GitHub (his own audit says they dilute the clinic project).

## 5. Information architecture

Single page, anchor sections in this order. Sticky header with links: Work, Services, Expertise, Process, About, Contact, plus a "Let's talk" button.

| # | Section id | Job | Closing call to action |
|---|---|---|---|
| 1 | `hero` | Say what he builds and for whom | View My Work / Let's Discuss Your Project |
| 2 | `work` | Prove it with the clinic case study | "Have a similar system in mind? Tell me about it" |
| 3 | `services` | The 7 things he can be hired for | "Not sure which one you need? Describe the problem" |
| 4 | `expertise` | Skills, grouped, no percentage bars | none (short section) |
| 5 | `process` | How a project runs, 5 steps | "Start with a short conversation" |
| 6 | `about` | Who he is and how he works | none |
| 7 | `contact` | Form, email, GitHub, LinkedIn | the form itself |

Order rationale: proof (work) comes right after the hero because it is the strongest trust signal; services and process answer "what will I get and how"; about follows because clients read it after they are interested.

### 5.1 Draft copy (final wording lives in `src/content/`)

**Hero.** Eyebrow: "Java backend developer · Bengaluru, India". Headline: "Backend systems that hold up in production." Sub: "I'm Rohit Raman. I design and build secure APIs, microservices and databases for healthcare and fintech products, and I stay on to keep them running." Buttons: "View My Work" (scrolls to `work`), "Let's Discuss Your Project" (scrolls to `contact`).

**Hero visual.** An interactive SVG diagram captioned "A typical setup I build": Client apps → API (Spring Boot) → Auth (Spring Security, JWT / Keycloak) → Services → PostgreSQL / MySQL, with Kafka for events and Docker on AWS for delivery. Each node is a button; hover, focus or tap shows a one-line plain-words explanation. A small dot travels along the request path on a slow loop (off under reduced motion). A hidden text list describes the diagram for screen readers.

**About.** Three short paragraphs: who he is; how he works (understand the business problem first, ship small milestones, secure by default, tested, documented, plain technology over clever technology); what he cares about, shown as three items: *Reliable* (handles failure cases, not just the happy path), *Maintainable* (clear modules, readable code, notes for whoever comes next), *Production-ready* (configuration, secrets, deployment and handover, not code that only runs on a laptop).

**Services (7).**
1. Backend application development
2. REST API development and integration
3. Database design and optimization
4. Microservices development
5. Authentication and authorization
6. Bug fixing and performance improvements
7. Deployment, maintenance and technical support

Each has an icon, a one-line client-facing benefit ("what you get"), and no fabricated numbers.

**Process (5 steps).** Discuss the problem → Scope and estimate → Build in milestones you can review → Test and deploy → Support and maintain. Each step has one sentence on what the client sees and does.

**Expertise.** Grouped cards, each with a one-sentence "how I use it" and chips:

- Core: Java, Spring Boot, Spring Security
- Architecture: REST APIs, microservices, event-driven design
- Data: PostgreSQL, MySQL, database design
- Messaging: Kafka
- Identity and access: Keycloak, authentication, role-based access control
- Delivery: AWS, Docker, deployment
- Domains: healthcare technology, FHIR, fintech

**Contact.** Heading "Tell me what you're building." Short line on what to include. Form on the left; direct email, GitHub and LinkedIn on the right.

## 6. Featured project data model

One typed array in `src/content/projects.ts`. Adding a project means adding one object and, optionally, images under `public/projects/<id>/`.

```ts
type Project = {
  id: string;                       // slug; also the URL hash, e.g. #healthcare
  title: string;
  tagline: string;
  status?: string;                  // e.g. "Deployed · validated with the client"
  problem: string;
  role: string;
  features: string[];
  facts?: { label: string; value: string }[];     // verifiable counts only
  stack: { group: string; items: string[] }[];
  architecture?: {
    nodes: { id: string; label: string; sub?: string; x: number; y: number; kind: 'client' | 'api' | 'data' | 'infra' }[];
    edges: { from: string; to: string; label?: string }[];
    caption?: string;
  };
  media?: { src: string; alt: string; caption?: string }[];   // real screenshots only
  links?: { label: string; href: string; kind: 'repo' | 'demo' | 'article' }[];
};
```

Rendering rule: any optional field that is missing or empty renders nothing. No empty frames, no "coming soon" boxes.

Card shows title, tagline, status, 3 stack chips, and an "Open case study" button. The button opens a native `<dialog>` (focus trap and Esc come free) holding: problem, role, features, facts, architecture diagram, stack, media, links. Opening writes `#healthcare` to the URL; loading the page with that hash opens the dialog. Back button closes it.

### 6.1 Launch content: the clinic platform (anonymous)

- **Title:** Multi-clinic healthcare platform. **Tagline:** One system that takes a patient from registration to prescription, billing and lab results.
- **Status:** Deployed to the cloud and validated with the client over several feedback rounds.
- **Problem:** A private clinic group needed one system for its front desk, doctors and lab, with each clinic seeing only its own operations.
- **Role:** Backend and full-stack engineer: API and database design, authorization, document generation, deployment, and client feedback cycles.
- **Facts:** 3 role-based portals (front desk, doctor, lab). 5 staff roles. One shared API and database.
- **Features:**
  - Full patient journey: registration, appointment, vitals, queue, consultation, prescription, billing, lab, records.
  - Role-based access with JWT sign-in; five roles see different data, not the same data with buttons hidden.
  - Clinic-scoped operations: staff are restricted to their own clinic's appointments, queue, billing and lab orders; admins see across clinics.
  - Prescriptions and bills rendered on the server to match the client's printed letterhead.
  - Lab flow: scheduled sample collection, orders released to the lab, report upload.
  - Bulk import of patients, medicines and lab tests from Excel with a preview step before anything is saved.
  - A security pass run against my own API as a low-privilege user; cross-clinic access gaps found were fixed and re-tested.
- **Stack:** Java 21, Spring Boot, Spring Security with JWT, Spring Data JPA, PostgreSQL, Docker, React, TypeScript, Vite; deployed with managed PostgreSQL, a container host and static hosting.
- **Architecture diagram (accurate):** three React portals → one Spring Boot REST API (auth and role checks → clinic scope → feature modules) → PostgreSQL. Caption: "A single deployable API, organised by feature."
- **Media:** none at launch. A slot exists for sanitized screenshots (no patient or clinic details). Links: none.

## 7. Visual design

Direction: premium engineering consultancy, editorial typography, restrained.

Tokens (Tailwind v4 `@theme`, all colours as CSS variables):

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0E14` | page |
| `--surface` | `#0F1520` | cards |
| `--surface-2` | `#151D2B` | raised / hover |
| `--line` | `#1F2937` | borders |
| `--text` | `#E6EAF2` | body |
| `--muted` | `#8B97AB` | secondary text (≥ 4.5:1 on `--bg`) |
| `--accent` | `#2DD4BF` | links, focus, key highlights; the only accent |

Typography, self-hosted via Fontsource, latin subset only: **Instrument Serif** for large headings, **Inter Variable** for body and UI, **JetBrains Mono Variable** for small technical labels. `font-display: swap`; preload the two above-the-fold files.

Surface treatment: flat dark cards with 1px borders, a faint radial teal glow behind the hero, a very low-contrast grid. No heavy blur, no neon, no stock illustrations. The header is solid with a bottom border once scrolled.

Spacing: generous (sections 96–128 px vertical on desktop, 64–80 px on mobile), max content width 1120 px, 16 px side gutters on mobile.

Responsive: designed mobile-first at 375 px; breakpoints at 640, 768, 1024, 1280. Hero diagram stacks under the text below 1024 px and simplifies (fewer labels) below 640 px.

## 8. Motion

Framer Motion through `LazyMotion` with `domAnimation` to keep the bundle small.

- Scroll reveal: 12 px rise and fade, 350 ms, once per element.
- Hero diagram: node hover/focus highlight and a slow request dot along the path.
- Buttons and cards: colour/border transitions only.
- `prefers-reduced-motion: reduce` disables reveals and the travelling dot; content shows immediately.
- Smooth anchor scrolling uses CSS `scroll-behavior: smooth` only when motion is allowed. Sections have `scroll-margin-top` equal to the header height.

## 9. Contact form

Fields: name (required, 2–80 characters), email (required, valid format), project type (optional select: Backend or API build, Integration, Bug fix or maintenance, Something else), message (required, 20–2000 characters). A hidden honeypot field is rejected if filled.

Behaviour:

- Validation runs on blur and on submit; errors appear under each field, linked with `aria-describedby`; the first invalid field is focused on submit.
- Submit posts JSON to the Web3Forms endpoint with `VITE_WEB3FORMS_KEY`. The button shows a sending state and is disabled while in flight.
- Success: the form is replaced by a confirmation in an `aria-live` region.
- Failure (network or service error): keep the user's text, show a clear message and a "Send by email instead" link built as a `mailto:` with the fields prefilled.
- If `VITE_WEB3FORMS_KEY` is not set, the form's submit opens the user's email app via the same prefilled `mailto:`. The site is fully functional without the key.
- The access key is public by design (it ships to the browser); the owner should restrict it to the final site domain in the Web3Forms dashboard if the plan allows.
- Validation lives in `src/lib/validate.ts` as pure functions, unit-tested.

## 10. SEO and sharing

- `<title>`: "Rohit Raman — Java Backend Developer for Freelance Projects". Meta description under 155 characters.
- Open Graph and Twitter tags; a 1200×630 preview image generated once from an SVG and committed (owner can replace it).
- Canonical and `og:url` are written at build time from `VITE_SITE_URL`; omitted if unset.
- JSON-LD `Person` (name, jobTitle, knowsAbout, sameAs links). No ratings, reviews or prices.
- `robots.txt`, and a `sitemap.xml` generated at build when `VITE_SITE_URL` is set.
- One `<h1>`; sections use `<h2>`; meaningful `alt` text; real `404.html`.

## 11. Accessibility and performance

Accessibility target: WCAG 2.1 AA.

- Skip-to-content link, landmarks (`header`, `nav`, `main`, `footer`), visible focus ring using the accent colour.
- Mobile menu is a disclosure button with `aria-expanded` and `aria-controls`; Esc closes it.
- Diagram nodes are real buttons with text names; a hidden list repeats the diagram's meaning.
- Colour contrast ≥ 4.5:1 for text; no information carried by colour alone.
- Touch targets ≥ 44 px.

Performance budget (production build):

- Initial JavaScript ≤ 150 KB gzip; no images above the fold; fonts subset and preloaded.
- Lighthouse on the built site: Accessibility, Best Practices and SEO ≥ 95; Performance ≥ 95 desktop and ≥ 90 mobile. Measured and reported as measured, not assumed.

## 12. Architecture and code layout

Stack: React 19 and TypeScript (strict), Vite, Tailwind CSS v4, Framer Motion, Lucide React, Vitest for the small amount of logic. Exact versions are pinned in `package.json` at scaffold time.

```
portfolio/
├─ index.html                  SEO tags, JSON-LD, font preloads
├─ render.yaml                 Render Static Site definition
├─ vite.config.ts              plugins: react, tailwind, html + sitemap transforms
├─ public/                     favicon, og-image.png, robots.txt, 404.html, projects/
├─ docs/superpowers/specs/     this file
└─ src/
   ├─ main.tsx, App.tsx, index.css
   ├─ content/                 site.ts, services.ts, skills.ts, process.ts, projects.ts   ← all editable copy
   ├─ sections/                Hero, Work, Services, Expertise, Process, About, Contact
   ├─ components/
   │  ├─ layout/               Header, Footer, SkipLink
   │  ├─ ui/                   Button, Section, Reveal, Chip, Dialog
   │  └─ diagrams/             Diagram (shared SVG renderer), heroDiagram.ts
   ├─ hooks/                   useActiveSection, useHashDialog
   └─ lib/                     validate.ts, submitContact.ts, mailto.ts
```

Boundaries:

- `content/` holds data only; components never hard-code copy.
- `Diagram` renders any `{nodes, edges}`; the hero and each project reuse it.
- `lib/submitContact.ts` is the only code that talks to the network.
- Each section is a standalone component that takes no props beyond content imports.

## 13. Deployment on Render

- Render **Static Site** (free, global CDN, does not sleep). Defined in `render.yaml`: build `npm ci && npm run build`, publish `dist`, `NODE_VERSION=22`, long-cache headers for `/assets/*`, `X-Content-Type-Options: nosniff`.
- Environment variables set in the Render dashboard (build-time): `VITE_SITE_URL`, `VITE_WEB3FORMS_KEY`.
- Steps documented in `README.md`: push to a GitHub repo, then Render → New → Static Site (or Blueprint) → pick repo → add the two variables → deploy → optional custom domain.
- The same build works on Cloudflare Pages without changes.
- Nothing is pushed or deployed unless the owner says "push it" and names the repo.

## 14. Needs the owner's input (defaults apply until then)

| Item | Default at launch |
|---|---|
| Web3Forms access key | Form uses the mailto fallback |
| Final site URL | Canonical, `og:url` and sitemap omitted |
| Confirm role wording and project description (section 6.1) | Shown as written |
| Confirm email, LinkedIn, GitHub, location | Taken from resume |
| Screenshots of the clinic platform (must hide all patient and clinic details) | None shown |
| Availability line (for example "Currently taking on select projects") | Not shown |
| Phone or WhatsApp | Not shown |
| Preview image | Generated placeholder with name and title |
| Patient self-registration by QR code (built, not yet deployed) | Left out of the feature list until it is live |

## 15. Verification plan

1. `npm run typecheck`, `npm run build`, and Vitest all pass.
2. Unit tests: form validation (valid, invalid, boundary lengths, honeypot), mailto builder, and a content check (unique project ids, every link is `https:` or `mailto:`, required project fields present).
3. In a real browser at 375, 768 and 1440 px: no horizontal scroll; every nav link, button and CTA goes where it says; mobile menu opens, closes and is keyboard operable; project dialog opens, closes with Esc, and deep link `#healthcare` opens it; form shows errors, a sending state, a success state, and the failure path with the mailto link (failure simulated); reduced-motion setting respected.
4. Browser console shows no errors or warnings on load or interaction.
5. Lighthouse run on the production build; numbers reported as measured, with any miss explained.
6. External links (GitHub, LinkedIn, mailto) checked by hand; LinkedIn blocks automated requests, so that one is a manual click.
7. Final deliverable includes `README.md` with local run steps (`npm install`, `npm run dev`, `npm run build`, `npm run preview`) and the Render steps above.

## 16. Risks

- **Overclaiming.** Mitigated by section 3 and by keeping the clinic description to facts from the owner's own system.
- **Single project looks thin.** Mitigated by making that one case study deep, and by the one-file process for adding more. A second project is a small addition once there is one the owner can publish.
- **Form service outage or missing key.** Mitigated by the mailto fallback.
- **Client confidentiality.** The anonymous framing and the screenshot rule (no patient or clinic details) keep the site safe to share without asking the client.
