import { useEffect, useRef, useState } from 'react'
import { Mail, Menu, X } from 'lucide-react'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './icons/BrandIcons.jsx'
import { CONTACT, emailHref, whatsappHref } from '../contact.js'

/**
 * Below this width the links no longer fit in the bar beside the wordmark,
 * so they fold into a Menu button. Keep in step with the matching media query
 * in global.css.
 */
const COMPACT = '(max-width: 1199px)'

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
export default function Navbar({ currentPage = 'home', onNavigate }) {
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  const handleLinkClick = (page, hash = '') => (event) => {
    event.preventDefault()
    setOpen(false)
    if (onNavigate) {
      onNavigate(page, hash)
    } else {
      if (page === 'plans') {
        window.location.pathname = '/plans'
      } else {
        window.location.href = hash || '/'
      }
    }
  }

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
      {/* The logo, then the name. "Stitch" carries the brand's stitched
          underline, the same one the section headlines use. */}
      <a
        className="nav__brand"
        href="/"
        aria-label="TheHealthyStitch, back to top"
        onClick={handleLinkClick('home', '#top')}
      >
        <img
          src="/assets/logo.png"
          alt="TheHealthyStitch logo"
          className="nav__logo-img"
          width="58"
          height="58"
        />
        <span className="nav__name" aria-hidden="true">
          TheHealthy<em>Stitch</em>
        </span>
      </a>

      {/* Places on the page first, then the two ways to reach Mitali
          directly, which leave the page. */}
      <ul className="nav__links" id="nav-links">
        <li>
          <a
            href="/"
            className={currentPage === 'home' ? 'is-active' : ''}
            onClick={handleLinkClick('home', '#top')}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/plans"
            className={currentPage === 'plans' ? 'is-active' : ''}
            onClick={handleLinkClick('plans', '')}
          >
            Plans
          </a>
        </li>
        <li>
          <a href="#enquiry" onClick={handleLinkClick(currentPage, '#enquiry')}>
            Enquiry Form
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
        <li>
          <a
            href={CONTACT.social.find((s) => s.id === 'instagram')?.href || 'https://www.instagram.com/the_healthy_stitch?dlrf=YmxzMG01cGZwZjB5'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            aria-label="Instagram (opens in a new tab)"
            title="Instagram"
            className="nav__social-link"
          >

            <InstagramIcon className="nav__link-icon nav__link-icon--social" />
            <span className="nav__social-text">Instagram</span>
          </a>
        </li>
        <li>
          <a
            href={CONTACT.social.find((s) => s.id === 'facebook')?.href || 'https://www.facebook.com/share/1F9pFvkeCP/?mibextid=wwXIfr'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            aria-label="Facebook (opens in a new tab)"
            title="Facebook"
            className="nav__social-link"
          >
            <FacebookIcon className="nav__link-icon nav__link-icon--social" />
            <span className="nav__social-text">Facebook</span>
          </a>
        </li>
      </ul>

      <div className="nav__end">
        <a className="nav__cta" href="#enquiry" onClick={handleLinkClick(currentPage, '#enquiry')}>
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
