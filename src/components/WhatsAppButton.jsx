import { useEffect, useState } from 'react'
import { WhatsAppIcon } from './icons/BrandIcons.jsx'
import { whatsappHref } from '../contact.js'

/**
 * The floating WhatsApp button, fixed to the bottom-right corner on every
 * screen. It opens a chat with Mitali with a first message already typed,
 * which the visitor can edit before sending.
 *
 * The "Chat on WhatsApp" label slides out on hover or keyboard focus. It is
 * part of the link, so it can be pointed at without vanishing, and Escape
 * tucks it away again, because it covers a little of the page beside the
 * button (WCAG 1.4.13).
 *
 * The name comes from aria-label, not from the label: at rest the label is
 * visibility: hidden, and hidden text does not count towards a link's name,
 * so a screen reader would otherwise announce an unnamed link.
 */
export default function WhatsAppButton() {
  const [hushed, setHushed] = useState(false)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setHushed(true)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <a
      className={`wa-fab${hushed ? ' is-hushed' : ''}`}
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Mitali (opens in a new tab)"
      onMouseLeave={() => setHushed(false)}
      onBlur={() => setHushed(false)}
    >
      <span className="wa-fab__label" aria-hidden="true">
        Chat on WhatsApp
      </span>
      <span className="wa-fab__button">
        <WhatsAppIcon className="wa-fab__icon" />
      </span>
    </a>
  )
}
