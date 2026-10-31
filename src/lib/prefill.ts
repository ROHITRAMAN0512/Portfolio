type Listener = () => void

/** A tiny shared value with subscribers, shaped for React's useSyncExternalStore. */
export function createPrefill() {
  let current = ''
  const listeners = new Set<Listener>()
  return {
    get: () => current,
    set(value: string) {
      if (value === current) return
      current = value
      listeners.forEach((l) => l())
    },
    subscribe(listener: Listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/** The project type a visitor picked by clicking "Discuss this" on a service. */
export const projectTypePrefill = createPrefill()
