export interface ContactInput {
  name: string
  email: string
  projectType: string
  message: string
  /** Honeypot: real visitors never see or fill this. */
  botcheck: boolean
}

export type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(input: ContactInput): FieldErrors {
  const errors: FieldErrors = {}
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Please enter your name (2–80 characters).'
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (message.length < 20 || message.length > 2000) {
    errors.message = 'Please tell me a little more (20–2000 characters).'
  }
  return errors
}
