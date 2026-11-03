import NutritionVisual from './NutritionVisual.jsx'
import LifestyleSlides from './LifestyleSlides.jsx'
import NutritionPillars from './NutritionPillars.jsx'

export default function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="hero__left">
        <NutritionVisual />
      </div>

      <div className="hero__right">
        {/* Two set lines, broken at the comma. Left to wrap on its own, the
            column strands the "a" at the end of the first line. The space
            between the spans keeps the words apart for a screen reader. */}
        <h1 className="hero__headline">
          <span className="hero__line">Stitch by stitch,</span>{' '}
          <span className="hero__line">
            a healthier <em>you</em>.
          </span>
        </h1>

        <div className="hero__rule">
          <span className="hero__rule-label">Goals.</span>
          <span className="hero__rule-line" aria-hidden="true" />
          <span className="hero__rule-label">Health</span>
        </div>

        <LifestyleSlides />
        <NutritionPillars />
      </div>
    </section>
  )
}
