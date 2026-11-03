import { useRef, useState } from 'react'
import { Mail } from 'lucide-react'
import { WhatsAppIcon } from './icons/BrandIcons.jsx'
import { CONTACT, mailtoHref, whatsappHref } from '../contact.js'
import useInView from '../hooks/useInView.js'

/**
 * The choices for "What would you like help with?". Drawn from what the site
 * already says the plans address, and from what the reviews describe. Add,
 * remove or reword freely; the message just carries the chosen text.
 */
const GOALS = [
  'Weight loss',
  'Blood sugar or insulin resistance',
  'Cholesterol or blood pressure',
  'Healthier everyday eating',
  'Something else',
]

const EMPTY = { name: '', phone: '', email: '', goal: '', message: '' }

/** Field order, for moving focus to the first one that needs fixing. */
const ORDER = ['name', 'phone', 'email', 'goal']

const LIMITS = { name: 80, phone: 20, email: 120, message: 1000 }

/** Read out after links that open somewhere else, so nobody is surprised. */
const NEW_TAB = <span className="u-sr"> (opens in a new tab)</span>

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Enter your name.'
  }

  // Loose on purpose: spaces, dashes, brackets and a leading + are all fine.
  const phone = values.phone.trim()
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15 || /[^\d\s()+-]/.test(phone)) {
    errors.phone = 'Enter a phone number with at least 10 digits.'
  }

  const email = values.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Check the email address, or leave it blank.'
  }

  if (!values.goal) {
    errors.goal = 'Choose what you would like help with.'
  }

  return errors
}

