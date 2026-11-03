import { useEffect, useRef, useState } from 'react'

/**
 * Reports once the element has been scrolled into view, then stops watching.
 *
 * The latch is deliberate: the proof section reveals itself on first sight,
 * but replaying that every time it scrolls back past is noise.
 */
export default function useInView(threshold = 0.05) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    // Without the observer there is no reveal to stage, so show everything.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])




  return [ref, inView]
}
