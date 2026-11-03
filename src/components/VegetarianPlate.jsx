import { useState } from 'react'
import { PRODUCE } from '../assets.js'

/**
 * Six staples arranged on the rim of a plate. Each one is a button: pointing
 * at it swaps the reading in the middle, so the diagram explains itself
 * instead of needing six captions printed round the edge.
 *
 * Angles step 60 degrees from nine o'clock, so the six pieces sit two to a
 * side with clear rim at the top and bottom of the dial. That leaves the core
 * label a field of its own instead of fighting a piece of fruit for it.
 */
const RIM = [
  {
    id: 'broccoli',
    name: 'Broccoli',
    note: 'Folate and vitamin K, plus the fibre that decides whether you are hungry again at four in the afternoon.',
  },
  {
    id: 'pepper',
    name: 'Red pepper',
    note: 'Gram for gram it carries more vitamin C than an orange, and vitamin C is what lets your gut pull iron out of a bowl of dal.',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    note: 'Lycopene, and the acidity that makes a vegetarian plate taste finished rather than merely worthy.',
  },
  {
    id: 'avocado',
    name: 'Avocado',
    note: 'Monounsaturated fat, so the fat-soluble vitamins sitting next to it on the plate actually get absorbed.',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    note: 'Polyphenols at well under half the sugar of a banana. Dessert that costs you nothing.',
  },
  {
    id: 'apple',
    name: 'Apple',
    note: 'Pectin. The soluble fibre that flattens the glucose curve after a meal instead of letting it spike.',
  },
]

const RESTING = {
  name: 'Six staples',
  note: 'Nothing on a Healthystitch plate is there for decoration. Point at a piece and see what it is doing.',
}

const COMPOSITION = [
  ['Half', 'vegetables and fruit'],
  ['A quarter', 'whole grains'],
  ['A quarter', 'pulses, nuts, dairy'],
]

export default function VegetarianPlate() {
  const [activeId, setActiveId] = useState(null)
  const reading = RIM.find((item) => item.id === activeId) ?? RESTING

  return (
    <figure className="plate">
      <div className="plate__dial" onMouseLeave={() => setActiveId(null)}>
        <svg
          className="plate__ring"
          viewBox="0 0 200 200"
          aria-hidden="true"
          focusable="false"
        >
          {/* Soft band the produce sit on, the plate well, its edge, and then
              the running stitch — a dashed rim whose offset crawls, which is
              where the name of the business comes from. */}
          <circle className="plate__ring-band" cx="100" cy="100" r="68" />
          <circle className="plate__ring-core" cx="100" cy="100" r="46" />
          <circle className="plate__ring-rim" cx="100" cy="100" r="59.5" />
          <circle className="plate__ring-stitch" cx="100" cy="100" r="76.394" />
        </svg>

        <ul className="plate__rim">
          {RIM.map((item, index) => (
            <li
              className="plate__slot"
              key={item.id}
              style={{
                '--angle': `${index * 60 - 90}deg`,
                '--drift-delay': `${index * 0.95}s`,
              }}
            >
              <button
                type="button"
                className={`plate__piece${activeId === item.id ? ' is-active' : ''}`}
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                aria-pressed={activeId === item.id}
              >
                <img src={PRODUCE[item.id]} alt="" aria-hidden="true" />
                <span className="u-sr">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="plate__core">
          <span className="plate__eyebrow">The plate</span>
          <strong className="plate__name">{reading.name}</strong>
        </div>
      </div>

      <figcaption className="plate__read">
        <p className="plate__note" aria-live="polite">
          {reading.note}
        </p>

        <dl className="plate__composition">
          {COMPOSITION.map(([share, of]) => (
            <div className="plate__share" key={of}>
              <dt>{share}</dt>
              <dd>{of}</dd>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  )
}
