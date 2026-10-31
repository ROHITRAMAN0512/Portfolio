/** Returns the project id a URL hash points at, or null. Never throws. */
export function parseProjectHash(hash: string, ids: readonly string[]): string | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (raw === '') return null
  let decoded: string
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    return null
  }
  return ids.includes(decoded) ? decoded : null
}

export function projectHash(id: string): string {
  return `#${id}`
}
