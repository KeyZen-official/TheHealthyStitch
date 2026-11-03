"""Shade a gelatin capsule half from surface normals (cylinder + hemisphere)."""
import numpy as np
from PIL import Image, ImageFilter

# Studio key light: high, slightly left, in front.
KEY = np.array([-0.38, -0.74, 0.56])
KEY /= np.linalg.norm(KEY)
VIEW = np.array([0.0, 0.0, 1.0])
HALF = KEY + VIEW
HALF /= np.linalg.norm(HALF)

SHADOW_TINT = np.array([188.0, 196.0, 178.0])  # sage, ties into the panel


def render_half(length, radius, base=(247, 246, 242), ss=3, open_end="right"):
    """
    Render one capsule half, axis horizontal, closed end rounded.

    length  total extent along the axis in output pixels
    radius  capsule radius in output pixels
    """
    L, R = length * ss, radius * ss
    w, h = int(L), int(2 * R)

    xs = np.arange(w, dtype=np.float32) + 0.5
    ys = np.arange(h, dtype=np.float32) + 0.5
    X, Y = np.meshgrid(xs, ys)

    # Axis runs left->right; closed hemisphere occupies x in [0, R].
    v = (Y - R) / R                      # -1..1 across the barrel
    if open_end == "right":
        u = X
    else:
        u = L - X
        v = v

    in_cap = u <= R
    du = (u - R) / R                     # -1..0 inside the hemisphere

    # Surface normals
    nx = np.where(in_cap, du, 0.0)
    ny = v
    t = 1.0 - nx * nx - ny * ny
    inside = t > 0.0
    nz = np.sqrt(np.clip(t, 0.0, None))

    body = (~in_cap) & (np.abs(v) <= 1.0) & (u <= L)
    mask = (in_cap & inside) | body
    # Barrel normals need no nx, but nz must come from v alone.
    nz = np.where(body, np.sqrt(np.clip(1.0 - ny * ny, 0.0, None)), nz)

    n = np.stack([nx, ny, nz], axis=-1)

    diff = np.clip(n @ KEY, 0.0, 1.0)
    spec = np.clip(n @ HALF, 0.0, 1.0) ** 70
    spec2 = np.clip(n @ HALF, 0.0, 1.0) ** 14
    facing = np.clip(nz, 0.0, 1.0)

    base_rgb = np.array(base, dtype=np.float32)
    shade = (0.50 + 0.42 * diff + 0.20 * facing)[..., None]
    rgb = base_rgb * shade

    # Sage-tinted falloff where the key light drops away.
    cool = ((1.0 - diff) ** 2)[..., None]
    rgb = rgb * (1.0 - 0.30 * cool) + SHADOW_TINT * 0.30 * cool

    # Gelatin: tight specular plus a broad sheen, and a bright silhouette rim.
    rgb += 255.0 * (0.95 * spec + 0.12 * spec2)[..., None]
    rim = ((1.0 - facing) ** 3)[..., None]
    rgb += 30.0 * rim

    # Darken the open rim so the half reads as hollow. The open end always sits
    # at u == L because `u` is already flipped for a left-opening half.
    band = 34 * ss
    edge = np.clip((u - (L - band)) / band, 0.0, 1.0)
    edge = np.where(body, edge, 0.0)
    inner = (edge ** 1.6)[..., None]
    rgb = rgb * (1.0 - 0.62 * inner) + np.array([96.0, 101.0, 88.0]) * 0.62 * inner

    # Thin bright catch-light on the very lip of the opening.
    lip = np.where(body, np.clip((u - (L - 7 * ss)) / (7 * ss), 0.0, 1.0), 0.0)
    rgb += 70.0 * (lip ** 2)[..., None]

    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    alpha = (mask * 255).astype(np.uint8)

    img = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    img = img.resize((int(length), int(2 * radius)), Image.LANCZOS)
    return img


def drop_shadow(img, blur=26, offset=(14, 20), strength=0.34, grow=0):
    """Soft shadow plate matching an RGBA subject."""
    a = img.getchannel("A")
    if grow:
        a = a.filter(ImageFilter.MaxFilter(grow * 2 + 1))
    pad = blur * 3
    plate = Image.new("L", (img.width + 2 * pad, img.height + 2 * pad), 0)
    plate.paste(a, (pad + offset[0], pad + offset[1]))
    plate = plate.filter(ImageFilter.GaussianBlur(blur))
    plate = plate.point(lambda p: int(p * strength))
    out = Image.new("RGBA", plate.size, (72, 76, 64, 0))
    out.putalpha(plate)
    return out, pad
