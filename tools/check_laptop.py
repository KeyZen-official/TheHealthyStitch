"""Spot-check the full-bleed canvas, the fold fit and headline fit at common
desktop widths. The headline is two set lines; `lines` must read 2."""
import os

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
WIDTHS = [(1920, 1080), (1680, 1050), (1536, 864), (1440, 900), (1366, 768), (1280, 800)]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        for w, h in WIDTHS:
            page.set_viewport_size({"width": w, "height": h})
            page.goto(URL, wait_until="networkidle")
            page.wait_for_timeout(900)
            info = page.evaluate(
                """() => {
                  const c = document.querySelector('.canvas').getBoundingClientRect();
                  const nav = document.querySelector('.nav').getBoundingClientRect();
                  const hero = document.querySelector('.hero').getBoundingClientRect();
                  const hl = document.querySelector('.hero__headline');
                  const cs = getComputedStyle(hl);
                  const hb = hl.getBoundingClientRect();
                  const fold = nav.height + hero.height;
                  return {
                    canvasW: Math.round(c.width),
                    pctOfViewport: +(c.width / window.innerWidth * 100).toFixed(1),
                    fold: Math.round(fold),
                    // The hero should land on the fold, not short of it or past it.
                    fits: fold <= window.innerHeight + 1,
                    sideScroll:
                      document.documentElement.scrollWidth > window.innerWidth,
                    headlineFont: Math.round(parseFloat(cs.fontSize)),
                    headlineW: Math.round(hb.width),
                    lines: Math.round(hb.height / parseFloat(cs.lineHeight)),
                    overflow: hl.scrollWidth > hl.clientWidth + 1,
                  };
                }"""
            )
            print(f"{w}x{h}  canvas={info['canvasW']}px "
                  f"({info['pctOfViewport']}% vw)  fold={info['fold']} "
                  f"fits={info['fits']}  sideScroll={info['sideScroll']}  "
                  f"h1={info['headlineFont']}px "
                  f"w={info['headlineW']}  lines={info['lines']} "
                  f"overflow={info['overflow']}", flush=True)
        browser.close()


if __name__ == "__main__":
    main()
