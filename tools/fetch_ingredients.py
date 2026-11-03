"""Download the studio-isolated produce photos used to build the capsule render."""
import json
import os
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "NutriSite/1.0 (local design asset build)"}
OUT = os.path.join(os.path.dirname(__file__), "..", "tmp_candidates", "ingredients")

# name -> (Commons file title, requested thumbnail width)
WANTED = {
    "broccoli_strawberry": ("File:Fruit and vegetable.jpg", 1900),
    "broccoli": ("File:Broccoli and cross section edit.jpg", 1600),
    "tomato": ("File:Bright red tomato and cross section02.jpg", 1600),
    "capsicum": ("File:Red capsicum and cross section.jpg", 1600),
    "apple": ("File:Pink lady and cross section.jpg", 1600),
    "avocado": ("File:Avocado with cross section edit.jpg", 1600),
    "onion": ("File:Red Onion on White.JPG", 1500),
    "blueberry": ("File:Single Blueberry.jpg", 900),
    "carrot": ("File:Carrot vegetable on white background.jpg", 1280),
}


def image_url(title, width):
    params = {
        "action": "query",
        "format": "json",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiurlwidth": str(width),
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    page = list(data["query"]["pages"].values())[0]
    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})
    return (
        info.get("thumburl") or info["url"],
        meta.get("LicenseShortName", {}).get("value", "?"),
        meta.get("Artist", {}).get("value", "?"),
    )


def main():
    os.makedirs(OUT, exist_ok=True)
    credits = []
    for name, (title, width) in WANTED.items():
        dest = os.path.join(OUT, name + ".jpg")
        try:
            url, lic, artist = image_url(title, width)
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=180) as resp:
                blob = resp.read()
            with open(dest, "wb") as fh:
                fh.write(blob)
            credits.append({"name": name, "title": title, "license": lic, "artist": artist})
            print(f"OK   {name:22s} {len(blob)//1024:5d} KB  [{lic}]", flush=True)
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {name:22s} {exc}", flush=True)

    with open(os.path.join(OUT, "credits.json"), "w", encoding="utf-8") as fh:
        json.dump(credits, fh, indent=2)


if __name__ == "__main__":
    main()
