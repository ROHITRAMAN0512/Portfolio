# Freelance Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify the single-page freelance portfolio described in the spec, ready to deploy as a Render Static Site.

**Architecture:** One Vite + React + TypeScript page of anchor sections. All copy and project data live in typed files under `src/content/`. The small amount of real logic (form validation, mailto, form submit, hash parsing, project-block selection, SEO strings) is pure TypeScript, built test-first with Vitest. UI is verified in a real browser.

**Tech Stack:** React 19, TypeScript (strict), Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion (`LazyMotion`), Lucide React, Fontsource (Instrument Serif, Inter Variable, JetBrains Mono Variable), Vitest (node environment).

**Spec:** `docs/superpowers/specs/2026-10-31-portfolio-design.md`. Executors read it alongside this plan; section numbers below (`§`) refer to it.

## Global Constraints

- Working directory `E:\CLAUDE\portfolio` (own git repo, branch `main`). Commit locally after every task. **Never push or deploy** unless the owner says "push it" and names the repo.
- Copy: only facts from the spec. No invented clients, testimonials, results, percentages, response-time promises, ratings or years of experience (§3).
- Clinic project is anonymous: no clinic name, no live portal links. Its text and diagram never mention Kafka, microservices, Keycloak or AWS (§3, §6.1).
- Contact details: `rohit6363126@gmail.com`, `https://www.linkedin.com/in/rohitraman05/`, `https://github.com/ROHITRAMAN0512`, Bengaluru. No phone or WhatsApp (§2).
- Colour tokens (§7): `--bg #0A0E14`, `--surface #0F1520`, `--surface-2 #151D2B`, `--line #1F2937`, `--text #E6EAF2`, `--muted #8B97AB`, `--accent #2DD4BF` (only accent). Dark only.
- Fonts (§7): Instrument Serif (headings), Inter Variable (body/UI), JetBrains Mono Variable (technical labels); self-hosted, latin subset, `font-display: swap`.
- Layout (§7): max content width 1120 px, 16 px mobile gutter, sections 96–128 px vertical desktop and 64–80 px mobile, breakpoints 640/768/1024/1280, designed mobile-first at 375 px.
- Motion (§8): `LazyMotion` + `domAnimation`; reveal = 12 px rise + fade, 350 ms, once; everything off under `prefers-reduced-motion: reduce`; smooth scrolling via CSS only when motion is allowed; `scroll-margin-top` = header height.
- Page title exactly: `Rohit Raman — Java Backend Developer for Freelance Projects`. Meta description ≤ 155 characters (§10).
- Accessibility WCAG 2.1 AA, touch targets ≥ 44 px, one `<h1>` (§11). Initial JS ≤ 150 KB gzip.
- Pin exact dependency versions (`npm install --save-exact`).
- Env vars (build-time): `VITE_SITE_URL`, `VITE_WEB3FORMS_KEY`. The site must work with both unset.

## Review Focus

Inputs the spec implies but does not spell out, most likely first. Each has a pinning test in the task shown.

1. Whitespace-padded or whitespace-only form fields (`"   "` as name, 20 spaces as message) must be invalid and sent trimmed. → Task 3.
2. A URL hash that is unknown, empty or malformed (`#nope`, `#`, `#%E0%A4%A`) must never throw or open a dialog; back button closes an open dialog. → Tasks 4 and 7.
3. Double-clicking Send must produce exactly one request. → Task 9.
4. A long or non-ASCII message in the mailto fallback must stay a usable link (under 1800 characters) and decode back correctly. → Task 3.
5. A future project with no media, links, facts or architecture must render no empty frames. → Task 4.

---

## File Structure

