import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { WhatsAppIcon } from './icons/BrandIcons.jsx'
import { CONTACT, whatsappHref } from '../contact.js'
import { HEALTH_CATEGORIES } from '../data/plansData.js'
import { saveEnquiry } from '../lib/enquiryStorage.js'
import useInView from '../hooks/useInView.js'

export const DIETARY_PREFERENCES = ['Jain', 'Vegetarian', 'Other']

export const CONSULTATION_TIMES = [
  'Morning (10 AM – 12 PM)',
  'Evening (4 PM – 7 PM)',
  'Flexible',
]

export const PROGRAMME_OPTIONS = [
  'The Starter Programme (1 Month)',
  'The Consistency Programme (3 Months)',
  'The Lifestyle Transformation Programme (6 Months)',
  'The Long-Term Wellness Programme (12 Months)',
  'Undecided / Open to Recommendation',
]

export const DEFAULT_GOAL = 'Fat Loss / Weight Loss'

const EMPTY = {
  name: '',
  phone: '',
  goal: DEFAULT_GOAL,
  customGoal: '',
  programme: '',
  diet: '',
  customDiet: '',
  consultationTime: '',
  message: '',
}

/** Field order, for moving focus to the first one that needs fixing. */
const ORDER = ['name', 'phone', 'goal', 'customGoal', 'diet', 'customDiet', 'consultationTime']

const LIMITS = { name: 80, phone: 20, goal: 100, customGoal: 150, programme: 100, diet: 40, customDiet: 100, consultationTime: 50, message: 1000 }

/** Read out after links that open somewhere else, so nobody is surprised. */
const NEW_TAB = <span className="u-sr"> (opens in a new tab)</span>

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Enter your name (at least 2 characters).'
  }

  const phone = values.phone.trim()
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15 || /[^\d\s()+-]/.test(phone)) {
    errors.phone = 'Enter a valid phone number with at least 10 digits.'
  }

  if (!values.goal) {
    errors.goal = 'Select your primary health goal.'
  } else if (values.goal === 'Other' && !values.customGoal?.trim()) {
    errors.customGoal = 'Please describe your health goal.'
  }

  if (!values.diet) {
    errors.diet = 'Please select your dietary preference.'
  } else if (values.diet === 'Other' && !values.customDiet?.trim()) {
    errors.customDiet = 'Please describe your dietary preference.'
  }

  if (!values.consultationTime) {
    errors.consultationTime = 'Please select your preferred consultation time.'
  }

  return errors
}

/** The enquiry as plain lines: formatted cleanly for WhatsApp. */
function compose(values) {
  const goalDisplay =
    values.goal === 'Other' && values.customGoal?.trim()
      ? `Other (${values.customGoal.trim()})`
      : values.goal
  const dietDisplay =
    values.diet === 'Other' && values.customDiet?.trim()
      ? `Other (${values.customDiet.trim()})`
      : values.diet

  const lines = [
    "Hi Mitali! I'd like to enquire about a personalised nutrition plan with TheHealthyStitch.",
    '',
    `Name: ${values.name.trim()}`,
    `Phone / WhatsApp: ${values.phone.trim()}`,
  ]
  if (values.programme) lines.push(`Selected Programme: ${values.programme}`)
  lines.push(`Primary Health Goal: ${goalDisplay}`)
  lines.push(`Dietary Preference: ${dietDisplay}`)
  lines.push(`Preferred Consultation Time: ${values.consultationTime}`)
  if (values.message.trim()) {
    lines.push('', `Notes & Questions: ${values.message.trim()}`)
  }
  return lines
}

