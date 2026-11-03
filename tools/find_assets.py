"""Search Wikimedia Commons for studio-isolated produce photos."""
import json
import urllib.parse
import urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "NutriSite/1.0 (local design asset build)"}

QUERIES = [
    "tomato white background",
    "red bell pepper white background",
    "green apple white background",
    "avocado white background",
    "red onion white background",
    "spinach leaves white background",
    "parsley herbs white background",
    "blueberries white background",
    "carrot white background",
    "vegetables isolated white studio",
]


def search(query, limit=10):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    pages = (data.get("query") or {}).get("pages") or {}
    out = []
    for page in pages.values():
        info = (page.get("imageinfo") or [{}])[0]
        if info.get("mime") != "image/jpeg":
            continue
        w, h = info.get("width", 0), info.get("height", 0)
        if w < 900 or h < 600:
            continue
        out.append((page["title"], w, h))
    return out


if __name__ == "__main__":
    for q in QUERIES:
        print(f"\n=== {q} ===", flush=True)
        try:
            for title, w, h in search(q):
                print(f"  {w}x{h}  {title}", flush=True)
        except Exception as exc:  # noqa: BLE001
            print(f"  ERR {exc}", flush=True)
