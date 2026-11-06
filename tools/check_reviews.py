"""Drive the reviews row, the About section, the results band and the nav in Chrome.

  * the sections run hero > About > Real clients > reviews > Why
    TheHealthyStitch > enquiry form
  * the reviews stand still: one list, no animation, no Pause button, and the
    row does not move by itself
  * the visitor slides it: the arrows step one card and land square and stop
    at either end, a mouse drags it (a short nudge springs back), a finger
    swipes it while an up-down swipe still scrolls the page, and the arrow
    keys move it once it has focus. On a screen wide enough for every card
    the arrows and the tab stop go away
  * every card is the same height and none clips its text
  * About gives Mitali's full name and the founder caption, the footer's About
    link lands on it, the portrait loads and stays level with the story
  * the results band shows the six client pairs and not the diploma photograph
  * the wordmark reads TheHealthyStitch, in the nav and the footer
  * the nav is Home, Plans (the plans page), Enquiry form, Contact (WhatsApp),
    the email address, Instagram and Facebook, and each goes where it says.
    Below 1200px they fold behind a Menu button: it opens with focus on the
    first link, Tab walks the links in order, and it closes on a link, Escape,
    a click outside, focus leaving the nav, and the screen widening
  * the bar fits at every width from 320px to 1920px, with nothing touching

Never submits the enquiry form, and blocks /api/enquiries in case anything
does, so no test record is written to data/enquiries.json.

    SITE_URL=http://localhost:5175/ python tools/check_reviews.py
"""
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
NAMES = ["Zeel", "Jalpa", "Kathan", "Drishti", "Arpita"]
ORDER = ["top", "about", "transformations", "reviews", "proof", "enquiry"]
WORDMARK = "TheHealthyStitch"

# Visible label, and how the href starts.
NAV = [
    ("Home", "/"),
    ("Plans", "/plans"),
    ("Enquiry form", "#enquiry"),
    ("Contact", "https://wa.me/918879293255?text="),
    ("shahmitali.ms@gmail.com", "mailto:shahmitali.ms@gmail.com"),
    ("Instagram", "https://www.instagram.com/"),
    ("Facebook", "https://www.facebook.com/"),
]
# What a screen reader hears for the links whose label is not the whole name.
NAV_NAMES = [
    "Contact on WhatsApp (opens in a new tab)",
    "Email shahmitali.ms@gmail.com",
    "Instagram (opens in a new tab)",
    "Facebook (opens in a new tab)",
]
COMPACT_BELOW = 1200  # Navbar.jsx COMPACT and the global.css media query
GAP = 24              # least room between the wordmark, the links and the end of the bar

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

# The brand is measured by what it holds: in the compact bar the link itself
# stretches across the free space.
BAR = """() => {
  const span = els => { const b = els.map(e => e.getBoundingClientRect());
    return { l: Math.round(Math.min(...b.map(r => r.left))), r: Math.round(Math.max(...b.map(r => r.right))) }; };
  const shown = s => getComputedStyle(document.querySelector(s)).display !== 'none';
  const inline = getComputedStyle(document.querySelector('.nav__links')).position !== 'absolute';
  const name = document.querySelector('.nav__name');
  return {
    brand: span([...document.querySelector('.nav__brand').children]),
    links: inline ? span([document.querySelector('.nav__links')]) : null,
    end: span([...document.querySelector('.nav__end').children].filter(k => getComputedStyle(k).display !== 'none')),
    cta: shown('.nav__cta'),
    toggle: shown('.nav__toggle'),
    nameCut: name.scrollWidth > name.clientWidth + 1,
    sideScroll: document.documentElement.scrollWidth > innerWidth,
  };
}"""

ROW = """() => {
  const row = document.querySelector('.reviews__viewport');
  const cards = [...row.querySelectorAll('.review')];
  const arrow = l => document.querySelector(`[aria-label="${l}"]`);
  const pad = parseFloat(getComputedStyle(document.querySelector('.reviews')).paddingLeft);
  return {
    lists: document.querySelectorAll('.reviews__list').length,
    copies: document.querySelectorAll('#reviews [aria-hidden="true"] .review').length,
    cards: cards.length,
    x: Math.round(row.scrollLeft),
    max: row.scrollWidth - row.clientWidth,
    step: cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0,
    gutter: Math.round(pad),
    firstLeft: Math.round(cards[0].getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft),
    animation: getComputedStyle(row.querySelector('.reviews__list')).animationName,
    heights: cards.map(c => Math.round(c.getBoundingClientRect().height)),
    clipped: [...row.querySelectorAll('.review__chat')].filter(c => c.scrollHeight > c.clientHeight + 1).length,
    toggle: !!document.querySelector('.reviews__toggle'),
    prev: arrow('Previous review') ? arrow('Previous review').getAttribute('aria-disabled') : null,
    next: arrow('Next review') ? arrow('Next review').getAttribute('aria-disabled') : null,
    tabindex: row.getAttribute('tabindex'),
    classes: row.className,
    sideScroll: document.documentElement.scrollWidth > innerWidth,
  };
}"""


