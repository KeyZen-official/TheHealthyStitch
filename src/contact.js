// Every way to reach TheHealthyStitch, in one place. The floating WhatsApp
// button, the nav's Contact and email links, the enquiry form and the footer
// all read from here, so a changed number or a new profile link is a
// one-line edit.

export const CONTACT = {
  email: 'shahmitali.ms@gmail.com',

  whatsapp: {
    // wa.me wants the full international number as digits only: 91 is
    // India's country code, followed by the 10-digit mobile number.
    number: '918879293255',
    display: '+91 88792 93255',
    // Typed into the chat for the visitor, who can edit it before sending.
    // A blank chat is a harder first step than a sentence to send.
    message: "Hi Mitali! I'd like to know more about your nutrition plans with TheHealthyStitch.",
  },

  // ── BEFORE THIS GOES LIVE ────────────────────────────────────────────
  // The real profile links were not supplied. Until they are, these point at
  // the platforms' home pages: harmless, but useless to a visitor. Paste the
  // full profile URLs in and delete `pending`.
  // ─────────────────────────────────────────────────────────────────────
  social: [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/the_healthy_stitch?dlrf=YmxzMG01cGZwZjB5' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1F9pFvkeCP/?mibextid=wwXIfr' },
  ],
}

/** A wa.me link that opens a chat with Mitali, the first message pre-typed. */
export const whatsappHref = (message = CONTACT.whatsapp.message) =>
  `https://wa.me/${CONTACT.whatsapp.number}?text=${encodeURIComponent(message)}`

export const emailHref = `mailto:${CONTACT.email}`

/** A mailto link with the subject and body filled in (the enquiry form). */
export const mailtoHref = (subject, body) =>
  `${emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
