# Image asset manifest

All photography in this demo comes from **Unsplash** and is used under the
[Unsplash License](https://unsplash.com/license) (free for commercial use; attribution
appreciated but not required). Images are **downloaded into `public/images/`** so the site never
depends on hot-linked URLs. Re-download with `npm run assets:download` (source list:
`scripts/assets.json` — this table is generated from it).

## Rules applied

- **No photos of the actual stores are used.** Store cards and pages use illustrative retail
  photography, captioned on-screen *“Illustrative image — not the actual store”*.
- **Google Maps / Google-hosted photos and the reference website's gallery were not downloaded** — reuse
  rights were not confirmed.
- Images showing **third-party eyewear or retail branding were rejected** (e.g. a Ray-Ban temple
  print, “Vision Express” in-store signage, designer-brand wall signage, branded lens stickers).
- Product photos illustrate **sample** products only; they do not depict the stores' real stock.
- Every `<img>` goes through `SmartImage`, which falls back to `public/images/fallback/frame.svg`
  if a file is missing — no broken-image icons.

## Owner actions

1. Supply approved photos of both stores → place in `public/images/stores/` and update `image` +
   set `imageIsIllustrative: false` in `src/config/site.ts`.
2. Supply real product photography with the real catalogue.
3. Supply a final logo → replace `public/images/brand/logo.png` (and `src/app/icon.png`).

## Files

