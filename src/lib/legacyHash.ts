import { site } from '../content/site'

/**
 * The case study used to open as a pop-up at /#healthcare. Old shared links
 * should now lead to its page. Returns the page path, or null if the hash is
 * not a legacy link. Never throws.
 */
export function legacyHashTarget(hash: string): string | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (raw === '') return null
  let decoded: string
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    return null
  }
  return decoded === 'healthcare' ? site.pages.healthcare.path : null
}