def check(fails, ok, label):
    print(f"  {'ok  ' if ok else 'FAIL'}  {label}", flush=True)
    if not ok:
        fails.append(label)


def settle(page, timeout=4000):
    """Wait until the page and the reviews row have both stopped scrolling."""
    probe = """() => { const r = document.querySelector('.reviews__viewport');
        return [Math.round(scrollY), r ? Math.round(r.scrollLeft) : 0]; }"""
    last, still, waited = None, 0, 0
    while waited < timeout:
        now = page.evaluate(probe)
        still = still + 1 if now == last else 0
        if still >= 3:
            return
        last = now
        page.wait_for_timeout(100)
        waited += 100


def top_of(page, selector):
    settle(page)
    return page.evaluate(f"Math.round(document.querySelector('{selector}').getBoundingClientRect().top)")


def open_page(browser, w, h, problems, path="", **context):
    ctx = browser.new_context(viewport={"width": w, "height": h}, **context)
    page = ctx.new_page()
    page.route("**/api/enquiries", lambda route: route.abort())
    page.on("console", lambda m: m.type in ("error", "warning")
            and problems.append(f"[{w} {m.type}] {m.text}"))
    page.on("pageerror", lambda e: problems.append(f"[{w} pageerror] {e}"))
    page.goto(URL + path, wait_until="networkidle")
    page.wait_for_timeout(800)
    return ctx, page


def to_row(page):
    page.evaluate("document.querySelector('#reviews').scrollIntoView({ block: 'start' })")
    page.wait_for_timeout(900)
    page.evaluate("document.querySelector('.reviews__viewport').scrollTo({ left: 0, behavior: 'instant' })")
    page.wait_for_timeout(200)


def row(page):
    return page.evaluate(ROW)


def touch_drag(page, cdp, dx=0, dy=0, steps=12, pause=16):
    """A finger put down in the middle of the row, as seen on screen, and dragged.

    `pause` is the time between moves: 16ms is an unhurried swipe, and five
    8ms steps over 260px is a hard flick."""
    box = page.locator(".reviews__viewport").bounding_box()
    x, y = box["x"] + box["width"] / 2, box["y"] + min(box["height"], 844) / 2
    cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y}]})
    for i in range(1, steps + 1):
        cdp.send("Input.dispatchTouchEvent", {"type": "touchMove",
                                              "touchPoints": [{"x": x + dx * i / steps, "y": y + dy * i / steps}]})
        page.wait_for_timeout(pause)
    cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    page.wait_for_timeout(300)
    settle(page)


def mouse_drag(page, dx, steps=10):
    box = page.locator(".reviews__viewport").bounding_box()
    x, y = box["x"] + box["width"] / 2, box["y"] + 200
    page.mouse.move(x, y)
    page.mouse.down()
    for i in range(1, steps + 1):
        page.mouse.move(x + dx * i / steps, y)
        page.wait_for_timeout(16)
    page.mouse.up()
    page.wait_for_timeout(300)
    settle(page)
    page.wait_for_timeout(500)  # past the 700ms that turns snapping back on


def press(page, name):
    page.get_by_role("button", name=name, exact=True).click()
    page.wait_for_timeout(200)
    settle(page)


def check_still(page, fails):
    """One list, nothing animating, and nothing moving by itself."""
    s = row(page)
    check(fails, s["lists"] == 1 and s["copies"] == 0 and s["cards"] == 5,
          f"one list of five cards, no hidden copy ({s['lists']} list, {s['copies']} copies, {s['cards']} cards)")
    check(fails, s["animation"] == "none" and not s["toggle"],
          f"no animation and no Pause button ({s['animation']}, toggle={s['toggle']})")
    before = s["x"]
    page.mouse.move(5, 5)
    page.wait_for_timeout(1500)
    after = row(page)["x"]
    check(fails, before == after, f"the row does not move by itself ({before} -> {after})")
    names = page.evaluate("[...document.querySelectorAll('.review__name')].map(n => n.textContent)")
    check(fails, names == NAMES, f"read once, in order: {names}")
    via = page.evaluate("[...new Set([...document.querySelectorAll('.review__via')].map(n => n.textContent))]")
    check(fails, via == ["On WhatsApp"], f"each card says 'On WhatsApp': {via}")
    check(fails, len(set(s["heights"])) == 1, f"cards share one height: {s['heights']}")
    check(fails, s["clipped"] == 0, f"no card clips its text ({s['clipped']} clipped)")
    check(fails, s["firstLeft"] == s["gutter"], f"the first card lines up with the headline "
                                                 f"({s['firstLeft']}px, gutter {s['gutter']}px)")
    check(fails, not s["sideScroll"], "no sideways page scroll")
    note = page.evaluate("document.querySelector('.reviews__note').textContent")
    stand = page.evaluate("document.querySelector('.reviews__standfirst').textContent")
    check(fails, "corrected" in note and "exactly as sent" not in note and "word for word" not in stand,
          "the note says the messages were corrected, not that they are verbatim")
    return s


