import { describe, expect, test } from 'vitest'
import { site } from './site'
import { services } from './services'
import { skillGroups } from './skills'
import { processSteps } from './process'
import { projects } from './projects'

const everything = { site, services, skillGroups, processSteps, projects }

describe('projects', () => {
  test('project ids are unique and match /^[a-z0-9-]+$/', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
  })

  test('every project has non-empty problem, role, at least one feature and one stack group', () => {
    for (const p of projects) {
      expect(p.problem.trim()).not.toBe('')
      expect(p.role.trim()).not.toBe('')
      expect(p.features.length).toBeGreaterThan(0)
      expect(p.stack.length).toBeGreaterThan(0)
    }
  })

  test('the healthcare project never mentions kafka, microservice, keycloak or aws', () => {
    const healthcare = projects.find((p) => p.id === 'healthcare')
    expect(healthcare).toBeDefined()
    expect(JSON.stringify(healthcare)).not.toMatch(/kafka|microservice|keycloak|\baws\b/i)
  })

  test('the healthcare project has facts and an architecture', () => {
    const healthcare = projects.find((p) => p.id === 'healthcare')
    expect(healthcare?.facts?.length).toBeGreaterThan(0)
    expect(healthcare?.architecture?.nodes.length).toBeGreaterThan(0)
  })
})

describe('site', () => {
  test('every link in site and projects is https: or mailto:', () => {
    const links = [
      site.github,
      site.linkedin,
      `mailto:${site.email}`,
      ...projects.flatMap((p) => (p.links ?? []).map((l) => l.href)),
    ]
    for (const href of links) expect(href).toMatch(/^(https:|mailto:)/)
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

describe('public claims match the verified code (31 Oct 2026)', () => {
  const healthcare = () => projects.find((p) => p.id === 'healthcare')!
  const text = () => JSON.stringify(healthcare())

  test('states four roles and never five', () => {
    expect(healthcare().facts?.some((f) => /roles/i.test(f.label) && f.value === '4')).toBe(true)
    expect(text()).not.toMatch(/\bfive\b|\b5 (staff )?roles\b/i)
  })

  test('has no filler facts', () => {
    for (const f of healthcare().facts ?? []) expect(f.value).not.toBe('1')
  })

  test('describes clinic separation together with its continuity-of-care exception', () => {
    expect(text()).toMatch(/continuity of care/i)
    expect(text()).not.toMatch(/limited to their own clinic/i)
  })

  test('only claims a preview step for patient imports', () => {
    const importLine = healthcare().features.find((f) => /bulk/i.test(f))
    expect(importLine).toBeDefined()
    expect(importLine).toMatch(/patients[^.]*preview/i)
    expect(importLine).not.toMatch(/(medicines|lab tests)[^.]*preview/i)
  })

  test('makes no security-testing claim the files do not evidence', () => {
    expect(text()).not.toMatch(/low-privilege|re-?tested|penetration|pen test/i)
  })

  test('leaks no access-control internals, secrets or configuration details', () => {
    expect(text()).not.toMatch(
      /\b(IDOR|bypass\w*|localStorage|rate[- ]?limit\w*|refresh token|secret\w*|credential\w*|password\w*|hostname)\b/i,
    )
  })

  test('omits crude counts (controllers, entities, endpoint annotations)', () => {
    expect(text()).not.toMatch(/\b(46|37|190|193)\b/)
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
})
