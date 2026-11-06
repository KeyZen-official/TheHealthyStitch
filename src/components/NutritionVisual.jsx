import { CAPSULE_IMAGE } from '../assets.js'

export default function NutritionVisual() {
  return (
    <figure className="visual">
      {/* Oversized decorative letters, cropped by the panel edges. Read as
          texture rather than as a word, which is why a long one works. */}
      <span className="visual__letters" aria-hidden="true">
        HEALTHY
      </span>

      <img
        className="visual__capsule"
        src={CAPSULE_IMAGE}
        alt="Open nutrition capsule surrounded by fresh vegetables, fruit and herbs — Vegetarian Plans That Survive a Blood Test"
        width="1600"
        height="1600"
        loading="eager"
        decoding="async"
      />
    </figure>
  )
}
