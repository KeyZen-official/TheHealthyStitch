import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Reads the OS "reduce motion" preference and keeps the component in sync if
 * the user changes it mid-session.
 *
 * Both moving pieces on this page (the hero slideshow and the plate dial) run
 * on timers, so they need to read this at render time rather than once inside
 * an effect.
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const sync = (event) => setReduced(event.matches)

    setReduced(media.matches)
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return reduced
}
