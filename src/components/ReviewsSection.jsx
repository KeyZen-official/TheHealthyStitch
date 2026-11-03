import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import useInView from '../hooks/useInView.js'
import useReducedMotion from '../hooks/useReducedMotion.js'

/**
 * Client reviews, as they arrived on WhatsApp.
 *
 * Transcribed word for word from the screenshots the clients' chats came in,
 * typos and emoji included: the point of the section is that nobody has
 * polished them. Only the client's own messages are kept. Contact-name
 * details (surnames, relationships), profile photos and the replies are left
 * out, and each person appears by first name only.
 *
 * `translation` is shown under messages that are not in English.
 */
const REVIEWS = [
  {
    id: 'zeel',
    name: 'Zeel',
    messages: [
      {
        time: '10:05 PM',
        text: 'Honestly, my experience with you was genuinely amazing\u2764\uFE0F I not only saw great results in my weight loss journey but also felt really supported throughout the process. What I personally loved the most was how you cared about my mental health as well, understood me on my personal level and made sure I felt comfortable and motivated. You went beyond just giving a diet plan, and that made a huge difference for me. I am genuinely grateful for your guidance and would definitely recommend you to anyone looking for a dietician who truly cares \uD83D\uDC95',
      },
    ],
  },
  {
    id: 'jalpa',
    name: 'Jalpa',
    messages: [
      {
        time: '2:38 PM',
        text: 'Thank u very much...te mane saras help kari weight loss ma',
      },
      {
        time: '2:40 PM',
        text: 'Bau saras journey rahi tari saathe..u r a fantastic person....with good soul....I enjoyed every meal u gave....so Thank you once again',
      },
    ],
    translation: {
      from: 'Gujarati',
      text: '\u201CThank you very much\u2026 you helped me so much with my weight loss.\u201D \u201CIt was a lovely journey with you\u2026\u201D',
    },
  },
  {
    id: 'kathan',
    name: 'Kathan',
    messages: [
      {
        time: '7:31 AM',
        text: 'Hi, I had a really good experience with your plan. It was practical to follow and helped me become more mindful of my eating habits and nutrition. Really appreciate the effort you put into making the plan easy to follow in my daily routine. Thank you for all your help!',
      },
    ],
  },
  {
    id: 'drishti',
    name: 'Drishti',
    messages: [
      {
        time: '10:52 AM',
        text: 'I had done the diet from you when it was my marriage happening and the diet plan was very practical and the receipes were damn easy to make and while the shopping also i was majorly eating healthy.. Sugar was almost not there in the 2-3 months of time. I had a pretty good experience. I would rejoin it even now.',
      },
    ],
  },
  {
    id: 'arpita',
    name: 'Arpita',
    messages: [
      {
        time: '3:15 PM',
        text: "I was under her plan for good 6months... She is very knowledgeable. I found lot of improvement in my symptoms of insulin resistance within a month of starting her diet plans. She gives lot of options so you didn't get bored of eating same food. She listens peacefully & addresses your cravings as well.She is available all the time for any query or questions.She really gives positive vibes & her plan worked really well for me \uD83D\uDE0D.. Thank you for all your efforts Mitali",
      },
    ],
  },
]

/** One chat card: a header with the client's name, then her messages. */
function ReviewCard({ review }) {
  const { name, messages, translation } = review

  return (
    <li className="review">
      <figure className="review__chat">
        <figcaption className="review__head">
          <span className="review__avatar" aria-hidden="true">
            {name.charAt(0)}
          </span>
          <span className="review__who">
            <span className="review__name">{name}</span>
            <span className="review__via">on WhatsApp</span>
          </span>
        </figcaption>

        <div className="review__thread">
          <blockquote className="review__messages">
            {messages.map(({ time, text }) => (
              <p className="review__bubble" key={time}>
                {text}
                {/* Floated, so it tucks into the last line when there is
                    room and drops below it when there is not, as WhatsApp
                    does. */}
                <span className="review__time" aria-hidden="true">
                  {time}
                </span>
              </p>
            ))}
          </blockquote>

          {/* Outside the blockquote: the translation is ours, not hers. */}
          {translation ? (
            <p className="review__translation">
              <span className="review__translation-tag">
                Translated from {translation.from}
              </span>
              {translation.text}
            </p>
          ) : null}
        </div>
      </figure>
    </li>
  )
}

/**
 * The reviews, running sideways in a loop.
 *
 * The strip is two identical lists side by side, slid left by exactly one
 * list's width and started again, so the join never shows. The copy is
 * aria-hidden: a screen reader hears each review once.
 *
 * Moving text that a reader cannot stop fails WCAG 2.2.2, and hover is not a
 * way to stop it on a phone or from a keyboard, so there is a real pause
 * button as well. With reduced motion the strip does not move at all: it
 * becomes a row you scroll sideways, and the copy and the button go away.
 */
export default function ReviewsSection() {
  const [ref, inView] = useInView()
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)

  return (
    <section
      className={`reviews${inView ? ' is-revealed' : ''}${paused ? ' is-paused' : ''}`}
      id="reviews"
      ref={ref}
      aria-labelledby="reviews-headline"
    >
      <header className="reviews__head">
        <p className="reviews__eyebrow">
          <span>Client reviews</span>
          <span className="reviews__rule" aria-hidden="true" />
        </p>

        <h2 className="reviews__headline" id="reviews-headline">
          Straight from the <em>chat</em>
        </h2>

        <p className="reviews__standfirst">
          What clients wrote to Mitali on WhatsApp after their plans, word for
          word.
        </p>

        {/* Last in the source, so it is read just before the strip it
            controls. The grid in reviews.css lifts it beside the headline on
            wide screens. */}
        {reduced ? null : (
          <button
            type="button"
            className="reviews__toggle"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Play the moving reviews' : 'Pause the moving reviews'}
          >
            {paused ? (
              <Play className="reviews__toggle-icon" aria-hidden="true" />
            ) : (
              <Pause className="reviews__toggle-icon" aria-hidden="true" />
            )}
            <span aria-hidden="true">{paused ? 'Play' : 'Pause'}</span>
          </button>
        )}
      </header>

      <div
        className="reviews__viewport"
        role="region"
        aria-label="Client reviews"
        // Only a scroller needs a tab stop: with reduced motion the row is
        // scrolled by hand, and a keyboard has to be able to reach it.
        tabIndex={reduced ? 0 : undefined}
      >
        <div className="reviews__track">
          <ul className="reviews__set">
            {REVIEWS.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </ul>

          {reduced ? null : (
            <ul className="reviews__set" aria-hidden="true">
              {REVIEWS.map((review) => (
                <ReviewCard review={review} key={review.id} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <footer className="reviews__foot">
        <p className="reviews__note">
          Shared with each client&rsquo;s permission, exactly as sent, first
          names only. These describe individual experiences, not a promise of
          results.
        </p>
      </footer>
    </section>
  )
}
