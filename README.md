# VISION & CO. — optical e-commerce demo (Phase 1)

A premium, fully responsive **demo** storefront for two optical stores in Pune —
**THE OPTICAL EXPRESS** (Sahakarnagar) and **Universal Eyecare** (Mitra Mandal Chowk) — built for
client review. “VISION & CO.” is a **temporary** brand name pending owner approval.

> **Demo mode:** no real orders, payments, bookings or messages are processed. Products, prices and
> coupons are illustrative sample data. See [`docs/VERIFICATION.md`](docs/VERIFICATION.md).

## Quick start

Requires **Node.js 20.9+** (developed on Node 22 LTS).

```bash
# If Node is not installed (macOS, no Homebrew needed):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# open a new terminal, then:
nvm install 22

npm install
npm run dev          # http://localhost:3000  (redirects to /en, /mr or /hi)
```

Production build:

```bash
npm run build
npm start            # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve (all 128 pages are statically generated) |
| `npm run typecheck` | TypeScript (strict, `noUncheckedIndexedAccess`) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run test` | Vitest unit tests — pricing, delivery, coupons, catalogue, validation, WhatsApp, slots, translations |
| `npm run test:e2e` | Playwright end-to-end tests against a production build (run `npm run build` first; first time: `npx playwright install chromium`) |
| `npm run check` | All of the above in order |
| `npm run assets:download` | Re-download the Unsplash images listed in `scripts/assets.json` |

## Where to change things

| To change… | Edit |
| --- | --- |
| Brand name, logo, store addresses/phones/hours, WhatsApp numbers, map & review links, delivery fee/threshold, announcement bar, demo flags | **`src/config/site.ts`** (single source of truth) |
| Products | `src/data/products.ts` |
| Coupons | `src/data/coupons.ts` |
| Google review excerpts | `src/data/reviews.ts` |
| Appointment slot templates | `src/data/appointment-slots.ts` |
| All UI text (English / Marathi / Hindi) | `messages/en.json`, `messages/mr.json`, `messages/hi.json` |
| Colours, fonts, spacing tokens | `src/app/globals.css` (`@theme`) |
| Images | `public/images/**` + `docs/ASSETS.md` |

## Features

- **22 page types** under `/en`, `/mr`, `/hi`: home, shop, 6 categories, new arrivals, offers,
  product details, search, wishlist, cart, checkout (demo), eye-checkup booking (demo), stores,
  store details, reviews, about, contact, account placeholder, 4 draft policy pages, 404.
- **Catalogue:** search, category / price / line / shape / colour filters, 5 sort orders,
  URL-synced filters (shareable, survive language switch), mobile filter drawer, empty states.
- **Cart:** persisted in `localStorage` (hydration-safe), quantity limits by stock, single-coupon
  rule with replacement notice, automatic coupon re-validation, Pune/outside-Pune delivery.
- **Delivery rules:** Pune ₹0; outside Pune free at ≥ ₹999, else an *illustrative* ₹99 courier fee.
  All money in integer paise.
- **Appointments:** both stores, past dates blocked, mock availability with booked slots,
  inline validation, explicit demo confirmation.
- **Reviews:** per-store only; verbatim excerpts flagged “pending owner confirmation”; no review
  structured data.
- **WhatsApp:** per-store click-to-chat with URL-encoded templates; **disabled until each number is
  owner-confirmed**.
- **i18n:** English, Marathi, Hindi with Devanagari-capable fonts (Noto); a unit test enforces
  identical keys and placeholders across languages.
- **Accessibility:** semantic landmarks, skip link, labelled controls, native `<dialog>` drawers
  (focus trap/ESC), visible focus, reduced-motion support, no horizontal overflow at 360 px.
- **SEO:** per-page metadata, Open Graph, hreflang alternates, sitemap. Demo mode adds `noindex` and
  a blocking `robots.txt` until launch.

## Project structure

```
src/
  app/[locale]/…        routes (App Router); proxy.ts handles locale redirects
  components/           ui · layout · home · products · cart · checkout · appointments · stores · reviews
  config/site.ts        business configuration
  data/                 sample catalogue, coupons, reviews, slot templates
  lib/                  pure business logic (pricing, delivery, coupons, catalog, validation, whatsapp…)
  i18n/                 dictionary loader, routing helpers, client provider
  stores/               zustand stores (cart, wishlist, toasts)
  types/                domain models (Phase 2-ready, incl. admin/order/payment types)
messages/               en.json · mr.json · hi.json
tests/e2e/              Playwright specs
docs/                   ASSETS.md · VERIFICATION.md · PHASE2.md
```

## Technical notes

- **Next.js 16.4 / React 19.3 / Tailwind CSS 4 / TypeScript 5.** Next 16 renames middleware to
  `proxy` (`src/proxy.ts`).
- i18n uses the dictionary pattern from the Next.js docs (no third-party i18n library).
- Cache Components is disabled for Phase 1 (fully static site); see `docs/PHASE2.md`.
- No API keys or secrets are used. Future secrets are listed in `.env.example` and must stay
  server-side.

## Next steps

See [`docs/VERIFICATION.md`](docs/VERIFICATION.md) for business details to confirm,
[`docs/ASSETS.md`](docs/ASSETS.md) for image approvals, and [`docs/PHASE2.md`](docs/PHASE2.md)
for the production roadmap (backend, admin, payments, inventory, shipping, real appointments).
# theopticalexpress
# theopticalexpress
