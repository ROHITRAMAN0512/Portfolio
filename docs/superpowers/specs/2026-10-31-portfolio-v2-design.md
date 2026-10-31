# Portfolio v2: Evidence-First Redesign (Design)

Date: 2026-10-31. Owner: Rohit Raman. Builds on `2026-10-31-portfolio-design.md`. Approved by the owner in chat on 31 Oct 2026.

## Goal
Make the portfolio convincing to freelance clients through real engineering evidence, without inventing metrics, features or outcomes. Target: 9/10 on the eight criteria below, claimed only after re-scoring the finished site.

Criteria: visual design and consistency; first-impression clarity; technical credibility; case-study quality; freelance conversion; mobile usability; accessibility; performance and SEO.

## Publishing rules (binding)
- The public case study covers client outcomes and high-level engineering decisions only.
- Never publish: how access control works internally, exact weaknesses (fixed or not), internal file paths, class or table names, secrets or configuration values, hostnames or URLs of the system, token or storage details, defect counts, or test details about security.
- No client or clinic name. No employer names. No performance figures, user numbers, revenue, testimonials or invented screenshots.
- Every published number is re-counted against the current code at publish time. Allowed numbers: 3 portals, 4 login roles, and "355 backend unit tests (counted 31 Oct 2026)" in the testing section. Controller, entity and endpoint counts are omitted.
- Screenshots are optional. No gallery and no placeholder on the public site. Real files may be added later after the owner checks them for patient and clinic details.
- Backend findings go in a separate private report outside every git repository. Database dumps and password hashes are never opened, copied or quoted.
- The Web3Forms key never appears in chat, the repo or tool output; live tests read it from a local environment variable.
- Commits carry no co-author trailer. Nothing is pushed without the owner's explicit "push it".

## Owner decisions
- Role: sole engineer (backend, three portals, deployment, client feedback rounds).
- Availability line: "Limited availability alongside a full-time role".
- About may say "Professional backend developer since 2023" (from the resume dates).
- Hosting platforms may be named as "deployed for client UAT".

## Changes by phase
**P0 (shipped):** corrected claims (4 roles, clinic separation wording, import preview, security-review wording), removed the filler stat, put the site address in `site.ts` so share previews, canonical, sitemap and structured data work.

**P1: case study page and hero**
- New static page `/work/healthcare/` built as a second HTML entry of the same Vite app (same components, no new framework). Own title, description, share preview, canonical and sitemap entry. The pop-up and its hash handling are removed; `/#healthcare` redirects to the page.
- Case study sections: the problem; what it lets the clinic do; architecture at a glance (diagram); my role; four engineering decisions (problem, decision, trade-off); how a visit flows (with workflow states); how it was tested; what I would add next; stack and delivery.
- Hero: title "Java Backend Developer"; headline "Java backend development for products where mistakes are expensive."; buttons "View My Work" and "Discuss a Project"; one line of proof linking to the case study; the diagram becomes the real clinic request path, smaller and quieter, with no travelling dot.

**P2: services, credibility, conversion**
- Services framed as client problems with outcomes; each has a "Discuss this" link that preselects the project type in the form. Microservices becomes part of backend development.
- Skills tagged where the clinic project evidences them; About rewritten from real facts; no skill levels.
- Call-to-action blocks reduced to header button, hero pair, per-service links, end of case study and the contact section. Contact gains the availability line and a short "what to include" hint.

**P3: polish, accessibility, SEO, tests, private report**
- One spacing scale, one type scale, calmer section rhythm, consistent cards and buttons; keep the navy, teal and serif identity.
- Fix the two known accessibility gaps (fact list markup order, diagram feedback for screen readers); keep reduced-motion support.
- Structured data per page, sitemap with both pages, per-page share image.
- Content tests for the publishing rules; Lighthouse, link and layout checks at 320, 375, 768 and 1440 px.
- Private security remediation report at `E:\CLAUDE\private\`, not in any repo.

## Out of scope
New frameworks, animated counters, skill bars, decorative charts, a screenshot gallery without real files, any claim the files do not support.
