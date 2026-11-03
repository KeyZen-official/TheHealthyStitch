"""
Compose the left-panel hero asset:
a shaded white nutrition capsule pulled open, with real photographic produce
spilling out of the mouth.

Output: public/assets/nutrition-capsule.png  (transparent, 1800x1800)
        tmp_candidates/capsule_preview.png   (flattened on the panel colour)
"""
import math
import os
import sys

from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(__file__))
from capsule import drop_shadow, render_half  # noqa: E402
from cutout import ING, cutout, largest_subject  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..")
SIZE = 1800
ANGLE = 32.0  # degrees, bottom-left -> upper-right
PANEL = (237, 238, 232, 255)

# Axis direction in screen space (y grows downward).
DX = math.cos(math.radians(-ANGLE))
DY = math.sin(math.radians(-ANGLE))

BODY_LEN, BODY_R = 650, 178
CAP_LEN, CAP_R = 460, 188
GAP = 300

# Unit vector perpendicular to the capsule axis, pointing up-and-left.
# d = (DX, DY) = (0.848, -0.530), so (DY, -DX) = (-0.530, -0.848).
PX, PY = DY, -DX


def paste_center(canvas, img, center):
    canvas.alpha_composite(
        img, (int(center[0] - img.width / 2), int(center[1] - img.height / 2))
    )


def place(canvas, img, center, blur=0.0, shadow=None):
    """Drop-shadow then composite an RGBA element at a centre point."""
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    if shadow:
        plate, pad = drop_shadow(img, **shadow)
        paste_center(canvas, plate, center)
    paste_center(canvas, img, center)


def ingredients():
    """Real produce cut-outs, keyed by role."""
    w0, h0 = Image.open(os.path.join(ING, "broccoli_strawberry.jpg")).size
    split = int(w0 * 0.60)
    return {
        "broccoli": largest_subject("broccoli_strawberry", crop=(0, 0, split, h0)),
        "broccoli2": largest_subject("broccoli"),
        "strawberry": largest_subject("strawberry_b"),
        "tomato": largest_subject("tomato"),
        "capsicum": largest_subject("capsicum"),
        "apple": largest_subject("apple"),
        # This frame has a warmer sweep, so the backdrop ramp starts lower.
        "onion": largest_subject("onion", white_lo=158, white_hi=226),
        "avocado": avocado_half(),
    }


def avocado_half():
    """The 'avocado with cross section' frame holds two subjects; take the cut half."""
    img = cutout("avocado", keep_largest=False)
    # The halved fruit sits on the right of the frame.
    return img.crop((int(img.width * 0.52), 0, img.width, img.height))


def trim_to_square(img, margin=0.035):
    """Crop away empty transparency, then re-centre on a square canvas.

    Without this the artwork carries a wide dead border and ends up looking
    small inside the hero panel.
    """
    box = img.getbbox()
    if not box:
        return img
    img = img.crop(box)
    side = int(max(img.width, img.height) * (1.0 + 2 * margin))
    out = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    out.alpha_composite(img, ((side - img.width) // 2, (side - img.height) // 2))
    return out


def scaled(img, target_h, rot=0.0):
    k = target_h / img.height
    out = img.resize((max(1, int(img.width * k)), int(target_h)), Image.LANCZOS)
    if rot:
        out = out.rotate(rot, Image.BICUBIC, expand=True)
    return out


def build():
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    # Mouth of the opened capsule.
    cx, cy = SIZE * 0.490, SIZE * 0.520

    body_d = GAP / 2 + BODY_LEN / 2
    cap_d = GAP / 2 + CAP_LEN / 2
    body_c = (cx - DX * body_d, cy - DY * body_d)
    cap_c = (cx + DX * cap_d, cy + DY * cap_d)

    body = render_half(BODY_LEN, BODY_R, base=(246, 245, 240), open_end="right")
    cap = render_half(CAP_LEN, CAP_R, base=(251, 250, 247), open_end="left")
    body = body.rotate(ANGLE, Image.BICUBIC, expand=True)
    cap = cap.rotate(ANGLE, Image.BICUBIC, expand=True)

    # Capsule shadows read as a soft studio contact shadow.
    for half, centre in ((body, body_c), (cap, cap_c)):
        plate, _ = drop_shadow(half, blur=34, offset=(16, 30), strength=0.26)
        paste_center(canvas, plate, centre)

    ing = ingredients()

    def fan(t, s):
        """Point offset from the mouth: t across the axis (+ = up-left),
        s along the axis (+ = toward the cap)."""
        return (cx + PX * t + DX * s, cy + PY * t + DY * s)

    # --- produce set back behind the capsule, softened for depth ---
    behind = [
        # key, height, t, s, rot, blur
        ("onion", 230, 340, 330, -10, 1.8),
        ("tomato", 180, 560, -120, -6, 2.2),
    ]
    for key, h, t, s, rot, blur in behind:
        el = scaled(ing[key], h, rot)
        place(canvas, el, fan(t, s), blur=blur,
              shadow=dict(blur=20, offset=(8, 14), strength=0.18))

    # --- the capsule itself ---
    paste_center(canvas, body, body_c)
    paste_center(canvas, cap, cap_c)

    # --- produce in front, fanning out of the open mouth ---
    front = [
        ("broccoli", 420, 430, -10, -12, 0.0),
        ("avocado", 215, 330, -330, 14, 0.0),
        ("strawberry", 195, 175, -160, -26, 0.0),
        ("tomato", 205, 95, 55, 8, 0.0),
        ("capsicum", 255, -215, -55, 16, 0.0),
        ("broccoli2", 200, -105, 190, 22, 0.0),
        ("apple", 190, -370, 130, -14, 0.5),
    ]
    for key, h, t, s, rot, blur in front:
        el = scaled(ing[key], h, rot)
        place(canvas, el, fan(t, s), blur=blur,
              shadow=dict(blur=22, offset=(10, 18), strength=0.26))

    canvas = trim_to_square(canvas, margin=0.035)

    out_dir = os.path.join(ROOT, "public", "assets")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "nutrition-capsule.png")
    canvas.save(out_path)

    preview = Image.new("RGBA", canvas.size, PANEL)
    preview.alpha_composite(canvas)
    prev_path = os.path.join(ROOT, "tmp_candidates", "capsule_preview.png")
    preview.convert("RGB").save(prev_path, quality=92)

    print("wrote", out_path)
    print("wrote", prev_path)


if __name__ == "__main__":
    build()
