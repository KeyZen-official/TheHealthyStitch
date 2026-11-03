"""Fetch licence and author metadata for every Commons file used in the build."""
import html
import json
import re
import time
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "NutriSite/1.0 (attribution collection)"}

USED = {
    "capsule composite - broccoli": "File:Fruit and vegetable.jpg",
    "capsule composite - broccoli floret": "File:Broccoli and cross section edit.jpg",
    "capsule composite - strawberry": "File:Strawberry on white background.jpg",
    "capsule composite - tomato": "File:Bright red tomato and cross section02.jpg",
    "capsule composite - red bell pepper": "File:Red capsicum and cross section.jpg",
    "capsule composite - apple": "File:Pink lady and cross section.jpg",
    "capsule composite - avocado": "File:Avocado with cross section edit.jpg",
    "capsule composite - red onion": "File:Red Onion on White.JPG",
    "lifestyle photograph": (
        "File:Woman prepares healthy food in a modern kitchen while "
        "smiling and mixing ingredients in a bowl.jpg"
    ),
}


def strip_html(value):
    return html.unescape(re.sub(r"<[^>]+>", "", value or "")).strip()


def meta(title):
    params = {
        "action": "query",
        "format": "json",
        "titles": title,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    page = list(data["query"]["pages"].values())[0]
    info = page["imageinfo"][0]
    em = info.get("extmetadata", {})
    return {
        "title": title,
        "page": "https://commons.wikimedia.org/wiki/"
                + urllib.parse.quote(title.replace(" ", "_")),
        "license": em.get("LicenseShortName", {}).get("value", "?"),
        "author": strip_html(em.get("Artist", {}).get("value", "")) or "unknown",
        "size": f"{info.get('width')}x{info.get('height')}",
    }


if __name__ == "__main__":
    rows = []
    for role, title in USED.items():
        for attempt in range(4):
            try:
                row = meta(title)
                row["role"] = role
                rows.append(row)
                print(f"{role:40s} {row['license']:16s} {row['author']}", flush=True)
                break
            except Exception as exc:  # noqa: BLE001
                print(f"..  {role} {exc}", flush=True)
                time.sleep(10 * (attempt + 1))
        time.sleep(6)

    with open("tmp_candidates/credits_final.json", "w", encoding="utf-8") as fh:
        json.dump(rows, fh, indent=2)
    print("\nwrote tmp_candidates/credits_final.json")
