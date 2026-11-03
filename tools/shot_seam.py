"""Photograph the join between About and the results band (the top of #transformations)."""
import os

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates")

def main():
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome")
        page = b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(1200)
        # Put the boundary a third of the way down the frame.
        top = page.evaluate(
            "() => document.querySelector('#transformations').getBoundingClientRect().top"
            " + window.scrollY")
        page.evaluate(f"() => window.scrollTo(0, {top} - 300)")
        page.wait_for_timeout(1000)
        out = os.path.join(OUT, "seam.png")
        page.screenshot(path=out)
        print("->", out)
        b.close()

if __name__ == "__main__":
    main()
