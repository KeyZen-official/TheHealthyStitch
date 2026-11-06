import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { HEALTH_CATEGORIES } from '../data/plansData.js'
import PlanEmblem from './PlanEmblem.jsx'
import PlanDetailsModal from './PlanDetailsModal.jsx'
import useInView from '../hooks/useInView.js'

export default function PlansSection({ onSelectPlan }) {
  const [ref, inView] = useInView()
  const [activePlan, setActivePlan] = useState(null)

  const handleCardClick = (plan) => {
    setActivePlan(plan)
  }

  const handleEnquireFromModal = (goalTitle) => {
    setActivePlan(null)
    if (onSelectPlan) {
      onSelectPlan(goalTitle)
    } else {
      const el = document.getElementById('enquiry')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  

  return (
    <section
      className={`plans-section${inView ? ' is-revealed' : ''}`}
      id="plans"
      ref={ref}
      aria-labelledby="plans-headline"
    >
      <header className="plans__head">
        <p className="plans__eyebrow">
          <span>Nutrition &amp; Health Goals</span>
          <span className="plans__rule" aria-hidden="true" />
        </p>

        <div className="plans__intro">
          <h2 className="plans__headline" id="plans-headline">
            Food-first guidance crafted for your <em>health goals</em>
          </h2>
          <p className="plans__lead">
            We don’t offer generic, one-size-fits-all diets. Select your primary health goal
            below to explore our evidence-informed nutrition approach, consultation framework,
            and dedicated support.
          </p>
        </div>
      </header>

      <div className="plans__grid">
        {HEALTH_CATEGORIES.map((plan) => (
          <article
            key={plan.id}
            className="plan-card"
            tabIndex={0}
            role="button"
            aria-label={`Explore ${plan.title} plan`}
            onClick={() => handleCardClick(plan)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick(plan)
              }
            }}
          >
            <div className="plan-card__top">
              <span className="plan-card__num">({plan.num})</span>
              <PlanEmblem icon={plan.icon} num={plan.num} />
            </div>

            <div className="plan-card__content">
              <h3 className="plan-card__title">{plan.title}</h3>
              <p className="plan-card__desc">{plan.shortDescription}</p>

              <div className="plan-card__tags">
                {plan.focusAreas.slice(0, 2).map((tag) => (
                  <span key={tag} className="plan-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

           

            <div className="plan-card__footer">
              <span className="plan-card__cta">
                <span>Explore Plan</span>
                <ArrowRight className="plan-card__arrow" aria-hidden="true" />
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="plans__note-banner">
        <div className="plans__note-content">
          <Sparkles className="plans__note-icon" aria-hidden="true" />
          <p>
            <strong>Personalised Nutrition Philosophy:</strong> These categories represent your
            distinct health and wellness aspirations. Following professional assessment, your
            nutritionist designs a unified, tailored plan that integrates seamlessly with your
            home cooking and medical routine.
          </p>
        </div>
      </div>

      {activePlan && (
        <PlanDetailsModal
          plan={activePlan}
          onClose={() => setActivePlan(null)}
          onEnquire={handleEnquireFromModal}
        />
      )}
    </section>
  )
}

