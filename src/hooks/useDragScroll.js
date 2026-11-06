import { useEffect } from 'react'

/**
 * Lets a mouse drag a sideways scroller, the way a finger or a trackpad
 * already can. Touch and trackpads scroll the row natively, so only a mouse
 * is handled here.
 *
 * - A press becomes a drag only after a few pixels of movement, so a plain
 *   click still behaves as a click.
 * - While dragging, the row carries `is-dragging`, and the CSS turns scroll
 *   snapping off: a snapping row fights the pointer.
 * - On release the row glides to the nearest item, leaning the way it was
 *   dragged, so a short flick still moves on by one. Snapping stays off
 *   (`is-settling`) until the row lands, so it cannot jump.
 *
 * `item` selects the things the row stops on. They must be laid out one
 * step apart and positioned against the list that holds them, with the first
 * one's snap point at the start of the row.
 */
export default function useDragScroll(ref, { item, reduced = false }) {
  useEffect(() => {
    const row = ref.current
    if (!row) return undefined

    let drag = null
    let timer = 0

    const stepOf = () => {
      const items = row.querySelectorAll(item)
      return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : row.clientWidth
    }

    const settled = () => {
      window.clearTimeout(timer)
      row.removeEventListener('scrollend', settled)
      row.classList.remove('is-settling')
    }

    const down = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      drag = { id: event.pointerId, x: event.clientX, left: row.scrollLeft, moved: false }
    }

    const move = (event) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return
        drag.moved = true
        row.setPointerCapture(event.pointerId)
        row.classList.add('is-dragging')
        window.getSelection()?.removeAllRanges()
      }
      row.scrollLeft = drag.left - dx
    }

    const up = (event) => {
      if (!drag || event.pointerId !== drag.id) return
      const { moved, left, x } = drag
      drag = null
      if (!moved) return

      const dx = event.type === 'pointercancel' ? 0 : event.clientX - x
      const step = stepOf()
      const max = row.scrollWidth - row.clientWidth
      const from = Math.round(left / step)
      let to = Math.round(row.scrollLeft / step)
      if (to === from && Math.abs(dx) > step * 0.15) to += dx < 0 ? 1 : -1

      settled()
      row.classList.remove('is-dragging')
      row.classList.add('is-settling')
      row.addEventListener('scrollend', settled)
      // scrollend never fires if the row is already where it should land,
      // and older browsers do not send it at all.
      timer = window.setTimeout(settled, 700)
      row.scrollTo({
        left: Math.min(max, Math.max(0, to * step)),
        behavior: reduced ? 'auto' : 'smooth',
      })
    }

    // Otherwise a drag that starts on selected text picks the text up.
    const noNativeDrag = (event) => event.preventDefault()

    row.addEventListener('pointerdown', down)
    row.addEventListener('pointermove', move)
    row.addEventListener('pointerup', up)
    row.addEventListener('pointercancel', up)
    row.addEventListener('dragstart', noNativeDrag)
    return () => {
      row.removeEventListener('pointerdown', down)
      row.removeEventListener('pointermove', move)
      row.removeEventListener('pointerup', up)
      row.removeEventListener('pointercancel', up)
      row.removeEventListener('dragstart', noNativeDrag)
      row.classList.remove('is-dragging')
      settled()
    }
  }, [ref, item, reduced])
}
