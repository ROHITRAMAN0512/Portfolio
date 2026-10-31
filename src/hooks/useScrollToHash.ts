import { useEffect } from 'react'

/**
 * The page is rendered by React after the browser has already tried (and
 * failed) to jump to #section, so a shared link like /#contact would land at
 * the top. Once the first render is in place, jump to the section once.
 */
export function useScrollToHash() {
  useEffect(() => {
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
