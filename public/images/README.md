# Zohra-Zaika product images

The catalogue uses these real product photographs inside `public/images/products/`:

| Catalogue product | File |
| --- | --- |
| Shahi Nimbu Achar | `shahi-nimbu-achar.jpg` |
| Shahi Amla Achar | `shahi-amla-achar.png` |
| Shahi Aam Achar | `shahi-aam-achar.png` |
| Shahi Murga Achar | `shahi-murga-achar.png` |
| Shahi Ananas Meetha | `shahi-ananas-meetha.png` + carousel `-1.jpg`, `-2.jpg`, `-3.jpg` |
| Shahi Amla Oil | `shahi-amla-oil.png` |
| Zohra-Zaika Masalas Master | `masalas-master.jpg` |
| Zohra-Zaika Chilli Powder | No photograph supplied yet — the UI shows a branded fallback |

Images are mapped in `lib/catalog.ts`. To replace a photo, keep the filename or
update the matching `images` entry. Use `next/image`-friendly source files
(JPG/PNG/WebP) and keep important content away from the very top and bottom
edges, because cards crop to a 4:5 frame.

Do not add invented photographs. If a real photo is not available, leave the
image array empty so the branded fallback appears.
