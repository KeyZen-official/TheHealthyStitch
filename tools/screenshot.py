"""Capture the landing page at desktop, tablet and mobile widths."""
import os
import sys

from playwright.sync_api import sync_playwright

URL = os.environ.get("SITE_URL", "http://localhost:5173/")
OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates")

VIEWPORTS = [
    ("desktop", 1920, 1080),
    ("laptop", 1440, 900),
    ("tablet", 834, 1112),
    ("mobile", 390, 844),
]


def main():
    only = sys.argv[1:] or None
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        for name, w, h in VIEWPORTS:
            if only and name not in only:
                continue
            page = browser.new_page(viewport={"width": w, "height": h},
                                    device_scale_factor=1)
            page.goto(URL, wait_until="networkidle")
            page.wait_for_timeout(1400)  # webfont swap + image decode
            path = os.path.join(OUT, f"shot_{name}.png")
            full = name in ("tablet", "mobile")
            page.screenshot(path=path, full_page=full)
            print(f"{name:8s} {w}x{h} -> {path}", flush=True)
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