/** The enquiry as plain lines: the same text goes to WhatsApp and to email. */
function compose(values) {
  const lines = [
    "Hi Mitali! I'd like to enquire about a nutrition plan.",
    '',
    `Name: ${values.name.trim()}`,
    `Phone: ${values.phone.trim()}`,
  ]
  if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`)
  lines.push(`Looking for help with: ${values.goal}`)
  if (values.message.trim()) lines.push('', values.message.trim())
  return lines
}

/**
 * The enquiry form.
 *
 * The site has no server, so nothing is submitted to it. "Send on WhatsApp"
 * opens a chat with Mitali with the enquiry already typed out; "Send by email"
 * opens the visitor's email app the same way. The visitor presses send there,
 * so the enquiry reaches Mitali from their own number or address, and nothing
 * is stored anywhere in between.
 *
 * Errors appear only after a first attempt to send, then clear as each field
 * is fixed. A failed send moves focus to the first field that needs fixing,
 * and that field's error is part of its description, so a screen reader reads
 * the problem out with the field.
 */
export default function EnquirySection() {
  const [ref, inView] = useInView()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [checked, setChecked] = useState(false)
  const [sent, setSent] = useState(null)
  const controls = useRef({})

  const change = (name) => (event) => {
    const next = { ...values, [name]: event.target.value }
    setValues(next)
    if (checked) setErrors(validate(next))
    setSent(null)
  }

  const send = (channel) => {
    const found = validate(values)
    setChecked(true)
    setErrors(found)

    const first = ORDER.find((name) => found[name])
    if (first) {
      setSent(null)
      controls.current[first]?.focus()
      return
    }

    const lines = compose(values)
    if (channel === 'whatsapp') {
      const href = whatsappHref(lines.join('\n'))
      window.open(href, '_blank', 'noopener,noreferrer')
      setSent({ channel, href })
    } else {
      // CRLF: RFC 6068 asks for it between lines of a mailto body.
      const href = mailtoHref(
        `Nutrition plan enquiry from ${values.name.trim()}`,
        lines.join('\r\n'),
      )
      window.location.href = href
      setSent({ channel, href })
    }
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
          <span>Enquiry form</span>
          <span className="enquiry__rule" aria-hidden="true" />
        </p>
      </header>

      <div className="enquiry__body">
        <div className="enquiry__intro">
          <h2 className="enquiry__headline" id="enquiry-headline">
            Tell Mitali about your <em>goals</em>
          </h2>
          <p className="enquiry__standfirst">
            A few details, and your enquiry goes straight to her on WhatsApp, or
            by email if you prefer.
          </p>

          <ol className="enquiry__steps">
            <li>
              <span className="enquiry__step-num" aria-hidden="true">
                01
              </span>
              <span>Fill in a few details.</span>
            </li>
            <li>
              <span className="enquiry__step-num" aria-hidden="true">
                02
              </span>
              <span>Choose Send on WhatsApp, or Send by email.</span>
            </li>
            <li>
              <span className="enquiry__step-num" aria-hidden="true">
                03
              </span>
              <span>
                Your message opens ready to go. Press send there, and it reaches
                Mitali.
              </span>
            </li>
          </ol>
        </div>

        <form
          className="enquiry__form"
          noValidate
          aria-labelledby="enquiry-headline"
          onSubmit={(event) => {
            event.preventDefault()
            send('whatsapp')
          }}
        >
          <div className="enquiry__grid">
            <div className="enquiry__field">
              <label className="enquiry__label" htmlFor="enquiry-name">
                Your name
              </label>
              <input
                className="enquiry__control"
                type="text"
                autoComplete="name"
                required
                {...bind('name')}
              />
              {error('name')}
            </div>

            <div className="enquiry__field">
              <label className="enquiry__label" htmlFor="enquiry-phone">
                Phone / WhatsApp number
              </label>
              <input
                className="enquiry__control"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                {...bind('phone')}
              />
              {error('phone')}
            </div>

            <div className="enquiry__field">
              <label className="enquiry__label" htmlFor="enquiry-email">
                Email <span className="enquiry__optional">(optional)</span>
              </label>
              <input
                className="enquiry__control"
                type="email"
                inputMode="email"
                autoComplete="email"
                {...bind('email')}
              />
              {error('email')}
            </div>

            <div className="enquiry__field">
              <label className="enquiry__label" htmlFor="enquiry-goal">
                What would you like help with?
              </label>
              <select
                className={`enquiry__control${values.goal ? '' : ' is-placeholder'}`}
                required
                {...bind('goal')}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
              {error('goal')}
            </div>

            <div className="enquiry__field enquiry__field--wide">
              <label className="enquiry__label" htmlFor="enquiry-message">
                Anything else Mitali should know?{' '}
                <span className="enquiry__optional">(optional)</span>
              </label>
              <textarea
                className="enquiry__control"
                rows={4}
                placeholder="Your routine, the foods you love, questions about plans…"
                {...bind('message')}
              />
            </div>
          </div>

          <div className="enquiry__actions">
            <button type="submit" className="enquiry__btn enquiry__btn--whatsapp">
              <WhatsAppIcon className="enquiry__btn-icon" />
              Send on WhatsApp
              {NEW_TAB}
            </button>
            <button
              type="button"
              className="enquiry__btn enquiry__btn--email"
              onClick={() => send('email')}
            >
              <Mail className="enquiry__btn-icon" aria-hidden="true" />
              Send by email
            </button>
          </div>

          {/* Always in the page, so screen readers announce what appears. */}
          <div className="enquiry__status" role="status">
            {sent?.channel === 'whatsapp' ? (
              <p>
                WhatsApp should now be open with your enquiry typed out. Press
                send there to reach Mitali. Didn&rsquo;t open?{' '}
                <a href={sent.href} target="_blank" rel="noopener noreferrer">
                  Open WhatsApp
                  {NEW_TAB}
                </a>
              </p>
            ) : null}
            {sent?.channel === 'email' ? (
              <p>
                Your email app should now be open with your enquiry typed out.
                Press send there. Nothing opened? <a href={sent.href}>Try again</a>,
                or write to {CONTACT.email}.
              </p>
            ) : null}
          </div>

          <p className="enquiry__privacy">
            Nothing you type here is stored on this website. It goes only to
            Mitali, from your own WhatsApp or email.
          </p>
        </form>
      </div>
    </section>
  )
}
