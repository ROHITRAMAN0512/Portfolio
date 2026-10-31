import { describe, expect, test } from 'vitest'
import { projects } from '../../content/projects'
import type { ArchEdge, ArchNode } from '../../content/types'

type Data = { nodes: ArchNode[]; edges: ArchEdge[] }

const diagrams: [string, Data][] = projects.flatMap((p): [string, Data][] =>
  p.architecture ? [[p.id, p.architecture]] : [],
)

test('there is at least one diagram to check', () => {
  expect(diagrams.length).toBeGreaterThan(0)
})

describe.each(diagrams)('%s diagram', (_name, d) => {
  test('node ids are unique', () => {
    const ids = d.nodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every edge endpoint matches a node id', () => {
    const ids = new Set(d.nodes.map((n) => n.id))
    for (const e of d.edges) {
      expect(ids.has(e.from)).toBe(true)
      expect(ids.has(e.to)).toBe(true)
    }
  })

  test('every node sits within 15-85 horizontally and 0-100 vertically so labels are not clipped', () => {
    for (const n of d.nodes) {
      expect(n.x).toBeGreaterThanOrEqual(15)
      expect(n.x).toBeLessThanOrEqual(85)
      expect(n.y).toBeGreaterThanOrEqual(0)
      expect(n.y).toBeLessThanOrEqual(100)
    }
  })

  test('every node has a label and a one-line note for hover, focus and screen readers', () => {
    for (const n of d.nodes) {
      expect(n.label.trim()).not.toBe('')
      expect(n.note?.trim()).toBeTruthy()
    }
  })

  test('no node text leaks access-control internals', () => {
    expect(JSON.stringify(d)).not.toMatch(/\b(JWT|tokens?|secrets?|passwords?|Hibernate)\b/i)
  })
})
