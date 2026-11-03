import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import useReducedMotion from '../hooks/useReducedMotion.js'

const pad = (n) => String(n).padStart(2, '0')

/** Which photographs are on screen, and whether the row can move either way. */
function measure(track) {
  const slides = track.querySelectorAll('.shift-gallery__slide')
  if (!slides.length) return null

  const first = slides[0]
  const step = slides.length > 1 ? slides[1].offsetLeft - first.offsetLeft : first.offsetWidth
  const gap = step - first.offsetWidth
  const x = track.scrollLeft
  const max = track.scrollWidth - track.clientWidth

  // One across on a phone held upright, several on a phone on its side.
  const across = Math.max(1, Math.floor((track.clientWidth - first.offsetLeft + gap) / step + 0.02))
  const from = Math.min(slides.length - 1, Math.max(0, Math.round(x / step)))

  return {
    from,
    to: Math.min(slides.length - 1, from + across - 1),
    atStart: x <= 1,
    atEnd: x >= max - 1,
  }
}

const same = (a, b) =>
  a.from === b.from && a.to === b.to && a.atStart === b.atStart && a.atEnd === b.atEnd

/**
 * The results band on a phone: the same photographs as the wheel, in a row
 * you swipe through.
 *
 * The wheel does not work on a phone. Below 640px its cards are capped at a
 * third of the screen, so each half of a before/after pair is about 60px
 * wide, and a touch screen has no scroll wheel to turn it: a swipe scrolls
 * the page instead. Here each photograph is nearly the width of the screen,
 * and the row is an ordinary sideways scroller with CSS snap points, so
 * swiping, momentum and the page's own up-and-down scrolling are all left
 * to the browser.
 *
 * The edge of the next photograph shows at the right, which tells people
 * they can swipe. The arrows are for anyone who isn't swiping (a mouse, a
 * keyboard, a switch). The counter is a polite live region, so a screen
 * reader hears where it has landed.
 */
export default function TransformationsGallery({ items, ratio, label, className }) {
  const trackRef = useRef(null)
  const reduced = useReducedMotion()
  const [view, setView] = useState({
    from: 0,
    to: 0,
    atStart: true,
    atEnd: items.length < 2,
  })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    let frame = 0

    const read = () => {
      frame = 0
      const next = measure(track)
      if (next) setView((prev) => (same(prev, next) ? prev : next))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    track.addEventListener('scroll', schedule, { passive: true })
    const resize = new ResizeObserver(schedule)
    resize.observe(track)
    return () => {
      track.removeEventListener('scroll', schedule)
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [items.length])

  /** One photograph left or right. Snap points make it land square. */
  const go = (direction) => {
    const track = trackRef.current
    if (!track) return
    if ((direction < 0 && view.atStart) || (direction > 0 && view.atEnd)) return

    const slides = track.querySelectorAll('.shift-gallery__slide')
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0
    track.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' })
  }

  const count = items.length
  const single = view.from === view.to
  const shown = single ? pad(view.from + 1) : `${pad(view.from + 1)}–${pad(view.to + 1)}`
  const spoken = single
    ? `Photograph ${view.from + 1} of ${count}: ${items[view.from]?.title}`
    : `Photographs ${view.from + 1} to ${view.to + 1} of ${count}`

  return (
    <div className={`shift-gallery ${className ?? ''}`} style={{ '--ratio': ratio }}>
      {/* Focusable, so the arrow keys scroll it once it has focus. */}
      <div
        ref={trackRef}
        className="shift-gallery__track"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {/* role="list" because Safari drops list semantics from a list that
            is styled list-style: none. */}
        <ul className="shift-gallery__list" role="list">
          {items.map((item, i) => (
            <li className="shift-gallery__slide" key={item.id ?? item.title}>
              <figure className="shift-gallery__figure">
                <div className="shift-gallery__frame">
                  <img
                    src={item.image}
                    alt={item.alt ?? item.title}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <figcaption className="shift-gallery__caption">{item.title}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="shift-gallery__controls">
        <p className="shift-gallery__count" aria-live="polite">
          <span aria-hidden="true">
            <span className="shift-gallery__count-now">{shown}</span> / {pad(count)}
          </span>
          <span className="u-sr">{spoken}</span>
        </p>

        <div className="shift-gallery__arrows">
          {/* aria-disabled rather than disabled: a disabled button drops the
              focus of whoever just pressed it to reach the end. */}
          <button
            type="button"
            className="shift-gallery__arrow"
            aria-label="Previous photograph"
            aria-disabled={view.atStart}
            onClick={() => go(-1)}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="shift-gallery__arrow"
            aria-label="Next photograph"
            aria-disabled={view.atEnd}
            onClick={() => go(1)}
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
