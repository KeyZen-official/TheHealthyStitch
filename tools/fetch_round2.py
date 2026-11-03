"""Second pass: green apple, herbs and a cleaner strawberry."""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
from fetch_ingredients import OUT, image_url  # noqa: E402
import urllib.request  # noqa: E402

UA = {"User-Agent": "NutriSite/1.0 (local design asset build)"}

WANTED = {
    "green_apple_a": ("File:A 'Granny Smith' green apple from Australia, photographed in India, December 4, 2023.jpg", 1500),
    "green_apple_b": ("File:Green apple 01.jpg", 1500),
    "green_apple_c": ("File:Green apple 02.jpg", 1500),
    "basil_a": ("File:Basil leaf.jpg", 1500),
    "basil_b": ("File:Sweet basil leaves.jpg", 1800),
    "parsley_a": ("File:Petroselinum crispum 003.JPG", 1500),
    "strawberry_b": ("File:Strawberry on white background.jpg", 1600),
}


def fetch_one(name, title, width, attempts=4):
    dest = os.path.join(OUT, name + ".jpg")
    if os.path.exists(dest) and os.path.getsize(dest) > 20000:
        print(f"SKIP {name:16s} already present", flush=True)
        return
    for attempt in range(attempts):
        try:
            url, lic, _ = image_url(title, width)
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=180) as resp:
                blob = resp.read()
            with open(dest, "wb") as fh:
                fh.write(blob)
            print(f"OK   {name:16s} {len(blob)//1024:5d} KB  [{lic}]", flush=True)
            return
        except Exception as exc:  # noqa: BLE001
            wait = 12 * (attempt + 1)
            print(f"..   {name:16s} {exc} -> retry in {wait}s", flush=True)
            time.sleep(wait)
    print(f"FAIL {name:16s} gave up", flush=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, (title, width) in WANTED.items():
        fetch_one(name, title, width)
        time.sleep(8)


if __name__ == "__main__":
    main()
