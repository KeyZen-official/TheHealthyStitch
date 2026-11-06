import VegetarianPlate from './VegetarianPlate.jsx'
import useInView from '../hooks/useInView.js'

/** The core nutrition pillars of TheHealthyStitch. */
const PILLARS = [
  {
    id: '01',
    title: 'Designed Around YOUR Food',
    body: 'Vegetarian and Jain-friendly nutrition plans that respect your food choices, traditions and everyday eating habits.',
  },
  {
    id: '02',
    title: 'No Starving. No Crash Diets.',
    body: 'Eat satisfying, balanced meals without extreme restrictions or giving up everything you enjoy.',
  },
  {
    id: '03',
    title: 'Cooked in your own kitchen',
    body: 'Dal, sabzi, khichdi, rajma, upma, curd rice. We change quantities, pairings and timing. You carry on cooking the food you already know.',
  },
  {
    id: '04',
    title: 'More Than Just Weight Loss',
    body: 'Work towards your health goals, whether it’s weight management, better eating habits, improved protein intake or supporting lifestyle-related health conditions.',
  },
  {
    id: '05',
    title: 'Guidance Beyond Your Diet Chart',
    body: 'Get regular diet plan updates, personalised guidance and WhatsApp support to help you stay consistent and make informed choices.',
  },
]

export default function ProofSection() {
  const [ref, inView] = useInView()

  return (
    <section
      className={`proof${inView ? ' is-revealed' : ''}`}
      id="proof"
      ref={ref}
      aria-labelledby="proof-headline"
    >
      <header className="proof__head">
        <p className="proof__eyebrow">
          <span>Why TheHealthyStitch</span>
          <span className="proof__rule" aria-hidden="true" />
        </p>

        <h2 className="proof__headline" id="proof-headline">
          Your Health Deserves More Than Another <em>Diet Plan.</em>
        </h2>
      </header>

      <div className="proof__body">
        <div className="proof__argument">
          <div className="proof__narrative">
            <div className="proof__questions">
              <p className="proof__question">
                Tired of following diets that work for a few weeks but never fit into your everyday life?
              </p>
              <p className="proof__question">
                Struggling to lose weight, manage your health or understand what your body actually needs?
              </p>
            </div>

            <p className="proof__statement">
              At The Healthy Stitch, we don’t believe in starving, cutting out your favourite foods or following someone else’s diet.
            </p>

            <p className="proof__statement">
              We help you build a healthier relationship with food through personalised nutrition that works with <strong>YOUR</strong> lifestyle, food preferences and health goals.
            </p>

            <p className="proof__callout">
              Because the goal isn’t just to lose weight. It’s to build habits that help you stay healthier for life.
            </p>
          </div>

          <ol className="promises">
            {PILLARS.map(({ id, title, body }) => (
              <li className="promises__item" key={id}>
                <span className="promises__num">{id}</span>
                <div className="promises__text">
                  <h3 className="promises__title">{title}</h3>
                  <p className="promises__body">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="proof__visual">
          <VegetarianPlate />
        </div>
      </div>

      <span className="stitch" aria-hidden="true" />

      <div className="proof__closing">
        <p className="proof__closing-statement">
          You don’t need another temporary diet. You need an approach you can actually live with.
        </p>
        <p className="proof__closing-motto">
          Let’s build healthier habits, <em>one stitch at a time.</em>
        </p>
      </div>
    </section>
  )
}
