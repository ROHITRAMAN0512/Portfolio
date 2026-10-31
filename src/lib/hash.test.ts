import { describe, expect, test } from 'vitest'
import { parseProjectHash, projectHash } from './hash'

const ids = ['healthcare']

describe('parseProjectHash', () => {
  test('a known id returns that id', () => {
    expect(parseProjectHash('#healthcare', ids)).toBe('healthcare')
  })

  test.each(['', '#', '#nope', '#Healthcare', '#healthcare/'])('%j returns null', (hash) => {
    expect(parseProjectHash(hash, ids)).toBeNull()
  })

  test('malformed percent-encoding returns null without throwing', () => {
    expect(() => parseProjectHash('#%E0%A4%A', ids)).not.toThrow()
    expect(parseProjectHash('#%E0%A4%A', ids)).toBeNull()
  })

  test('an encoded known id still matches', () => {
    expect(parseProjectHash('#health%63are', ids)).toBe('healthcare')
  })
})

describe('projectHash', () => {
  test('prefixes the id with #', () => {
    expect(projectHash('healthcare')).toBe('#healthcare')
  })
})
