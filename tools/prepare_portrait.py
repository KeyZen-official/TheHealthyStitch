"""Make the About section's portrait from the supplied photograph of Mitali.

The source is the same photograph the results wheel uses for its diploma card
(Mitali holding her Diploma in Nutrition), but the wheel pads it into a wide
landscape card. The About column wants a portrait, so this crops it instead:
4:5, full width, from just above the head to below the certificate. Cropping
is fine here, unlike on a before/after body shot, because nothing below the
certificate is the point of the picture.

Usage
-----
    # the original goes in assets_src/about/ (git-ignored), any filename
    python tools/prepare_portrait.py

Writes public/assets/about/mitali.jpg. Re-encoding drops all EXIF, as the
transformations pipeline does, and the crop is never upscaled.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets_src" / "about"
OUT = ROOT / "public" / "assets" / "about" / "mitali.jpg"

#: Width / height of the frame in src/styles/about.css.
RATIO = 4 / 5
#: Where the crop starts, as a fraction of the photograph's height. Leaves
#: headroom above the hair for the arch-topped frame to curve into.
TOP = 0.04

SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".bmp", ".tif", ".tiff"}


def main() -> int:
    SRC_DIR.mkdir(parents=True, exist_ok=True)
    sources = sorted(p for p in SRC_DIR.iterdir() if p.suffix.lower() in SUFFIXES)
    if not sources:
        print(f"No photograph in {SRC_DIR.relative_to(ROOT)}. Put the original there first.")
        return 1

    source = sources[0]
    with Image.open(source) as handle:
        photo = ImageOps.exif_transpose(handle).convert("RGB")

    w, h = photo.size
    crop_h = min(round(w / RATIO), h)
    crop_w = round(crop_h * RATIO)
    left = (w - crop_w) // 2
    top = min(round(h * TOP), h - crop_h)
    portrait = photo.crop((left, top, left + crop_w, top + crop_h))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    portrait.save(
        OUT,
        "JPEG",
        quality=88,
        optimize=True,
        progressive=True,
        # 4:4:4: the certificate's lettering smears under chroma subsampling.
        subsampling=0,
    )
    kb = OUT.stat().st_size / 1024
    print(f"  {source.name}  ->  {OUT.relative_to(ROOT)}  {portrait.width}x{portrait.height}  ({kb:.0f} KB)")
    print("EXIF dropped.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
