"""Turn studio-on-white produce photos into feathered RGBA cut-outs."""
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ING = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates", "ingredients")


def _background_mask(rgb, white_lo=185, white_hi=235, neutral_lo=12.0, neutral_hi=32.0):
    """
    Soft 0..1 'this pixel is backdrop' map.

    Backdrop means bright *and* colourless, which catches both the white sweep
    and the grey contact shadow under the subject, while sparing pale-but-warm
    subject pixels such as apple flesh or a broccoli stalk.
    """
    darkest = rgb.min(axis=2).astype(np.float32)
    ramp = np.clip((darkest - white_lo) / float(white_hi - white_lo), 0.0, 1.0)
    spread = rgb.max(axis=2).astype(np.float32) - darkest
    neutral = np.clip(1.0 - (spread - neutral_lo) / (neutral_hi - neutral_lo), 0.0, 1.0)
    return ramp * neutral


def cutout(name, crop=None, feather=1.6, keep_largest=True, min_frac=0.004, **bg):
    """Load <name>.jpg, drop the white backdrop, trim to the subject."""
    img = Image.open(os.path.join(ING, name + ".jpg")).convert("RGB")
    if crop:
        img = img.crop(crop)
    rgb = np.asarray(img)

    bg_soft = _background_mask(rgb, **bg)
    # Low threshold so soft contact shadows join the backdrop component and get
    # removed, while interior specular highlights stay protected below.
    solid_bg = bg_soft > 0.30

    # Only backdrop touching the frame edge is removed, so dark pockets
    # inside a floret or a seed cavity stay intact.
    labels, count = ndimage.label(solid_bg)
    if count:
        edge = np.concatenate(
            [labels[0, :], labels[-1, :], labels[:, 0], labels[:, -1]]
        )
        outside = set(int(v) for v in np.unique(edge) if v)
        if outside:
            connected = np.isin(labels, list(outside))
            bg_soft = np.where(connected, bg_soft, 0.0)

    alpha = np.clip((1.0 - bg_soft) * 255.0, 0, 255).astype(np.uint8)
    out = Image.fromarray(rgb).convert("RGBA")
    a = Image.fromarray(alpha, "L")

    if keep_largest:
        fg_labels, fg_count = ndimage.label(alpha > 110)
        if fg_count > 1:
            sizes = ndimage.sum(np.ones_like(fg_labels), fg_labels, range(1, fg_count + 1))
            total = float(alpha.size)
            biggest = int(np.argmax(sizes)) + 1
            drop = [
                i + 1
                for i, s in enumerate(sizes)
                if i + 1 != biggest and s / total < min_frac
            ]
            if drop:
                arr = np.asarray(a).copy()
                arr[np.isin(fg_labels, drop)] = 0
                a = Image.fromarray(arr, "L")

    if feather:
        a = a.filter(ImageFilter.GaussianBlur(feather))
    out.putalpha(a)

    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    return out


def largest_subject(name, crop=None, **kw):
    """Cut out, then keep only the biggest connected subject (drops cross-sections)."""
    img = cutout(name, crop=crop, **kw)
    a = np.asarray(img.getchannel("A"))
    labels, count = ndimage.label(a > 110)
    if count <= 1:
        return img
    sizes = ndimage.sum(np.ones_like(labels), labels, range(1, count + 1))
    biggest = int(np.argmax(sizes)) + 1
    arr = np.asarray(img).copy()
    arr[..., 3] = np.where(labels == biggest, arr[..., 3], 0)
    out = Image.fromarray(arr, "RGBA")
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out