export default function EnquirySection({ selectedGoal, selectedProgramme }) {
  const [ref, inView] = useInView()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [checked, setChecked] = useState(false)
  const [sent, setSent] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goalHighlight, setGoalHighlight] = useState(false)
  const controls = useRef({})

  // When a goal is passed in
  useEffect(() => {
    if (selectedGoal) {
      setValues((prev) => ({ ...prev, goal: selectedGoal }))
      setGoalHighlight(true)
      const timer = setTimeout(() => {
        setGoalHighlight(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [selectedGoal])

  // When a programme is passed in
  useEffect(() => {
    if (selectedProgramme) {
      setValues((prev) => ({ ...prev, programme: selectedProgramme }))
    }
  }, [selectedProgramme])

  const change = (name) => (event) => {
    const next = { ...values, [name]: event.target.value }
    setValues(next)
    if (checked) setErrors(validate(next))
    if (sent) setSent(null)
  }

  const send = async () => {
    const found = validate(values)
    setChecked(true)
    setErrors(found)

    const first = ORDER.find((name) => found[name])
    if (first) {
      setSent(null)
      controls.current[first]?.focus()
      return
    }

    setIsSubmitting(true)

    // Save to enquiry management system (localStorage + API)
    await saveEnquiry({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: '',
      programme: values.programme,
      goal: values.goal,
      diet: values.diet,
      consultationTime: values.consultationTime,
      message: values.message.trim(),
      channel: 'whatsapp',
    })

    const lines = compose(values)
    const href = whatsappHref(lines.join('\n'))
    window.open(href, '_blank', 'noopener,noreferrer')

    setSent({
      channel: 'whatsapp',
      href,
      name: values.name.trim(),
      programme: values.programme,
      goal: values.goal,
      diet: values.diet,
      consultationTime: values.consultationTime,
    })
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setValues(EMPTY)
    setChecked(false)
    setErrors({})
    setSent(null)
  }

  /** The props every control shares: value, change handler, error wiring. */
  const bind = (name) => ({
    id: `enquiry-${name}`,
    name,
    value: values[name],
    onChange: change(name),
    maxLength: LIMITS[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `enquiry-${name}-error` : undefined,
    ref: (node) => {
      controls.current[name] = node
    },
  })

  const error = (name) =>
    errors[name] ? (
      <p className="enquiry__error" id={`enquiry-${name}-error`}>
        {errors[name]}
      </p>
    ) : null

  return (
    <section
      className={`enquiry${inView ? ' is-revealed' : ''}`}
      id="enquiry"
      ref={ref}
      aria-labelledby="enquiry-headline"
    >
      <header className="enquiry__head">
        <p className="enquiry__eyebrow">
          <span>Enquiry &amp; Consultation</span>
          <span className="enquiry__rule" aria-hidden="true" />
        </p>
      </header>

      <div className="enquiry__body">
        <div className="enquiry__intro">
          <h2 className="enquiry__headline" id="enquiry-headline">
            Begin Your Journey With <em>TheHealthyStitch</em>
          </h2>
          <p className="enquiry__standfirst">
            Share your health goals and lifestyle preferences. Your enquiry is saved
            and opens immediately in WhatsApp for Mitali.
          </p>

          <ol className="enquiry__steps">
            <li>
              <span className="enquiry__step-num" aria-hidden="true">
                01
              </span>
              <span>Select your primary health goal and dietary preference.</span>
            </li>
            <li>
              <span className="enquiry__step-num" aria-hidden="true">
                02
              </span>
              <span>Specify your preferred consultation time window.</span>
            </li>
            <li>
              <span className="enquiry__step-num" aria-hidden="true">
                03
              </span>
              <span>Send on WhatsApp to connect directly with Mitali.</span>
            </li>
          </ol>

          <div className="enquiry__assurance">
            <ShieldCheck className="enquiry__assurance-icon" />
            <p>
              Your details are kept completely private and submitted directly to Mitali Shah
              for personalised clinical assessment.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="enquiry__success-card" role="alert">
            <div className="enquiry__success-badge">
              <CheckCircle2 className="enquiry__success-icon" />
              <span>Enquiry Submitted Successfully</span>
            </div>

            <h3 className="enquiry__success-title">
              Thank you, {sent.name}!
            </h3>

            <p className="enquiry__success-desc">
              Your consultation enquiry has been recorded in our system and prepared for Mitali.
              WhatsApp should now be open with your enquiry pre-typed. Simply press send there.
            </p>

            <div className="enquiry__success-summary">
              {sent.programme && (
                <div className="enquiry__success-item">
                  <span className="enquiry__success-label">Selected Programme</span>
                  <strong className="enquiry__success-value">{sent.programme}</strong>
                </div>
              )}
              <div className="enquiry__success-item">
                <span className="enquiry__success-label">Primary Health Goal</span>
                <strong className="enquiry__success-value">
                  {sent.goal === 'Other' && sent.customGoal ? `Other (${sent.customGoal})` : sent.goal}
                </strong>
              </div>
              <div className="enquiry__success-item">
                <span className="enquiry__success-label">Dietary Preference</span>
                <strong className="enquiry__success-value">
                  {sent.diet === 'Other' && sent.customDiet ? `Other (${sent.customDiet})` : sent.diet}
                </strong>
              </div>
              <div className="enquiry__success-item">
                <span className="enquiry__success-label">Preferred Time</span>
                <strong className="enquiry__success-value">{sent.consultationTime}</strong>
              </div>
            </div>

            <div className="enquiry__success-actions">
              <a
                href={sent.href}
                className="enquiry__btn enquiry__btn--whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="enquiry__btn-icon" />
                Reopen in WhatsApp
                {NEW_TAB}
              </a>

              <button
                type="button"
                className="enquiry__btn enquiry__btn--reset"
                onClick={resetForm}
              >
                <RotateCcw className="enquiry__btn-icon" aria-hidden="true" />
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          <form
            className="enquiry__form"
            noValidate
            aria-labelledby="enquiry-headline"
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <div className="enquiry__grid">
              {/* Field: Name */}
              <div className="enquiry__field">
                <label className="enquiry__label" htmlFor="enquiry-name">
                  Your name <span className="enquiry__required">*</span>
                </label>
                <input
                  className="enquiry__control"
                  type="text"
                  autoComplete="name"
                  placeholder="E.g. Ananya Mehta"
                  required
                  {...bind('name')}
                />
                {error('name')}
              </div>

              {/* Field: Phone */}
              <div className="enquiry__field">
                <label className="enquiry__label" htmlFor="enquiry-phone">
                  Phone / WhatsApp number <span className="enquiry__required">*</span>
                </label>
                <input
                  className="enquiry__control"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="E.g. +91 98200 12345"
                  required
                  {...bind('phone')}
                />
                {error('phone')}
              </div>

              {/* Field: Preferred Programme (Optional / Preselected from Plans page) */}
              <div className="enquiry__field">
                <label className="enquiry__label" htmlFor="enquiry-programme">
                  Preferred Programme <span className="enquiry__optional">(optional)</span>
                  {values.programme && (
                    <span className="enquiry__preselected-tag">
                      <Sparkles className="enquiry__preselected-icon" /> Preselected
                    </span>
                  )}
                </label>
                <select
                  className={`enquiry__control${values.programme ? '' : ' is-placeholder'}`}
                  {...bind('programme')}
                >
                  <option value="">Choose a programme</option>
                  {PROGRAMME_OPTIONS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 1 (Mandatory): Primary Health Goal */}
              <div className={`enquiry__field${goalHighlight ? ' is-highlighted' : ''}`}>
                <label className="enquiry__label" htmlFor="enquiry-goal">
                  Primary Health Goal <span className="enquiry__required">*</span>
                  {values.goal && selectedGoal === values.goal && (
                    <span className="enquiry__preselected-tag">
                      <Sparkles className="enquiry__preselected-icon" /> Preselected
                    </span>
                  )}
                </label>
                <select
                  className={`enquiry__control${values.goal ? '' : ' is-placeholder'}`}
                  required
                  {...bind('goal')}
                >
                  <option value="" disabled>
                    Select from 14 Health Categories
                  </option>
                  {HEALTH_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {error('goal')}
              </div>

              {/* Conditional Description for Other Goal */}
              {values.goal === 'Other' && (
                <div className="enquiry__field enquiry__field--wide">
                  <label className="enquiry__label" htmlFor="enquiry-customGoal">
                    Describe Your Health Goal <span className="enquiry__required">*</span>
                  </label>
                  <input
                    id="enquiry-customGoal"
                    className="enquiry__control"
                    type="text"
                    placeholder="E.g. High cholesterol, sports nutrition, allergy management..."
                    autoFocus
                    {...bind('customGoal')}
                  />
                  {error('customGoal')}
                </div>
              )}

              {/* Field 2 (Mandatory): Jain / Vegetarian Preference */}
              <div className="enquiry__field">
                <label className="enquiry__label" htmlFor="enquiry-diet">
                  Dietary Preference <span className="enquiry__required">*</span>
                </label>
                <select
                  className={`enquiry__control${values.diet ? '' : ' is-placeholder'}`}
                  required
                  {...bind('diet')}
                >
                  <option value="" disabled>
                    Select Dietary Preference
                  </option>
                  {DIETARY_PREFERENCES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
                {error('diet')}
              </div>

              {/* Conditional Description for Other Diet */}
              {values.diet === 'Other' && (
                <div className="enquiry__field enquiry__field--wide">
                  <label className="enquiry__label" htmlFor="enquiry-customDiet">
                    Describe Dietary Preference <span className="enquiry__required">*</span>
                  </label>
                  <input
                    id="enquiry-customDiet"
                    className="enquiry__control"
                    type="text"
                    placeholder="E.g. Vegan, eggetarian, gluten-free, dairy-free..."
                    autoFocus
                    {...bind('customDiet')}
                  />
                  {error('customDiet')}
                </div>
              )}

              {/* Field 3 (Mandatory): Preferred Consultation Time */}
              <div className="enquiry__field">
                <label className="enquiry__label" htmlFor="enquiry-consultationTime">
                  Preferred Consultation Time <span className="enquiry__required">*</span>
                </label>
                <select
                  className={`enquiry__control${values.consultationTime ? '' : ' is-placeholder'}`}
                  required
                  {...bind('consultationTime')}
                >
                  <option value="" disabled>
                    Select Preferred Time Window
                  </option>
                  {CONSULTATION_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {error('consultationTime')}
              </div>

              {/* Field: Message (Optional) */}
              <div className="enquiry__field enquiry__field--wide">
                <label className="enquiry__label" htmlFor="enquiry-message">
                  Anything else Mitali should know?{' '}
                  <span className="enquiry__optional">(optional)</span>
                </label>
                <textarea
                  className="enquiry__control"
                  rows={4}
                  placeholder="Your daily schedule, known allergies, medical history, or foods you love…"
                  {...bind('message')}
                />
              </div>
            </div>

            <div className="enquiry__actions">
              <button
                type="submit"
                className="enquiry__btn enquiry__btn--whatsapp"
                disabled={isSubmitting}
              >
                <WhatsAppIcon className="enquiry__btn-icon" />
                <span>Send on WhatsApp</span>
                {NEW_TAB}
              </button>
            </div>

            <p className="enquiry__privacy">
              All submitted enquiries are encrypted and directly routed to Mitali Shah.
              Nothing is shared with external commercial advertisers.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
