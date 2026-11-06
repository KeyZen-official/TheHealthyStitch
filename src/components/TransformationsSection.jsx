import WorksWheel from '../components/ui/works-wheel.tsx'
import TransformationsGallery from './TransformationsGallery.jsx'
import { TRANSFORMATIONS, TRANSFORMATION_GALLERY_RATIO, TRANSFORMATION_RATIO } from '../assets.js'
import useInView from '../hooks/useInView.js'
import useMediaQuery from '../hooks/useMediaQuery.js'

/**
 * Where the swipe gallery takes over from the wheel: any screen under 640px
 * wide, and a touch screen under 520px tall, which is a phone on its side.
 * Tablets keep the wheel. 640px is also where the wheel moves its index from
 * the side of the stage to below it (Tailwind's `sm`).
 */
const PHONE = '(max-width: 639px), (pointer: coarse) and (max-height: 520px)'

const LABEL = 'Client before and after photographs'

/**
 * The results band: the client before/after photographs, hung on the wheel,
 * or on a phone laid out in a row to swipe through (TransformationsGallery
 * explains why).
 *
 * The wheel is a perspective object, so this section gives it a dark ground
 * (`theme-dark-olive`, defined in styles/tailwind.css) instead of the page's
 * off-white. On the warm canvas the cards that rotate away have nothing to
 * recede into and the drum reads as a flat stack.
 *
 * No card carries an `href`: there is no page behind a photograph, and the
 * component renders plain divs and drops its hover affordance when the link is
 * omitted, which is what a gallery should do rather than offer a dead link.
 */
export default function TransformationsSection() {
  const [ref, inView] = useInView()
  const phone = useMediaQuery(PHONE)

  return (
    <section
      className={`shift theme-dark-olive${inView ? ' is-revealed' : ''}`}
      id="transformations"
      ref={ref}
      aria-labelledby="shift-headline"
    >
      <header className="shift__head">
        <p className="shift__eyebrow">
          <span>Real Clients</span>
          <span className="shift__rule" aria-hidden="true" />
        </p>

        <h2 className="shift__headline" id="shift-headline">
          Before, And <em>After</em>
        </h2>

        <p className="shift__standfirst">
          {phone
            ? 'Photographs sent in by clients who finished a plan. Swipe through them, or use the arrows.'
            : 'Photographs sent in by clients who finished a plan. Turn the wheel — scroll it, drag it, or pick a name from the list.'}
        </p>
      </header>

      {phone ? (
        <TransformationsGallery
          className="shift__gallery"
          items={TRANSFORMATIONS}
          ratio={TRANSFORMATION_GALLERY_RATIO}
          label={LABEL}
        />
      ) : (
        <WorksWheel
          className="shift__wheel"
          items={TRANSFORMATIONS}
          ratio={TRANSFORMATION_RATIO}
          label="The shift"
          aria-label={LABEL}
        />
      )}

      {/* Same shape as the proof section's footer: the rule spans the measure,
          the small print inside it keeps a readable line length. */}
      <footer className="shift__foot">
        <p className="shift__disclaimer">
          Published with each client&rsquo;s permission. These are individual
          results on individual plans, not an average and not a promise — what
          changes for you depends on where you start, what you are treated for,
          and how much of the plan you actually keep to.
        </p>
      </footer>
    </section>
  )
}
