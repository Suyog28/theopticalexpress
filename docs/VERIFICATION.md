# Business details requiring verification

Nothing below should be published as fact until the owner confirms it. Every value lives in
**`src/config/site.ts`** (search for `VERIFY`) unless noted otherwise. Each store fact carries a
`status`: `owner-confirmed`, `source-checked` (matched a public source on the given date) or
`unverified`. The UI shows “(To be confirmed)” / “Pending verification” for unverified values.

Research date: **11 Oct 2026**.

## THE OPTICAL EXPRESS (Sahakarnagar)

| Item | Current value | Status | Source |
| --- | --- | --- | --- |
| Address | Opp. Relax Veg, Shop No. 2, Suvarna Apartment, Tulshibagwale Colony Road, near Bagul Garden, Sahakarnagar No. 2, Pune 411009 | source-checked | the-optical-express.grexa.site |
| Phone | +91 89837 90869 | source-checked | same |
| Hours | Daily 10:00 AM – 9:30 PM | source-checked | same |
| Google rating | 5.0 / 252+ reviews | source-checked (as displayed on the business website) | same — re-check on Google before launch |
| WhatsApp number | **none set** (disabled in UI) | unverified | The listed phone is **not** assumed to be WhatsApp-enabled |
| Services | Prescriptions, fitting, repairs, eye care | source-checked | same |
| Google review excerpts | 7 verbatim excerpts in `src/data/reviews.ts` | **pending permission** | Copied verbatim from Google reviews shown on the business website. One mentions a staff member by first name (“Mr. Mangesh”). Owner must confirm reuse; set `flags.showPendingReviewExcerpts` to `false` to hide them. |

## Universal Eyecare (Mitra Mandal Chowk)

| Item | Current value | Status |
| --- | --- | --- |
| Address | Shop No. 2, near Mitra Mandal Chowk, opposite Purohit Hospital, Parvati Gaon, Parvati Paytha, Pune 411009 | **unverified** — no public listing could be retrieved on the research date |
| Phone | +91 83172 33588 | **unverified** |
| Hours | Daily 10:00 AM – 10:00 PM | **unverified** |
| Google rating | 4.9 / 46 reviews | **unverified** — from initial brief; re-check on Google |
| WhatsApp number | none set (disabled in UI) | unverified |
| Services | left empty (“to be confirmed”) | unverified |
| Google reviews | none shown — placeholder only | Retrieve this store's **own** reviews; never reuse The Optical Express reviews |

## Shared / commercial

| Item | Demo value | Where |
| --- | --- | --- |
| Final brand name & logo | THE OPTICAL EXPRESS (logo supplied) | `siteConfig.brand`, `public/images/brand/logo.png` |
| Courier fee outside Pune | ₹99 — **illustrative**, labelled as such in the UI | `siteConfig.delivery.outsidePuneFeePaise` |
| Free-shipping threshold | ₹999 | `siteConfig.delivery.freeThresholdPaise` |
| Threshold basis | Merchandise subtotal (before coupon) | `siteConfig.delivery.thresholdBasis` (`"after-discount"` also supported) |
| Coupons | WELCOME10 (10%, cap ₹500), FRAME100 (₹100 off ≥ ₹999), MONSOON15 (expired, demo) | `src/data/coupons.ts` — **illustrative, not approved promotions** |
| Catalogue & prices | 15 sample products, illustrative prices | `src/data/products.ts` — replace with real stock |
| Policies | Draft text, bannered “DRAFT” | `messages/*.json` → `policies.*` |
| Public email | none | `siteConfig.email` |
| Social profiles | none found | `siteConfig.social` |
| Store photos | illustrative (captioned) | see `docs/ASSETS.md` |
| Legal relationship | Site states the businesses are independent and the shared site is a proposal | `footer.demoNote`, About page |

## How to mark something as confirmed

```ts
phone: { value: "+91 …", status: "owner-confirmed", source: "Confirmed by owner, <date>" },
whatsapp: { value: "91XXXXXXXXXX", status: "owner-confirmed", source: "Owner, <date>" },
```

WhatsApp buttons only become active when the status is `owner-confirmed` and a valid number is set.
