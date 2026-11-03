"""Drive the reviews strip, the About section and the nav in Chrome.

The strip is a CSS animation, so a screenshot cannot say whether it moves,
stops or loops cleanly. This measures it instead:

  * the sections run hero > About > Real clients > reviews > Why
    Healthystitch > enquiry form
  * the loop is seamless: two identical lists, and the track is exactly twice
    one of them, so sliding by -50% lands the copy where the original began
  * it moves on its own, stops under the pointer, and stops and restarts from
    the Pause button, whose label follows
  * a screen reader meets each review once (the copy is aria-hidden)
  * with reduced motion it stands still, drops the copy and the button, and
    becomes a row you can scroll sideways and reach from the keyboard
  * the footer's About link lands on the About section, the portrait loads,
    and it stays level with the story while the story scrolls past it
  * the nav is Home, Plans, Enquiry form, Contact (WhatsApp) and the email
    address, and each lands where it says. Below 960px they fold behind a
    Menu button: it opens with focus on the first link, Tab walks the links in
    order, and it closes on a link, Escape, a click outside, focus leaving the
    nav, and the screen widening
  * the bar fits at every width from 320px to 1920px, with nothing touching

    SITE_URL=http://localhost:5175/ python tools/check_reviews.py
"""
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
NAMES = ["Zeel", "Jalpa", "Kathan", "Drishti", "Arpita"]
ORDER = ["top", "about", "transformations", "reviews", "proof", "enquiry"]

# Visible label, and how the href starts.
NAV = [
    ("Home", "#top"),
    ("Plans", "#proof"),
    ("Enquiry form", "#enquiry"),
    ("Contact", "https://wa.me/918879293255?text="),
    ("shahmitali.ms@gmail.com", "mailto:shahmitali.ms@gmail.com"),
]
# What a screen reader hears for the two links whose label is not the whole name.
NAV_NAMES = ["Contact on WhatsApp (opens in a new tab)", "Email shahmitali.ms@gmail.com"]
COMPACT_BELOW = 960   # Navbar.jsx COMPACT and the global.css media query
CTA_BELOW = 360       # Get Started is dropped on the smallest phones
GAP = 24              # least room between the wordmark, the links and the end of the bar

TRACK_X = """() => new DOMMatrix(getComputedStyle(
    document.querySelector('.reviews__track')).transform).m41"""

# The visible label only: .u-sr text is for screen readers, checked by name.
NAV_LINKS = """els => els.map(e => {
    const c = e.cloneNode(true);
    c.querySelectorAll('.u-sr').forEach(n => n.remove());
    return { text: c.textContent.trim(), href: e.getAttribute('href') || '',
             target: e.getAttribute('target'), rel: e.getAttribute('rel') };
})"""

# The focused element, by its visible label (or 'toggle' for the Menu button).
ACTIVE = """() => { const a = document.activeElement;
    if (!a || a === document.body) return null;
    if (a.matches('.nav__toggle')) return 'toggle';
    const c = a.cloneNode(true);
    c.querySelectorAll('.u-sr').forEach(n => n.remove());
    return c.textContent.trim(); }"""

BAR = """() => {
  const box = s => { const b = document.querySelector(s).getBoundingClientRect();
    return { l: Math.round(b.left), r: Math.round(b.right) }; };
  const shown = s => getComputedStyle(document.querySelector(s)).display !== 'none';
  const inline = getComputedStyle(document.querySelector('.nav__links')).position !== 'absolute';
  // .nav__end stretches across its grid column, so measure what is in it.
  const end = [...document.querySelector('.nav__end').children]
    .filter(k => getComputedStyle(k).display !== 'none')
    .map(k => k.getBoundingClientRect());
  return {
    brand: box('.nav__brand'),
    links: inline ? box('.nav__links') : null,
    end: { l: Math.round(Math.min(...end.map(b => b.left))),
           r: Math.round(Math.max(...end.map(b => b.right))) },
    cta: shown('.nav__cta'),
    toggle: shown('.nav__toggle'),
    sideScroll: document.documentElement.scrollWidth > innerWidth,
  };
}"""


