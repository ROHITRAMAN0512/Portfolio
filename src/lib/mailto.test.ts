import { describe, expect, test } from 'vitest'
import { buildMailto } from './mailto'
import type { ContactInput } from './validate'

const input: ContactInput = {
  name: 'Asha',
  email: 'asha@x.com',
  projectType: 'Integration',
  message: 'Hello there, I need an API integration done.',
  botcheck: false,
}

const bodyOf = (href: string) => new URL(href).searchParams.get('body') ?? ''

describe('buildMailto', () => {
  test('plain ASCII input produces the expected subject and body', () => {
    const href = buildMailto('me@x.com', input)
    expect(href.startsWith('mailto:me@x.com?subject=Project%20enquiry%20from%20Asha&body=')).toBe(true)
    expect(bodyOf(href)).toBe(
      'Name: Asha\nEmail: asha@x.com\nProject type: Integration\n\nHello there, I need an API integration done.',
    )
  })

  test('a newline in the message is encoded as %0A', () => {
    const href = buildMailto('me@x.com', { ...input, message: 'First line of the message.\nSecond line here.' })
    expect(href).toContain('%0A')
    expect(href).not.toContain('\n')
  })

  test('a non-ASCII message round-trips through decoding', () => {
    const message = 'நன்றி ₹ 5000 — please call me back soon'
    const href = buildMailto('me@x.com', { ...input, message })
    expect(bodyOf(href).endsWith(message)).toBe(true)
  })

  test('a 2000-character message keeps the link under 1800 characters and ends with the note', () => {
    const href = buildMailto('me@x.com', { ...input, message: 'word '.repeat(400).trim() })
    expect(href.length).toBeLessThanOrEqual(1800)
    expect(bodyOf(href).endsWith('…(message shortened, please paste the rest)')).toBe(true)
  })

  test('a long emoji message does not throw and stays under 1800 characters', () => {
    const href = buildMailto('me@x.com', { ...input, message: '😀'.repeat(1000) })
    expect(href.length).toBeLessThanOrEqual(1800)
    expect(() => decodeURIComponent(href)).not.toThrow()
  })
})
