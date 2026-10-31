import type { ReactElement } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { Button } from './Button'

type AnchorProps = { href?: string; onClick?: () => void; target?: string; rel?: string }

describe('Button', () => {
  test('a link button hands its onClick to the anchor (the mobile menu relies on this to close)', () => {
    const onClick = vi.fn()
    const el = Button({ href: '#contact', onClick, children: 'Talk' }) as ReactElement<AnchorProps>
    expect(el.type).toBe('a')
    expect(el.props.href).toBe('#contact')
    expect(el.props.onClick).toBe(onClick)
  })

  test('an external link opens safely in a new tab', () => {
    const el = Button({ href: 'https://example.com', external: true, children: 'Go' }) as ReactElement<AnchorProps>
    expect(el.props.target).toBe('_blank')
    expect(el.props.rel).toBe('noopener noreferrer')
  })

  test('without href it renders a button that keeps its onClick', () => {
    const onClick = vi.fn()
    const el = Button({ onClick, children: 'Go' }) as ReactElement<AnchorProps>
    expect(el.type).toBe('button')
    expect(el.props.onClick).toBe(onClick)
  })
})
