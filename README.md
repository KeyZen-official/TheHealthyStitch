# Healthystitch — Wellness Walk

Editorial landing page for a vegetarian nutrition service. React + Vite, plain
JavaScript, hand-written CSS, no backend.

One exception, added for the results band: Tailwind CSS v4 and TypeScript, for
a single shadcn-style component in `src/components/ui/`. Everything else is
still hand-written CSS and `.jsx`. See
[The results band](#the-results-band-before-and-after) for why the two coexist
rather than one replacing the other.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview    # serve the built output
npm run typecheck  # tsc over src/ (the .tsx only; checkJs is off)
```

## Structure

```
index.html                     fonts, favicon, meta
public/
  favicon.svg
  assets/
    nutrition-capsule.png      left panel artwork (1487x1487, transparent)
    lifestyle-kitchen.jpg      hero slide 1 (2200x1467)
    lifestyle-harvest.jpg      hero slide 2 (2200x1464)
    lifestyle-nourish.jpg      hero slide 3 (2200x1468)
    produce/*.png              six cut-outs, reused by the plate diagram
    transformations/*.jpg      seven client before/after cards — CONSENT, see ATTRIBUTION
    about/mitali.jpg           About portrait, 512x640, from tools/prepare_portrait.py
    wellness-lifestyle.jpg     unreferenced original of slide 1 — see ATTRIBUTION
    ATTRIBUTION.md             image credits + licence warning
assets_src/
  transformations/             drop the original client photographs here
  about/                       the original of the About portrait
                               all git-ignored (identifiable people + GPS EXIF)
components.json                shadcn config, so `npx shadcn@latest add` works
tsconfig.json                  TypeScript + the @/* path alias
src/
  main.jsx
  App.jsx                      page shell -> Navbar + Hero + About + Transformations
                               + Reviews + Proof + Enquiry, then Footer + WhatsApp button
  assets.js                    every image path, and each slide's crop and tone
  contact.js                   email, WhatsApp number + pre-typed message, social links,
                               the wa.me and mailto link builders
  lib/
    utils.ts                   cn() — clsx + tailwind-merge, the shadcn helper
  hooks/
    useReducedMotion.js        tracks prefers-reduced-motion, live
    useInView.js               latching IntersectionObserver for the reveal
    useMediaQuery.js           tracks any media query, live (the phone switch)
  components/
    ui/
      works-wheel.tsx          the ring/drum wheel — Tailwind, TypeScript
    TransformationsSection.jsx the results band: the wheel, or on phones the gallery
    TransformationsGallery.jsx the same photographs on phones, in a row you swipe
    ReviewsSection.jsx         WhatsApp reviews as chat cards on a looping strip
    AboutSection.jsx           Mitali's story beside her portrait
    EnquirySection.jsx         the enquiry form: sends by WhatsApp or email, stores nothing
    SiteFooter.jsx             get in touch, contact, section links, social, small print
    WhatsAppButton.jsx         the floating chat button, bottom-right on every screen
    icons/BrandIcons.jsx       WhatsApp, Instagram and Facebook marks (inline SVG)
    Navbar.jsx                 two-tone wordmark (no logo), five links, Get Started;
                               the links fold behind a Menu button below 960px
    HeroSection.jsx            43/57 grid, two-line headline, GOALS/HEALTH divider
    NutritionVisual.jsx        decorative letters, capsule, tagline
    LifestyleSlides.jsx        three photographs on a 2s timer, organic clip path
    NutritionPillars.jsx       intro copy + four numbered rows
    ProofSection.jsx           the argument: promises, figures, mechanisms
    VegetarianPlate.jsx        interactive plate dial, six produce cut-outs
  styles/
    tailwind.css               Tailwind v4 entry, WITHOUT preflight + shadcn tokens
    global.css                 tokens, reset, page shell, navigation
    hero.css                   hero composition, slideshow, breakpoints
    proof.css                  proof section, plate dial, accordion
    transformations.css        the results band's chrome and the phone gallery
                               (not the wheel)
    reviews.css                review cards, the looping strip, reduced-motion row
    about.css                  About layout, arch portrait, story typography
    enquiry.css                the enquiry form and its two send buttons
    whatsapp.css               the floating button; defines --fab-size and --fab-gap
    footer.css                 the footer, on the dark olive band
tools/                         asset build + visual verification scripts
```

## Page order

Hero, About us, Real clients (the before/after wheel), client reviews, Why
Healthystitch, the enquiry form, then the footer. `App.jsx` sets the order,
and the footer's Explore links follow it.

## Design tokens

Set once in `src/styles/global.css` as custom properties.

| Element | Token | Value |
|---|---|---|
| Page / canvas | `--canvas` | `#F5F5F1` |
| Hero left panel | `--panel-left` | `#EDEEE8` |
| Hero right panel | `--panel-right` | `#F7F7F4` |
| Proof section | `--panel-proof` | `#EFF1E9` |
| Display olive | `--headline` | `#69851F` |
| Small-type olive | `--olive-ink` | `#3F5213` |
| Decorative letters | `--letters` | `#D6DDC8` |
| Main text | `--text` | `#22231F` |
| Secondary text | `--text-soft` | `#66665E` |
| Dividers | `--rule` | `#383832` |
| Hairlines | `--hairline` | `rgba(56,56,50,.22)` |

`--headline` measures 3.9:1 against the canvas, which clears WCAG AA for large
text but not for body copy. `--olive-ink` is the same hue at 7.6:1 and is what
every olive element below ~24px uses.

Type: **Fraunces** for headlines, titles and italic captions, **Plus Jakarta
Sans** for body copy and every small uppercase label. Both load from Google
Fonts in `index.html`, as variable fonts.

- `--font-display` and `--font-serif` are both Fraunces. They stay two tokens
  so each rule still says which role it plays. Fraunces's optical-size axis
  gives small text sturdier, wider letterforms automatically, which the old
  pairing (Bodoni Moda hairlines, a light Cormorant Garamond) could not do at
  caption sizes. That was the readability problem.
- `body` sets `font-variation-settings: 'SOFT' 50`, Fraunces's softness axis
  at half, for rounder, friendlier terminals. The property replaces the whole
  list rather than merging, so any rule that sets its own variation settings
  must repeat `'SOFT' 50`.
- The same three values are mirrored in `src/styles/tailwind.css` for the
  wheel's `font-display` utility. Change both together.
- Body sizes were raised with the switch: nothing that is read as a sentence
  is below 12px now, and long-form copy is 15–17px.

## Layout notes

- **Full bleed.** The canvas is the page: 100% wide, no outer mat, no max
  width. `--gutter` (`clamp(22px, 3.1vw, 56px)`) is the single horizontal inset
  the nav, the hero's editorial column and the proof section all align to.
- The hero is `min-height: calc(100vh - var(--nav-h))`, so it lands exactly on
  the fold and About starts at the next screen. The nav is
  border-box, so its 1px bottom border is already inside `--nav-h`.
- Hero columns are a CSS Grid at `43% / 57%` with no gap.
- The hero headline, "Stitch by stitch, a healthier *you*.", is set as two
  lines broken at the comma (two block spans in `HeroSection.jsx`). Left to
  wrap freely, the column strands the "a" at the end of the first line. It is
  sized so the longer line fills most of the column, and it is verified to stay
  on exactly two lines from 320px to 1920px. The photograph below it is
  `flex: 1 1 auto`, so the extra line comes out of the photo, not the fold.
- Because the canvas is unbounded, every band in the proof section is capped by
  `--measure` (1320px) and centred, or paragraphs would run the full 1920px.
- `.slides__frame` holds its photographs absolutely positioned. Sizing the
  frame from in-flow children makes the row height and the frame height depend
  on each other, and Chrome resolves that by growing the hero past the fold on
  768px-tall laptops.
- The organic photo mask is an SVG `clipPath` in
  `clipPathUnits="objectBoundingBox"`, so one path definition scales to every
  breakpoint.

Verified to land exactly on the fold at 1920×1080, 1680×1050, 1536×864,
1440×900, 1366×768 and 1280×800 with no horizontal scroll, and to stack
cleanly at 834px and 390px.

## The hero slideshow

`LifestyleSlides.jsx`. Three photographs, 2000ms dwell, 900ms crossfade.

- The outgoing frame is held at full opacity *underneath* the incoming one
  (`.is-previous`) for the length of the crossfade. Fading both at once leaves a
  gap halfway through where the panel colour shows between them.
- Hover or keyboard focus parks the timer, so a 2s rotation can still be read.
- Only the frame on screen carries `alt` text; the parked frames are `alt=""`.
- `prefers-reduced-motion: reduce` stops the timer outright. The three stitch
  marks below the frame still move it by hand.
- Each slide declares its own `focus` (object-position) and `tone` (filter) in
  `src/assets.js`. The three are lit very differently — the kitchen is warm and
  low-key and needs lifting, the harvest frame would blow out under the same
  correction.

## The proof section

`ProofSection.jsx` + `VegetarianPlate.jsx`, after the reviews. The argument
that a vegetarian plate moves measurable numbers, in four bands: the service
promises, the plate diagram, published figures, and the mechanisms behind
them. The nav's Plans link lands here: there is no plans section, and this
is the one that says what a plan involves.

The plate dial derives its orbit, piece size and SVG rim from one length
(`--dial`), so everything stays in register at any size. The dashed rim is the
brand motif — a running stitch, animated by `stroke-dashoffset`, with `r`
chosen so the circumference is exactly 60 whole dashes and the loop has no
seam. The pieces drift gently and settle the moment the pointer enters the
dial, so nobody has to chase a moving target.

The accordion animates `grid-template-rows` from `0fr` to `1fr` and flips
`visibility`, which keeps a collapsed panel out of the accessibility tree
without the `display: none` that would kill the animation.

### The figures are citations, not our results

The four numbers are pooled results from published literature about vegetarian
diets as a category. They are **not** outcomes measured on this service, and
the section says so in two places — above the figures and in the source note.
Keep it that way.

1. Koch, Kjeldsen & Frikke-Schmidt, *European Heart Journal* 44(28), 2023 —
   meta-analysis of randomised trials: LDL −0.30 mmol/L, total cholesterol
   −0.34 mmol/L, apoB −12.9 mg/dL.
   <https://pubmed.ncbi.nlm.nih.gov/37226630/>
2. Yokoyama et al., *JAMA Internal Medicine* 174(4), 2014 — systolic
   −4.8 mm Hg, diastolic −2.2 mm Hg.
   <https://pubmed.ncbi.nlm.nih.gov/24566947/>
3. Tonstad, Butler, Yan & Fraser, *Diabetes Care* 32(5), 2009 — type-2 diabetes
   prevalence 2.9% in vegans, 3.2% lacto-ovo, 7.6% non-vegetarians, across
   60,903 adults in the Adventist Health Study-2.
   <https://pubmed.ncbi.nlm.nih.gov/19351712/>

Direction of change is spelled out in words ("mmol/L lower") rather than with a
leading minus. A minus sign is a short hairline at reading size in most
display faces (it was nearly invisible in the original Bodoni), and here the
sign is the whole point.

### Service claims still need signing off

Three statements in this section describe how the business operates, not what
the research says, and nobody has confirmed them:

- bloodwork at week 0 and again at week 12, with a free rewrite if the numbers
  have not moved (`PROMISES[1]`);
- B12, ferritin, vitamin D and thyroid tested at baseline (`LEDGER[3]`);
- every plan naming a B12 source (`LEDGER[3]`).

Make them true or change the copy.

## The results band (before and after)

`TransformationsSection.jsx` + `src/components/ui/works-wheel.tsx`, directly
after About. Client before/after photographs hung
on a wheel: at rest they sit in a ring around a title, and the first notch of
scroll opens the ring into a vertical drum with one photograph flat and full
size at the front.

### On phones: a swipe gallery instead of the wheel

The wheel does not work on a phone. Below 640px its cards are capped at a
third of the screen, so each half of a before/after pair is about 60px wide,
and a touch screen has no scroll wheel to turn it: a swipe scrolls the page
instead. So on phones `TransformationsSection.jsx` renders
`TransformationsGallery.jsx` in its place, with the same photographs.

- **When:** any screen under 640px wide, and a touch screen under 520px tall
  (a phone on its side). That is `PHONE` in `TransformationsSection.jsx`.
  Tablets keep the wheel.
- **What:** one photograph across the screen, with the edge of the next one
  showing at the right, in an ordinary sideways scroller with CSS snap
  points. Swiping, momentum and the page's own up-and-down scrolling are all
  left to the browser, so a thumb is never caught by the section. Arrows and
  a counter ("02 / 07") sit underneath for anyone not swiping, and the
  counter is a polite live region for screen readers. The row takes keyboard
  focus, so the arrow keys move it too.
- **The frame is nearly square** (`TRANSFORMATION_GALLERY_RATIO`, 1.02), not
  the wheel's 1.45. Every supplied photograph is square or portrait, so the
  padding the pipeline adds sits at its sides, and `object-fit: cover` in
  this frame trims only that padding. Each photograph comes out about 1.4
  times as large as it would in a 1.45 frame. `prepare_transformations.py`
  warns if a photograph wider than the frame arrives.
- On a phone on its side the screen's height sets the size, so two or three
  photographs are on screen at once and the counter shows the range
  ("04–06 / 07").

### Why Tailwind and TypeScript are here, and why they are contained

The wheel is a shadcn-style component and expects three things this project did
not have: Tailwind utilities, TypeScript, and an `@/*` alias resolving to
`src/`. Rewriting it into the project's plain-CSS idiom would have meant
hand-translating about 60 utility classes and a dozen arbitrary-value
properties — a lot of transcription with a bug in every line. Adding the
toolchain was the smaller and more reversible change.

What keeps it from spreading:

- **Preflight is not imported.** `src/styles/tailwind.css` pulls in
  `tailwindcss/theme.css` and `tailwindcss/utilities.css` only. Preflight is a
  global reset — it strips heading sizes, list markers, element margins and
  border widths — and it would have flattened the hero headline, the promises
  list and every dashed rule in the proof section. This is the documented way
  to opt out ([tailwindcss#17063](https://github.com/tailwindlabs/tailwindcss/discussions/17063)).
- **Tailwind is imported first** in `main.jsx`, before the three editorial
  sheets, so on any rule they contest the hand-written CSS still wins.
- **`checkJs` is off.** The existing 1500 lines of JavaScript are not put under
  a type checker they were never written for. Only the `.tsx` is checked.
- `tools/check_styles.py` asserts the existing page's computed colours and
  geometry, and passes unchanged. Run it after touching `tailwind.css`.

The shadcn semantic tokens (`--background`, `--foreground`, `--muted-foreground`,
`--border`) are mapped onto this project's palette, so anything else installed
with `npx shadcn@latest add` lands in the brand rather than in stock stone.

### Why the band is dark

The wheel is a perspective object: cards rotate away from the reader and run
off the top and bottom of the frame. On the page's warm off-white those depth
cues all but vanish and the drum reads as a flat stack. The section carries
`.theme-dark-olive`, a deep olive charcoal (`#1B1D17`) pulled from `--text` and
`--rule` rather than a generic black, which re-themes the shadcn tokens for
its subtree only.

Note the warning in the asset pipeline section below: the `produce/` cut-outs
must not go on a dark background. They are not used here.

### Geometry

`CARD_RATIO` stays at the component's native `1.45` even though the supplied
photographs are square to portrait. Square cards looked obvious and were wrong:
the ring's radius is set in card *heights*, so a square card makes the ring
about 119% of the stage and the seven cards collide. At 1.45 the ring is ~109%
— the slight bleed off the top and bottom the component is designed around.

The photographs are fitted to the landscape frame by the script below, which
**pads rather than crops**. A before/after photograph that loses its subject's
head is worthless, and `object-cover` in a 1.45 card would take about 31% of
the height off a square one.

Two numbers must stay in step: `TRANSFORMATION_RATIO` in `src/assets.js` and
`RATIO` in `tools/prepare_transformations.py`. So must the phone gallery's
pair, `TRANSFORMATION_GALLERY_RATIO` and `GALLERY_RATIO`.

### Preparing the photographs

```bash
# drop the originals in assets_src/transformations/ — any names, they map in sorted order
python tools/prepare_transformations.py
python tools/prepare_transformations.py --dry-run      # show the mapping only
python tools/prepare_transformations.py --placeholders # marked stand-ins
```

It auto-orients from EXIF, pads to the card ratio against a blurred copy of the
photograph, re-encodes at quality 88 with 4:4:4 subsampling (two of these
photographs carry coloured lettering, which chroma subsampling smears), and
**drops all EXIF** — phone photographs routinely carry the GPS coordinates of
the place they were taken, frequently the client's home. It also warns about
any photograph wider than the phone gallery's frame, which phones would trim.

### Consent is the blocker, not licensing

`public/assets/ATTRIBUTION.md` has the detail. In short: written permission per
person before the file ships, permission for any figure published beside it,
and a cheap route to take one down. The titles in `TRANSFORMATIONS` are
deliberately neutral (`Transformation No. 01`) so that placeholder copy cannot
quietly become a health claim about a named person.

## Asset pipeline

`public/assets/nutrition-capsule.png` is generated, not hand-painted:

```bash
python tools/build_capsule.py
```

- `tools/capsule.py` shades the two capsule halves from computed surface
  normals (hemisphere + barrel, key light, specular, sage-tinted falloff,
  darkened open rim).
- `tools/cutout.py` removes the white studio backdrop from each produce
  photograph. Backdrop is detected as *bright and colourless*, which also
  catches the grey contact shadow while sparing pale-but-warm subject pixels
  such as apple flesh. Only backdrop connected to the frame edge is removed, so
  interior highlights survive.
- `tools/build_capsule.py` places each item on a fan around the capsule mouth,
  with drop shadows and depth blur.

Source photographs are re-downloaded by `tools/fetch_ingredients.py` and
`tools/fetch_round2.py` into `tmp_candidates/` (git-ignored).

The `produce/` cut-outs still carry faint white residue along their contact
edges. That is invisible on the pale panels they sit on and clearly visible on
anything dark, which is why both the hero panel and the proof section stay
light. Do not put these cut-outs on a dark background without re-cutting them.

## Reviews and About

About comes straight after the hero, and the reviews straight after the
results band. Section eyebrows carry a label and a rule only; the
"No. 02"–"No. 05" section numbers were removed.

**Reviews, `ReviewsSection.jsx`.** Client messages from WhatsApp,
set as chat cards (bubbles, timestamps, the beige chat background) on a strip
that runs sideways in a loop. The text is transcribed word for word from the
supplied screenshots, typos and emoji included. Only the clients' own messages
are kept, under first names only: no surnames, relationships, profile photos
or replies. Jalpa's messages are in Gujarati written in English letters, so
her card carries a short translation in a yellow note.

- The loop is two identical lists slid left by exactly one list's width, so
  the join never shows. The copy is `aria-hidden`, so a screen reader hears
  each review once.
- The strip stops under the pointer, and a real Pause button stops it for
  keyboard and touch users. Moving content that cannot be stopped fails
  WCAG 2.2.2, and hover alone is not a way to stop it on a phone.
- With reduced motion the strip stands still and becomes a row you scroll
  sideways (focusable, so arrow keys work). The copy and the button are not
  rendered.
- To add a review, add an entry to `REVIEWS` at the top of the component.

**About, `AboutSection.jsx`.** Mitali's story, exactly as she wrote
it, beside her portrait. The greeting and the caption give her full name,
Mitali Shah. The footer's "About us" link lands here. The portrait is
the diploma photograph from the results wheel, cropped to 4:5 by
`tools/prepare_portrait.py` (original in `assets_src/about/`). It stays level
with the story while the story scrolls past (`position: sticky`). That only
works because `.canvas` uses `overflow: clip`; `overflow: hidden` on any
ancestor quietly disables sticky.

The source photograph is only 512px wide, so the portrait is capped at 380px
and is slightly soft on high-density screens. A larger original would fix it:
drop it in `assets_src/about/` and rerun the script.

## Navigation

`Navbar.jsx`: the wordmark, five links, and Get Started.

- **Home** goes to the top of the page, **Plans** to Why Healthystitch and
  **Enquiry form** to the form. **Contact** opens the WhatsApp chat in a new
  tab, the same chat as the floating button, and the **email address** opens
  the visitor's email app. Get Started goes to the form too.
- Below 960px the links fold behind a Menu button and open as a panel under
  the bar. The panel is a disclosure, not a modal, so focus is not trapped.
  Opening it moves focus to the first link, because the links come before the
  button in the page and Tab would otherwise skip them. It closes on a link,
  on Escape (focus goes back to the button), on a click outside, when focus
  leaves the nav, and when the screen widens past 960px.
- The fold point is written twice: `COMPACT` in `Navbar.jsx` and the
  `max-width: 959px` query in `global.css`. Change them together.
  `tools/check_reviews.py` measures the bar from 320px to 1920px and fails if
  anything in it touches.
- Below 360px Get Started is hidden: the wordmark, Get Started and the Menu
  button do not fit side by side. The menu's Enquiry form goes to the same
  place.

## The enquiry form

`EnquirySection.jsx`, the last section before the footer. The site has no
server, so the form sends nothing to it. **Send on WhatsApp** opens a chat
with Mitali with the enquiry typed out. **Send by email** opens the visitor's
email app with the same text and a subject line ("Nutrition plan enquiry
from" and their name). The visitor presses send there, so the enquiry comes
from their own number or address, and nothing is stored on the way.

- Name, phone (10 to 15 digits) and "What would you like help with?" are
  required. Email and the message are optional.
- Errors appear after the first try to send and clear as each field is fixed.
  A failed send moves focus to the first field that needs fixing, and a screen
  reader reads each error with its field.
- After a send, a status line says what should have happened, with a link to
  try again if WhatsApp or the email app did not open.
- The choices for "What would you like help with?" are `GOALS` at the top of
  the component. Change them freely; the message carries the chosen text.
- The fields are 16px, so iPhones do not zoom the page in when one is
  focused.

## Contact: the WhatsApp button and the footer

Every contact detail lives in `src/contact.js`: the email address, the
WhatsApp number (as `wa.me` wants it, `918879293255`: country code 91 for
India, then the 10-digit number), the message pre-typed into a new chat, and
the social links. The floating button, the nav's Contact and email links, the
enquiry form and the footer all read from it, so a change is one line.

**Floating button, `WhatsAppButton.jsx`.** Fixed to the bottom-right corner
on every screen, above everything else. It opens a chat with Mitali in a new
tab with the first message already typed, which the visitor can edit. A
"Chat on WhatsApp" label slides out on hover or keyboard focus; Escape hides
it again (WCAG 1.4.13). The fill is a deeper green than the logo's `#25D366`,
which only gives a white glyph 2:1 contrast; this one gives 3.1:1.

**Footer, `SiteFooter.jsx`.** It sits outside `<main>`, so it is the page's
contentinfo landmark, and its id is `contact`. In order:

- a last "Get in touch" call with WhatsApp and email buttons;
- the wordmark with Mitali's line "A lifestyle, not a temporary goal.";
- Explore (every section), Contact (email and WhatsApp, written out) and
  Follow (Instagram, Facebook);
- the small print: copyright with the year filled in automatically, "not
  medical advice", the CC BY 2.0 credit the hero photographs require (see
  `public/assets/ATTRIBUTION.md`), and Back to top.

Its bottom padding is the floating button's footprint (`--fab-size` plus
`--fab-gap` on both sides), so at the end of the page the button never sits
on a footer link.

### Before launch: the social links

The real Instagram and Facebook profile URLs were not supplied. Until they
are, both links point at the platforms' home pages and are marked
`pending: true` in `src/contact.js`. Paste the full profile URLs in and delete
`pending`.

## Verification scripts

Need `pip install playwright numpy scipy pillow` and a local Chrome.

```bash
python tools/screenshot.py          # captures 4 breakpoints
python tools/check_styles.py        # computed colours + geometry vs the spec
python tools/check_laptop.py        # full-bleed width, fold fit, headline fit
python tools/check_console.py       # console / network errors
python tools/check_wheel.py         # drives the wheel, shoots ring + drum states
python tools/check_wheel_a11y.py    # keyboard, index jumps, scroll release, reduced motion
python tools/probe_wheel.py         # stage/card/ring measurements per viewport
python tools/check_reviews.py       # section order, the reviews strip, About, the nav and its Menu
python tools/check_align.py         # every band shares one left edge
python tools/shot_seam.py           # the join between About and the results band
python tools/_test_transformations.py  # the photo pipeline, on synthetic stand-ins
```

`_test_transformations.py` runs the real pipeline over seven stand-ins shaped
like the supplied photographs, with markers pinned to the extreme top and
bottom of each. If the pipeline ever starts cropping instead of padding, the
markers vanish and it fails. It works in a temporary directory and never
touches `assets_src/` or `public/`, so it is safe to run with the real
photographs in place.

Set `SITE_URL` if the dev server is not on port 5173, and `VIEWPORT`
(e.g. `1024x768`) for `check_wheel.py`. Below 640px the page shows the swipe
gallery, so the wheel scripts have nothing to drive there and say so.

A static screenshot only ever catches the wheel's ring, because it writes its
transforms from a rAF loop — `check_wheel.py` sends real wheel deltas and
captures the opened drum.

## Before you launch: swap the produce artwork

The capsule and the `produce/` cut-outs are built from photos that include
GFDL 1.2 and CC BY-SA 3.0 material. Both are copyleft, so the composites are
not suitable for a closed commercial site. See
`public/assets/ATTRIBUTION.md`.

Replace them with artwork you own or licence, then update `src/assets.js`.
Nothing else needs to change. A prompt that matches the intended capsule look:

> Photorealistic 3D render of a large white gelatin nutrition capsule pulled
> open, angled from lower-left to upper-right, with fresh broccoli, spinach,
> green apple, strawberry, red bell pepper, tomato, red onion, herbs and avocado
> floating out of the opening. Soft studio lighting, realistic shadows, shallow
> depth of field, transparent background, square, 2000px.

The three slideshow photographs are CC BY 2.0 and only need visible
attribution, so they can stay as-is.

## Known gaps against the brief

- The ingredient list asked for spinach and fresh herbs. No studio-isolated
  spinach or herb photograph exists on Wikimedia Commons; everything available
  is shot in a garden and will not cut out cleanly. The greens in the composite
  are broccoli and broccoli florets.
- The apple is a cross-section of a Pink Lady rather than a whole green apple,
  for the same reason: the green-apple photographs on Commons are all shot on
  dark textured surfaces.
- There is no plans or prices section, so the nav's Plans link goes to Why
  Healthystitch. When one exists, point Plans (`#proof` in `Navbar.jsx`) at it.
- The enquiry form cannot send by itself: it relies on the visitor having
  WhatsApp or an email app set up. A form service would remove that step,
  but enquiries would then be stored by a third party.
- **On a tablet the wheel still cannot be turned by swiping.** A swipe
  scrolls the page, so the list of names is the way to reach a photograph.
  To give tablets the swipe gallery as well, add `, (pointer: coarse)` to
  `PHONE` in `TransformationsSection.jsx`.
- The wheel takes over the scroll while it still has somewhere to turn, which
  is the component's design and it does release the page at either end
  (asserted by `check_wheel_a11y.py`). It still means roughly 6300px of wheel
  delta to cross the section. `WHEEL_UNITS` is the dial if that proves too slow.
- Titles are placeholders. See the consent note above before replacing them.