| File | Purpose | Source | Licence | Approval |
| --- | --- | --- | --- | --- |
| `public/images/hero/hero-tortoiseshell.jpg` | Homepage hero | [Unsplash](https://unsplash.com/photos/a-young-woman-wearing-stylish-tortoiseshell-glasses-Ukk-zKS65hU) | Unsplash License | Not yet reviewed by owner |
| `public/images/editorial/campaign-frames.jpg` | Promotional campaign banner | [Unsplash](https://unsplash.com/photos/woman-in-orange-and-black-top-and-eyeglasses-eBPNpVDC1RM) | Unsplash License | Not yet reviewed by owner |
| `public/images/editorial/eye-exam.jpg` | Eye-care section and appointment page Instrument shows its manufacturer’s name (equipment, not a retailer). | [Unsplash](https://unsplash.com/photos/white-eye-testing-machine-aMmDIsdnUro) | Unsplash License | Not yet reviewed by owner |
| `public/images/editorial/eye-chart.jpg` | Appointment page accent | [Unsplash](https://unsplash.com/photos/medical-eye-test-0are122T4ho) | Unsplash License | Not yet reviewed by owner |
| `public/images/editorial/collection-books.jpg` | New arrivals / about editorial | [Unsplash](https://unsplash.com/photos/several-pairs-of-glasses-resting-on-books-4NPBDov7tfs) | Unsplash License | Not yet reviewed by owner |
| `public/images/editorial/community.jpg` | About page editorial | [Unsplash](https://unsplash.com/photos/an-elderly-indian-woman-wearing-a-sari-and-glasses-4eTVOjSNHFY) | Unsplash License | Not yet reviewed by owner |
| `public/images/categories/eyeglasses.jpg` | Category: Eyeglasses | [Unsplash](https://unsplash.com/photos/woman-in-brown-coat-wearing-black-framed-eyeglasses-LVJHabrJ2C4) | Unsplash License | Not yet reviewed by owner |
| `public/images/categories/sunglasses.jpg` | Category: Sunglasses | [Unsplash](https://unsplash.com/photos/woman-wearing-green-framed-sunglasses-GwglcplmXDs) | Unsplash License | Not yet reviewed by owner |
| `public/images/categories/kids.jpg` | Category: Kids' eyewear | [Unsplash](https://unsplash.com/photos/girl-in-red-framed-eyeglasses-and-gray-sweater-sitting-on-brown-wooden-chair-JBcxO430PKM) | Unsplash License | Not yet reviewed by owner |
| `public/images/categories/premium.jpg` | Category: Premium frames | [Unsplash](https://unsplash.com/photos/eyeglasses-and-perfume-bottle-on-wooden-stand-qQTMrv-aIYA) | Unsplash License | Not yet reviewed by owner |
| `public/images/categories/everyday.jpg` | Category: Everyday frames | [Unsplash](https://unsplash.com/photos/man-in-black-framed-eyeglasses-and-black-long-sleeve-shirt-Z-k1GNO1P7Q) | Unsplash License | Not yet reviewed by owner |
| `public/images/categories/blue-light.jpg` | Category: Blue-light glasses | [Unsplash](https://unsplash.com/photos/a-woman-with-glasses-is-looking-at-her-cell-phone-3VwALdNbvFQ) | Unsplash License | Not yet reviewed by owner |
| `public/images/stores/illustrative-frame-wall.jpg` | ILLUSTRATIVE frame wall (not the actual store) — no third-party branding visible | [Unsplash](https://unsplash.com/photos/close-up-photo-of-eyeglasses-rack-5hC2YalkXHw) | Unsplash License | Not yet reviewed by owner |
| `public/images/stores/illustrative-frame-display.jpg` | ILLUSTRATIVE frame display (not the actual store) — no third-party branding visible | [Unsplash](https://unsplash.com/photos/eyeglasses-lot-G8ioIHUDfNc) | Unsplash License | Not yet reviewed by owner |
| `public/images/stores/illustrative-display.jpg` | ILLUSTRATIVE frame display (stores page header) | [Unsplash](https://unsplash.com/photos/arranged-assorted-color-eyeglasses-on-rack-UsALNdok2m4) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/aurora-rectangle-2.jpg` | Sample product (lifestyle) | [Unsplash](https://unsplash.com/photos/man-in-brown-button-up-jacket-wearing-black-framed-eyeglasses-95o5-T5FGCQ) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/lumen-round-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-eyeglasses-on-white-surface-DSW79QZtjGM) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/lumen-round-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-eyeglasses-on-white-surface-JblwtK032ag) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/heritage-oval-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/brown-framed-eyeglasses-on-brown-wooden-table-a8o-mAP8Ui4) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/sienna-cateye-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/tortoiseshell-eyeglasses-on-a-neutral-background-kQRtNeFxAcw) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/sienna-cateye-2.jpg` | Sample product (lifestyle) | [Unsplash](https://unsplash.com/photos/woman-in-red-and-white-plaid-shirt-wearing-black-framed-eyeglasses-upn798iEEYM) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/titan-air-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/round-metal-rimmed-glasses-on-a-light-yellow-fabric-Nf8XWr9JYvk) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/titan-air-2.jpg` | Sample product (detail) | [Unsplash](https://unsplash.com/photos/silver-metal-eyeglass-frames-twEsfXMyiAQ) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/nova-geometric-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-eyeglasses-on-white-surface-OWfBsDDOUlQ) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/nova-geometric-2.jpg` | Sample product (lifestyle) | [Unsplash](https://unsplash.com/photos/man-in-black-framed-eyeglasses-rnk1O_Requw) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/clarity-bluelight-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/a-pair-of-glasses-sitting-on-top-of-a-table-_GMm2QD5yco) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/clarity-bluelight-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/a-pair-of-glasses-sitting-on-top-of-a-white-surface-J7pWvj-Tqmo) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/oriel-aviator-optical-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/eyeglasses-on-white-surface-2l3H_1e-85Y) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/oriel-aviator-optical-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-eyeglasses-on-white-surface-yQpSxKF_ELA) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/vintage-wire-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-eyeglasses-on-white-surface-aa13iRARJwk) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/vintage-wire-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/antique-round-spectacles-resting-on-white-cloth-j65Nu2xvkIQ) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/coast-aviator-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-aviator-style-sunglasses-ouAyz-zRMTw) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/coast-aviator-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/silver-framed-aviator-style-sunglasses-on-white-ceramic-saucer-P4TPjOXKqY8) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/harbour-browline-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-sunglasses-on-white-surface-lSl94SZHRgA) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/harbour-browline-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-sunglasses-on-white-table-3xtCeUhqZWE) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/muse-cateye-sun-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/gray-sunglasses-with-white-frames-FlP6C5pkMKs) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/muse-cateye-sun-2.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/two-tortoiseshell-framed-wayfarer-styled-sunglasses-with-box-Pp_nVOuJMTU) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/riva-round-sun-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/black-framed-sunglasses-on-white-table-ODhxNCO8XHY) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/pip-kids-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/six-pairs-of-glasses-sitting-on-top-of-a-white-surface-ogav-IaToZI) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/pip-kids-2.jpg` | Sample product (lifestyle) | [Unsplash](https://unsplash.com/photos/girl-in-blue-and-white-shirt-wearing-pink-framed-eyeglasses-msgYbIh-1DA) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/scout-kids-1.jpg` | Sample product | [Unsplash](https://unsplash.com/photos/three-pairs-of-glasses-sitting-next-to-each-other-tyo8ibpCbhs) | Unsplash License | Not yet reviewed by owner |
| `public/images/products/scout-kids-2.jpg` | Sample product (lifestyle) | [Unsplash](https://unsplash.com/photos/girl-in-pink-sleeveless-shirt-wearing-black-framed-eyeglasses-Ya9G0IPLlgI) | Unsplash License | Not yet reviewed by owner |
| `public/images/brand/logo.png` | Official The Optical Express logo | Supplied by client | Client asset | Final |
| `public/images/fallback/frame.svg` | Fallback when an image fails | Created for this project | Project asset | — |
