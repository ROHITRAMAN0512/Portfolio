import { describe, expect, test } from 'vitest'
import { validateContact, type ContactInput } from './validate'

const valid: ContactInput = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  projectType: 'Integration',
  message: 'We need a billing API built for our clinic app.',
  botcheck: false,
}
const make = (over: Partial<ContactInput>): ContactInput => ({ ...valid, ...over })

describe('validateContact', () => {
  test('valid input has no errors', () => {
    expect(validateContact(valid)).toEqual({})
  })

  test('a whitespace-only name is invalid', () => {
    expect(validateContact(make({ name: '   ' })).name).toBe('Please enter your name (2–80 characters).')
  })

  test('a name that is 1 character after trimming is invalid', () => {
    expect(validateContact(make({ name: ' A ' })).name).toBeDefined()
  })

  test('name length boundaries are 2 to 80', () => {
    expect(validateContact(make({ name: 'Al' })).name).toBeUndefined()
    expect(validateContact(make({ name: 'a'.repeat(80) })).name).toBeUndefined()
    expect(validateContact(make({ name: 'a'.repeat(81) })).name).toBeDefined()
  })

  test('email without a dot after the @ is invalid', () => {
    expect(validateContact(make({ email: 'a@b' })).email).toBe('Please enter a valid email address.')
  })

  test('email with surrounding spaces is valid', () => {
    expect(validateContact(make({ email: ' me@x.com ' })).email).toBeUndefined()
  })

  test('email longer than 254 characters is invalid', () => {
    expect(validateContact(make({ email: `${'a'.repeat(250)}@x.com` })).email).toBeDefined()
  })

  test('a message of 20 spaces is invalid', () => {
    expect(validateContact(make({ message: ' '.repeat(20) })).message).toBe(
      'Please tell me a little more (20–2000 characters).',
    )
  })

  test('message length boundaries are 20 to 2000 after trimming', () => {
    expect(validateContact(make({ message: 'a'.repeat(19) })).message).toBeDefined()
    expect(validateContact(make({ message: 'a'.repeat(20) })).message).toBeUndefined()
    expect(validateContact(make({ message: 'a'.repeat(2000) })).message).toBeUndefined()
    expect(validateContact(make({ message: 'a'.repeat(2001) })).message).toBeDefined()
  })

  test('two bad fields give two error keys', () => {
    const errors = validateContact(make({ name: '', email: 'nope' }))
    expect(Object.keys(errors).sort()).toEqual(['email', 'name'])
  })
})
