"""Assert the rendered page against the spec's colour and geometry numbers."""
import os

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")

PROBES = [
    ("body", "backgroundColor", "body      #F5F5F1 -> rgb(245,245,241)"),
    (".canvas", "backgroundColor", "canvas    #F5F5F1 -> rgb(245,245,241)"),
    (".hero__left", "backgroundColor", "left      #EDEEE8 -> rgb(237,238,232)"),
    (".hero__right", "backgroundColor", "right     #F7F7F4 -> rgb(247,247,244)"),
    (".proof", "backgroundColor", "proof     #EFF1E9 -> rgb(239,241,233)"),
    (".hero__headline", "color", "headline  #69851F -> rgb(105,133,31)"),
    (".hero__headline", "fontFamily", "headline font"),
    (".hero__headline", "fontSize", "headline size"),
    (".visual__letters", "color", "letters   #D6DDC8 -> rgb(214,221,200)"),
    (".visual__tagline", "color", "tagline   #22231F -> rgb(34,35,31)"),
    (".visual__tagline", "fontFamily", "tagline font"),
    (".hero__rule-label", "color", "rule lbl  #22231F -> rgb(34,35,31)"),
    (".hero__rule-line", "backgroundColor", "rule line #383832 -> rgb(56,56,50)"),
    (".pillars__copy", "color", "copy      #66665E -> rgb(102,102,94)"),
    (".pillars__name", "color", "pillar nm #22231F -> rgb(34,35,31)"),
    (".proof__headline em", "color", "proof em  #69851F -> rgb(105,133,31)"),
    (".promises__num", "color", "olive ink #3F5213 -> rgb(63,82,19)"),
    (".nav", "height", "nav height 68px (60px under 900)"),
    (".nav__name", "fontFamily", "wordmark font (Fraunces)"),
    ("body", "fontFamily", "body font (Plus Jakarta Sans)"),
]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(1200)

        print("--- computed styles ---")
        for sel, prop, note in PROBES:
            val = page.eval_on_selector(
                sel, f"el => getComputedStyle(el).{prop}"
            )
            print(f"{note:46s} = {val}")

        print("\n--- geometry ---")
        geo = page.evaluate(
            """() => {
              const r = s => {
                const e = document.querySelector(s);
                if (!e) return null;
                const b = e.getBoundingClientRect();
                return {x: Math.round(b.x), y: Math.round(b.y),
                        w: Math.round(b.width), h: Math.round(b.height)};
              };
              const canvas = r('.canvas');
              const left = r('.hero__left');
              const right = r('.hero__right');
              const nav = r('.nav');
              const hero = r('.hero');
              return {
                viewport: [window.innerWidth, window.innerHeight],
                canvas, left, right,
                leftPct: +(left.w / canvas.w * 100).toFixed(1),
                rightPct: +(right.w / canvas.w * 100).toFixed(1),
                // Full bleed: the canvas is the page, so this must read 100.
                canvasPctOfViewport: +(canvas.w / window.innerWidth * 100).toFixed(1),
                // The hero owns the first screen; the proof section starts
                // exactly at the fold.
                foldBottom: Math.round(nav.h + hero.h),
                heroFitsFold: (nav.h + hero.h) <= window.innerHeight + 1,
                noSideScroll:
                  document.documentElement.scrollWidth <= window.innerWidth,
                // Two set lines ("Stitch by stitch," / "a healthier you.").
                headlineLines: (() => {
                  const h = document.querySelector('.hero__headline');
                  const cs = getComputedStyle(h);
                  return Math.round(h.getBoundingClientRect().height /
                                    parseFloat(cs.lineHeight));
                })(),
                headlineOverflows: (() => {
                  const h = document.querySelector('.hero__headline');
                  return h.scrollWidth > h.clientWidth + 1;
                })(),
                slideClip: getComputedStyle(
                  document.querySelector('.slides__frame')).clipPath,
                slideCount: document.querySelectorAll('.slides__image').length,
                slidesActive:
                  document.querySelectorAll('.slides__image.is-active').length,
                platePieces: document.querySelectorAll('.plate__piece').length,
                ledgerRows: document.querySelectorAll('.ledger__row').length,
                imgNatural: (() => {
                  const i = document.querySelector('.visual__capsule');
                  return [i.naturalWidth, i.naturalHeight, i.complete];
                })(),
                photoNatural: (() => {
                  const i = document.querySelector('.slides__image.is-active');
                  return [i.naturalWidth, i.naturalHeight, i.complete];
                })(),
              };
            }"""
        )
        for k, v in geo.items():
            print(f"{k:24s} = {v}")

        browser.close()


if __name__ == "__main__":
    main()
