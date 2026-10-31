export type NodeEvent =
  | { type: 'pointerenter' | 'pointerleave'; pointerType: string }
  | { type: 'focus'; focusVisible: boolean }
  | { type: 'blur' }
  | { type: 'click' }

/**
 * Which diagram node's note is showing, after `event` happens on node `id`.
 *
 * Only a mouse hovers, and only keyboard focus counts as focus: a tap on
 * Android fires touch-enter, then a pointer focus, then a click, and all three
 * must not cancel each other out. A click only ever shows the note; blur or
 * leave on one node never clears a different node that took over.
 */
export function nextActive(current: string | null, id: string, event: NodeEvent): string | null {
  switch (event.type) {
    case 'pointerenter':
      return event.pointerType === 'mouse' ? id : current
    case 'pointerleave':
      return event.pointerType === 'mouse' && current === id ? null : current
    case 'focus':
      return event.focusVisible ? id : current
    case 'blur':
      return current === id ? null : current
    case 'click':
      return id
  }
}
