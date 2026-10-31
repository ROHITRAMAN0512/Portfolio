import { describe, expect, test } from 'vitest'
import { nextActive, type NodeEvent } from './nodeFocus'

/** Plays a sequence of events on one node and returns the active id after each. */
function play(id: string, events: NodeEvent[], start: string | null = null) {
  const states: (string | null)[] = []
  let active = start
  for (const e of events) {
    active = nextActive(active, id, e)
    states.push(active)
  }
  return states
}

describe('nextActive', () => {
  test('a single tap on Android (touch enter, non-keyboard focus, click) leaves the note showing', () => {
    // Chrome on Android fires these three, in this order, for one tap.
    const states = play('api', [
      { type: 'pointerenter', pointerType: 'touch' },
      { type: 'focus', focusVisible: false },
      { type: 'click' },
    ])
    expect(states[states.length - 1]).toBe('api')
  })

  test('hovering with a mouse shows the note, clicking keeps it, leaving clears it', () => {
    expect(
      play('api', [
        { type: 'pointerenter', pointerType: 'mouse' },
        { type: 'click' },
        { type: 'pointerleave', pointerType: 'mouse' },
      ]),
    ).toEqual(['api', 'api', null])
  })

  test('keyboard focus shows the note and blur clears it', () => {
    expect(
      play('api', [
        { type: 'focus', focusVisible: true },
        { type: 'blur' },
      ]),
    ).toEqual(['api', null])
  })

  test('touch hover and pointer-focus alone do not show anything', () => {
    expect(
      play('api', [
        { type: 'pointerenter', pointerType: 'touch' },
        { type: 'focus', focusVisible: false },
      ]),
    ).toEqual([null, null])
  })

  test('tapping a second node switches to it', () => {
    expect(nextActive('api', 'auth', { type: 'click' })).toBe('auth')
  })

  test('blur or leave on one node does not clear another node that became active', () => {
    expect(nextActive('auth', 'api', { type: 'blur' })).toBe('auth')
    expect(nextActive('auth', 'api', { type: 'pointerleave', pointerType: 'mouse' })).toBe('auth')
  })
})
