"""Assert every band's text hangs off the same left edge as the proof section.

Covers the results band, the reviews, About, the enquiry form and the footer.
The reviews strip runs full bleed on purpose, so it is not in the list."""
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")


def main():
    fails = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        for w, h in ((1920, 1080), (1440, 900), (1024, 768), (834, 1112), (390, 844)):
            page = b.new_page(viewport={"width": w, "height": h})
            page.goto(URL, wait_until="networkidle")
            page.wait_for_timeout(600)
            left = page.evaluate(
                """() => {
                  const x = s => Math.round(
                    document.querySelector(s).getBoundingClientRect().left);
                  return {
                    proofEyebrow: x('.proof__eyebrow'),
                    proofHeadline: x('.proof__headline'),
                    shiftEyebrow: x('.shift__eyebrow'),
                    shiftHeadline: x('.shift__headline'),
                    shiftFoot: x('.shift__foot'),
                    shiftDisclaimer: x('.shift__disclaimer'),
                    // The wheel, or on a phone the swipe gallery that replaces it.
                    wheelOrGallery: x('.shift__wheel, .shift__gallery'),
                    reviewsEyebrow: x('.reviews__eyebrow'),
                    reviewsHeadline: x('.reviews__headline'),
                    reviewsNote: x('.reviews__note'),
                    aboutEyebrow: x('.about__eyebrow'),
                    aboutHeadline: x('.about__headline'),
                    enquiryEyebrow: x('.enquiry__eyebrow'),
                    enquiryHeadline: x('.enquiry__headline'),
                    footerEyebrow: x('.site-footer__eyebrow'),
                    footerHeadline: x('.site-footer__headline'),
                    footerBottom: x('.site-footer__bottom'),
                  };
                }"""
            )
            ok = len(set(left.values())) == 1
            print(f"{w}x{h}  {left}  aligned={ok}")
            if not ok:
                fails.append(f"{w}x{h}: {left}")
            page.close()
        b.close()

    print("\n" + ("MISALIGNED:" if fails else "every band shares one left edge"))
    for f in fails:
        print(" -", f)
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
