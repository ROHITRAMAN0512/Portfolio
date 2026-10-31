import { describe, expect, test } from 'vitest'
import { projectBlocks } from './projectBlocks'
import { projects } from '../content/projects'
import type { Project } from '../content/types'

const minimal: Project = {
  id: 'tiny',
  title: 'Tiny',
  tagline: 'A tiny project',
  problem: 'A problem.',
  role: 'A role.',
  features: ['One feature'],
  stack: [{ group: 'Backend', items: ['Java'] }],
}

describe('projectBlocks', () => {
  test('the healthcare project shows every block it has data for, in order', () => {
    const healthcare = projects.find((p) => p.id === 'healthcare')!
    expect(projectBlocks(healthcare)).toEqual(['problem', 'role', 'features', 'facts', 'architecture', 'stack'])
  })

  test('a minimal project shows only its required blocks', () => {
    expect(projectBlocks(minimal)).toEqual(['problem', 'role', 'features', 'stack'])
  })

  test('empty media and links arrays are omitted', () => {
    expect(projectBlocks({ ...minimal, media: [], links: [], facts: [] })).toEqual([
      'problem',
      'role',
      'features',
      'stack',
    ])
  })

  test('media and links appear after stack when present', () => {
    const full: Project = {
      ...minimal,
      media: [{ src: '/projects/tiny/a.png', alt: 'Screen' }],
      links: [{ label: 'Repo', href: 'https://example.com', kind: 'repo' }],
    }
    expect(projectBlocks(full)).toEqual(['problem', 'role', 'features', 'stack', 'media', 'links'])
  })
})
