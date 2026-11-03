const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const GoodFatsIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3.5c3.6 2.6 5.6 5.3 5.6 8.3A5.6 5.6 0 0 1 12 17.4a5.6 5.6 0 0 1-5.6-5.6c0-3 2-5.7 5.6-8.3Z" />
    <path d="M9.6 12.3a2.4 2.4 0 0 0 2.4 2.4" />
  </svg>
)

const LeafyGreensIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M5 19c0-6.6 4.6-12 14-12 0 7.7-5 12-10 12H5Z" />
    <path d="M5 19C8 14.6 11.6 11.6 16 9.8" />
  </svg>
)

const PlantProteinIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 21V10" />
    <path d="M12 10C12 6 9.2 3.4 5 3c-.4 4.2 2.2 7 7 7Z" />
    <path d="M12 13c0-3.3 2.3-5.6 6-6 .3 3.6-2 6-6 6Z" />
  </svg>
)

const DrinkWaterIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M6.5 4h11l-1.1 15.1a1.6 1.6 0 0 1-1.6 1.4H9.2a1.6 1.6 0 0 1-1.6-1.4L6.5 4Z" />
    <path d="M7 10.5c2 1.3 3.4 1.3 5 0s3-1.3 4.6 0" />
  </svg>
)

const PILLARS = [
  { id: '01', name: 'Good Fats', Icon: GoodFatsIcon },
  { id: '02', name: 'Leafy Greens', Icon: LeafyGreensIcon },
  { id: '03', name: 'Plant Protein', Icon: PlantProteinIcon },
  { id: '04', name: 'Drink Water', Icon: DrinkWaterIcon },
]

export default function NutritionPillars() {
  return (
    <section className="pillars">
      <div className="pillars__intro">
        <h2 className="pillars__title">
          Our 4 Pillars <em>Of</em> Nutrition
        </h2>
        <p className="pillars__copy">
          Framework designed to fulfil your body&rsquo;s core nutritional needs
          while fueling positive long-term health.
        </p>
      </div>

      <ul className="pillars__list">
        {PILLARS.map(({ id, name, Icon }) => (
          <li className="pillars__row" key={id}>
            <span className="pillars__num">({id})</span>
            <span className="pillars__name">{name}</span>
            <span className="pillars__icon">
              <Icon />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
