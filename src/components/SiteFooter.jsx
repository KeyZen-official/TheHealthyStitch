import { ArrowUp, Mail } from 'lucide-react'
import { SOCIAL_ICONS, WhatsAppIcon } from './icons/BrandIcons.jsx'
import { CONTACT, emailHref, whatsappHref } from '../contact.js'

/** Every section the page has, in page order. */
const EXPLORE = [
  { label: 'About us', href: '#about' },
  { label: 'Client results', href: '#transformations' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Why us', href: '#proof' },
  { label: 'Enquiry form', href: '#enquiry' },
]

/** Read out after links that open somewhere else, so nobody is surprised. */
const NEW_TAB = <span className="u-sr"> (opens in a new tab)</span>

/**
 * The page footer: a last call to get in touch, then contact details, the
 * section links and the social profiles, then the small print.
 *
 * It sits outside <main>, so it is the page's contentinfo landmark. The dark
 * band is the results section's `theme-dark-olive`, so the page closes on the
 * same ground as its darkest section.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer theme-dark-olive" id="contact">
      <div className="site-footer__inner">
        <section className="site-footer__cta" aria-labelledby="footer-cta-title">
          <p className="site-footer__eyebrow">
            <span>Get in touch</span>
            <span className="site-footer__rule" aria-hidden="true" />
          </p>

          <div className="site-footer__cta-row">
            <div>
              <h2 className="site-footer__headline" id="footer-cta-title">
                Ready when you <em>are</em>
              </h2>
              <p className="site-footer__lead">
                Questions about a plan, or ready to begin? Message Mitali on
                WhatsApp or send her an email.
              </p>
            </div>

            <div className="site-footer__actions">
              <a
                className="site-footer__btn site-footer__btn--whatsapp"
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="site-footer__btn-icon" />
                Chat on WhatsApp
                {NEW_TAB}
              </a>
              <a className="site-footer__btn site-footer__btn--email" href={emailHref}>
                <Mail className="site-footer__btn-icon" aria-hidden="true" />
                Send an email
              </a>
            </div>
          </div>
        </section>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__wordmark">
              Healthy<em>stitch</em>
            </p>
            {/* Mitali's own closing line, from her story. */}
            <p className="site-footer__motto">A lifestyle, not a temporary goal.</p>
          </div>

          <nav className="site-footer__col" aria-labelledby="footer-explore">
            <h3 className="site-footer__title" id="footer-explore">
              Explore
            </h3>
            <ul className="site-footer__list">
              {EXPLORE.map(({ label, href }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__col">
            <h3 className="site-footer__title">Contact</h3>
            <ul className="site-footer__list">
              <li>
                <a className="site-footer__contact" href={emailHref}>
                  <Mail className="site-footer__contact-icon" aria-hidden="true" />
                  <span>
                    <span className="site-footer__contact-kind">Email</span>
                    <span className="site-footer__contact-value">{CONTACT.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="site-footer__contact"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="site-footer__contact-icon" />
                  <span>
                    <span className="site-footer__contact-kind">WhatsApp</span>
                    <span className="site-footer__contact-value">
                      {CONTACT.whatsapp.display}
                    </span>
                  </span>
                  {NEW_TAB}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__title">Follow</h3>
            <ul className="site-footer__social">
              {CONTACT.social.map(({ id, label, href }) => {
                const Icon = SOCIAL_ICONS[id]
                return (
                  <li key={id}>
                    <a
                      className="site-footer__social-link"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="site-footer__social-icon" />
                      {label}
                      {NEW_TAB}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            &copy; {year} The Healthy Stitch. Nutrition guidance, not medical
            advice.
          </p>
          {/* CC BY 2.0 requires a visible credit for the hero slideshow's
              photographs. See public/assets/ATTRIBUTION.md. */}
          <p className="site-footer__credit">
            Lifestyle photographs: Shixart1985 / Wikimedia Commons,{' '}
            <a
              href="https://creativecommons.org/licenses/by/2.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 2.0
              {NEW_TAB}
            </a>
          </p>
          <a className="site-footer__top" href="#top">
            Back to top
            <ArrowUp className="site-footer__top-icon" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
