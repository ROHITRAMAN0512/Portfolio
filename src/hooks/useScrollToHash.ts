import { useEffect } from 'react'
import { legacyHashTarget } from '../lib/legacyHash'

/**
 * The page is rendered by React after the browser has already tried (and
 * failed) to jump to #section, so a shared link like /#contact would land at
 * the top. Once the first render is in place, jump to the section once.
 * Old pop-up links (/#healthcare) are sent to the case study page instead.
 */
export function useScrollToHash() {
  useEffect(() => {
    const legacy = legacyHashTarget(window.location.hash)
    if (legacy) {
      window.location.replace(legacy)
      return
    }
    let id: string
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])
}
