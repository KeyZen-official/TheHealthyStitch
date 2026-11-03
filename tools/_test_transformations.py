"""Exercise prepare_transformations.py on stand-ins shaped like the real set.

Checks the things that would silently ruin a before/after photograph: a crop
that takes the subject's head or feet, a wrong output ratio, surviving EXIF
(which carries GPS), and a file too heavy to ship.

Runs entirely in a temporary directory. It used to work in place — writing its
stand-ins into assets_src/transformations/ and deleting that folder afterwards
— which was harmless while the folder was empty and would now destroy the real
client photographs and the published cards. It must never touch either.
"""
import pathlib
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The pixel sizes of the seven supplied photographs, in slot order.
SIZES = [(1024, 1010), (870, 1024), (1024, 1024), (1024, 1024),
         (951, 1024), (1024, 1024), (512, 1024)]

HEAD = (255, 255, 0)
FEET = (0, 255, 255)


def write_originals(target: pathlib.Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    for i, (w, h) in enumerate(SIZES, start=1):
        im = Image.new("RGB", (w, h), (180, 90, 140))
        g = ImageDraw.Draw(im)
        g.rectangle([(0, 0), (w // 2, h)], fill=(150, 60, 110))
        # Markers pinned to the extreme top and bottom. A pipeline that crops
        # to fill a landscape card loses them; one that pads keeps them.
        g.ellipse([(w * 0.20, 2), (w * 0.34, h * 0.07)], fill=HEAD)
        g.ellipse([(w * 0.20, h * 0.93), (w * 0.34, h - 3)], fill=FEET)
        # EXIF, to prove re-encoding drops it. Scalar tags rather than a GPS
        # IFD, which Pillow will not write from a plain dict — the point is
        # only that whatever came in does not come out.
        exif = Image.Exif()
        exif[0x0112] = 1                       # Orientation
        exif[0x010F] = "TestPhone"             # Make
        exif[0x0110] = "TestModel"             # Model
        exif[0x0132] = "2026:01:01 12:00:00"   # DateTime
        im.save(target / f"{i:02d}_test.jpg", quality=95, exif=exif)


def has(im: Image.Image, colour, tol=60) -> bool:
    # getcolors over the whole palette rather than getdata(), which Pillow 14
    # drops, and it is a great deal faster than iterating a million pixels.
    for _count, px in im.getcolors(maxcolors=1 << 24) or []:
        if all(abs(a - b) <= tol for a, b in zip(px, colour)):
            return True
    return False


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="transformations-test-") as tmp:
        return check(pathlib.Path(tmp) / "src", pathlib.Path(tmp) / "out")


def check(src: pathlib.Path, out: pathlib.Path) -> int:
    fails = []

    write_originals(src)
    run = subprocess.run([sys.executable, str(ROOT / "tools" / "prepare_transformations.py"),
                          "--src", str(src), "--out", str(out)],
                         capture_output=True, text=True, cwd=ROOT)
    print(run.stdout.strip())
    if run.returncode != 0:
        fails.append(f"script exited {run.returncode}: {run.stderr.strip()}")

    expected = ["transformation-01", "transformation-02", "transformation-03",
                "transformation-04", "transformation-05", "transformation-06",
                "credential"]

    for slot in expected:
        path = out / f"{slot}.jpg"
        if not path.exists():
            fails.append(f"{slot}.jpg was not written")
            continue
        with Image.open(path) as im:
            ratio = im.width / im.height
            kb = path.stat().st_size / 1024
            if abs(ratio - 1.45) > 0.01:
                fails.append(f"{slot}: ratio {ratio:.3f}, expected 1.45")
            if im.getexif():
                fails.append(f"{slot}: EXIF survived re-encoding")
            if kb > 500:
                fails.append(f"{slot}: {kb:.0f} KB is too heavy")
            rgb = im.convert("RGB")
            if not has(rgb, HEAD):
                fails.append(f"{slot}: the head marker was cropped away")
            if not has(rgb, FEET):
                fails.append(f"{slot}: the feet marker was cropped away")
            print(f"  {slot:18s} {im.width}x{im.height} ratio={ratio:.3f} "
                  f"{kb:5.0f} KB  exif={bool(im.getexif())}  head+feet kept")

    print("\n" + ("FAILED:" if fails else "pipeline keeps every subject whole, "
                                          "hits 1.45, and strips EXIF"))
    for f in fails:
        print(" -", f)
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
