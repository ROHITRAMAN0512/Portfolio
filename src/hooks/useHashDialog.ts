import { useCallback, useEffect, useRef, useState } from 'react'
import { parseProjectHash, projectHash } from '../lib/hash'

/**
 * Keeps an open dialog and the URL hash (#<id>) in step.
 * open() pushes a history entry so Back closes the dialog; a page loaded
 * directly on #<id> opens it too. Unknown or malformed hashes open nothing.
 */
export function useHashDialog(ids: readonly string[]) {
  const key = ids.join('|')
  const [activeId, setActiveId] = useState<string | null>(() => parseProjectHash(window.location.hash, ids))
  const pushedRef = useRef(false)

  useEffect(() => {
    const known = key === '' ? [] : key.split('|')
    const sync = () => {
      const id = parseProjectHash(window.location.hash, known)
      if (id === null) pushedRef.current = false
      setActiveId(id)
    }
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [key])

  const open = useCallback((id: string) => {
    history.pushState(null, '', projectHash(id))
    pushedRef.current = true
    setActiveId(id)
  }, [])

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false
      history.back() // popstate then clears activeId
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      setActiveId(null)
    }
  }, [])

  return { activeId, open, close }
}