def check(fails, ok, label):
    print(f"  {'ok  ' if ok else 'FAIL'}  {label}", flush=True)
    if not ok:
        fails.append(label)


def moving(page, wait=700):
    a = page.evaluate(TRACK_X)
    page.wait_for_timeout(wait)
    b = page.evaluate(TRACK_X)
    return abs(b - a) > 2, a, b


def open_page(browser, w, h, problems):
    page = browser.new_page(viewport={"width": w, "height": h})
    page.on("console", lambda m: m.type in ("error", "warning")
            and problems.append(f"[{w} {m.type}] {m.text}"))
    page.on("pageerror", lambda e: problems.append(f"[{w} pageerror] {e}"))
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(800)
    return page


def top_of(page, selector):
    page.wait_for_timeout(900)
    return page.evaluate(f"Math.round(document.querySelector('{selector}').getBoundingClientRect().top)")


def check_links(page, fails):
    """The five links: labels, targets, and the names a screen reader hears."""
    links = page.eval_on_selector_all(".nav__links a", NAV_LINKS)
    labels = [link["text"] for link in links]
    check(fails, labels == [label for label, _ in NAV], f"nav links: {labels}")
    check(fails, len(links) == len(NAV) and all(
        link["href"].startswith(href) for link, (_, href) in zip(links, NAV)),
        f"each goes where it says: {[link['href'][:40] for link in links]}")
    contact = links[3] if len(links) == len(NAV) else {}
    check(fails, contact.get("target") == "_blank" and contact.get("rel") == "noopener noreferrer",
          "Contact opens the WhatsApp chat in a new tab")
    # Scoped to the nav: the footer has an email link with the same name.
    nav = page.get_by_role("navigation", name="Main", exact=True)
    for name in NAV_NAMES:
        check(fails, nav.get_by_role("link", name=name, exact=True).count() == 1,
              f"screen readers hear '{name}'")


def check_wide_nav(page, fails):
    check(fails, page.locator(".nav__toggle").is_hidden(), "no Menu button: the links fit in the bar")
    check_links(page, fails)
    tops = page.evaluate("""() => [...document.querySelectorAll('.nav__links a')]
        .map(a => { const r = a.getBoundingClientRect(); return Math.round(r.top + r.height / 2); })""")
    check(fails, len(set(tops)) == 1, f"the links sit on one line: centres {tops}")

    links = page.locator(".nav__links")
    for label, target in (("Plans", "#proof"), ("Enquiry form", "#enquiry")):
        links.get_by_text(label, exact=True).click()
        top = top_of(page, target)
        check(fails, abs(top) <= 2, f"'{label}' lands on {target} (top {top}px)")
    page.locator(".nav__cta").click()
    top = top_of(page, "#enquiry")
    check(fails, abs(top) <= 2, f"'Get Started' lands on the enquiry form (top {top}px)")
    links.get_by_text("Home", exact=True).click()
    page.wait_for_timeout(900)
    landed = page.evaluate("Math.round(scrollY)")
    check(fails, landed == 0, f"Home lands on the real top of the page (scrollY {landed})")


