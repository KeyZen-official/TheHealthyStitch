"""Drive the results wheel in a real browser and photograph each state.

The wheel writes its transforms from a rAF loop, so a static screenshot of the
page only ever shows the ring at rest. This scrolls the section into view, then
sends wheel deltas and captures the ring, the opened drum and a couple of turns
past it — plus anything the console complained about on the way.
"""
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates")

WIDTH, HEIGHT = (int(v) for v in os.environ.get("VIEWPORT", "1440x900").split("x"))


def main():
    tag = sys.argv[1] if len(sys.argv) > 1 else "wheel"
    os.makedirs(OUT, exist_ok=True)
    problems = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT},
                                device_scale_factor=1)
        page.on("console", lambda m: m.type in ("error", "warning")
                and problems.append(f"[{m.type}] {m.text}"))
        page.on("pageerror", lambda e: problems.append(f"[pageerror] {e}"))

        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(1200)

        section = page.locator("#transformations")
        assert section.count() == 1, "#transformations is not on the page"

        # Below 640px (and on a phone on its side) the section shows the swipe
        # gallery instead, so there is no wheel to drive.
        if page.locator("#transformations [aria-roledescription='wheel']").count() == 0:
            print(f"No wheel at {WIDTH}x{HEIGHT}: the swipe gallery replaces it on phones.")
            browser.close()
            return 0

        # The band comes straight after About (check_reviews.py asserts the order).
        order = page.eval_on_selector_all(
            "main.canvas > section", "els => els.map(e => e.id || e.className)")
        print("section order:", order, flush=True)

        cards = page.locator("#transformations img").count()
        print(f"cards: {cards}", flush=True)

        section.scroll_into_view_if_needed()
        page.wait_for_timeout(900)

        # Only now: all but the first two cards are loading="lazy", so before
        # the section is near the viewport they have not even been requested
        # and would read as broken. Wait for each to load or fail, then flag any
        # that 404d or would not decode (naturalWidth 0).
        broken = page.evaluate(
            """() => Promise.all([...document.querySelectorAll('#transformations img')]
                .map(img => (img.complete ? Promise.resolve() : new Promise(done => {
                    img.addEventListener('load', done, { once: true })
                    img.addEventListener('error', done, { once: true })
                    setTimeout(done, 8000)
                })).then(() => img.naturalWidth === 0 ? img.getAttribute('src') : null)))
                .then(srcs => srcs.filter(Boolean))""")
        print("broken images:", broken or "none", flush=True)
        page.screenshot(path=os.path.join(OUT, f"{tag}_0_ring.png"))

        # Park the pointer over the stage so the wheel takes the deltas.
        box = section.bounding_box()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)

        for shot, notches in ((1, 10), (2, 9), (3, 9)):
            for _ in range(notches):
                page.mouse.wheel(0, 100)
                page.wait_for_timeout(45)
            page.wait_for_timeout(1100)
            label = page.locator("#transformations ol button[aria-current]").first
            name = label.inner_text() if label.count() else "?"
            page.screenshot(path=os.path.join(OUT, f"{tag}_{shot}_turn.png"))
            print(f"after {notches} notches -> front card: {name}", flush=True)

        browser.close()

    print("\nconsole:", flush=True)
    for line in problems or ["  clean"]:
        print(" ", line, flush=True)
    return 1 if any("pageerror" in x or "[error]" in x for x in problems) else 0


if __name__ == "__main__":
    sys.exit(main())
