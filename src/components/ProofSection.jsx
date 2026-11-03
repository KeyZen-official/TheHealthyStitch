import { useState } from 'react'
import VegetarianPlate from './VegetarianPlate.jsx'
import useInView from '../hooks/useInView.js'

/** What makes this service different, as opposed to what the diet does. */
const PROMISES = [
  {
    id: '01',
    title: 'Vegetarian by construction',
    body: 'We start from pulses, grains, greens, nuts and dairy and build upwards. Nothing is subtracted, so nothing quietly goes missing.',
  },
  {
    id: '02',
    title: 'Week nought, then week twelve',
    body: 'Bloodwork before you change anything, bloodwork again at twelve weeks. If the numbers have not moved, the plan was wrong, and rewriting it is our job rather than yours.',
  },
  {
    id: '03',
    title: 'Cooked in your own kitchen',
    body: 'Dal, sabzi, khichdi, rajma, upma, curd rice. We change quantities, pairings and timing. You carry on cooking the food you already know.',
  },
]


/**
 * Pooled results from the published literature. Deliberately not framed as
 * this service's own outcomes — see the source note at the foot of the
 * section. Reference keys match that note.
 *
 * The direction of each change is spelled out in the unit rather than carried
 * by a leading minus: Bodoni's minus is a hairline that all but vanishes at
 * reading distance, and here the sign is the entire point.
 */
const FIGURES = [
  {
    value: '0.30',
    unit: 'mmol/L lower',
    label: 'LDL cholesterol, set against an omnivorous diet',
    ref: '1',
  },
  {
    value: '4.8',
    unit: 'mm Hg lower',
    label: 'Systolic blood pressure, pooled across controlled trials',
    ref: '2',
  },
  {
    value: '12.9',
    unit: 'mg/dL lower',
    label: 'Apolipoprotein B, the particle count that carries the risk',
    ref: '1',
  },
  {
    value: '2.9%',
    unit: 'against 7.6%',
    label: 'Type-2 diabetes prevalence, vegetarians and meat eaters',
    ref: '3',
  },
]

/** The mechanisms. Why the figures above happen at all. */
const LEDGER = [
  {
    id: '01',
    title: 'Fibre is the whole trick',
    body: 'Soluble fibre from pulses, oats and vegetables binds bile acids in the gut and carries them out of the body. Your liver then has to pull cholesterol out of the blood to build replacements. That is the machinery behind the LDL figure above, and meat contributes nothing to it, because animal foods contain no fibre at all.',
    practice:
      'Thirty grams a day, spread across three meals, rather than loaded into one smoothie at breakfast.',
  },
  
  
  
  {
    id: '02',
    title: 'Iron, paired on purpose',
    body: 'Iron from plants is non-haem iron, and on its own your gut takes up very little of it. Vitamin C in the same meal changes that chemistry, which is why no iron-heavy meal leaves this office without an acid source sitting beside it.',
    practice:
      'Lentils finished with lemon. Spinach with roasted pepper. Chana with tomato. Tea an hour either side of the meal, never during it.',
  },
  {
    id: '03',
    title: 'Protein, completed across the day',
    body: 'Pulses run short on methionine and cereals run short on lysine. Eaten across the same day they cover the full set of essential amino acids between them, which is precisely why every old vegetarian cuisine already pairs a pulse with a grain.',
    practice:
      'Dal and rice. Rajma and roti. Idli and sambar. Hummus and flatbread. None of this is new, and none of it needs a powder.',
  },
  {
    id: '04',
    title: 'The one thing plants cannot do',
    body: 'Vitamin B12 is made by bacteria, not by plants. No vegetable, however organic, carries a dependable amount of it, and a long deficiency damages nerves in ways that eating better afterwards will not undo. Every plan we write names a B12 source, fortified food or a supplement, because pretending otherwise is exactly how vegetarian diets fail the people living on them.',
    practice:
      'B12, ferritin, vitamin D and thyroid tested at baseline. Four tests, once, before anybody changes what they eat.',
  },


]

