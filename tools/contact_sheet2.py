"""Review round-two candidates: raw photo beside its auto cut-out."""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(__file__))
from cutout import ING, largest_subject  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates")
PANEL = (237, 238, 232, 255)
CELL = 330

NAMES = [
    "green_apple_a",
    "green_apple_b",
    "green_apple_c",
    "basil_a",
    "basil_b",
    "parsley_a",
    "strawberry_b",
]


def build():
    sheet = Image.new("RGBA", (2 * CELL, len(NAMES) * CELL), PANEL)
    draw = ImageDraw.Draw(sheet)

    for row, name in enumerate(NAMES):
        y = row * CELL
        raw = Image.open(os.path.join(ING, name + ".jpg")).convert("RGBA")
        try:
            cut = largest_subject(name)
        except Exception as exc:  # noqa: BLE001
            cut = Image.new("RGBA", (10, 10))
            draw.text((CELL + 10, y + 20), f"ERR {exc}"[:60], fill=(170, 30, 30))

        for col, img in enumerate((raw, cut)):
            thumb = img.copy()
            thumb.thumbnail((CELL - 30, CELL - 46), Image.LANCZOS)
            sheet.alpha_composite(
                thumb,
                (col * CELL + (CELL - thumb.width) // 2,
                 y + 30 + (CELL - 46 - thumb.height) // 2),
            )
            draw.rectangle(
                [col * CELL, y, col * CELL + CELL - 1, y + CELL - 1],
                outline=(160, 160, 150),
            )

        draw.text((8, y + 8), f"{name}  raw | cutout {cut.width}x{cut.height}",
                  fill=(30, 30, 28))

    path = os.path.join(OUT, "cutout_sheet2.png")
    sheet.convert("RGB").save(path, quality=92)
    print("wrote", path, sheet.size)


if __name__ == "__main__":
    build()
