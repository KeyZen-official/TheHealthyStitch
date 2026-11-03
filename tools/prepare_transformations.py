"""Turn supplied client photographs into the cards the results wheel loads.

Why this exists rather than dropping the originals into public/:

  * Phone photographs arrive at 3-12 MB each. Seven of them on one page is a
    30 MB section. These come out around 200-350 KB with no visible loss.
  * The wheel's cards are landscape (RATIO, below) and fill by `object-cover`,
    so a square or portrait photograph would be cropped — and on a before/after
    body shot the crop takes the heads or the feet. Every photograph is padded
    to the card's ratio instead, on a blurred copy of itself so the fill looks
    intended rather than letterboxed.
  * Phone photographs carry EXIF. That routinely includes GPS coordinates —
    frequently the client's own home. Pillow writes no EXIF unless asked to,
    so re-encoding strips the lot. For a health business publishing a named
    client's photograph that is not a nicety.
  * EXIF also holds the orientation flag. Dropped straight into an <img> a
    portrait phone photo often lies on its side; exif_transpose bakes the
    rotation into the pixels before the flag is discarded.

Usage
-----
    # put the originals in assets_src/transformations/ first, any names
    python tools/prepare_transformations.py

    # see the slot mapping without writing anything
    python tools/prepare_transformations.py --dry-run

    # write clearly-marked stand-ins so the page renders before the photos land
    python tools/prepare_transformations.py --placeholders

Files are matched to slots by sorted filename, so name the originals 01..07 (or
anything that sorts the way you want them to appear) and the order follows.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets_src" / "transformations"
OUT_DIR = ROOT / "public" / "assets" / "transformations"

# Must match TRANSFORMATION_RATIO and TRANSFORMATIONS in src/assets.js.
RATIO = 1.45
# Must match TRANSFORMATION_GALLERY_RATIO in src/assets.js. Phones show each
# card through a frame this shape, trimming the padding at its sides, so a
# photograph wider than this would lose its own edges there.
GALLERY_RATIO = 1.02
#: Card renders at roughly 475 CSS px wide, so 1200 covers 2x with headroom.
EDGE = 1200
QUALITY = 88

#: Slot order. The names are the paths src/assets.js asks for.
SLOTS = [
    "transformation-01",
    "transformation-02",
    "transformation-03",
    "transformation-04",
    "transformation-05",
    "transformation-06",
    "credential",
]

SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".bmp", ".tif", ".tiff"}

#: The band the cards sit on, from .theme-dark-olive in src/styles/tailwind.css.
BAND = (27, 29, 23)


def target_size() -> tuple[int, int]:
    if RATIO >= 1:
        return EDGE, round(EDGE / RATIO)
    return round(EDGE * RATIO), EDGE


def backdrop(photo: Image.Image, size: tuple[int, int]) -> Image.Image:
    """A blurred, darkened copy of the photograph, cropped to fill the card.

    Used for the bars a non-square photograph leaves behind. A flat colour
    reads as a mistake at these proportions; a blurred continuation of the
    picture reads as depth of field, and it keeps the card's own colour.
    """
    fill = ImageOps.fit(photo, size, method=Image.LANCZOS, centering=(0.5, 0.5))
    fill = fill.filter(ImageFilter.GaussianBlur(radius=max(size) * 0.035))
    # Knock it back so it never competes with the photograph in front of it.
    return Image.blend(fill, Image.new("RGB", size, BAND), 0.45)


def show(path: Path) -> str:
    """The path relative to the project when it is inside it, else in full."""
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path)


def prepare(source: Path, slot: str, out_dir: Path = OUT_DIR) -> Path:
    with Image.open(source) as handle:
        # Apply the EXIF rotation to the pixels, then forget the EXIF existed.
        photo = ImageOps.exif_transpose(handle).convert("RGB")

    shape = photo.width / photo.height
    if shape > GALLERY_RATIO:
        print(f"  WARNING  {source.name} is {shape:.2f} wide to 1 tall, wider than the phone")
        print(f"           gallery's frame ({GALLERY_RATIO}), so phones would trim its sides. Raise")
        print(f"           GALLERY_RATIO here and TRANSFORMATION_GALLERY_RATIO in src/assets.js")
        print(f"           to at least {shape:.2f}.")

    size = target_size()
    canvas = backdrop(photo, size)

    # Fit inside the card: the whole subject survives, the bars get the blur.
    inner = photo.copy()
    inner.thumbnail(size, Image.LANCZOS)
    canvas.paste(inner, ((size[0] - inner.width) // 2, (size[1] - inner.height) // 2))

    out = out_dir / f"{slot}.jpg"
    out_dir.mkdir(parents=True, exist_ok=True)
    canvas.save(
        out,
        "JPEG",
        quality=QUALITY,
        optimize=True,
        progressive=True,
        # 4:4:4. Two of these photographs carry coloured lettering — a scripted
        # "Before / After" and a printed certificate — and chroma subsampling
        # smears exactly that.
        subsampling=0,
    )
    return out


#: One tone per slot. Not decoration: identical stand-ins merge into a single
#: dark mass on the ring, which hides whether the geometry is right.
PLACEHOLDER_TONES = [
    (104, 58, 86),
    (54, 84, 88),
    (46, 68, 112),
    (116, 62, 52),
    (108, 84, 46),
    (70, 96, 58),
    (88, 72, 104),
]


def placeholder(slot: str, index: int, out_dir: Path = OUT_DIR) -> Path:
    """A stand-in that cannot be mistaken for a client photograph."""
    size = target_size()
    tone = PLACEHOLDER_TONES[(index - 1) % len(PLACEHOLDER_TONES)]
    canvas = Image.new("RGB", size, tone)
    draw = ImageDraw.Draw(canvas)

    shade = tuple(max(0, c - 16) for c in tone)
    for offset in range(-size[1], size[0], 54):
        draw.line([(offset, size[1]), (offset + size[1], 0)], fill=shade, width=14)
    draw.rectangle([(0, 0), (size[0] - 1, size[1] - 1)], outline=(228, 232, 214), width=4)

    mid = (size[0] // 2, size[1] // 2)
    draw.text(mid, f"PHOTO {index:02d}\nPENDING", fill=(240, 242, 232), anchor="mm", align="center")

    out = out_dir / f"{slot}.jpg"
    out_dir.mkdir(parents=True, exist_ok=True)
    canvas.save(out, "JPEG", quality=70, optimize=True, progressive=True)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="print the mapping only")
    parser.add_argument("--placeholders", action="store_true", help="write stand-ins")
    # For tools/_test_transformations.py, which runs in a temp directory so it
    # can never mix stand-ins into, or delete, the real photographs.
    parser.add_argument("--src", type=Path, default=SRC_DIR, help=argparse.SUPPRESS)
    parser.add_argument("--out", type=Path, default=OUT_DIR, help=argparse.SUPPRESS)
    args = parser.parse_args()
    src_dir, out_dir = args.src, args.out

    if args.placeholders:
        for index, slot in enumerate(SLOTS, start=1):
            out = placeholder(slot, index, out_dir)
            print(f"  placeholder  {show(out)}")
        print(f"\n{len(SLOTS)} stand-ins written. Replace them by putting the real")
        print(f"photographs in {show(src_dir)} and running this without --placeholders.")
        return 0

    src_dir.mkdir(parents=True, exist_ok=True)
    sources = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in SUFFIXES)

    if not sources:
        print(f"No photographs found in {show(src_dir)}.")
        print("Save the client photographs there, then run this again.")
        print("Expected order (sorted by filename):")
        for index, slot in enumerate(SLOTS, start=1):
            print(f"  {index}. -> {slot}.jpg")
        return 1

    if len(sources) != len(SLOTS):
        print(f"Warning: {len(sources)} photograph(s) for {len(SLOTS)} slots.")
        print("src/assets.js lists seven; trim TRANSFORMATIONS or add the missing files.\n")

    written = 0
    for source, slot in zip(sources, SLOTS):
        if args.dry_run:
            print(f"  {source.name}  ->  {slot}.jpg")
            continue
        out = prepare(source, slot, out_dir)
        kb = out.stat().st_size / 1024
        print(f"  {source.name}  ->  {show(out)}  ({kb:.0f} KB)")
        written += 1

    if args.dry_run:
        print("\nDry run. Nothing written.")
    else:
        print(f"\n{written} card(s) written to {show(out_dir)}.")
        print("EXIF, including any GPS location, has been dropped.")

    leftover = sources[len(SLOTS):]
    if leftover:
        print(f"\nIgnored (no slot): {', '.join(p.name for p in leftover)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
