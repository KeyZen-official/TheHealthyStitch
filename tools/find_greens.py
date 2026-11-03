"""Hunt for leafy greens / herbs shot against a plain backdrop."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from find_assets import search  # noqa: E402

QUERIES = [
    "spinach leaf",
    "basil leaves",
    "mint leaves white",
    "parsley",
    "baby spinach",
    "coriander leaves",
    "rosemary sprig",
    "strawberry white background",
    "green apple granny smith",
]

for q in QUERIES:
    print(f"\n=== {q} ===", flush=True)
    try:
        rows = search(q, limit=10)
        if not rows:
            print("  (none)")
        for title, w, h in rows:
            print(f"  {w}x{h}  {title}", flush=True)
    except Exception as exc:  # noqa: BLE001
        print(f"  ERR {exc}", flush=True)
