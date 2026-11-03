"""Measure the wheel: stage box, card box, and how far the ring overruns it."""
import json
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")

PROBE = """
() => {
  const section = document.querySelector('#transformations');
  // Phones get the swipe gallery instead of the wheel.
  const stage = section.querySelector('[aria-roledescription="wheel"]');
  if (!stage) return 'no wheel at this size: the swipe gallery replaces it';
  const cards = [...stage.querySelectorAll(':scope > div > *')];
  const s = stage.getBoundingClientRect();
  /* The scale lives on the card's inner face, not on the card, so the card's
     own rect is the full unscaled box and over-reports the ring. Measure the
     face: that is what is actually painted. */
  const boxes = cards.map(c => c.firstElementChild.getBoundingClientRect());
  const top = Math.min(...boxes.map(b => b.top));
  const bottom = Math.max(...boxes.map(b => b.bottom));
  const left = Math.min(...boxes.map(b => b.left));
  const right = Math.max(...boxes.map(b => b.right));
  return {
    stage: { w: Math.round(s.width), h: Math.round(s.height) },
    card: { w: Math.round(cards[0].offsetWidth), h: Math.round(cards[0].offsetHeight) },
    ringExtent: { w: Math.round(right - left), h: Math.round(bottom - top) },
    clippedTopPx: Math.round(s.top - top),
    clippedBottomPx: Math.round(bottom - s.bottom),
    sectionH: Math.round(section.getBoundingClientRect().height),
    perspective: getComputedStyle(stage).perspective,
    preserve3d: getComputedStyle(stage.firstElementChild).transformStyle,
  };
}
"""

def main():
    for vp in (sys.argv[1:] or ["1920x1080", "1440x900", "1280x720", "834x1112", "390x844"]):
        w, h = (int(v) for v in vp.split("x"))
        with sync_playwright() as p:
            b = p.chromium.launch(channel="chrome")
            page = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            page.goto(URL, wait_until="networkidle")
            page.locator("#transformations").scroll_into_view_if_needed()
            page.wait_for_timeout(1000)
            print(f"{vp:10s} {json.dumps(page.evaluate(PROBE))}", flush=True)
            b.close()

if __name__ == "__main__":
    main()
