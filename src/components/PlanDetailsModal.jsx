import { useEffect, useRef } from 'react'
import { X, ArrowRight, ShieldCheck, CheckCircle2, Calendar, MessageCircleHeart } from 'lucide-react'
import PlanEmblem from './PlanEmblem.jsx'

export default function PlanDetailsModal({ plan, onClose, onEnquire }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!plan) return undefined

    // Save previous active element to restore focus on close
    const previousActive = document.activeElement
    closeButtonRef.current?.focus()

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previousActive && previousActive.focus) {
        previousActive.focus()
      }
    }
  }, [plan, onClose])

  if (!plan) return null

  const handleEnquireClick = () => {
    onEnquire(plan.title)
  }

  return (
    <div
      className="plan-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-plan-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="plan-modal__dialog" ref={modalRef}>
        <button
          type="button"
          className="plan-modal__close"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close plan details"
        >
          <X className="plan-modal__close-icon" aria-hidden="true" />
        </button>

        <header className="plan-modal__header">
          <div className="plan-modal__meta">
            <span className="plan-modal__badge">Health Goal {plan.num}</span>
            <span className="plan-modal__divider" aria-hidden="true" />
            <span className="plan-modal__tagline">{plan.tagline}</span>
          </div>

          <div className="plan-modal__title-row">
            <PlanEmblem icon={plan.icon} num={plan.num} className="plan-emblem--large" />
            <div>
              <h2 className="plan-modal__title" id="modal-plan-title">
                {plan.title}
              </h2>
              <div className="plan-modal__pills">
                {plan.focusAreas.map((area) => (
                  <span key={area} className="plan-modal__pill">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="plan-modal__body">
          {/* Approach */}
          <section className="plan-modal__section">
            <div className="plan-modal__section-header">
              <span className="plan-modal__section-num">01</span>
              <h3 className="plan-modal__section-title">Personalised Nutrition Approach</h3>
            </div>
            <p className="plan-modal__text">{plan.approach}</p>
          </section>

          {/* Consultation Process */}
          <section className="plan-modal__section">
            <div className="plan-modal__section-header">
              <span className="plan-modal__section-num">02</span>
              <h3 className="plan-modal__section-title">Consultation & Assessment Process</h3>
            </div>
            <p className="plan-modal__text">{plan.consultation}</p>
            <div className="plan-modal__process-steps">
              <div className="plan-modal__step">
                <CheckCircle2 className="plan-modal__step-icon" />
                <span>1. Clinical History & Lifestyle Audit</span>
              </div>
              <div className="plan-modal__step">
                <CheckCircle2 className="plan-modal__step-icon" />
                <span>2. Biomarker Review & Meal Pacing</span>
              </div>
              <div className="plan-modal__step">
                <CheckCircle2 className="plan-modal__step-icon" />
                <span>3. Custom Food Roadmap (Your Kitchen)</span>
              </div>
            </div>
          </section>

          {/* Expected Support */}
          <section className="plan-modal__section">
            <div className="plan-modal__section-header">
              <span className="plan-modal__section-num">03</span>
              <h3 className="plan-modal__section-title">Expected Support & Accountability</h3>
            </div>
            <p className="plan-modal__text">{plan.support}</p>
            <div className="plan-modal__support-tags">
              <span className="plan-modal__support-tag">
                <MessageCircleHeart className="plan-modal__support-icon" /> Direct WhatsApp check-ins
              </span>
              <span className="plan-modal__support-tag">
                <Calendar className="plan-modal__support-icon" /> Fortnightly adjustments
              </span>

            </div>
          </section>

          {/* Professional Medical Disclaimer */}
          <div className="plan-modal__disclaimer">
            <ShieldCheck className="plan-modal__disclaimer-icon" />
            <p>
              <strong>Professional Assessment Note:</strong> These categories represent your
              individual wellness goals, not fixed pre-packaged diets. Recommendations are
              custom-calibrated following professional assessment and work alongside your medical
              care without clinical claims or guaranteed medical outcomes.
            </p>
          </div>
        </div>

        <footer className="plan-modal__footer">
          <button
            type="button"
            className="plan-modal__cta"
            onClick={handleEnquireClick}
          >
            <span>Enquire About {plan.title}</span>
            <ArrowRight className="plan-modal__cta-icon" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="plan-modal__cancel"
            onClick={onClose}
          >
            Back to All Plans
          </button>
        </footer>
      </div>
    </div>
  )
}