def check_arrows(page, fails):
    s = row(page)
    check(fails, s["prev"] == "true" and s["next"] == "false" and s["tabindex"] == "0",
          f"at the start: Previous off, Next on, the row takes focus ({s['prev']}, {s['next']}, {s['tabindex']})")
    press(page, "Next review")
    s = row(page)
    check(fails, s["x"] == s["step"] and s["prev"] == "false",
          f"Next moves one card and lands square (x={s['x']}, step={s['step']})")
    presses = 0
    while row(page)["next"] != "true" and presses < 8:
        press(page, "Next review")
        presses += 1
    s = row(page)
    check(fails, s["next"] == "true" and s["x"] >= s["max"] - 1,
          f"Next stops at the last card (x={s['x']} of {s['max']}, Next off)")
    focused = page.evaluate("document.activeElement.getAttribute('aria-label')")
    check(fails, focused == "Next review", f"focus stays on Next at the end ({focused!r})")
    press(page, "Previous review")
    s = row(page)
    check(fails, s["x"] < s["max"] and s["next"] == "false", f"Previous goes back (x={s['x']})")


def check_mouse(page, fails):
    to_row(page)
    s0 = row(page)
    mouse_drag(page, -200)
    s = row(page)
    check(fails, s["x"] == s0["step"], f"a mouse drag slides the row on by one card (x={s['x']}, step={s0['step']})")
    check(fails, "is-dragging" not in s["classes"] and "is-settling" not in s["classes"],
          f"snapping is back on once it lands ({s['classes']!r})")
    mouse_drag(page, -30)
    s = row(page)
    check(fails, s["x"] == s0["step"], f"a short nudge springs back to the card (x={s['x']})")
    mouse_drag(page, 220)
    s = row(page)
    check(fails, s["x"] == 0, f"dragging the other way goes back (x={s['x']})")

    page.focus(".reviews__viewport")
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(200)
    settle(page)
    s = row(page)
    check(fails, s["x"] == s0["step"], f"ArrowRight on the focused row moves one card (x={s['x']})")
    page.keyboard.press("ArrowLeft")
    page.wait_for_timeout(200)
    settle(page)
    check(fails, row(page)["x"] == 0, f"ArrowLeft moves back (x={row(page)['x']})")


def check_touch(page, fails):
    to_row(page)
    cdp = page.context.new_cdp_session(page)
    step = row(page)["step"]
    touch_drag(page, cdp, dx=-200)
    s = row(page)
    check(fails, s["x"] == step, f"a swipe left moves one card and snaps square (x={s['x']}, step={step})")
    touch_drag(page, cdp, dx=200)
    check(fails, row(page)["x"] == 0, f"a swipe right goes back (x={row(page)['x']})")
    page.wait_for_timeout(600)
    touch_drag(page, cdp, dx=-260, steps=5, pause=8)
    s = row(page)
    check(fails, s["x"] == step, f"even a hard flick moves on by one review only (x={s['x']})")
    page.evaluate("document.querySelector('.reviews__viewport').scrollTo({ left: 0, behavior: 'instant' })")
    page.wait_for_timeout(200)
    page.evaluate("document.querySelector('.reviews__viewport').scrollIntoView({ block: 'center' })")
    page.wait_for_timeout(400)
    before = page.evaluate("Math.round(scrollY)")
    touch_drag(page, cdp, dy=-300)
    after = page.evaluate("Math.round(scrollY)")
    check(fails, after - before > 150 and row(page)["x"] == 0,
          f"an up-down swipe on a card scrolls the page ({before} -> {after}), the row stays put")


