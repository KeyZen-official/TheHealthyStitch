import { useEffect, useState } from 'react'

/**
 * Whether a media query matches, kept in sync as the screen changes (a phone
 * turned on its side, a window resized).
 *
 * Read on the first render, not after it: the site renders in the browser
 * only, so there is no server render to disagree with, and the component
 * never paints in the wrong layout first.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])

  return matches
}
