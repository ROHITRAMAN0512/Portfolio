import type { ContactInput } from './validate'

const MAX_HREF_LENGTH = 1800
const SHORTENED_NOTE = '…(message shortened, please paste the rest)'

export function buildMailto(to: string, input: ContactInput): string {
  const name = input.name.trim()
  const email = input.email.trim()
  const projectType = input.projectType.trim()
  const message = input.message.trim()

  const subject = encodeURIComponent(`Project enquiry from ${name}`)
  const hrefFor = (text: string) => {
    const body = `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${text}`
    return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`
  }

  const full = hrefFor(message)
  if (full.length <= MAX_HREF_LENGTH) return full

  // Shorten by whole code points (never split an emoji's surrogate pair):
  // binary-search the longest prefix that still fits with the note appended.
  const chars = Array.from(message)
  let lo = 0
  let hi = chars.length
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    if (hrefFor(chars.slice(0, mid).join('') + SHORTENED_NOTE).length <= MAX_HREF_LENGTH) lo = mid
    else hi = mid - 1
  }
  return hrefFor(chars.slice(0, lo).join('') + SHORTENED_NOTE)
}
