# Image credits

Every photograph here was assembled from freely licensed material on Wikimedia
Commons. **Read the licence warning at the bottom before using this site
commercially.**

## Hero slideshow

Three frames, served by `LIFESTYLE_SLIDES` in `src/assets.js`. All three are
by the same photographer under the same licence, downscaled to 2200px wide.

| File | Source | Author | Licence | Original |
|---|---|---|---|---|
| `lifestyle-kitchen.jpg` | [Woman prepares healthy food in a modern kitchen…](https://commons.wikimedia.org/wiki/File:Woman_prepares_healthy_food_in_a_modern_kitchen_while_smiling_and_mixing_ingredients_in_a_bowl.jpg) | Shixart1985 | CC BY 2.0 | 5947 × 3965 |
| `lifestyle-harvest.jpg` | [Woman holding a wooden crate of freshly harvested vegetables](https://commons.wikimedia.org/wiki/File:Woman_holding_a_wooden_crate_of_freshly_harvested_vegetables.jpg) | Shixart1985 | CC BY 2.0 | 6048 × 4024 |
| `lifestyle-nourish.jpg` | [Woman holds almonds in her hand while seated comfortably at home…](https://commons.wikimedia.org/wiki/File:Woman_holds_almonds_in_her_hand_while_seated_comfortably_at_home_enjoying_a_healthy_snack_in_cozy_surroundings.jpg) | Shixart1985 | CC BY 2.0 | 6016 × 4016 |

CC BY 2.0 requires attribution. Keep a visible credit such as
"Photographs: Shixart1985 / Wikimedia Commons, CC BY 2.0".

## `wellness-lifestyle.jpg`

The 3840px original of the kitchen frame above, same file and same credit. It
is **no longer referenced by the site** — `lifestyle-kitchen.jpg` is the
version the slideshow loads. Everything under `public/` is copied into the
build as-is, so this 1.1 MB file ships for nothing and can be deleted.

## `nutrition-capsule.png`

The capsule shell is generated from surface normals by
`tools/build_capsule.py` (no third-party rights). The produce is cut out from
these photographs, and the same cut-outs are reused in `public/assets/produce/`
by the plate diagram in the proof section:

| Element | Source | Author | Licence |
|---|---|---|---|
| Broccoli | [Fruit and vegetable.jpg](https://commons.wikimedia.org/wiki/File:Fruit_and_vegetable.jpg) | Renee Comet | Public domain |
| Broccoli floret | [Broccoli and cross section edit.jpg](https://commons.wikimedia.org/wiki/File:Broccoli_and_cross_section_edit.jpg) | Fir0002 | **GFDL 1.2** |
| Strawberry | [Strawberry on white background.jpg](https://commons.wikimedia.org/wiki/File:Strawberry_on_white_background.jpg) | Joselodos | CC0 |
| Tomato | [Bright red tomato and cross section02.jpg](https://commons.wikimedia.org/wiki/File:Bright_red_tomato_and_cross_section02.jpg) | Fir0002 | **GFDL 1.2** |
| Red bell pepper | [Red capsicum and cross section.jpg](https://commons.wikimedia.org/wiki/File:Red_capsicum_and_cross_section.jpg) | Fir0002 | **GFDL 1.2** |
| Apple | [Pink lady and cross section.jpg](https://commons.wikimedia.org/wiki/File:Pink_lady_and_cross_section.jpg) | Fir0002 | **GFDL 1.2** |
| Avocado | [Avocado with cross section edit.jpg](https://commons.wikimedia.org/wiki/File:Avocado_with_cross_section_edit.jpg) | Muhammad Mahdi Karim | **GFDL 1.2** |
| Red onion | [Red Onion on White.JPG](https://commons.wikimedia.org/wiki/File:Red_Onion_on_White.JPG) | Colin | **CC BY-SA 3.0** |

## Licence warning

The capsule composite and the `produce/` cut-outs mix GFDL 1.2 and CC BY-SA 3.0
source material. Both are copyleft: a derivative work has to be released under
the same terms. That makes this artwork unsuitable for a closed commercial
brand site, and it now appears in two places — the hero capsule and the plate
diagram.

Before launching, replace the capsule and the produce cut-outs with artwork you
own, commission or licence (the prompt used to specify the capsule is in the
project README). Nothing in the code needs to change: update the paths in
`src/assets.js`.

The three slideshow photographs are CC BY 2.0 and only need visible
attribution, so they can stay as they are.

Content of the Commons licence pages was summarised rather than reproduced.

## `transformations/` — client photographs

Six images served by `TRANSFORMATIONS` in `src/assets.js` and shown in the
results section. These are **not** stock or freely licensed material: they are
photographs of real, identifiable people, supplied by the clients themselves.

| File | Source | Licence |
|---|---|---|
| `transformation-01.jpg` … `transformation-06.jpg` | Supplied by the client | Permission of the subject |

Nothing here is a licence question; it is a consent question, and the answer
has to be on file **per person** before the file ships:

- Written permission to publish that photograph on a public website, from the
  person in it. Verbal agreement in a chat thread is not a record.
- Permission for any figure published next to it. A weight or a timeframe
  attached to a named person is a health claim about that person.
- A route to withdraw. If a client asks for her photograph to come down, the
  removal is deleting the file and its entry in `src/assets.js` — keep it that
  cheap on purpose.

`about/mitali.jpg`, the About portrait, shows Mitali herself with her Diploma
in Nutrition. Her own photograph on her own site needs no one else's
permission. It is no longer one of the results cards.

Anyone else caught in frame counts too. `transformation-03.jpg` shows two
other people: a man in a black shirt standing beside the client in the
"before" half (his face is cut off by the top of the frame), and a young man
at the left edge of the "after" half, with part of his face in view. Neither
has agreed to anything. Crop them out or get their permission as well.

Generated by `tools/prepare_transformations.py`, which strips EXIF — phone
photographs otherwise carry the GPS coordinates of the place they were taken,
frequently the client's home. The originals stay in `assets_src/`, which is
git-ignored.
