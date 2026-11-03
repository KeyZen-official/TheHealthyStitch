"""Render every cut-out onto a flat panel colour so alpha quality is reviewable."""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(__file__))
from cutout import ING, cutout, largest_subject  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates")
PANEL = (237, 238, 232, 255)
CELL = 360
COLS = 5


def build():
    w0, h0 = Image.open(os.path.join(ING, "broccoli_strawberry.jpg")).size
    split = int(w0 * 0.60)

    items = [
        ("pd broccoli", largest_subject("broccoli_strawberry", crop=(0, 0, split, h0))),
        ("pd strawberry", largest_subject("broccoli_strawberry", crop=(split, 0, w0, h0))),
        ("broccoli", largest_subject("broccoli")),
        ("tomato", largest_subject("tomato")),
        ("capsicum", largest_subject("capsicum")),
        ("apple", largest_subject("apple")),
        ("avocado whole", largest_subject("avocado")),
        ("avocado all", cutout("avocado", keep_largest=False)),
        ("onion", largest_subject("onion")),
        ("blueberry", largest_subject("blueberry")),
        ("carrot", largest_subject("carrot")),
    ]

    rows = (len(items) + COLS - 1) // COLS
    sheet = Image.new("RGBA", (COLS * CELL, rows * CELL), PANEL)
    draw = ImageDraw.Draw(sheet)

    for i, (label, img) in enumerate(items):
        cx, cy = (i % COLS) * CELL, (i // COLS) * CELL
        thumb = img.copy()
        thumb.thumbnail((CELL - 40, CELL - 60), Image.LANCZOS)
        sheet.alpha_composite(
            thumb,
            (cx + (CELL - thumb.width) // 2, cy + 24 + (CELL - 60 - thumb.height) // 2),
        )
        draw.text((cx + 10, cy + 6), f"{label} {img.width}x{img.height}", fill=(30, 30, 28))
        draw.rectangle([cx, cy, cx + CELL - 1, cy + CELL - 1], outline=(160, 160, 150))

    path = os.path.join(OUT, "cutout_sheet.png")
    sheet.convert("RGB").save(path, quality=92)
    print("wrote", path, sheet.size)


if __name__ == "__main__":
    build()
