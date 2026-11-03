'use client'

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.

import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string
  /** Cover art. Any src an <img> takes. */
  image: string
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string
  /** Describes the picture for anyone who cannot see it. Falls back to title. */
  alt?: string
}

export interface WorksWheelProps
  extends Omit<React.ComponentPropsWithoutRef<'section'>, 'children'> {
  items: WorksWheelItem[]
  /** Sits in the middle of the ring. @default undefined */
  label?: string
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string
  /**
   * Card width / height. The default is the landscape crop cover art wants;
   * override it when the pictures are portrait, because the card fills by
   * `object-cover` and a tall subject in a wide card loses its top and bottom.
   * @default 1.45
   */
  ratio?: number
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38 // front card height, of the stage
const CARD_MAX_W = 0.34 // ... but never wider than this much of the stage
const CARD_RATIO = 1.45 // card width / height
const STEP = 40 // degrees between cards on the drum
const DRUM = 2.22 // drum radius, in card heights - and everything below likewise
const LENS = 2.7 // perspective distance
const RING_R = 1.14 // ring radius

/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82

const TITLE = 0.124 // ring label and front-card title
const INDEX = 0.04 // the index down the right-hand side

/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900
const DRAG_UNITS = 420

/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140

/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Stage = { w: number; h: number }

const rad = (deg: number) => (deg * Math.PI) / 180

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) => -bow * (1 - Math.cos(rad(drumDeg)))

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    `rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    `rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  )
}