def check_compact_nav(page, w, h, fails):
    toggle = page.locator(".nav__toggle")

    def expanded():
        return toggle.get_attribute("aria-expanded")

    check(fails, toggle.is_visible() and expanded() == "false"
          and toggle.get_attribute("aria-controls") == "nav-links",
          f"Menu button shown, closed, controls #nav-links ({expanded()})")
    check(fails, page.get_by_role("button", name="Menu", exact=True).count() == 1,
          "screen readers hear 'Menu'")
    check(fails, page.locator(".nav__links").is_hidden(), "closed: the links are hidden")
    focusable = page.evaluate("""() => { const a = document.querySelector('.nav__links a');
        a.focus(); return document.activeElement === a; }""")
    check(fails, not focusable, "closed: the links are out of the tab order")

    # Open from the keyboard. Focus lands on the first link and Tab walks the
    # rest in order, staying open until focus leaves the nav.
    toggle.focus()
    page.keyboard.press("Enter")
    page.wait_for_timeout(350)
    check(fails, expanded() == "true" and page.locator(".nav__links").is_visible(),
          f"Enter opens the menu ({expanded()})")
    check(fails, page.evaluate(ACTIVE) == "Home", f"focus moves to Home ({page.evaluate(ACTIVE)!r})")
    check_links(page, fails)

    panel = page.evaluate("""() => {
        const p = document.querySelector('.nav__links').getBoundingClientRect();
        const nav = document.querySelector('.nav').getBoundingClientRect();
        const rows = [...document.querySelectorAll('.nav__links a')]
            .map(a => Math.round(a.getBoundingClientRect().height));
        return { l: p.left, r: p.right, gap: Math.round(p.top - nav.bottom), rows,
                 sideScroll: document.documentElement.scrollWidth > innerWidth };
    }""")
    check(fails, panel["l"] >= 0 and panel["r"] <= w and not panel["sideScroll"]
          and abs(panel["gap"]) <= 1, f"the panel opens under the bar, full width: {panel}")
    check(fails, min(panel["rows"]) >= 44, f"every row is a 44px+ target: {panel['rows']}")

    walked = []
    for _ in range(len(NAV) - 1):
        page.keyboard.press("Tab")
        walked.append(page.evaluate(ACTIVE))
    check(fails, walked == [label for label, _ in NAV[1:]], f"Tab walks the links in order: {walked}")
    steps = 0
    while page.evaluate("() => !!document.activeElement.closest('.nav')") and steps < 4:
        page.keyboard.press("Tab")
        steps += 1
    page.wait_for_timeout(300)
    check(fails, expanded() == "false", f"Tabbing out of the nav closes the menu ({expanded()})")

    toggle.click()
    page.wait_for_timeout(300)
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    check(fails, expanded() == "false" and page.evaluate(ACTIVE) == "toggle",
          f"Escape closes it and returns focus to the button ({expanded()}, {page.evaluate(ACTIVE)!r})")

    toggle.click()
    page.wait_for_timeout(300)
    page.mouse.click(8, h - 8)
    page.wait_for_timeout(300)
    check(fails, expanded() == "false", f"a click outside closes it ({expanded()})")

    page.evaluate("scrollTo(0, 0)")
    toggle.click()
    page.wait_for_timeout(300)
    page.locator(".nav__links").get_by_text("Enquiry form", exact=True).click()
    top = top_of(page, "#enquiry")
    check(fails, expanded() == "false" and abs(top) <= 2,
          f"'Enquiry form' closes the menu and lands on the form ({expanded()}, top {top}px)")

    # The two links in the bar itself close it as well: they are inside the
    # nav, so the click-outside rule does not cover them.
    for label, selector in (("Get Started", ".nav__cta"), ("The wordmark", ".nav__brand")):
        page.evaluate("scrollTo(0, 0)")
        page.wait_for_timeout(300)
        toggle.click()
        page.wait_for_timeout(300)
        page.locator(selector).click()
        page.wait_for_timeout(400)
        check(fails, expanded() == "false", f"{label} closes the menu too ({expanded()})")

    page.evaluate("scrollTo(0, 0)")
    page.wait_for_timeout(300)
    toggle.click()
    page.wait_for_timeout(300)
    page.set_viewport_size({"width": 1200, "height": h})
    page.wait_for_timeout(400)
    check(fails, expanded() == "false" and page.locator(".nav__links").is_visible(),
          f"widening the screen closes it and puts the links back in the bar ({expanded()})")


def check_bar_fit(browser, fails):
    """Nothing in the bar touches, and the bar never pushes out a scrollbar."""
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(URL, wait_until="networkidle")
    for w in (320, 359, 360, 390, 600, 768, 959, 960, 1024, 1100, 1279, 1280, 1366, 1440, 1920):
        page.set_viewport_size({"width": w, "height": 900})
        page.wait_for_timeout(250)
        bar = page.evaluate(BAR)
        inline = w >= COMPACT_BELOW
        room = [(bar["links"]["l"] - bar["brand"]["r"]), (bar["end"]["l"] - bar["links"]["r"])] \
            if bar["links"] else [bar["end"]["l"] - bar["brand"]["r"]]
        ok = (bar["toggle"] != inline and (bar["links"] is not None) == inline
              and bar["cta"] == (w >= CTA_BELOW) and min(room) >= GAP
              and bar["end"]["r"] <= w and not bar["sideScroll"])
        what = "links in the bar" if bar["links"] else "Menu button"
        check(fails, ok, f"{w:>4}px  {what}, Get Started {'shown' if bar['cta'] else 'hidden'}, "
                         f"room {room}px")
    page.close()


