import { describe, expect, test } from 'vitest'
import { heroDiagram } from './heroDiagram'
import { projects } from '../../content/projects'
import type { ArchEdge, ArchNode } from '../../content/types'

type Data = { nodes: ArchNode[]; edges: ArchEdge[] }

const diagrams: [string, Data][] = [
  ['hero', heroDiagram],
  ...projects.flatMap((p): [string, Data][] => (p.architecture ? [[p.id, p.architecture]] : [])),
]

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

  test('every node has a non-empty label', () => {
    for (const n of d.nodes) expect(n.label.trim()).not.toBe('')
  })
})

describe('hero diagram', () => {
  test('every node has a note', () => {
    for (const n of heroDiagram.nodes) expect(n.note?.trim()).toBeTruthy()
  })

  test('the request flow follows existing edges', () => {
    const ids = new Set(heroDiagram.nodes.map((n) => n.id))
    expect(heroDiagram.flow.length).toBeGreaterThanOrEqual(2)
    for (const id of heroDiagram.flow) expect(ids.has(id)).toBe(true)
    for (let i = 0; i < heroDiagram.flow.length - 1; i++) {
      const a = heroDiagram.flow[i]
      const b = heroDiagram.flow[i + 1]
      const connected = heroDiagram.edges.some(
        (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
      )
      expect(connected).toBe(true)
    }
  })
})
