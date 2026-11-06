import { ABOUT_PORTRAIT } from '../assets.js'
import useInView from '../hooks/useInView.js'

/**
 * About us: Mitali Shah's own account of how she came to nutrition.
 *
 * The words are hers, exactly as supplied, including the capitalised YOU.
 * The changes are her full name in the greeting, as asked, and the caption
 * under the portrait, which names her as the founder of TheHealthyStitch.
 * Only the typography is ours: the realisation she builds up to gets a
 * stitched rule, and the last two lines are set larger as the sign-off.
 */
export default function AboutSection() {
  const [ref, inView] = useInView()

  return (
    <section
      className={`about${inView ? ' is-revealed' : ''}`}
      id="about"
      ref={ref}
      aria-labelledby="about-headline"
    >
      <header className="about__head">
        <p className="about__eyebrow">
          <span>About Us</span>
          <span className="about__rule" aria-hidden="true" />
        </p>

        <h2 className="about__headline" id="about-headline">
          My Story, My <em>Journey</em>
        </h2>
      </header>

      <div className="about__body">
        <figure className="about__portrait">
          <div className="about__frame">
            <img
              src={ABOUT_PORTRAIT.src}
              alt={ABOUT_PORTRAIT.alt}
              width={ABOUT_PORTRAIT.width}
              height={ABOUT_PORTRAIT.height}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="about__caption">
            <span className="about__caption-name">Mitali Shah</span>
            Founder of TheHealthyStitch
          </figcaption>
        </figure>

        <div className="about__story">
          <h3 className="about__hello">
            The Story Behind <br />
            TheHealthyStitch
          </h3>

          <p>
            My journey towards nutrition wasn&rsquo;t just about learning what
            to eat. It started with my own struggles with weight loss.
          </p>

          <p>
            I tried different approaches, followed various diet trends and
            often found myself struggling to achieve the results I wanted. But
            I never gave up.
          </p>

          <p>
            Along the way, I began questioning the myths I had believed about
            weight loss and realised something important:
          </p>

          <div className="about__transformations">
            <figure className="about__transformation-card">
              <img
                src="/assets/transformations/transformation-05.jpg"
                alt="Mitali Shah personal transformation before and after"
                className="about__transformation-img"
                width="1200"
                height="828"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="about__transformation-card">
              <img
                src="/assets/transformations/transformation-06.jpg"
                alt="Mitali Shah healthy lifestyle transformation before and after"
                className="about__transformation-img"
                width="1200"
                height="828"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <p className="about__realisation">
            Weight loss isn&rsquo;t about following a temporary diet.
            It&rsquo;s about changing the way you live, eat and think about
            food.
          </p>

          <p>
            I learned that sustainable weight management is a result of
            consistent lifestyle changes, mindful food choices and a
            constructive daily routine that you can maintain for life.
          </p>

          <p>
            This personal journey inspired me to pursue nutrition
            professionally and become a nutritionist, so I could help others
            develop a healthier relationship with food and move beyond
            restrictive diet mindsets.
          </p>

          <p>
            Through TheHealthyStitch, I want to help people understand that
            healthy eating doesn&rsquo;t mean giving up their favourite foods,
            following extreme diets or constantly worrying about calories.
          </p>

          <p>
            It means making better choices, building sustainable habits and
            finding a balance that works for <strong className="about__you">YOU</strong>.
          </p>

          <p className="about__creator">
            Because <strong className="about__you">YOU</strong> are the
            creator of a new and healthier{' '}
            <strong className="about__you">YOU</strong>!
          </p>

          <p className="about__signoff">
            Let&rsquo;s make your journey towards better health a lifestyle,
            not a temporary goal.
          </p>
        </div>
      </div>
    </section>
  )
}