def main():
    fails = []
    problems = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")

        for w, h in ((1440, 900), (390, 844)):
            print(f"\n{w}x{h}", flush=True)
            page = open_page(browser, w, h, problems)

            order = page.eval_on_selector_all("main.canvas > section", "els => els.map(e => e.id)")
            check(fails, order == ORDER, f"sections run {' > '.join(ORDER)}: {order}")
            eyebrows = page.eval_on_selector_all(
                ".proof__eyebrow, .shift__eyebrow, .reviews__eyebrow, .about__eyebrow, .enquiry__eyebrow",
                "els => els.map(e => e.innerText.trim())")
            check(fails, len(eyebrows) == 5 and not any("NO." in e.upper() for e in eyebrows),
                  f"no section numbers in the eyebrows: {eyebrows}")

            section = page.locator("#reviews")
            section.scroll_into_view_if_needed()
            page.wait_for_timeout(900)

            geo = page.evaluate("""() => {
              const sets = [...document.querySelectorAll('.reviews__set')];
              const track = document.querySelector('.reviews__track');
              return {
                sets: sets.length,
                hidden: sets.map(s => s.getAttribute('aria-hidden')),
                cards: sets.map(s => s.querySelectorAll('.review').length),
                widths: sets.map(s => s.getBoundingClientRect().width),
                track: track.getBoundingClientRect().width,
                heights: [...sets[0].querySelectorAll('.review')].map(
                  c => Math.round(c.getBoundingClientRect().height)),
                sideScroll: document.documentElement.scrollWidth > innerWidth,
              };
            }""")
            check(fails, geo["sets"] == 2 and geo["hidden"] == [None, "true"],
                  f"two lists, the copy aria-hidden: {geo['hidden']}")
            check(fails, geo["cards"] == [5, 5], f"five cards in each: {geo['cards']}")
            seam = abs(geo["track"] - 2 * geo["widths"][0])
            check(fails, seam < 0.5 and abs(geo["widths"][0] - geo["widths"][1]) < 0.5,
                  f"seamless loop: track {geo['track']:.1f} = 2 x {geo['widths'][0]:.1f} (off by {seam:.2f}px)")
            check(fails, len(set(geo["heights"])) == 1, f"cards share one height: {geo['heights']}")
            check(fails, not geo["sideScroll"], "no sideways page scroll")

            names = page.evaluate("""() => [...document.querySelectorAll(
                '.reviews__set:not([aria-hidden]) .review__name')].map(n => n.textContent)""")
            check(fails, names == NAMES, f"read once, in order: {names}")

            # Park the pointer well away from the strip before timing it.
            page.mouse.move(5, 5)
            go, a, b = moving(page)
            check(fails, go and b < a, f"strip moves left on its own ({a:.1f} -> {b:.1f})")

            box = page.locator(".reviews__viewport").bounding_box()
            page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.wait_for_timeout(150)
            go, a, b = moving(page)
            check(fails, not go, f"stops under the pointer ({a:.1f} -> {b:.1f})")
            page.mouse.move(5, 5)

            toggle = page.locator(".reviews__toggle")
            check(fails, toggle.get_attribute("aria-label") == "Pause the moving reviews",
                  f"button starts as Pause: {toggle.get_attribute('aria-label')!r}")
            toggle.click()
            page.mouse.move(5, 5)
            page.wait_for_timeout(150)
            go, a, b = moving(page)
            check(fails, not go and toggle.get_attribute("aria-label") == "Play the moving reviews",
                  f"Pause stops it and relabels to Play ({a:.1f} -> {b:.1f})")
            toggle.click()
            page.mouse.move(5, 5)
            go, a, b = moving(page)
            check(fails, go, f"Play starts it again ({a:.1f} -> {b:.1f})")

            # Every review must be readable on the strip: nothing clipped
            # inside a card at this width.
            clipped = page.evaluate("""() => [...document.querySelectorAll(
                '.reviews__set:not([aria-hidden]) .review__chat')]
                .filter(c => c.scrollHeight > c.clientHeight + 1).length""")
            check(fails, clipped == 0, f"no card clips its text ({clipped} clipped)")

            check(fails, page.locator("#philosophy, .quote").count() == 0,
                  "the green quote band is gone")

            page.locator(".site-footer nav a", has_text="About us").click()
            top = top_of(page, "#about")
            check(fails, abs(top) <= 2, f"'About us' in the footer lands on the section (top {top}px)")

            about = page.locator("#about")
            about.scroll_into_view_if_needed()
            page.wait_for_timeout(700)
            img = page.evaluate("""() => { const i = document.querySelector('.about__frame img');
                return [i.complete, i.naturalWidth, i.naturalHeight]; }""")
            check(fails, img[0] and img[1] == 512 and img[2] == 640, f"portrait loads at 512x640: {img}")
            hello = page.evaluate("document.querySelector('.about__hello').textContent")
            check(fails, "Mitali Shah" in hello, f"About gives her full name: {hello.strip()!r}")

            if w > 860:
                # Scroll so the story is half past, and the portrait should
                # still be pinned near the top of the viewport.
                page.evaluate("""() => { const s = document.querySelector('.about__story')
                    .getBoundingClientRect(); window.scrollBy(0, s.top + s.height * 0.45); }""")
                page.wait_for_timeout(400)
                pin = page.evaluate("Math.round(document.querySelector('.about__portrait').getBoundingClientRect().top)")
                check(fails, 30 <= pin <= 42, f"portrait sticks beside the story (top {pin}px, want 36)")

            page.close()

            print(f"\nnav, {w}x{h}", flush=True)
            page = open_page(browser, w, h, problems)
            if w >= COMPACT_BELOW:
                check_wide_nav(page, fails)
            else:
                check_compact_nav(page, w, h, fails)
            page.close()

        print("\nthe bar at every width", flush=True)
        check_bar_fit(browser, fails)

        print("\nreduced motion, 1440x900", flush=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        page = ctx.new_page()
        page.goto(URL, wait_until="networkidle")
        page.locator("#reviews").scroll_into_view_if_needed()
        page.wait_for_timeout(600)
        rm = page.evaluate("""() => {
          const v = document.querySelector('.reviews__viewport');
          return {
            sets: document.querySelectorAll('.reviews__set').length,
            toggle: !!document.querySelector('.reviews__toggle'),
            animation: getComputedStyle(document.querySelector('.reviews__track')).animationName,
            scrollable: v.scrollWidth > v.clientWidth,
            tabindex: v.getAttribute('tabindex'),
            visible: getComputedStyle(document.querySelector('.reviews__head')).opacity,
          };
        }""")
        check(fails, rm["sets"] == 1 and not rm["toggle"], f"one list, no Pause button: {rm}")
        check(fails, rm["animation"] == "none", f"no animation: {rm['animation']}")
        check(fails, rm["scrollable"] and rm["tabindex"] == "0",
              "row scrolls sideways and takes keyboard focus")
        check(fails, rm["visible"] == "1", "content shown without the reveal")
        page.focus(".reviews__viewport")
        before = page.evaluate("document.querySelector('.reviews__viewport').scrollLeft")
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(400)
        after = page.evaluate("document.querySelector('.reviews__viewport').scrollLeft")
        check(fails, after > before, f"arrow key scrolls the row ({before} -> {after})")
        ctx.close()
        browser.close()

    print("\nconsole:", flush=True)
    for line in problems or ["  clean"]:
        print(" ", line, flush=True)
    if problems:
        fails.append("console problems")

    print("\n" + ("FAILED: " + "; ".join(fails) if fails else "all reviews, About and nav checks passed"))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
