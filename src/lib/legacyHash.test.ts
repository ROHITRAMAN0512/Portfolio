import { describe, expect, test } from 'vitest'
import { legacyHashTarget } from './legacyHash'

describe('legacyHashTarget', () => {
  test('the old pop-up link leads to the case study page', () => {
    expect(legacyHashTarget('#healthcare')).toBe('/work/healthcare/')
  })

  test.each(['', '#', '#nope', '#Healthcare', '#healthcare/', '#work', '#contact'])(
    '%j is not a legacy link',
    (hash) => {
      expect(legacyHashTarget(hash)).toBeNull()
    },
  )

  test('malformed percent-encoding returns null without throwing', () => {
    expect(() => legacyHashTarget('#%E0%A4%A')).not.toThrow()
    expect(legacyHashTarget('#%E0%A4%A')).toBeNull()
  })

  test('an encoded form of the legacy id still matches', () => {
    expect(legacyHashTarget('#health%63are')).toBe('/work/healthcare/')
  })
})
