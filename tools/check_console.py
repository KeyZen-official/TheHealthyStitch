"""Fail loudly on console errors, page errors or failed requests."""
import os

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")


def main():
    problems = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda m: problems.append(f"console.{m.type}: {m.text}")
                if m.type in ("error", "warning") else None)
        page.on("pageerror", lambda e: problems.append(f"pageerror: {e}"))
        page.on("requestfailed",
                lambda r: problems.append(f"requestfailed: {r.url} {r.failure}"))
        page.on("response", lambda r: problems.append(
            f"http {r.status}: {r.url}") if r.status >= 400 else None)
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(1500)
        browser.close()

    if problems:
        print("PROBLEMS:")
        for item in problems:
            print(" -", item)
    else:
        print("clean: no console errors, page errors or failed requests")


if __name__ == "__main__":
    main()
