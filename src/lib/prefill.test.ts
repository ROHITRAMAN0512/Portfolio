import { describe, expect, test, vi } from 'vitest'
import { createPrefill } from './prefill'

describe('createPrefill', () => {
  test('starts empty and returns what was set', () => {
    const p = createPrefill()
    expect(p.get()).toBe('')
    p.set('Integration')
    expect(p.get()).toBe('Integration')
  })

  test('tells subscribers once per real change', () => {
    const p = createPrefill()
    const listener = vi.fn()
    p.subscribe(listener)
    p.set('Integration')
    p.set('Integration')
    p.set('Bug fix or maintenance')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  test('stops telling a subscriber after it unsubscribes', () => {
    const p = createPrefill()
    const listener = vi.fn()
    const off = p.subscribe(listener)
    off()
    p.set('Integration')
    expect(listener).not.toHaveBeenCalled()
  })
})
