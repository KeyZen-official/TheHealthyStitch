import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import useInView from '../hooks/useInView.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import useDragScroll from '../hooks/useDragScroll.js'

/**
 * Client reviews, as they arrived on WhatsApp.
 *
 * Transcribed from the screenshots the clients' chats came in, then corrected
 * for spelling, grammar and capital letters, as asked. What each client said
 * is unchanged, and the note under the row says the messages were edited.
 * Only the client's own messages are kept. Contact-name details (surnames,
 * relationships), profile photos and the replies are left out, and each
 * person appears by first name only. Jalpa wrote partly in Gujarati, in
 * English letters; those words stay as she wrote them, with a translation.
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
        text: 'Honestly, my experience with you was genuinely amazing. \u2764\uFE0F I not only saw great results in my weight loss journey but also felt really supported throughout the process. What I personally loved the most was how you cared about my mental health as well, understood me on a personal level and made sure I felt comfortable and motivated. You went beyond just giving a diet plan, and that made a huge difference for me. I am genuinely grateful for your guidance and would definitely recommend you to anyone looking for a dietician who truly cares. \uD83D\uDC95',
      },
    ],
  },
  {
    id: 'jalpa',
    name: 'Jalpa',
    messages: [
      {
        time: '2:38 PM',
        text: 'Thank you very much\u2026 Te mane saras help kari weight loss ma.',
      },
      {
        time: '2:40 PM',
        text: 'Bau saras journey rahi tari saathe\u2026 You are a fantastic person with a good soul. I enjoyed every meal you gave me. So thank you once again.',
      },
    ],
    translation: {
      from: 'Gujarati',
      text: '\u201CThank you very much\u2026 You helped me so much with my weight loss.\u201D \u201CIt was a lovely journey with you\u2026\u201D',
    },
  },
  {
    id: 'kathan',
    name: 'Kathan',
    messages: [
      {
        time: '7:31 AM',
        text: 'Hi, I had a really good experience with your plan. It was practical to follow and helped me become more mindful of my eating habits and nutrition. I really appreciate the effort you put into making the plan easy to follow in my daily routine. Thank you for all your help!',
      },
    ],
  },
  {
    id: 'drishti',
    name: 'Drishti',
    messages: [
      {
        time: '10:52 AM',
        text: 'I followed your diet plan around the time of my wedding. The plan was very practical, the recipes were really easy to make, and even while out shopping, I mostly ate healthy food. There was almost no sugar in my diet for those 2\u20133 months. I had a pretty good experience, and I would rejoin even now.',
      },
    ],
  },
  {
    id: 'arpita',
    name: 'Arpita',
    messages: [
      {
        time: '3:15 PM',
        text: 'I was on her plan for a good 6 months. She is very knowledgeable. I found a lot of improvement in my symptoms of insulin resistance within a month of starting her diet plans. She gives lots of options, so you don\u2019t get bored of eating the same food. She listens patiently and addresses your cravings as well. She is available all the time for any queries or questions. She really gives positive vibes, and her plan worked really well for me. \uD83D\uDE0D Thank you for all your efforts, Mitali.',
      },
    ],
  },
]

/** What the row stops on, for the arrows and the mouse drag. */
const CARD = '.review'

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
            <span className="review__via">On WhatsApp</span>
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

/** Whether the row can move either way, and whether it needs to at all. */
function readEdges(row) {
  const max = row.scrollWidth - row.clientWidth
  return { fits: max <= 1, atStart: row.scrollLeft <= 1, atEnd: row.scrollLeft >= max - 1 }
}

const sameEdges = (a, b) => a.fits === b.fits && a.atStart === b.atStart && a.atEnd === b.atEnd

/**
 * The reviews, in a row the visitor slides sideways. Nothing moves on its
 * own.
 *
 * The row is an ordinary sideways scroller with CSS snap points, so a finger
 * or a trackpad slides it natively and it comes to rest on a card. A mouse
 * can drag it too (useDragScroll), and the arrows beside the headline step
 * through it one card at a time for anyone not swiping. Once it has focus,
 * the arrow keys scroll it. On a screen wide enough to show every card, the
 * arrows and the tab stop go away, because there is nothing to scroll.
 */
export default function ReviewsSection() {
  const [ref, inView] = useInView()
  const reduced = useReducedMotion()
  const rowRef = useRef(null)
  const [edges, setEdges] = useState({ fits: false, atStart: true, atEnd: false })

  useDragScroll(rowRef, { item: CARD, reduced })

  useEffect(() => {
    const row = rowRef.current
    if (!row) return undefined
    let frame = 0

    const read = () => {
      frame = 0
      const next = readEdges(row)
      setEdges((prev) => (sameEdges(prev, next) ? prev : next))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    row.addEventListener('scroll', schedule, { passive: true })
    // The row and the list both change size with the screen.
    const resize = new ResizeObserver(schedule)
    resize.observe(row)
    if (row.firstElementChild) resize.observe(row.firstElementChild)
    return () => {
      row.removeEventListener('scroll', schedule)
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  /** One card left or right. The snap points make it land square. */
  const go = (direction) => {
    const row = rowRef.current
    if (!row) return
    if ((direction < 0 && edges.atStart) || (direction > 0 && edges.atEnd)) return

    const cards = row.querySelectorAll(CARD)
    const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : row.clientWidth
    const max = row.scrollWidth - row.clientWidth
    const index = Math.round(row.scrollLeft / step) + direction
    row.scrollTo({
      left: Math.min(max, Math.max(0, index * step)),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      className={`reviews${inView ? ' is-revealed' : ''}`}
      id="reviews"
      ref={ref}
      aria-labelledby="reviews-headline"
    >
      <header className="reviews__head">
        <p className="reviews__eyebrow">
          <span>Client Reviews</span>
          <span className="reviews__rule" aria-hidden="true" />
        </p>

        <h2 className="reviews__headline" id="reviews-headline">
          Straight From The <em>Chat</em>
        </h2>

        <p className="reviews__standfirst">
          What clients wrote to Mitali on WhatsApp after their plans.
        </p>

        {/* Last in the source, so they are read just before the row they
            move. The grid in reviews.css lifts them beside the headline on
            wide screens. aria-disabled rather than disabled: a disabled
            button drops the focus of whoever just pressed it to reach the
            end. */}
        {edges.fits ? null : (
          <div className="reviews__arrows">
            <button
              type="button"
              className="reviews__arrow"
              aria-label="Previous review"
              aria-controls="reviews-row"
              aria-disabled={edges.atStart}
              onClick={() => go(-1)}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="reviews__arrow"
              aria-label="Next review"
              aria-controls="reviews-row"
              aria-disabled={edges.atEnd}
              onClick={() => go(1)}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      <div
        ref={rowRef}
        id="reviews-row"
        className={`reviews__viewport${edges.fits ? '' : ' is-scrollable'}`}
        role="region"
        aria-label="Client reviews"
        // A tab stop only while there is something to scroll: once the row
        // has focus, the arrow keys move it.
        tabIndex={edges.fits ? undefined : 0}
      >
        {/* role="list" because Safari drops list semantics from a list that
            is styled list-style: none. */}
        <ul className="reviews__list" role="list">
          {REVIEWS.map((review) => (
            <ReviewCard review={review} key={review.id} />
          ))}
        </ul>
      </div>

      <footer className="reviews__foot">
        <p className="reviews__note">
          Shared with each client&rsquo;s permission, under first names only.
          Spelling and grammar have been corrected. These describe individual
          experiences, not a promise of results.
        </p>
      </footer>
    </section>
  )
}
