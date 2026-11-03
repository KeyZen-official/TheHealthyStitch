import { useEffect, useRef, useState } from 'react'
import { Mail, Menu, X } from 'lucide-react'
import { WhatsAppIcon } from './icons/BrandIcons.jsx'
import { CONTACT, emailHref, whatsappHref } from '../contact.js'

/**
 * Below this width the links no longer fit in the bar beside the wordmark,
 * so they fold into a Menu button. Keep in step with the matching media query
 * in global.css.
 */
const COMPACT = '(max-width: 959px)'

/**
 * The site navigation.
 *
 * On wide screens the links sit in the bar. On narrower ones they fold behind
 * a Menu button and open as a panel under the bar: a disclosure, not a modal,
 * so focus is not trapped. Opening it moves focus to the first link, because
 * the links come before the button in the page and Tab would otherwise skip
 * them. It closes on any link in the bar, on Escape (focus returns to the
 * button), on a click or focus outside the nav, and when the screen widens
 * past COMPACT.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const nav = navRef.current

    nav?.querySelector('#nav-links a')?.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onPointer = (event) => {
      if (!nav?.contains(event.target)) setOpen(false)
    }
    // Tabbing on past the last link leaves the nav: close, so the panel never
    // covers whatever has focus. No target means the window itself lost focus
    // (another tab or app), so leave the menu as it was.
    const onFocusOut = (event) => {
      const next = event.relatedTarget
      if (next && !nav?.contains(next)) setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    nav?.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      nav?.removeEventListener('focusout', onFocusOut)
    }
  }, [open])

  useEffect(() => {
    const media = window.matchMedia(COMPACT)
    const sync = () => {
      if (!media.matches) setOpen(false)
    }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const close = () => setOpen(false)

  return (
    <nav className={`nav${open ? ' is-open' : ''}`} aria-label="Main" ref={navRef}>
      {/* The name is the mark: no separate logo. "stitch" carries the brand's
          stitched underline, the same one the section headlines use. */}
      <a className="nav__brand" href="#top" aria-label="Healthystitch, back to top" onClick={close}>
        <span className="nav__name" aria-hidden="true">
          Healthy<em>stitch</em>
        </span>
      </a>

      {/* Places on the page first, then the two ways to reach Mitali
          directly, which leave the page. */}
      <ul className="nav__links" id="nav-links">
        <li>
          <a href="#top" onClick={close}>
            Home
          </a>
        </li>
        <li>
          {/* There is no list of plans or prices yet. "Why Healthystitch"
              is the section that describes what a plan is. */}
          <a href="#proof" onClick={close}>
            Plans
          </a>
        </li>
        <li>
          <a href="#enquiry" onClick={close}>
            Enquiry form
          </a>
        </li>
        <li>
          {/* The same chat as the floating button. */}
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" onClick={close}>
            <WhatsAppIcon className="nav__link-icon nav__link-icon--whatsapp" />
            Contact
            <span className="u-sr"> on WhatsApp (opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={emailHref} onClick={close}>
            <Mail className="nav__link-icon nav__link-icon--mail" aria-hidden="true" />
            <span className="u-sr">Email </span>
            {CONTACT.email}
          </a>
        </li>
      </ul>

      <div className="nav__end">
        <a className="nav__cta" href="#enquiry" onClick={close}>
          Get Started <span aria-hidden="true">&#8594;</span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          ref={toggleRef}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X className="nav__toggle-icon" aria-hidden="true" />
          ) : (
            <Menu className="nav__toggle-icon" aria-hidden="true" />
          )}
          <span className="u-sr">Menu</span>
        </button>
      </div>
    </nav>
  )
}
