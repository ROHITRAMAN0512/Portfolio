import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { site } from './site'
import { services } from './services'
import { caseStudyEvidence, skillGroups } from './skills'
import { processSteps } from './process'
import { projects } from './projects'
import { healthcareCaseStudy as study } from './caseStudy'

const everything = { site, services, skillGroups, processSteps, projects, study }

/**
 * The client's name is deliberately NOT written anywhere in this public repo.
 * To enforce the rule on your own machine, list the words to keep out, one per
 * line, in `forbidden-words.local.txt` at the repo root (it is git-ignored). On
 * a machine without that file the two checks below are skipped.
 */
const repoRoot = new URL('../../', import.meta.url)
const forbiddenFile = new URL('forbidden-words.local.txt', repoRoot)
const forbiddenWords = existsSync(forbiddenFile)
  ? readFileSync(forbiddenFile, 'utf8')
      .split(/\r?\n/)
      .map((w) => w.trim())
      .filter(Boolean)
  : []
const forbiddenRegex = forbiddenWords.length
  ? new RegExp(`\\b(${forbiddenWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i')
  : null

function readableFiles(dir: URL, found: string[] = []): string[] {
  const path = dir.pathname.replace(/^\/([A-Za-z]:)/, '$1')
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'public'].includes(entry.name)) continue
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir)
    if (entry.isDirectory()) readableFiles(child, found)
    else if (/\.(ts|tsx|md|html|json|yml|yaml)$/.test(entry.name) && !entry.name.endsWith('.local.txt'))
      found.push(join(path, entry.name))
  }
  return found
}
const publicText = JSON.stringify({ projects, study })

describe('projects', () => {
  test('project ids are unique and match /^[a-z0-9-]+$/', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
  })

  test('every project has a tagline, a stack and a case-study link that is one of the site pages', () => {
    const paths = Object.values(site.pages).map((p) => p.path)
    for (const p of projects) {
      expect(p.tagline.trim()).not.toBe('')
      expect(p.stack.length).toBeGreaterThan(0)
      expect(paths).toContain(p.href)
    }
  })

  test('the healthcare project shows 3 portals and 4 login roles, nothing else, and has an architecture', () => {
    const healthcare = projects.find((p) => p.id === 'healthcare')!
    expect(healthcare.facts).toEqual([
      { label: 'Role-based portals', value: '3' },
      { label: 'Login roles', value: '4' },
    ])
    expect(healthcare.architecture?.nodes.length).toBeGreaterThan(0)
  })
})

describe('site', () => {
  test('every link on the site is https: or mailto:', () => {
    for (const href of [site.github, site.linkedin, `mailto:${site.email}`]) {
      expect(href).toMatch(/^(https:|mailto:)/)
    }
  })

  test('site.title equals the approved title', () => {
    expect(site.title).toBe('Rohit Raman — Java Backend Developer for Freelance Projects')
  })

  test('site.description is at most 155 characters', () => {
    expect(site.description.length).toBeLessThanOrEqual(155)
  })

  test('site.url is an https origin with no path', () => {
    const url = new URL(site.url)
    expect(url.protocol).toBe('https:')
    expect(url.pathname).toBe('/')
    expect(site.url.endsWith('/')).toBe(false)
  })

  test('nav ids are unique', () => {
    const ids = site.nav.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('healthcare case study', () => {
  test('every section is filled in', () => {
    expect(study.problem.length).toBeGreaterThanOrEqual(1)
    expect(study.capabilities.length).toBeGreaterThanOrEqual(5)
    expect(study.architecture.layers.length).toBeGreaterThanOrEqual(3)
    expect(study.role.responsibilities.length).toBeGreaterThanOrEqual(5)
    expect(study.decisions).toHaveLength(4)
    for (const d of study.decisions) {
      expect(d.title.trim()).not.toBe('')
      expect(d.problem.trim()).not.toBe('')
      expect(d.chose.trim()).not.toBe('')
      expect(d.tradeoff.trim()).not.toBe('')
    }
    expect(study.flow.length).toBeGreaterThanOrEqual(5)
    expect(study.testing.items.length).toBeGreaterThanOrEqual(3)
    expect(study.testing.next.length).toBeGreaterThanOrEqual(3)
    expect(study.stack.length).toBeGreaterThanOrEqual(3)
  })

  test('its section ids are unique', () => {
    const ids = study.sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('states four roles and never five', () => {
    expect(publicText).toMatch(/four roles/i)
    expect(publicText).not.toMatch(/\bfive\b|\b5 (staff )?roles\b/i)
  })

  test('describes clinic separation together with its continuity-of-care exception', () => {
    expect(publicText).toMatch(/continuity of care/i)
    expect(publicText).not.toMatch(/limited to their own clinic/i)
  })

  test('claims a preview step only for patient imports', () => {
    expect(publicText).not.toMatch(/(medicines|lab tests)[^."]*preview/i)
  })

  test('makes no security-testing claim the files do not evidence', () => {
    expect(publicText).not.toMatch(/low-privilege|re-?tested|penetration|pen test|vulnerabilit/i)
  })

  test('leaks no access-control internals, secrets, token details or configuration', () => {
    expect(publicText).not.toMatch(
      /\b(IDOR|bypass\w*|JWT|tokens?|localStorage|cookies?|rate[- ]?limit\w*|secrets?|credentials?|passwords?|hostnames?|Hibernate|\.env)\b/i,
    )
  })

  test('uses only numbers that were counted against the code', () => {
    const { stack: _stack, ...rest } = study
    const numbers = JSON.stringify(rest).match(/\b\d+\b/g) ?? []
    for (const n of numbers) expect(['3', '4', '355', '31', '2026']).toContain(n)
  })

  test('omits crude counts (controllers, entities, endpoint annotations)', () => {
    expect(publicText).not.toMatch(/\b(46|37|190|193)\b/)
  })

  test('says the test count is dated', () => {
    expect(JSON.stringify(study.testing)).toMatch(/355[^"]*31 Oct 2026/)
  })
})

describe('services framed as client problems', () => {
  test('each states the client problem and the outcome in plain sentences', () => {
    for (const s of services) {
      expect(s.problem.trim().length).toBeGreaterThan(20)
      expect(s.outcome.trim().length).toBeGreaterThan(20)
      expect(s.problem).toMatch(/[.?]$/)
      expect(s.outcome).toMatch(/\.$/)
    }
  })

  test('titles and ids are unique', () => {
    expect(new Set(services.map((s) => s.title)).size).toBe(services.length)
    expect(new Set(services.map((s) => s.id)).size).toBe(services.length)
  })

  test('each points at a project type the contact form offers', () => {
    for (const s of services) expect(site.contact.projectTypes).toContain(s.projectType)
  })

  test('the seven services are the ones the owner listed', () => {
    expect(services.map((s) => s.title)).toEqual([
      'Java and Spring Boot backend development',
      'REST API development and integration',
      'Database design and optimization',
      'Authentication and authorization',
      'Bug fixing in existing applications',
      'Backend performance improvements',
      'Deployment and maintenance',
    ])
  })
})

describe('credibility', () => {
  test('every skill tagged as shown in the case study really appears in it', () => {
    const text = JSON.stringify({ projects, study }).toLowerCase()
    const allItems = skillGroups.flatMap((g) => g.items)
    for (const [skill, keyword] of Object.entries(caseStudyEvidence)) {
      expect(allItems).toContain(skill)
      expect(text).toContain(keyword.toLowerCase())
    }
  })

  test('skills the case study does not show are not tagged', () => {
    for (const untagged of ['Kafka', 'Keycloak', 'AWS', 'MySQL', 'FHIR', 'Fintech', 'Microservices']) {
      expect(Object.keys(caseStudyEvidence)).not.toContain(untagged)
    }
  })

  test('About says professional backend developer since 2023, and names no employer', () => {
    const about = JSON.stringify(site.about)
    expect(about).toMatch(/professional backend developer since 2023/i)
    expect(about).not.toMatch(/trustt|novopay|mpowered/i)
  })

  test('About makes no unconfirmed share-of-work claim', () => {
    expect(JSON.stringify(site.about)).not.toMatch(/most of my work|majority of my/i)
  })

  test('the availability line is the approved one', () => {
    expect(site.contact.availability).toBe('Limited availability alongside a full-time role.')
  })

  test('the contact section tells visitors what a good first message includes', () => {
    expect(site.contact.include.length).toBeGreaterThanOrEqual(3)
  })
})

describe('lists', () => {
  test('services has 7 entries and processSteps has 5', () => {
    expect(services).toHaveLength(7)
    expect(processSteps).toHaveLength(5)
  })

  test('skillGroups cover the 7 groups in spec 5.1', () => {
    expect(skillGroups.map((g) => g.id)).toEqual([
      'core',
      'architecture',
      'data',
      'messaging',
      'identity',
      'delivery',
      'domains',
    ])
    for (const g of skillGroups) expect(g.items.length).toBeGreaterThan(0)
  })
})

describe('content rules', () => {
  test('no content string contains a percentage figure', () => {
    expect(JSON.stringify(everything)).not.toMatch(/\d\s?%/)
  })

  test.skipIf(!forbiddenRegex)('the site content never names the client (words come from a git-ignored local file)', () => {
    expect(JSON.stringify(everything)).not.toMatch(forbiddenRegex!)
  })

  test.skipIf(!forbiddenRegex)('no tracked source, doc or config file in the repo names the client', () => {
    const hits = readableFiles(repoRoot).filter((file) => forbiddenRegex!.test(readFileSync(file, 'utf8')))
    expect(hits).toEqual([])
  })

  test('public text never shows class-style names of internal components or custom headers', () => {
    expect(publicText).not.toMatch(/\b[A-Za-z]+(Guard|Resolver|Aspect|Interceptor|Filter)\b/)
    expect(publicText).not.toMatch(/\bX-[A-Za-z]+(-[A-Za-z]+)+\b/)
  })

  test('the site never names an employer', () => {
    expect(JSON.stringify(everything)).not.toMatch(/trustt|novopay|mpowered/i)
  })
})