export function WorksWheel({
  items,
  label = "Works '26",
  action = 'View',
  ratio = CARD_RATIO,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const wheelRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLElement | null)[]>([])
  const labelRef = React.useRef<HTMLParagraphElement>(null)
  const titleRef = React.useRef<HTMLParagraphElement>(null)

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0)
  const target = React.useRef(0)
  const [active, setActive] = React.useState(0)
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 })

  const count = items.length
  const last = Math.max(count - 1, 0)

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch. Reduced motion drops the
  // easing, so the wheel lands where it is put instead of gliding there.
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduced(query.matches)
    read()
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])

  React.useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const metrics = React.useMemo(() => {
    const { w, h } = stage
    const cardW = Math.min(h * CARD_H * ratio, w * CARD_MAX_W)
    const cardH = cardW / ratio
    const drumR = cardH * DRUM
    const ringR = cardH * RING_R

    // Shrink the ring's cards until the circle reads as a closed loop rather
    // than beads on a wire, however many pieces the wheel is given.
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1

    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      // Both are a fraction of the card, which holds its proportions on a
      // wide stage but collapses on a narrow one: the card is capped by width
      // there, so on a 390px phone the index would compute to under 4px and
      // the title to 11px. The floors are a legibility limit, not a style.
      title: Math.max(20, cardH * TITLE),
      index: Math.max(11, cardH * INDEX),
    }
  }, [stage, count, ratio])

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    if (!stage.h) return
    let frame = 0
    const { ringR, ringScale, drumR, bow } = metrics

    const draw = () => {
      frame = requestAnimationFrame(draw)

      const gap = target.current - turn.current
      if (Math.abs(gap) < 0.0005) turn.current = target.current
      else turn.current += gap * (reduced ? 1 : EASE)

      const t = turn.current
      const m = clamp(t, 0, 1)
      const pos = Math.max(0, t - 1)

      // The drum is pulled back so its front face lands on the picture plane.
      // That set-back has to arrive with the drum, or the ring would sit at the
      // far side of the perspective and render at half its size.
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos
        const drumDeg = d * STEP
        const card = cardRefs.current[i]

        if (card) {
          card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m)

          // Culled by distance, not by angle: at a full turn the far side comes
          // back round to face us, and everything past the neighbours lands on
          // the vanishing point in a heap.
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? '0' : '1'
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2))
        }

        const face = card?.firstElementChild as HTMLElement | null
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m)
      if (titleRef.current) titleRef.current.style.opacity = String(m)

      const near = clamp(Math.round(pos), 0, last)
      setActive((prev) => (prev === near ? prev : near))
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [metrics, stage.h, count, last, reduced])

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1)
    },
    [last],
  )

  // Native listener, because the wheel has to be cancellable - and it only
  // cancels while it still has somewhere to go, so the page scrolls on at
  // either end instead of trapping the reader.
  React.useEffect(() => {
    const el = stageRef.current
    if (!el) return

    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS
      if (next > 0 && next < last + 1) event.preventDefault()
      to(next)

      // A wheel gesture arrives as a burst of events with no end of its own, so
      // the rest position is whatever notch it happened to stop on. Left there
      // the drum sits between two cards - nothing at the front, and the pair
      // either side of the gap both turned half away. Settle onto an item.
      window.clearTimeout(settling.current)
      settling.current = window.setTimeout(() => to(Math.round(target.current)), SETTLE)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.clearTimeout(settling.current)
    }
  }, [to, last])

  const drag = React.useRef<number | null>(null)
  const settling = React.useRef(0)

  return (
    <section
      className={cn(
        'bg-background text-foreground relative isolate w-full overflow-hidden',
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        role="group"
        tabIndex={0}
        aria-label={label}
        aria-roledescription="wheel"
        /* touch-action stays pan-y, so a thumb can always scroll the page past
           this section rather than being held by it. A touch drag turns the
           wheel and scrolls the page at the same time, which is why the index
           exists as a second route to any one item.

           Height: the ring is about 2.9 card heights tall and the card is 38%
           of the stage, so the ring wants ~1.1x the stage height and bleeds a
           little off the top and bottom - which is the intent. On a narrow
           stage the card is capped by width instead, the whole wheel scales
           down with it and the ring ends up swimming in empty height, so there
           the stage is sized off its own width rather than the viewport. */
        className="relative h-[min(88vw,520px)] min-h-[300px] w-full cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing sm:h-[min(100svh,860px)] sm:min-h-[520px]"
        style={{ perspective: metrics.depth ? `${metrics.depth}px` : undefined }}
        onPointerDown={(event) => {
          drag.current = event.clientY
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return
          to(target.current + (drag.current - event.clientY) / DRAG_UNITS)
          drag.current = event.clientY
        }}
        onPointerUp={() => {
          // Land on an item rather than between two.
          drag.current = null
          if (target.current > 1) to(Math.round(target.current))
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') to(Math.round(target.current) + 1)
          else if (event.key === 'ArrowUp') to(Math.round(target.current) - 1)
          else return
          event.preventDefault()
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const Tag = (item.href ? 'a' : 'div') as 'a'

            return (
              <Tag
                key={item.title}
                href={item.href}
                ref={(node) => {
                  cardRefs.current[i] = node
                }}
                className="group absolute [backface-visibility:hidden]"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                <div className="bg-card ring-border relative h-full w-full overflow-hidden rounded-[3px] shadow-[0_26px_60px_-18px_rgba(0,0,0,0.55)] ring-1">
                  <img
                    src={item.image}
                    alt={item.alt ?? item.title}
                    draggable={false}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                  {action && item.href ? (
                    <span className="bg-background/85 text-foreground pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] uppercase opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      {action}
                    </span>
                  ) : null}
                </div>
              </Tag>
            )
          })}
        </div>
      </div>

      {/* Ring title and front-card title trade places across the transition.
          Type is sized off the measured stage, not vh, so the wheel keeps its
          proportions inside a card as well as at full bleed. */}
      <p
        ref={labelRef}
        aria-hidden="true"
        className="font-display pointer-events-none absolute inset-0 m-0 grid place-items-center text-center leading-[1.05] tracking-[-0.01em]"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </p>

      {/* Under the front card rather than beside it. Beside only works while
          the title is short enough to clear the index list on the right; a
          real one ("Transformation No. 01", or a name and a figure) runs
          straight into it. Centred under the card it has the whole width of
          the stage and cannot collide at any size. */}
      <p
        ref={titleRef}
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-1/2 left-1/2 m-0 max-w-[min(34ch,78vw)] -translate-x-1/2 text-center leading-[1.1] tracking-[-0.01em] opacity-0"
        style={{ fontSize: metrics.title, marginTop: metrics.cardH / 2 + 26 }}
      >
        {items[active]?.title}
      </p>

      {/* A column down the right-hand side of the stage, except on a narrow
          one: there the ring leaves only about 50px clear either side, so the
          column would sit on top of the cards. Below the wheel instead, as a
          wrapped row - and it is the only way to reach a given photograph on
          a phone without dragging, so it cannot simply be hidden. */}
      <ol
        className="text-muted-foreground m-0 flex list-none flex-wrap justify-center gap-x-4 gap-y-1.5 px-5 pb-7 text-center sm:absolute sm:top-1/2 sm:right-[clamp(14px,3vw,46px)] sm:m-0 sm:max-w-[34vw] sm:-translate-y-1/2 sm:flex-col sm:flex-nowrap sm:items-end sm:gap-[0.55em] sm:px-0 sm:pb-0 sm:text-right"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              aria-current={i === active ? 'true' : undefined}
              className={cn(
                'focus-visible:outline-foreground cursor-pointer transition-colors outline-none focus-visible:outline-1',
                i === active && 'text-foreground font-medium',
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default WorksWheel
