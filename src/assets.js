// Central asset registry.
// Swap a path here and the artwork changes everywhere it is used.

export const CAPSULE_IMAGE = '/assets/Healthy Produce Capsule Arrangement (2).png'

/**
 * Hero slideshow, in running order.
 *
 * `focus` is that frame's object-position. The organic mask crops hard on all
 * four sides, so each photograph needs its own subject anchor — a single
 * shared value pushes at least one of the three subjects out of frame.
 *
 * `tone` is that frame's filter. The three are lit very differently: the
 * kitchen is warm and low-key and needs lifting toward the editorial palette,
 * the harvest shot is already bright and would blow out under the same
 * correction.
 */
export const LIFESTYLE_SLIDES = [
  {
    id: 'slide-1',
    src: '/assets/img1.jpeg',
    alt: 'Healthy lifestyle and nutritious meals with TheHealthyStitch',
    caption: 'Made For Everyday Living',
    focus: 'center',
  },
  {
    id: 'slide-2',
    src: '/assets/img2.jpeg',
    alt: 'Fresh, balanced vegetarian and jain nutrition with TheHealthyStitch',
    caption: 'Nutrition In Every Bite',
    focus: 'center',
  },
  {
    id: 'slide-3',
    src: '/assets/img3.jpeg',
    alt: 'Sustainable habits and healthy lifestyle with TheHealthyStitch',
    caption: 'Healthy Habits, Real Life',
    focus: 'center',
  },
]

/**
 * The About section's portrait: Mitali with her Diploma in Nutrition. Cropped
 * to 4:5 from the supplied photograph by tools/prepare_portrait.py. The source
 * is only 512px wide, so it is shown no wider than the frame in about.css.
 */
export const ABOUT_PORTRAIT = {
  src: '/assets/about/mitali.jpg',
  width: 512,
  height: 640,
  alt: 'Mitali Shah smiling in a red floral top, holding up her Diploma in Nutrition certificate.',
}

/** Produce cut-outs, shared by the capsule artwork and the plate diagram. */
export const PRODUCE = {
  broccoli: '/assets/produce/broccoli.png',
  pepper: '/assets/produce/pepper.png',
  tomato: '/assets/produce/tomato.png',
  avocado: '/assets/produce/avocado.png',
  strawberry: '/assets/produce/strawberry.png',
  apple: '/assets/produce/apple.png',
}

/**
 * Client before/after photographs, in the order the wheel turns through them.
 *
 * Each file is one supplied photograph: the before and the after are already
 * side by side in a single frame. `tools/prepare_transformations.py` pads every
 * one to the card's landscape frame (TRANSFORMATION_RATIO, below) and re-encodes
 * it, so the card never crops a head or a pair of feet off a body shot.
 *
 * ── BEFORE THIS GOES LIVE ──────────────────────────────────────────────
 * The titles below are deliberately neutral. Replace each one with the real
 * first name and the real figure (e.g. "Priya — 14 kg, 7 months") ONLY once
 * you have the number in writing and the client's written consent to publish
 * her photograph. Do not let placeholder copy become a claim.
 * ───────────────────────────────────────────────────────────────────────
 */
export const TRANSFORMATIONS = [
  {
    id: 'pair-01',
    title: 'Transformation No. 01',
    image: '/assets/transformations/transformation-01.jpg',
    alt: 'The same client side by side: at the left in a pink and gold kurta outdoors, at the right in a cream embroidered anarkali.',
  },
  {
    id: 'pair-02',
    title: 'Transformation No. 02',
    image: '/assets/transformations/transformation-02.jpg',
    alt: 'The same client side by side, captioned before and after: at the left in a belted teal dress, at the right in a maroon t-shirt and lounge trousers.',
  },
  {
    id: 'pair-03',
    title: 'Transformation No. 03',
    image: '/assets/transformations/transformation-03.jpg',
    alt: 'The same client side by side: at the left in a blue and white block-print shirt and trousers indoors, at the right in a yellow kurta with a red dupatta, holding a pink handbag.',
  },
  {
    id: 'pair-04',
    title: 'Transformation No. 04',
    image: '/assets/transformations/transformation-04.jpg',
    alt: 'The same client in the same red t-shirt and black trousers, photographed twice against a green wall and split down the middle.',
  },
  {
    id: 'pair-05',
    title: 'Transformation No. 05',
    image: '/assets/transformations/transformation-05.jpg',
    alt: 'The same client side by side: at the left in a white tasselled top, at the right in a pink embroidered kurta and palazzo set.',
  },
  {
    id: 'pair-06',
    title: 'Transformation No. 06',
    image: '/assets/transformations/transformation-06.jpg',
    alt: 'The same client side by side: at the left in a black cardigan over a striped dress, at the right in a yellow puff-sleeve dress.',
  },
]

/**
 * Card width / height, and it is the wheel's own default for a reason.
 *
 * The supplied photographs are square to portrait, so square cards looked like
 * the obvious choice. They are not: the ring's radius is set in card heights,
 * so a square card is as tall as it is wide, the ring comes out about 119% of
 * the stage and the seven cards collide. At the native 1.45 the same ring sits
 * at about 109% — the slight bleed off the top and bottom the component is
 * designed around — and the cards clear each other.
 *
 * So the frame stays landscape and the photographs are fitted into it by
 * tools/prepare_transformations.py instead, which pads rather than crops. A
 * before/after photograph that loses its subject's head is worthless.
 */
export const TRANSFORMATION_RATIO = 1.45

/**
 * The phone gallery's frame, width / height.
 *
 * On a phone the photographs are shown one at a time across the screen
 * instead of on the wheel, so they no longer need the wheel's landscape
 * card, and the padding it adds only makes them smaller. Every supplied
 * photograph is square or portrait (the widest, No. 01, is 1.014 wide to 1
 * tall), and the padding sits at its sides. In a frame this shape,
 * `object-fit: cover` keeps all of each photograph and trims only the
 * blurred padding.
 *
 * A photograph wider than this would lose its edges on phones.
 * tools/prepare_transformations.py warns when one arrives; if it does, raise
 * this and GALLERY_RATIO in that script together.
 */
export const TRANSFORMATION_GALLERY_RATIO = 1.02
