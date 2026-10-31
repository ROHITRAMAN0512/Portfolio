import { describe, expect, test } from 'vitest'
import { site } from './site'
import { services } from './services'
import { skillGroups } from './skills'
import { processSteps } from './process'
import { projects } from './projects'
import { healthcareCaseStudy as study } from './caseStudy'

const everything = { site, services, skillGroups, processSteps, projects, study }
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

  test('the site never names the client clinic', () => {
    expect(JSON.stringify(everything)).not.toMatch(/\bplaceholder-client-name\b/i)
  })

  test('the site never names an employer', () => {
    expect(JSON.stringify(everything)).not.toMatch(/trustt|novopay|mpowered/i)
  })
})
