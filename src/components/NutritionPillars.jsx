const ICON_PROPS = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

/** 1. Eating less crap / junk food (drink cup & fast food crossed out) */
const JunkFoodIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M17 11h10l-1.3 14a1.8 1.8 0 0 1-1.8 1.6h-3.8a1.8 1.8 0 0 1-1.8-1.6L17 11z" />
    <path d="M19 11l2-5h3" />
    <path d="M5 15h9l-1 10.5a1.8 1.8 0 0 1-1.8 1.5H7.8a1.8 1.8 0 0 1-1.8-1.5L5 15z" />
    <path d="M7 15v-5" />
    <path d="M9.5 15V8" />
    <path d="M12 15v-5" />
    <line x1="3" y1="7" x2="29" y2="27" strokeWidth="1.8" />
  </svg>
)

/** 2. Vegetarian / Jain plate (wholesome plant protein & veggies replacing steak) */
const VeggiePlateIcon = () => (
  <svg {...ICON_PROPS}>
    <ellipse cx="16" cy="18" rx="13" ry="8" />
    <ellipse cx="16" cy="18" rx="8" ry="4.5" />
    <path d="M16 13.5c-2.5-4-1-7 2-7.5 1.5 2 1.5 4.5 0 6.5" />
    <path d="M16.5 8.5c1 1 2 2.5 1.5 4" />
  </svg>
)

/** 3. Lifting weights & walking (dumbbell) */
const DumbbellIcon = () => (
  <svg {...ICON_PROPS}>
    <line x1="9" y1="16" x2="23" y2="16" strokeWidth="2.4" />
    <rect x="7" y="10" width="3" height="12" rx="1.5" />
    <rect x="3" y="12" width="3" height="8" rx="1" />
    <rect x="22" y="10" width="3" height="12" rx="1.5" />
    <rect x="26" y="12" width="3" height="8" rx="1" />
  </svg>
)

/** 4. Good night's sleep (crescent moon with zzz) */
const SleepIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M19 6a11 11 0 1 0 7 15 10 10 0 0 1-7-15z" />
    <path d="M21 7h4l-4 4h4" strokeWidth="1.2" />
    <path d="M25 3h3l-3 3h3" strokeWidth="1" />
  </svg>
)

const HABITS = [
  {
    id: 'junk',
    Icon: JunkFoodIcon,
    question: 'Eating less crap?',
  },
  {
    id: 'veggie',
    Icon: VeggiePlateIcon,
    question: 'Having wholesome dal, paneer and veggies?',
  },
  {
    id: 'weights',
    Icon: DumbbellIcon,
    question: 'Lifting weights and going for walks?',
  },
  {
    id: 'sleep',
    Icon: SleepIcon,
    question: 'Getting a good night’s sleep?',
  },
]

export default function NutritionPillars() {
  return (
    <section className="pillars basics-card" aria-labelledby="basics-heading">
      <header className="basics-card__head">
        <h2 className="basics-card__title" id="basics-heading">
          Everyone is obsessed with tracking their health data.
        </h2>
        <p className="basics-card__subtitle">
          But have you tried&hellip;
        </p>
      </header>

      <div className="basics-card__grid">
        {HABITS.map(({ id, Icon, question }) => (
          <div className="basics-card__col" key={id}>
            <div className="basics-card__icon">
              <Icon />
            </div>
            <p className="basics-card__question">{question}</p>
          </div>
        ))}
      </div>

      <footer className="basics-card__foot">
        <p className="basics-card__punchline">
          Master the basics before obsessing over the data.
        </p>
      </footer>
    </section>
  )
}
