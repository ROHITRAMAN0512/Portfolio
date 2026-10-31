import { buildMailto } from './mailto'
import type { ContactInput } from './validate'

const ENDPOINT = 'https://api.web3forms.com/submit'

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'mailto'; href: string }
  | { status: 'error'; message: string; mailtoHref: string }

export interface SubmitOptions {
  accessKey?: string
  mailtoTo: string
  fetchImpl?: typeof fetch
}

const GENERIC_ERROR = 'The message could not be sent.'

export async function submitContact(input: ContactInput, opts: SubmitOptions): Promise<SubmitResult> {
  // Bots fill the hidden field: pretend it worked and send nothing.
  if (input.botcheck) return { status: 'sent' }

  const clean: ContactInput = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim(),
    projectType: input.projectType.trim(),
    message: input.message.trim(),
  }
  const mailtoHref = buildMailto(opts.mailtoTo, clean)

  if (!opts.accessKey) return { status: 'mailto', href: mailtoHref }

  const doFetch = opts.fetchImpl ?? fetch
  try {
    const res = await doFetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: opts.accessKey,
        name: clean.name,
        email: clean.email,
        message: clean.message,
        project_type: clean.projectType,
        subject: `Project enquiry from ${clean.name}`,
        from_name: clean.name,
      }),
    })
    const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null
    if (res.ok && data?.success) return { status: 'sent' }
    return { status: 'error', message: data?.message ?? GENERIC_ERROR, mailtoHref }
  } catch {
    return { status: 'error', message: GENERIC_ERROR, mailtoHref }
  }
}