```
index.html                       SEO tags, noscript, JSON-LD slot (Tasks 1, 10)
render.yaml, README.md, .env.example   (Task 11)
vite.config.ts                   react, tailwind, vitest config, SEO + font-preload plugin (Tasks 1, 10)
build/seo.ts, build/seo.test.ts  pure SEO string builders (Task 10)
scripts/og.html                  source of og-image.png (Task 10)
public/                          favicon.svg, og-image.png, robots.txt, 404.html, projects/
src/main.tsx, App.tsx, index.css, vite-env.d.ts
src/content/                     types.ts, site.ts, services.ts, skills.ts, process.ts, projects.ts, content.test.ts
src/lib/                         validate.ts, mailto.ts, submitContact.ts, hash.ts, projectBlocks.ts (+ *.test.ts)
src/hooks/                       useActiveSection.ts, usePrefersReducedMotion.ts, useHashDialog.ts
src/components/layout/           Header.tsx, Footer.tsx, SkipLink.tsx
src/components/ui/               Button.tsx, Section.tsx, Reveal.tsx, Chip.tsx, Dialog.tsx
src/components/diagrams/         Diagram.tsx, heroDiagram.ts, diagram.test.ts
src/sections/                    Hero, Work, Services, Expertise, Process, About, Contact (.tsx)
```

---

### Task 1: Scaffold, tooling and design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

**Interfaces:**
- Produces: npm scripts `dev`, `build` (= `tsc --noEmit && vite build`), `typecheck`, `test` (= `vitest run`), `preview`; Tailwind theme colours `bg, surface, surface-2, line, text, muted, accent` and font families `font-display, font-sans, font-mono`; Vitest config (`environment: 'node'`, `include: ['src/**/*.test.ts', 'build/**/*.test.ts']`).

