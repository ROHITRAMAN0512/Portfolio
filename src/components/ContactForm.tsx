import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { site } from '../content/site'
import { validateContact, type ContactInput, type FieldErrors } from '../lib/validate'
import { submitContact } from '../lib/submitContact'
import { Button } from './ui/Button'

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error'
type FieldName = 'name' | 'email' | 'message'

const PROJECT_TYPES = ['Backend or API build', 'Integration', 'Bug fix or maintenance', 'Something else']
const FIELD_ORDER: FieldName[] = ['name', 'email', 'message']

const emptyValues: ContactInput = { name: '', email: '', projectType: '', message: '', botcheck: false }

const inputClass =
  'w-full rounded-lg border bg-surface px-4 py-3 text-base text-text placeholder:text-muted/70 transition-colors'

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(emptyValues)
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [notice, setNotice] = useState<{ message: string; href: string } | null>(null)
  const sendingRef = useRef(false)
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({})
  const sentRef = useRef<HTMLDivElement>(null)

  const errors: FieldErrors = validateContact(values)
  const visibleError = (f: FieldName) => (touched[f] ? errors[f] : undefined)

  useEffect(() => {
    if (status === 'sent') sentRef.current?.focus()
  }, [status])

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (sendingRef.current) return

    setTouched({ name: true, email: true, message: true })
    const firstInvalid = FIELD_ORDER.find((f) => errors[f])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }

    sendingRef.current = true
    setStatus('sending')
    setNotice(null)
    try {
      const result = await submitContact(values, {
        accessKey: import.meta.env.VITE_WEB3FORMS_KEY || undefined,
        mailtoTo: site.email,
      })
      if (result.status === 'sent') {
        setStatus('sent')
      } else if (result.status === 'mailto') {
        setNotice({ message: 'Your email app should open with your message ready.', href: result.href })
        setStatus('mailto')
        window.location.href = result.href
      } else {
        setNotice({ message: `${result.message} Your text is still here.`, href: result.mailtoHref })
        setStatus('error')
      }
    } finally {
      sendingRef.current = false
    }
  }

  if (status === 'sent') {
    return (
      <div
        ref={sentRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-3 rounded-2xl border border-accent/40 bg-surface p-6 outline-none sm:p-8"
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-accent" />
        <h3 className="font-display text-3xl text-text">Message sent.</h3>
        <p className="text-muted">Thanks for getting in touch. I&apos;ll reply to {values.email.trim()} soon.</p>
      </div>
    )
  }

  const field = (name: FieldName) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    'aria-invalid': visibleError(name) ? (true as const) : undefined,
    'aria-describedby': visibleError(name) ? `contact-${name}-error` : undefined,
    onChange: (e: { target: { value: string } }) => set(name, e.target.value),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    className: `${inputClass} ${visibleError(name) ? 'border-danger' : 'border-line'}`,
  })

  const errorLine = (name: FieldName) =>
    visibleError(name) ? (
      <p id={`contact-${name}-error`} className="mt-2 text-sm text-danger">
        {errors[name]}
      </p>
    ) : null

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm text-text">
          Name <span className="text-muted">(required)</span>
        </label>
        <input
          {...field('name')}
          ref={(el) => {
            fieldRefs.current.name = el
          }}
          type="text"
          autoComplete="name"
          aria-required="true"
        />
        {errorLine('name')}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm text-text">
          Email <span className="text-muted">(required)</span>
        </label>
        <input
          {...field('email')}
          ref={(el) => {
            fieldRefs.current.email = el
          }}
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-required="true"
        />
        {errorLine('email')}
      </div>

      <div>
        <label htmlFor="contact-projectType" className="mb-2 block text-sm text-text">
          Project type <span className="text-muted">(optional)</span>
        </label>
        <select
          id="contact-projectType"
          name="projectType"
          value={values.projectType}
          onChange={(e) => set('projectType', e.target.value)}
          className={`${inputClass} border-line`}
        >
          <option value="">Select a type</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm text-text">
          Message <span className="text-muted">(required)</span>
        </label>
        <textarea
          {...field('message')}
          ref={(el) => {
            fieldRefs.current.message = el
          }}
          rows={6}
          aria-required="true"
          placeholder="What does the product do, what is broken or missing, and when do you need it?"
        />
        {errorLine('message')}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tick it. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        checked={values.botcheck}
        onChange={(e) => set('botcheck', e.target.checked)}
      />

      {notice && (
        <div
          role={status === 'error' ? 'alert' : 'status'}
          className={`rounded-lg border p-4 text-sm ${
            status === 'error' ? 'border-danger/50 text-text' : 'border-line text-muted'
          }`}
        >
          <p>{notice.message}</p>
          <p className="mt-2">
            <a href={notice.href} className="text-accent underline underline-offset-4">
              {status === 'error' ? 'Send by email instead' : "If nothing opened, use this link"}
            </a>
          </p>
        </div>
      )}

      <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
        {status === 'sending' ? 'Sending…' : 'Send message'}
        <Send aria-hidden="true" className="size-4" />
      </Button>
    </form>
  )
}
