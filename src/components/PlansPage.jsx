import { useState, useRef } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  Layers,
  Calendar,
} from 'lucide-react'
import { PROGRAMMES } from '../data/programmesData.js'
import EnquirySection from './EnquirySection.jsx'

export default function PlansPage({ onNavigateHome }) {
  const [selectedProgramme, setSelectedProgramme] = useState(PROGRAMMES[1]) // Default to 3 Months Flagship
  const enquiryRef = useRef(null)

  const handleSelectProgramme = (prog) => {
    setSelectedProgramme(prog)
    const el = document.getElementById('enquiry')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="plans-page">
      <div className="plans-page__measure">
        {/* Back to Homepage */}
        <button
          type="button"
          className="plans-page__back-home"
          onClick={onNavigateHome}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Page Header */}
        <header className="plans-page__header">
          <p className="plans-page__eyebrow">
            <img
              src="/assets/logo.png"
              alt=""
              className="plans-page__logo-img"
              width="24"
              height="24"
            />
            <span>TheHealthyStitch — Personalised Nutrition Programmes</span>
            <span className="plans-page__eyebrow-rule" aria-hidden="true" />
          </p>

          <h1 className="plans-page__title">
            Personalised Programmes Calibrated to Your <em>Lifestyle</em>
          </h1>

          <p className="plans-page__lead">
            Every programme is designed around your lifestyle, food preferences, nutritional
            requirements and health goals. Choose the duration that matches your timeline for sustainable habit change.
          </p>

          {/* Quick-jump navigation pills */}
          <div className="plans-page__quick-nav">
            {PROGRAMMES.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className={`plans-page__quick-link${p.isFlagship ? ' plans-page__quick-link--flagship' : ''}`}
              >
                <Calendar className="w-3.5 h-3.5 text-olive-ink" />
                <span>
                  {p.duration} &middot; {p.name.replace('The ', '')}
                </span>
                {p.isFlagship && <Star className="w-3 h-3 text-headline fill-headline" />}
              </a>
            ))}
          </div>
        </header>

        {/* The Boxed Modular Grid */}
        <div className="programmes-grid">
          {PROGRAMMES.map((prog) => (
            <article
              key={prog.id}
              id={prog.id}
              className={`prog-box${prog.isFlagship ? ' prog-box--flagship' : ''}`}
            >
              {prog.isFlagship && (
                <div className="prog-box__flagship-ribbon">
                  <span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Flagship Programme &middot; Most Popular
                  </span>
                  <span>12 Weeks of Consistency</span>
                </div>
              )}

              {/* Compartment 1: Duration & Header */}
              <div className="prog-box__compartment-head">
                <div className="prog-box__meta-row">
                  <span className="prog-box__code">[{prog.code}]</span>
                  <span
                    className={`prog-box__badge${prog.isFlagship ? ' prog-box__badge--highlight' : ''}`}
                  >
                    {prog.badge}
                  </span>
                </div>

                <div className="prog-box__duration-row">
                  <span className="prog-box__duration">{prog.duration}</span>
                </div>

                <h2 className="prog-box__name">{prog.name}</h2>
                <p className="prog-box__tagline">&ldquo;{prog.tagline}&rdquo;</p>
              </div>

              {/* Compartment 2: Inclusions List */}
              <div className="prog-box__compartment-body">
                {prog.inheritance && (
                  <div className="prog-box__inheritance">
                    <Layers className="prog-box__inheritance-icon" />
                    <span>{prog.inheritance}</span>
                  </div>
                )}

                <h3 className="prog-box__inclusions-title">What&rsquo;s Included</h3>

                <ul className="prog-box__list">
                  {prog.inclusions.map((item, idx) => (
                    <li key={idx} className="prog-box__item">
                      <CheckCircle2 className="prog-box__check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Compartment 3: Ideal For Frame */}
                <div className="prog-box__compartment-ideal">
                  <span className="prog-box__ideal-label">Ideal For</span>
                  <p className="prog-box__ideal-text">{prog.idealFor}</p>
                </div>
              </div>

              {/* Compartment 4: Action */}
              <div className="prog-box__compartment-foot">
                <button
                  type="button"
                  className="prog-box__cta"
                  onClick={() => handleSelectProgramme(prog)}
                >
                  <span>Select {prog.name}</span>
                  <ArrowRight className="prog-box__cta-icon" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Comparison Blueprint Box */}
        <section className="prog-matrix" aria-labelledby="matrix-title">
          <div className="prog-matrix__head">
            <div className="prog-matrix__eyebrow">Programme Comparison Blueprint</div>
            <h2 className="prog-matrix__title" id="matrix-title">
              Compare Programme Deliverables
            </h2>
            <p className="prog-matrix__desc">
              All programmes are rooted in whole home foods and tailored around your laboratory
              markers. Longer durations allow for deeper habit reinforcement and independent food literacy.
            </p>
          </div>

          <div className="prog-matrix__table-wrap">
            <table className="prog-matrix__table">
              <thead>
                <tr>
                  <th>Feature &amp; Deliverable</th>
                  <th>1 Month (Starter)</th>
                  <th className="is-flagship">3 Months (Consistency) ★</th>
                  <th>6 Months (Lifestyle)</th>
                  <th>12 Months (Wellness)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="prog-matrix__feature-name">Duration &amp; Focus</td>
                  <td>1 Month &middot; Trial</td>
                  <td className="is-flagship">3 Months &middot; Consistency</td>
                  <td>6 Months &middot; Habit Shift</td>
                  <td>12 Months &middot; Mastery</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">Diet Plan Updates</td>
                  <td>1 revision / month</td>
                  <td className="is-flagship">Twice monthly</td>
                  <td>Twice monthly</td>
                  <td>Twice monthly (seasonal)</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">Progress Assessment</td>
                  <td>1 assessment</td>
                  <td className="is-flagship">Monthly assessments</td>
                  <td>Detailed monthly review</td>
                  <td>Monthly &amp; quarterly</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">Vegetarian Protein Guidance</td>
                  <td>Basic guidance</td>
                  <td className="is-flagship">Personalised pairing</td>
                  <td>Advanced balance</td>
                  <td>Long-term independence</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">Restaurant &amp; Social Dining</td>
                  <td>Food swaps</td>
                  <td className="is-flagship">Eating-out &amp; festival guides</td>
                  <td>Travel &amp; vacation systems</td>
                  <td>Year-round social ease</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">Habit &amp; Grocery Strategies</td>
                  <td>Portion timing</td>
                  <td className="is-flagship">Routine improvement</td>
                  <td>Grocery &amp; meal-prep guides</td>
                  <td>Relapse prevention</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">WhatsApp Doubt-Solving</td>
                  <td>When required</td>
                  <td className="is-flagship">Continuous when required</td>
                  <td>Continuous support</td>
                  <td>Year-round guidance</td>
                </tr>
                <tr>
                  <td className="prog-matrix__feature-name">Follow-up Calls</td>
                  <td>If required</td>
                  <td className="is-flagship">Whenever necessary</td>
                  <td>Whenever necessary</td>
                  <td>Whenever necessary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Integrated Enquiry Form on the Plans Page */}
        <div ref={enquiryRef}>
          <EnquirySection
            selectedProgramme={selectedProgramme ? `${selectedProgramme.name} (${selectedProgramme.duration})` : ''}
          />
        </div>
      </div>
    </div>
  )
}