def check_results(page, fails):
    imgs = page.eval_on_selector_all("#transformations img", "els => els.map(i => i.getAttribute('src'))")
    titles = page.eval_on_selector_all("#transformations button, #transformations figcaption",
                                       "els => els.map(e => e.textContent.trim())")
    check(fails, len(imgs) == 6 and not any("credential" in s for s in imgs)
          and not any("Diploma" in t for t in titles),
          f"the results band shows six client pairs and no diploma ({len(imgs)} photographs)")


def check_about(page, fails, w):
    page.locator(".site-footer nav a", has_text="About us").click()
    top = top_of(page, "#about")
    check(fails, abs(top) <= 2, f"'About us' in the footer lands on the section (top {top}px)")
    img = page.evaluate("""() => { const i = document.querySelector('.about__frame img');
        return [i.complete, i.naturalWidth, i.naturalHeight]; }""")
    check(fails, img[0] and img[1] == 512 and img[2] == 640, f"portrait loads at 512x640: {img}")
    hello = page.evaluate("document.querySelector('.about__hello').textContent").strip()
    check(fails, "Mitali Shah" in hello and WORDMARK in hello, f"About gives her full name: {hello!r}")
    caption = page.evaluate("""() => { const c = document.querySelector('.about__caption').cloneNode(true);
        c.querySelector('.about__caption-name').remove(); return c.textContent.trim(); }""")
    check(fails, caption == f"Founder of {WORDMARK}", f"the caption under her photo: {caption!r}")
    if w > 860:
        page.evaluate("""() => { const s = document.querySelector('.about__story')
            .getBoundingClientRect(); window.scrollBy(0, s.top + s.height * 0.45); }""")
        page.wait_for_timeout(400)
        pin = page.evaluate("Math.round(document.querySelector('.about__portrait').getBoundingClientRect().top)")
        check(fails, 30 <= pin <= 42, f"portrait sticks beside the story (top {pin}px, want 36)")


def check_links(page, fails):
    """The seven links: labels, targets, and the names a screen reader hears."""
    links = page.eval_on_selector_all(".nav__links a", NAV_LINKS)
    labels = [link["text"] for link in links]
    check(fails, labels == [label for label, _ in NAV], f"nav links: {labels}")
    check(fails, len(links) == len(NAV) and all(
        link["href"].startswith(href) for link, (_, href) in zip(links, NAV)),
        f"each goes where it says: {[link['href'][:34] for link in links]}")
    away = links[3:] if len(links) == len(NAV) else []
    check(fails, all(link["target"] == "_blank" and link["rel"] == "noopener noreferrer"
                     for link in away if not link["href"].startswith("mailto:")),
          "WhatsApp, Instagram and Facebook open in a new tab")
    # Scoped to the nav: the footer has links with the same names.
    nav = page.get_by_role("navigation", name="Main", exact=True)
    for name in NAV_NAMES:
        check(fails, nav.get_by_role("link", name=name, exact=True).count() == 1,
              f"screen readers hear '{name}'")


def check_wide_nav(page, fails):
    check(fails, page.locator(".nav__toggle").is_hidden(), "no Menu button: the links fit in the bar")
    marks = page.evaluate("[...document.querySelectorAll('.nav__name, .site-footer__wordmark')].map(e => e.textContent.trim())")
    check(fails, marks == [WORDMARK, WORDMARK], f"the wordmark reads {WORDMARK}: {marks}")
    check_links(page, fails)
    centres = page.evaluate("""() => [...document.querySelectorAll('.nav__links a')]
        .map(a => { const r = a.getBoundingClientRect(); return Math.round(r.top + r.height / 2); })""")
    check(fails, max(centres) - min(centres) <= 1, f"the links sit on one line: centres {centres}")

    links = page.locator(".nav__links")
    links.get_by_text("Enquiry form", exact=True).click()
    top = top_of(page, "#enquiry")
    check(fails, abs(top) <= 2, f"'Enquiry form' lands on the form (top {top}px)")
    page.locator(".nav__cta").click()
    top = top_of(page, "#enquiry")
    check(fails, abs(top) <= 2, f"'Get Started' lands on the form (top {top}px)")
    links.get_by_text("Plans", exact=True).click()
    settle(page)
    page.wait_for_timeout(400)
    on_plans = page.evaluate("[location.pathname, !!document.querySelector('.plans-page')]")
    check(fails, on_plans == ["/plans", True], f"'Plans' opens the plans page: {on_plans}")
    links.get_by_text("Home", exact=True).click()
    settle(page)
    page.wait_for_timeout(400)
    home = page.evaluate("[location.pathname, !!document.querySelector('#about'), Math.round(scrollY)]")
    check(fails, home[0] == "/" and home[1] and home[2] == 0,
          f"Home comes back to the real top of the home page: {home}")


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

    page.evaluate("scrollTo(0, 0)")
    page.wait_for_timeout(300)
    toggle.click()
    page.wait_for_timeout(300)
    page.locator(".nav__brand").click()
    page.wait_for_timeout(400)
    check(fails, expanded() == "false", f"the wordmark closes the menu too ({expanded()})")

    settle(page)
    page.evaluate("scrollTo(0, 0)")
    page.wait_for_timeout(300)
    toggle.click()
    page.wait_for_timeout(300)
    page.set_viewport_size({"width": 1280, "height": h})
    page.wait_for_timeout(400)
    check(fails, expanded() == "false" and page.locator(".nav__links").is_visible(),
          f"widening the screen closes it and puts the links back in the bar ({expanded()})")


