"""Exercise the wheel's keyboard route, its index buttons and reduced motion."""
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates")

FRONT = "#transformations ol button[aria-current]"


def front(page):
    el = page.locator(FRONT)
    return el.inner_text() if el.count() else None


def main():
    fails = []
    os.makedirs(OUT, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")

        # ---------- keyboard ----------
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(URL, wait_until="networkidle")
        page.locator("#transformations").scroll_into_view_if_needed()
        page.wait_for_timeout(700)

        stage = page.locator("#transformations [role='group']")
        stage.focus()
        focused = page.evaluate("() => document.activeElement.getAttribute('role')")
        print(f"stage focusable: {focused == 'group'}")
        if focused != "group":
            fails.append("stage did not take focus")

        for _ in range(3):
            page.keyboard.press("ArrowDown")
            page.wait_for_timeout(700)
        after_down = front(page)
        print(f"3x ArrowDown -> {after_down}")
        if after_down != "Transformation No. 03":
            fails.append(f"ArrowDown landed on {after_down}, expected No. 03")

        page.keyboard.press("ArrowUp")
        page.wait_for_timeout(800)
        after_up = front(page)
        print(f"1x ArrowUp   -> {after_up}")
        if after_up != "Transformation No. 02":
            fails.append(f"ArrowUp landed on {after_up}, expected No. 02")

        # ArrowDown must not also scroll the page.
        before = page.evaluate("() => window.scrollY")
        page.keyboard.press("ArrowDown")
        page.wait_for_timeout(400)
        if page.evaluate("() => window.scrollY") != before:
            fails.append("ArrowDown scrolled the page as well as turning the wheel")
        print(f"arrow keys do not scroll the page: {page.evaluate('() => window.scrollY') == before}")

        # ---------- index buttons ----------
        page.locator("#transformations ol button").last.click()
        page.wait_for_timeout(900)
        jumped = front(page)
        print(f"click last index entry -> {jumped}")
        if jumped != "Diploma in Nutrition":
            fails.append(f"index jump landed on {jumped}, expected the last item")

        # ---------- the page is not trapped ----------
        page.locator("#transformations ol button").first.click()
        page.wait_for_timeout(900)
        box = page.locator("#transformations").bounding_box()
        page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        start = page.evaluate("() => window.scrollY")
        for _ in range(90):
            page.mouse.wheel(0, 120)
            page.wait_for_timeout(16)
        page.wait_for_timeout(600)
        moved = page.evaluate("() => window.scrollY") - start
        print(f"page still scrolls past the wheel: {moved > 0} (+{moved}px)")
        if moved <= 0:
            fails.append("the wheel traps the page scroll at its end")
        page.close()

        # ---------- reduced motion ----------
        page = browser.new_page(viewport={"width": 1440, "height": 900},
                                reduced_motion="reduce")
        page.goto(URL, wait_until="networkidle")
        page.locator("#transformations").scroll_into_view_if_needed()
        page.wait_for_timeout(700)
        # The section reveal must be off, not mid-fade.
        opacity = page.eval_on_selector("#transformations .shift__head",
                                        "el => getComputedStyle(el).opacity")
        print(f"reduced motion: head opacity {opacity}")
        if opacity != "1":
            fails.append(f"reduced motion left the head at opacity {opacity}")

        page.locator("#transformations ol button").nth(3).click()
        # No easing under reduced motion: it should be there almost at once.
        page.wait_for_timeout(180)
        snap = front(page)
        print(f"reduced motion: index jump settled in 180ms -> {snap}")
        if snap != "Transformation No. 04":
            fails.append(f"reduced motion jump was still easing: {snap}")
        page.screenshot(path=os.path.join(OUT, "wheel_reduced.png"))
        page.close()

        browser.close()

    print("\n" + ("FAILED:" if fails else "all interaction checks passed"))
    for f in fails:
        print(" -", f)
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