const SOURCES = [
  {
    ref: '1',
    text: 'Koch, Kjeldsen and Frikke-Schmidt, European Heart Journal 44(28), 2023 \u2014 meta-analysis of randomised trials of vegetarian and vegan diets.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/37226630/',
  },
  {
    ref: '2',
    text: 'Yokoyama and colleagues, JAMA Internal Medicine 174(4), 2014 \u2014 meta-analysis of vegetarian diets and blood pressure.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/24566947/',
  },
  {
    ref: '3',
    text: 'Tonstad, Butler, Yan and Fraser, Diabetes Care 32(5), 2009 \u2014 60,903 adults in the Adventist Health Study-2.',
    href: 'https://pubmed.ncbi.nlm.nih.gov/19351712/',
  },




]

export default function ProofSection() {
  const [ref, inView] = useInView()
  const [openRow, setOpenRow] = useState('01')

  return (
    <section
      className={`proof${inView ? ' is-revealed' : ''}`}
      id="proof"
      ref={ref}
      aria-labelledby="proof-headline"
    >
      <header className="proof__head">
        <p className="proof__eyebrow">
          <span>Why Healthystitch</span>
          <span className="proof__rule" aria-hidden="true" />
        </p>

        <h2 className="proof__headline" id="proof-headline">
          A vegetarian plate that turns up in your{' '}
          <em>bloodwork</em>
        </h2>
      </header>

      <div className="proof__body">
        <div className="proof__argument">
          <p className="proof__lead">
            Most plant-based plans sell a feeling. We would rather be judged on
            numbers a laboratory prints out. Every Healthystitch plan is
            vegetarian from its first line, not a meat plan with the meat
            deleted, so the nutrient gaps get closed on purpose instead of by
            luck.
          </p>

          <ol className="promises">
            {PROMISES.map(({ id, title, body }) => (
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

      <div className="figures">
        <p className="figures__frame">
          What the published trials report. Pooled results for vegetarian diets
          in general, not outcomes measured on this service.
        </p>

        <ul className="figures__list">
          {FIGURES.map(({ value, unit, label, ref: cite }) => (
            <li className="figures__item" key={label}>
              <p className="figures__value">
                {value}
                <span className="figures__unit">{unit}</span>
              </p>
              <p className="figures__label">
                {label}
                <a className="figures__cite" href={`#source-${cite}`}>
                  <span className="u-sr">See source </span>
                  {cite}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <span className="stitch" aria-hidden="true" />

      <div className="ledger">
        <div className="ledger__intro">
          <h3 className="ledger__title">
            How it actually <em>works</em>
          </h3>
          <p className="ledger__standfirst">
            Four mechanisms. The fourth is the one nobody selling vegetarian
            food enjoys bringing up.
          </p>

          <p className="ledger__aside">
            None of it needs a powder, a shake, or a box arriving every month.
            It needs a shopping list and about forty minutes on a Sunday.
          </p>
        </div>

        <ul className="ledger__list">
          {LEDGER.map(({ id, title, body, practice }) => {
            const open = openRow === id

            return (
              <li className={`ledger__row${open ? ' is-open' : ''}`} key={id}>
                <h4 className="ledger__heading">
                  <button
                    type="button"
                    className="ledger__trigger"
                    aria-expanded={open}
                    aria-controls={`ledger-panel-${id}`}
                    onClick={() => setOpenRow(open ? null : id)}
                  >
                    <span className="ledger__num">({id})</span>
                    <span className="ledger__label">{title}</span>
                    <span className="ledger__mark" aria-hidden="true" />
                  </button>
                </h4>

                <div className="ledger__panel" id={`ledger-panel-${id}`}>
                  <div className="ledger__panel-inner">
                    <p className="ledger__body">{body}</p>
                    <p className="ledger__practice">
                      <span className="ledger__practice-tag">In practice</span>
                      {practice}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <footer className="proof__sources">
        <h4 className="proof__sources-title">Sources</h4>
        <ol className="proof__sources-list">
          {SOURCES.map(({ ref: cite, text, href }) => (
            <li id={`source-${cite}`} key={cite}>
              <span className="proof__sources-num">{cite}</span>
              <span>
                {text}{' '}
                <a href={href} target="_blank" rel="noreferrer noopener">
                  Read it
                </a>
              </span>
            </li>
          ))}
        </ol>
        <p className="proof__disclaimer">
          Those papers describe vegetarian diets as a category. They are not
          clinical results for this service, and nothing on this page is
          medical advice. Talk to a doctor before changing a diet you are
          medicated for.

        </p>
      </footer>
    </section>
  )
}