- [ ] **Step 1:** Write the project files by hand (or generate with Vite's `react-ts` template in a scratch directory and copy). Install runtime deps (`react`, `react-dom`, `framer-motion`, `lucide-react`, the three Fontsource packages) and dev deps (`typescript`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `@types/react`, `@types/react-dom`, `@types/node`) with `--save-exact`. `.gitignore` covers `node_modules`, `dist`, `.env.local` and `.env.*.local`. `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `jsx: react-jsx`, `moduleResolution: bundler`, include `src`, `build`, `vite.config.ts`.
- [ ] **Step 2:** `src/index.css`: `@import "tailwindcss"`, an `@theme` block holding the colour and font tokens from Global Constraints, imports of the latin-only Fontsource stylesheets (check each package's `*.css` files for a latin-only one), `:root { color-scheme: dark }`, body background `--bg` and text `--text`, a visible `:focus-visible` ring in `--accent`, and `html { scroll-behavior: smooth }` wrapped in `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 3:** `App.tsx` renders a single `<main>` with the text "Portfolio" so the toolchain can be checked end to end.
- [ ] **Step 4:** Run `npm run typecheck && npm test -- --passWithNoTests && npm run build`. Expected: all exit 0, `dist/` created. Run `npm run dev`, open the page in the built-in browser: dark `#0A0E14` background, light text, no console errors.
- [ ] **Step 5:** Commit: `git add -A && git commit -m "Scaffold Vite React TS app with Tailwind tokens and fonts"`.

---

### Task 2: Content types and data

**Files:**
- Create: `src/content/types.ts`, `site.ts`, `services.ts`, `skills.ts`, `process.ts`, `projects.ts`
- Test: `src/content/content.test.ts`
- Modify: `docs/superpowers/specs/2026-10-31-portfolio-design.md` (§6: add optional `note?: string` to architecture nodes)

**Interfaces:**
- Produces (`types.ts`): `Project` exactly as spec §6 plus `ArchNode.note?: string`; `type ArchNode`, `type ArchEdge`; `type Service = { id: string; title: string; benefit: string; icon: 'server' | 'plug' | 'database' | 'boxes' | 'shield' | 'wrench' | 'rocket' }`; `type SkillGroup = { id: string; title: string; how: string; items: string[] }`; `type ProcessStep = { id: string; title: string; detail: string }`.
- Produces: `site: { name; title; description; role; location; email; linkedin; github; siteUrl: string | undefined; nav: { id: string; label: string }[] }` (`siteUrl` reads `import.meta.env.VITE_SITE_URL`), `services: Service[]`, `skillGroups: SkillGroup[]`, `processSteps: ProcessStep[]`, `projects: Project[]`.

- [ ] **Step 1: Write the failing tests** in `content.test.ts`:
  - `project ids are unique and match /^[a-z0-9-]+$/`
  - `every link in site and projects is https: or mailto:`
  - `every project has non-empty problem, role, at least one feature and one stack group`
  - `services has 7 entries and processSteps has 5`
  - `skillGroups cover the 7 groups in spec §5.1`
  - `no content string contains a percentage figure` — `JSON.stringify` all content, assert it does not match `/\d\s?%/`
  - `the healthcare project never mentions kafka, microservice, keycloak or aws` (case-insensitive, over its JSON)
  - `the site never names the client clinic`
  - `site.title equals "Rohit Raman — Java Backend Developer for Freelance Projects"` and `site.description.length <= 155`
- [ ] **Step 2:** Run `npx vitest run src/content`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Write the types and data files. Copy follows spec §5.1 and §6.1 verbatim for hero-adjacent text, the clinic project, services names, process step names and skill groups. Write one client-facing benefit per service, one sentence per process step, and one "how I use it" sentence per skill group; none may contain numbers. `projects` has exactly one entry, id `healthcare`, with no `media` and no `links`. Add the `note?` line to spec §6.
- [ ] **Step 4:** Run `npx vitest run src/content && npm run typecheck`. Expected: PASS.
- [ ] **Step 5:** Commit: `git add -A && git commit -m "Add typed content and content integrity tests"`.

---

### Task 3: Contact logic (validate, mailto, submit)

**Files:**
- Create: `src/lib/validate.ts`, `src/lib/mailto.ts`, `src/lib/submitContact.ts`
- Test: `src/lib/validate.test.ts`, `src/lib/mailto.test.ts`, `src/lib/submitContact.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type ContactInput = { name: string; email: string; projectType: string; message: string; botcheck: boolean }`
  - `type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>`
  - `validateContact(input: ContactInput): FieldErrors` — empty object means valid. Rules on trimmed values: name 2–80 chars; email matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` and ≤ 254 chars; message 20–2000 chars. Messages: `"Please enter your name (2–80 characters)."`, `"Please enter a valid email address."`, `"Please tell me a little more (20–2000 characters)."`.
  - `buildMailto(to: string, input: ContactInput): string` — `mailto:` URL, subject `Project enquiry from <name>`, body containing name, email, project type and message.
  - `type SubmitResult = { status: 'sent' } | { status: 'mailto'; href: string } | { status: 'error'; message: string; mailtoHref: string }`
  - `submitContact(input: ContactInput, opts: { accessKey?: string; mailtoTo: string; fetchImpl?: typeof fetch }): Promise<SubmitResult>`

- [ ] **Step 1: Write the failing tests.**
  - `validate.test.ts`: valid input → `{}`; `name: "   "` → `name` error; `name: " A "` → `name` error (trimmed length 1); 80-char name valid, 81 invalid; `email: "a@b"` → error, `" me@x.com "` → valid; message of 20 spaces → `message` error; 19 chars invalid, 20 valid, 2000 valid, 2001 invalid; two bad fields give two keys.
  - `mailto.test.ts`: plain ASCII input → exact string `mailto:me@x.com?subject=Project%20enquiry%20from%20Asha&body=…`; a newline in the message encodes as `%0A`; message `"நன்றி ₹ 5000 — please call me back soon"` round-trips through `decodeURIComponent` of the body; 2000-character message → `href.length <= 1800` and the decoded body ends with the note `…(message shortened, please paste the rest)`.
  - `submitContact.test.ts` with a fake `fetchImpl`: no `accessKey` → `{status:'mailto', href}` and fetch never called; success response `{ok:true, json:{success:true}}` → `{status:'sent'}` and one POST to `https://api.web3forms.com/submit` with JSON body containing `access_key`, trimmed `name`, `email`, `message`, `subject`; `ok:false` → `status:'error'` with a `mailtoHref`; `success:false` → error; fetch rejects → error; `botcheck: true` → `{status:'sent'}` and fetch never called.
- [ ] **Step 2:** Run `npx vitest run src/lib`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement the three modules with the signatures above. `buildMailto`: if the encoded URL exceeds 1800 characters, shorten the message by characters (appending the note above) until it fits. `submitContact`: trim all strings before sending; treat `!res.ok || !json.success` as an error; default `fetchImpl` is the global `fetch`.
- [ ] **Step 4:** Run `npx vitest run src/lib && npm run typecheck`. Expected: PASS.
- [ ] **Step 5:** Commit: `git add -A && git commit -m "Add contact validation, mailto fallback and submit logic"`.

---

### Task 4: Project helpers (hash parsing, visible blocks)

**Files:**
- Create: `src/lib/hash.ts`, `src/lib/projectBlocks.ts`
- Test: `src/lib/hash.test.ts`, `src/lib/projectBlocks.test.ts`

**Interfaces:**
- Consumes: `Project` from `src/content/types.ts`.
- Produces:
  - `parseProjectHash(hash: string, ids: readonly string[]): string | null` — exact match of the decoded fragment against `ids`, else `null`; never throws.
  - `projectHash(id: string): string` — returns `` `#${id}` ``.
  - `type ProjectBlock = 'problem' | 'role' | 'features' | 'facts' | 'architecture' | 'stack' | 'media' | 'links'`
  - `projectBlocks(p: Project): ProjectBlock[]` — blocks in that order, omitting any whose data is missing or an empty array.

- [ ] **Step 1: Write the failing tests.**
  - `hash.test.ts` with `ids = ['healthcare']`: `'#healthcare'` → `'healthcare'`; `''`, `'#'`, `'#nope'`, `'#Healthcare'`, `'#healthcare/'` → `null`; `'#%E0%A4%A'` (malformed percent-encoding) → `null` without throwing; `projectHash('healthcare')` → `'#healthcare'`.
  - `projectBlocks.test.ts`: the real `healthcare` project → `['problem','role','features','facts','architecture','stack']`; a minimal project (problem, role, one feature, one stack group only) → `['problem','role','features','stack']`; empty `media: []` and `links: []` are omitted.
- [ ] **Step 2:** Run `npx vitest run src/lib/hash src/lib/projectBlocks`. Expected: FAIL.
- [ ] **Step 3:** Implement both modules (wrap `decodeURIComponent` in try/catch).
- [ ] **Step 4:** Run `npx vitest run && npm run typecheck`. Expected: PASS (all suites so far).
- [ ] **Step 5:** Commit: `git add -A && git commit -m "Add hash parsing and project block selection"`.

---

### Task 5: Layout shell and UI primitives

**Files:**
- Create: `src/hooks/useActiveSection.ts`, `src/hooks/usePrefersReducedMotion.ts`, `src/components/ui/{Button,Section,Reveal,Chip,Dialog}.tsx`, `src/components/layout/{Header,Footer,SkipLink}.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`

**Interfaces:**
- Consumes: `site` from `src/content/site.ts`.
- Produces:
  - `useActiveSection(ids: string[]): string` (IntersectionObserver; returns the id currently in view).
  - `usePrefersReducedMotion(): boolean`.
  - `Button({ href?: string; onClick?: () => void; variant?: 'primary' | 'secondary'; children })` — renders `<a>` when `href` is given, else `<button>`; min height 44 px.
  - `Section({ id: string; title: string; eyebrow?: string; children })` — `<section id aria-labelledby>` with an `<h2>`, `scroll-margin-top` equal to header height, vertical padding per Global Constraints.
  - `Reveal({ children })` — fade/rise once on scroll, wrapped in `LazyMotion` with `domAnimation`; renders children immediately when reduced motion is on.
  - `Chip({ children })`.
  - `Dialog({ open: boolean; onClose: () => void; labelledBy: string; children })` — native `<dialog>` using `showModal()`; Esc and backdrop click call `onClose`; locks body scroll while open.
  - `Header` (sticky, solid background with bottom border after scroll, nav from `site.nav`, active link `aria-current="true"`, mobile disclosure button with `aria-expanded`/`aria-controls`, Esc closes it, "Let's talk" button linking `#contact`); `Footer` (copyright, GitHub, LinkedIn, email, back-to-top link); `SkipLink` (first focusable element, targets `#main`).

- [ ] **Step 1:** Implement the hooks and components with the signatures above; `App.tsx` renders `SkipLink`, `Header`, `<main id="main">` containing an empty `<section id=...>` per nav id for scroll targets, and `Footer`.
- [ ] **Step 2:** Verify in the built-in browser at 1440 and 375 px: Tab's first stop is "Skip to content" and it works; header nav links scroll to their anchors without being hidden under the header; at 375 px the menu button opens and closes the menu, `aria-expanded` flips, Esc closes it and returns focus to the button; reduced-motion emulation shows no animation. Console clean.
- [ ] **Step 3:** Run `npm run typecheck && npm run build`. Expected: both exit 0.
- [ ] **Step 4:** Commit: `git add -A && git commit -m "Add layout shell, header, footer and UI primitives"`.

---

### Task 6: Diagram and Hero

**Files:**
- Create: `src/components/diagrams/Diagram.tsx`, `src/components/diagrams/heroDiagram.ts`, `src/sections/Hero.tsx`
- Test: `src/components/diagrams/diagram.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `ArchNode`, `ArchEdge` from `types.ts`; `Button`, `Reveal`; `usePrefersReducedMotion`; `projects`.
- Produces:
  - `Diagram({ nodes: ArchNode[]; edges: ArchEdge[]; caption?: string; label: string; animate?: boolean })` — fixed-aspect container; node `x`,`y` are percentages (0–100) of it; edges are drawn in an SVG sharing that coordinate space so a travelling dot is not distorted; each node is an HTML `<button>` that shows its `note` on hover, focus or tap; a visually hidden list repeats nodes and connections; the dot (SMIL `animateMotion`) is rendered only when `animate` and motion is allowed; below 640 px node `sub` text is hidden.
  - `heroDiagram: { nodes: ArchNode[]; edges: ArchEdge[] }` — nodes: Client apps, API (Spring Boot), Auth (Spring Security · JWT / Keycloak), Services, Database (PostgreSQL · MySQL), Events (Kafka), Delivery (Docker · AWS), each with a one-line plain-words `note`; edges client→api, api→auth, api→services, services→database, services→events, delivery→api. Caption "A typical setup I build".

- [ ] **Step 1: Write the failing test** `diagram.test.ts`: for `heroDiagram` and for every `project.architecture`: node ids are unique; every edge `from`/`to` matches a node id; every `x` and `y` is within 0–100; every node has a non-empty `label`; hero nodes all have a `note`.
- [ ] **Step 2:** Run `npx vitest run src/components/diagrams`. Expected: FAIL.
- [ ] **Step 3:** Implement `heroDiagram.ts`, `Diagram.tsx` and `Hero.tsx` (eyebrow, single `<h1>`, sub-copy and two buttons per spec §5.1; "View My Work" → `#work`, "Let's Discuss Your Project" → `#contact`; diagram beside the text ≥ 1024 px and below it otherwise; faint radial teal glow and low-contrast grid behind it). Mount `Hero` in `App.tsx`.
- [ ] **Step 4:** Run `npx vitest run && npm run typecheck`. Expected: PASS.
- [ ] **Step 5:** Verify in the built-in browser at 1440, 768 and 375 px: layout stacks correctly, no horizontal scroll, hovering/focusing each node shows its note, the dot travels and stops under reduced motion, both buttons scroll to the right place. Console clean.
- [ ] **Step 6:** Commit: `git add -A && git commit -m "Add architecture diagram and hero section"`.

---

### Task 7: Work section (cards, case-study dialog, deep link)

**Files:**
- Create: `src/hooks/useHashDialog.ts`, `src/sections/Work.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `projects`, `parseProjectHash`, `projectHash`, `projectBlocks`, `Dialog`, `Diagram`, `Chip`, `Reveal`, `Section`.
- Produces: `useHashDialog(ids: readonly string[]): { activeId: string | null; open(id: string): void; close(): void }` — `open` pushes `#id` onto history; `close` calls `history.back()` if this page pushed the entry, otherwise `history.replaceState` to the URL without a hash; a `hashchange`/`popstate` listener keeps state in sync; initial state comes from `parseProjectHash(location.hash, ids)`.

- [ ] **Step 1:** Implement `useHashDialog` and `Work.tsx`: `Section id="work"`; a card per project (title, tagline, status, first 3 stack items as chips, "Open case study" button); a `Dialog` rendering exactly the blocks returned by `projectBlocks` in order — problem, role, features, facts, `Diagram` (with `project.architecture.caption`), grouped stack, media (`<img>` with `alt`, `loading="lazy"`), links (`rel="noopener noreferrer"`, `target="_blank"`); section closing CTA "Have a similar system in mind? Tell me about it" → `#contact`.
- [ ] **Step 2:** Verify in the built-in browser: clicking the card opens the dialog and the URL gains `#healthcare`; Esc closes it and removes the hash; browser Back closes it; loading `/#healthcare` directly opens it; loading `/#nope`, `/#`, and `/#%E0%A4%A` shows the normal page with no dialog and no console error; focus returns to the card button on close; at 375 px the dialog scrolls inside itself and the page behind does not scroll.
- [ ] **Step 3:** Run `npm run typecheck && npx vitest run`. Expected: PASS.
- [ ] **Step 4:** Commit: `git add -A && git commit -m "Add work section with case-study dialog and deep links"`.

---

### Task 8: Services, Expertise, Process and About

**Files:**
- Create: `src/sections/{Services,Expertise,Process,About}.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `services`, `skillGroups`, `processSteps`, `site`, `Section`, `Reveal`, `Chip`, `Button`; Lucide icons mapped from `Service.icon`.
- Produces: four sections with ids `services`, `expertise`, `process`, `about`, mounted in `App.tsx` in the order of spec §5 (hero, work, services, expertise, process, about, contact).

- [ ] **Step 1:** Implement the sections. Services: 7 cards (icon, title, benefit) then CTA "Not sure which one you need? Describe the problem" → `#contact`. Expertise: one card per skill group (title, how-I-use-it sentence, chips); no bars or percentages. Process: 5 numbered steps (vertical on mobile, horizontal ≥ 1024 px) then CTA "Start with a short conversation" → `#contact`. About: three paragraphs per spec §5.1 plus the three items Reliable, Maintainable, Production-ready. Order and copy come from the content files, not hard-coded.
- [ ] **Step 2:** Verify in the built-in browser at 1440, 768 and 375 px: all four sections render, no horizontal scroll, the active nav link follows scrolling, every CTA lands on the contact anchor under the header. Console clean.
- [ ] **Step 3:** Run `npm run typecheck && npm run build`. Expected: both exit 0.
- [ ] **Step 4:** Commit: `git add -A && git commit -m "Add services, expertise, process and about sections"`.

---

### Task 9: Contact section

**Files:**
- Create: `src/sections/Contact.tsx`, `src/components/ContactForm.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `validateContact`, `submitContact`, `ContactInput`, `site`, `Section`, `Button`.
- Produces: `ContactForm()` — fields name, email, project type (select: Backend or API build, Integration, Bug fix or maintenance, Something else), message, hidden honeypot named `botcheck`; state machine `idle | sending | sent | mailto | error`.

- [ ] **Step 1:** Implement per spec §9: validate on blur and on submit with errors under each field via `aria-describedby`, focus the first invalid field on submit; a `useRef` guard plus `disabled` while sending so a second submit is ignored; `sent` replaces the form with a confirmation in an `aria-live="polite"` region; `mailto` shows "Your email app should open. If it didn't, use this link" with the href and also sets `window.location.href`; `error` keeps the text and shows the message with a "Send by email instead" link. Read the key from `import.meta.env.VITE_WEB3FORMS_KEY`. Right column: email link, GitHub, LinkedIn (`rel="noopener noreferrer"`, `target="_blank"` for the two sites). Heading "Tell me what you're building."
- [ ] **Step 2:** Verify in the built-in browser, with the key unset: submitting empty shows three errors and focuses name; whitespace-only name and 20 spaces as message show errors; a valid submit shows the mailto state with a correct prefilled link. Then stub `window.fetch` via the console: success → confirmation; `ok:false` → error state with text preserved and mailto link; two rapid clicks on Send → the stub is called once. Set `VITE_WEB3FORMS_KEY=test` in `.env.local` to exercise the fetch path (do not commit the file).
- [ ] **Step 3:** Run `npm run typecheck && npx vitest run && npm run build`. Expected: PASS and exit 0.
- [ ] **Step 4:** Commit: `git add -A && git commit -m "Add contact section and form"`.

---

### Task 10: SEO, static assets and font preload

**Files:**
- Create: `build/seo.ts`, `build/seo.test.ts`, `scripts/og.html`, `public/{favicon.svg,og-image.png,robots.txt,404.html}`
- Modify: `index.html`, `vite.config.ts`

**Interfaces:**
- Consumes: `site` (title, description, name, role, github, linkedin).
- Produces (`build/seo.ts`):
  - `headTags(siteUrl: string | undefined): string` — `''` when unset; otherwise `<link rel="canonical">` and `<meta property="og:url">` (and absolute `og:image`).
  - `buildSitemap(siteUrl: string | undefined): string | null` — `null` when unset; otherwise XML with one `<url><loc>` for the site root.
  - `buildJsonLd(): string` — JSON string for a schema.org `Person` (name, jobTitle, knowsAbout from skill groups, `sameAs` = GitHub and LinkedIn). No ratings or reviews.
  - A Vite plugin in `vite.config.ts` that injects `headTags(...)` and `buildJsonLd()` into `index.html`, emits `sitemap.xml` when `buildSitemap` returns a string, and adds `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the latin Instrument Serif and Inter files found in the bundle.

- [ ] **Step 1: Write the failing tests** in `build/seo.test.ts`: `headTags(undefined)` is `''`; `headTags('https://example.com')` contains `rel="canonical" href="https://example.com/"` and `og:url`; `buildSitemap(undefined)` is `null`; `buildSitemap('https://example.com/')` contains exactly one `<loc>https://example.com/</loc>`; `JSON.parse(buildJsonLd())` has `@type: "Person"` and `sameAs` containing both profile URLs.
- [ ] **Step 2:** Run `npx vitest run build`. Expected: FAIL.
- [ ] **Step 3:** Implement `build/seo.ts` and wire the plugin. In `index.html` set the exact title, description, Open Graph and Twitter tags (using a relative-safe `og:image` only when a URL exists), `theme-color` `#0A0E14`, favicon link, and a `<noscript>` block saying the site needs JavaScript with a visible `mailto:` link. Add `robots.txt` (`User-agent: *`, `Allow: /`, and a `Sitemap:` line only if a URL is known, so omit it from the static file), `favicon.svg` (a simple monogram in the accent colour), and a styled self-contained `404.html` with a link home.
- [ ] **Step 4:** Create `scripts/og.html` (1200×630, name, "Java Backend Developer", tagline, dark tokens, local Fontsource files) and render it to `public/og-image.png` with headless Chrome (`chrome --headless --screenshot --window-size=1200,630`). Confirm dimensions 1200×630 by reading the PNG header.
- [ ] **Step 5:** Run `npx vitest run && npm run typecheck`. Then `VITE_SITE_URL=https://example.com npm run build` and confirm `dist/index.html` has the canonical tag, JSON-LD and font preloads and `dist/sitemap.xml` exists; run `npm run build` with the variable unset and confirm no canonical tag and no `sitemap.xml`. Expected: PASS.
- [ ] **Step 6:** Commit: `git add -A && git commit -m "Add SEO tags, JSON-LD, sitemap, 404 and preview image"`.

---

### Task 11: Render config and README

**Files:**
- Create: `render.yaml`, `README.md`, `.env.example`

**Interfaces:**
- Consumes: scripts from Task 1; env var names from Global Constraints.
- Produces: a Render Static Site definition and owner-facing docs.

- [ ] **Step 1:** `render.yaml`: one service, `type: web`, `runtime: static`, `buildCommand: npm ci && npm run build`, `staticPublishPath: dist`, env vars `NODE_VERSION=22`, `VITE_SITE_URL` and `VITE_WEB3FORMS_KEY` (both `sync: false`), headers `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` and `X-Content-Type-Options: nosniff` for `/*`. `.env.example` lists the two variables with comments.
- [ ] **Step 2:** `README.md` in plain words: what the site is; run locally (`npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm test`); where to edit copy (`src/content/`); how to add a project (one object in `projects.ts`, optional images in `public/projects/<id>/`, what each optional field does); the "Needs your input" table from spec §14 with each default; setting up Web3Forms (free account, copy key, set `VITE_WEB3FORMS_KEY`, restrict to the final domain if the plan allows); deploying on Render (push to GitHub, New → Static Site or Blueprint, pick repo, add the two variables, deploy, optional custom domain); the same build on Cloudflare Pages; note that nothing is pushed for the owner.
- [ ] **Step 3:** Verify: `npm ci && npm run build && npm run preview` serves the site at `http://localhost:4173`; `grep -n "staticPublishPath: dist" render.yaml` matches. Expected: build exits 0, page loads.
- [ ] **Step 4:** Commit: `git add -A && git commit -m "Add Render config, env example and README"`.

---

### Task 12: Verification and polish

**Files:**
- Modify: whichever files fail a check below.

**Interfaces:**
- Consumes: the full site from `npm run build` / `npm run preview`.

- [ ] **Step 1:** Run `npm run typecheck && npm test && npm run build`. Expected: all pass. Record the gzip size of the initial JS from the build output; it must be ≤ 150 KB.
- [ ] **Step 2:** With `npm run preview`, check at 320, 375, 768 and 1440 px, and at 200% zoom on desktop: no horizontal scroll; no clipped or overlapping text; every nav link, hero button, section CTA, footer link and card button works; mobile menu works by keyboard; dialog open/close/deep-link/Back all work; form states (invalid, mailto, stubbed success, stubbed failure) work; tabbing through the page shows a visible focus ring everywhere and follows reading order; with reduced motion on, nothing animates.
- [ ] **Step 3:** Confirm the console shows no errors or warnings on load and after each interaction above, and the Network panel shows no failed requests.
- [ ] **Step 4:** Run Lighthouse against `http://localhost:4173` (`npx lighthouse http://localhost:4173 --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo`, once as is for mobile and once with `--preset=desktop`). Targets: Accessibility, Best Practices, SEO ≥ 95; Performance ≥ 95 desktop and ≥ 90 mobile. Fix anything below target; if one cannot be met, record the measured number and why.
- [ ] **Step 5:** Click GitHub and email links by hand; LinkedIn blocks automated requests, so open it manually once.
- [ ] **Step 6:** Re-run Steps 1 and 3 after fixes. Write the measured results (sizes, Lighthouse scores, any misses) into the commit message body.
- [ ] **Step 7:** Commit: `git add -A && git commit -m "Verification fixes and measured results"`.

---

## Self-Review

- **Spec coverage:** §1 → Tasks 1–12 overall; §2/§14 → Task 2 (site data), Task 11 (README table); §3 → Task 2 content tests; §4 → no tasks by design; §5 → Tasks 5–9; §6 → Tasks 2, 4, 7; §7 → Tasks 1, 5; §8 → Tasks 5, 6; §9 → Tasks 3, 9; §10 → Task 10; §11 → Tasks 5, 6, 12; §12 → File Structure; §13 → Task 11; §15 → Task 12; §16 → Global Constraints and content tests.
- **Spec change:** Task 2 adds `ArchNode.note?` to spec §6 because the hero diagram needs a per-node explanation.
- **Type consistency:** `ContactInput` (Task 3) is used unchanged in Task 9; `Project`/`ArchNode`/`ArchEdge` (Task 2) are used in Tasks 4, 6, 7; `projectBlocks` and `parseProjectHash` (Task 4) are consumed in Task 7; `Diagram` props (Task 6) are consumed in Task 7.