def check_bar_fit(browser, fails, problems):
    """Nothing in the bar touches, the wordmark is never cut, no sideways scroll."""
    ctx, page = open_page(browser, 1440, 900, problems)
    for w in (320, 359, 360, 390, 600, 768, 959, 960, 1024, 1100, 1199, 1200,
              1279, 1280, 1366, 1440, 1920):
        page.set_viewport_size({"width": w, "height": 900})
        page.wait_for_timeout(250)
        bar = page.evaluate(BAR)
        inline = w >= COMPACT_BELOW
        room = [(bar["links"]["l"] - bar["brand"]["r"]), (bar["end"]["l"] - bar["links"]["r"])] \
            if bar["links"] else [bar["end"]["l"] - bar["brand"]["r"]]
        ok = (bar["toggle"] != inline and (bar["links"] is not None) == inline
              and bar["cta"] == inline and min(room) >= GAP and not bar["nameCut"]
              and bar["end"]["r"] <= w and not bar["sideScroll"])
        what = "links in the bar" if bar["links"] else "Menu button"
        check(fails, ok, f"{w:>4}px  {what}, Get Started {'shown' if bar['cta'] else 'hidden'}, "
                         f"room {room}px{', wordmark cut' if bar['nameCut'] else ''}")
    ctx.close()


def main():
    fails = []
    problems = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")

        for w, h, touch in ((1440, 900, False), (390, 844, True)):
            extra = {"is_mobile": True, "has_touch": True, "device_scale_factor": 2} if touch else {}
            print(f"\n{w}x{h}{' (touch)' if touch else ''}", flush=True)
            ctx, page = open_page(browser, w, h, problems, **extra)

            order = page.eval_on_selector_all("main.canvas > section", "els => els.map(e => e.id)")
            check(fails, order == ORDER, f"sections run {' > '.join(ORDER)}: {order}")
            eyebrows = page.eval_on_selector_all(
                ".proof__eyebrow, .shift__eyebrow, .reviews__eyebrow, .about__eyebrow, .enquiry__eyebrow",
                "els => els.map(e => e.innerText.trim())")
            check(fails, len(eyebrows) == 5 and not any("NO." in e.upper() for e in eyebrows),
                  f"no section numbers in the eyebrows: {eyebrows}")
            check(fails, page.locator("#philosophy, .quote").count() == 0, "the green quote band is gone")
            check_results(page, fails)

            to_row(page)
            check_still(page, fails)
            check_arrows(page, fails)
            if touch:
                check_touch(page, fails)
            else:
                check_mouse(page, fails)
            check_about(page, fails, w)
            ctx.close()

            print(f"\nnav, {w}x{h}", flush=True)
            ctx, page = open_page(browser, w, h, problems, **extra)
            if w >= COMPACT_BELOW:
                check_wide_nav(page, fails)
            else:
                check_compact_nav(page, w, h, fails)
            ctx.close()

        print("\nevery card on screen, 1920x1080", flush=True)
        ctx, page = open_page(browser, 1920, 1080, problems)
        to_row(page)
        s = row(page)
        check(fails, s["max"] <= 1 and s["prev"] is None and s["next"] is None and s["tabindex"] is None,
              f"nothing to slide: no arrows, no tab stop (overflow {s['max']}px)")
        ctx.close()

        print("\nthe bar at every width", flush=True)
        check_bar_fit(browser, fails, problems)

        print("\nreduced motion, 1440x900", flush=True)
        ctx, page = open_page(browser, 1440, 900, problems, reduced_motion="reduce")
        to_row(page)
        visible = page.evaluate("getComputedStyle(document.querySelector('.reviews__head')).opacity")
        check(fails, visible == "1", "content shown without the reveal")
        page.get_by_role("button", name="Next review", exact=True).click()
        page.wait_for_timeout(120)
        s = row(page)
        check(fails, s["x"] == s["step"], f"Next jumps without gliding (x={s['x']} after 120ms)")
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
