# Portfolio v2 Implementation Plan

**Goal:** Build phases P1 to P3 of `docs/superpowers/specs/2026-10-31-portfolio-v2-design.md`.
**Architecture:** Same Vite + React + TypeScript + Tailwind app. A second static HTML entry (`work/healthcare/index.html`) renders the case study with the same components. Content stays in `src/content/`; logic stays pure and tested.
**Rules:** the spec's "Publishing rules" bind every task. Local commits only, no co-author trailer, no push without the owner's "push it".

## Tasks
1. **Multi-page build and per-page SEO.** `site.pages` (path, title, description per page). In `build/seo.ts`: `pageKeyFor(filename)`, `headTags(siteUrl, path)`, `metaTags(page)`, `buildSitemap` listing every page, `buildJsonLd(page)` (Person for home, Article for the case study). Vite `build.rollupOptions.input` with both HTML files. Tests first in `build/seo.test.ts`.
2. **Case study content and page.** `src/content/caseStudy.ts` (typed), `src/pages/CaseStudyPage.tsx` and small section components, `src/case-study.tsx` entry. Simplify `Project` to the home-card summary. Remove the pop-up (`Dialog`, `useHashDialog`, `CaseStudy`, `hash`, `projectBlocks`) and their tests. Content tests enforce the publishing rules on the case study text.
3. **Home integration.** The project card links to `/work/healthcare/`; the section-closing call-to-action block is removed; `/#healthcare` redirects to the page (pure `legacyHashTarget` tested). `Header` and `Footer` work on both pages (links to `/#section` off the home page).
4. **Hero.** New headline, sub-copy, button labels, proof line linking to the case study; diagram replaced by the real request path, smaller, no travelling dot.
5. **P1 verification.** Tests, typecheck, build, browser checks at 320/375/768/1440, Lighthouse on both pages, link check.
6. **P2.** Services as client problems with preselecting links; skills tagged by evidence; About rewrite; fewer call-to-action blocks; contact availability line and hint.
7. **P3.** Spacing and type scale, accessibility gaps, per-page share image, content tests, final Lighthouse and layout checks.
8. **Private report.** `E:\CLAUDE\private\clinic-security-remediation.md`, outside every repo, no secret values.
9. **Final re-score** against the eight criteria, with evidence.
