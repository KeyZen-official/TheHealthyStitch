import { useCallback, useEffect, useState } from 'react'
import { LIFESTYLE_SLIDES } from '../assets.js'
import useReducedMotion from '../hooks/useReducedMotion.js'

/** How long each photograph holds before the next one crossfades in. */
const DWELL_MS = 2000

/**
 * Organic asymmetrical mask.
 * Declared in objectBoundingBox units so the curve scales with the element
 * and survives every breakpoint without redefining the path.
 */
function OrganicMaskDefs() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="organic-mask" clipPathUnits="objectBoundingBox">
          {/* Corner radii are deliberately uneven: a wide sweep top-left, a
              tighter shoulder top-right, a long curve bottom-right. */}
          <path
            d="M0.004,0.305
               C0.004,0.100 0.095,0.006 0.305,0.010
               C0.525,0.014 0.765,0.002 0.902,0.036
               C0.990,0.058 0.996,0.195 0.992,0.432
               C0.988,0.688 0.996,0.878 0.842,0.952
               C0.688,0.996 0.398,0.992 0.214,0.968
               C0.046,0.944 0.000,0.818 0.004,0.558
               Z"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

const pad = (n) => String(n).padStart(2, '0')

export default function LifestyleSlides() {
  const count = LIFESTYLE_SLIDES.length
  const reducedMotion = useReducedMotion()

  /**
   * `previous` is kept at full opacity underneath the incoming frame. Fading
   * the outgoing photo out at the same time as the incoming one fades in
   * leaves a gap where the panel colour shows through the middle of the
   * crossfade; holding it until the new frame is solid avoids that flash.
   */
  const [{ previous, active }, setFrame] = useState({ previous: null, active: 0 })

  /** Hover or keyboard focus parks the timer so a frame can be looked at. */
  const [held, setHeld] = useState(false)

  const advance = useCallback((next) => {
    setFrame((frame) =>
      next === frame.active ? frame : { previous: frame.active, active: next }
    )
  }, [])

  useEffect(() => {
    if (held || reducedMotion) return undefined

    const timer = window.setInterval(() => {
      setFrame(({ active: current }) => ({
        previous: current,
        active: (current + 1) % count,
      }))
    }, DWELL_MS)

    return () => window.clearInterval(timer)
  }, [held, reducedMotion, count])

  const park = () => setHeld(true)
  const release = () => setHeld(false)

  return (
    <div
      className="slides"
      role="group"
      aria-roledescription="slideshow"
      aria-label="Life on a plan from TheHealthyStitch"
    >
      <OrganicMaskDefs />

      <div
        className="slides__frame"
        onMouseEnter={park}
        onMouseLeave={release}
      >
        {LIFESTYLE_SLIDES.map((slide, index) => (
          <img
            key={slide.id}
            className={[
              'slides__image',
              index === active && 'is-active',
              index === previous && 'is-previous',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ objectPosition: slide.focus, filter: slide.tone }}
            src={slide.src}
            /* Only the frame on screen is described; the two parked
               underneath it would otherwise be read out as well. */
            alt={index === active ? slide.alt : ''}
            width="2200"
            height="1467"
            loading="eager"
            decoding="async"
          />
        ))}
      </div>

      <div className="slides__meta">
        <p className="slides__caption">
          <span className="slides__index">{pad(active + 1)} —</span>
          {LIFESTYLE_SLIDES[active].caption}
        </p>

        <div className="slides__stitches">
          {LIFESTYLE_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`slides__stitch${index === active ? ' is-active' : ''}`}
              onClick={() => advance(index)}
              onFocus={park}
              onBlur={release}
              aria-label={`${pad(index + 1)} — ${slide.caption}`}
              aria-current={index === active}
            >
              <span className="slides__stitch-bar" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
