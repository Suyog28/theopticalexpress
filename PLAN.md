# Implementation Plan — Phase 1 Demo: Premium Optical E‑Commerce Website (Pune)

> On approval, this plan is copied into the project folder as `PLAN.md`. **Nothing else is implemented** until you ask.

## Context

The client owns two optical stores in Pune: **THE OPTICAL EXPRESS** (Sahakarnagar) and **Universal Eyecare** (Mitra Mandal Chowk). They want to sell online. The first deliverable is a **static, interactive demo** for client approval: a shopping catalogue, cart, coupons, Pune delivery rules, a mock checkout, appointment booking, Google reviews, WhatsApp contact, and EN/MR/HI languages. The code is structured so Phase 2 can add a backend, admin, payments, and inventory without a redesign.

### Repository state (inspected 11 Oct 2026)
- `/Users/suyogmuley/Optical Express Website` is **empty**, and it is not a git repository.
- **Node.js and npm are not installed.** Homebrew, nvm, fnm, and volta are also missing. Only `git` is available.
- This means the first step is setting up the environment.

### Reference research (from the-optical-express.grexa.site, fetched 11 Oct 2026)
- Name, address, phone (8983790869) and hours (Mon–Sun 10:00–21:30) match the brief.
- The site shows a 5.0 rating with 252+ Google reviews.
- Brands: Ray‑Ban, Vogue, Oakley.
- Services: eyewear prescriptions, glasses fitting/repair, eye care, emergency service.
- Review excerpts visible on the site: Kishori Upadhye, Sayali Salvi, Rohit Ajit Dharmadhikari, Amit Mandhre, Rahul Joglekar (dated Apr–Sep 2026).
- The 14 gallery photos have no captions. No social links were found.
- Universal Eyecare has not been verified yet. It needs a manual check on Google Maps.

---

## 0. Environment setup
1. Install Node 22 LTS with nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`, then `nvm install 22`. The official macOS `.pkg` also works.
2. Run `git init` and add a `.gitignore`.
3. Scaffold the app: `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`.
   - Use the latest stable Next.js (15/16), React 19 and Tailwind v4.
4. Install dependencies:
   - Runtime: `next-intl`, `lucide-react`, `zod`, `zustand`, `clsx`, `tailwind-merge`.
   - Dev: `vitest`, `@testing-library/react`, `jsdom`, `prettier`, `prettier-plugin-tailwindcss`, `@playwright/test` (optional smoke tests).
5. Turn on strict mode in `tsconfig` (`strict`, `noUncheckedIndexedAccess`).

## 1. Architecture

```
src/
  app/
    layout.tsx                 # root html shell (minimal)
    sitemap.ts  robots.ts  not-found.tsx
    [locale]/
      layout.tsx               # fonts, NextIntlClientProvider, Header/Footer, providers
      page.tsx                 # Home
      shop/page.tsx            # all products + filters
      category/[slug]/page.tsx # eyeglasses | sunglasses | kids | premium | everyday | blue-light
      new-arrivals/page.tsx  offers/page.tsx  search/page.tsx
      product/[slug]/page.tsx
      wishlist/page.tsx  cart/page.tsx  checkout/page.tsx
      appointments/page.tsx
      stores/page.tsx  stores/[slug]/page.tsx
      reviews/page.tsx  about/page.tsx  contact/page.tsx
      policies/{shipping,returns,privacy,terms}/page.tsx
  middleware.ts                # next-intl locale detection/redirect
  i18n/ routing.ts request.ts navigation.ts
  config/site.ts               # SINGLE source of business config (see §3)
  data/ products.ts categories.ts stores.ts reviews.ts coupons.ts appointment-slots.ts banners.ts
  lib/ currency.ts pricing.ts delivery.ts coupons.ts validation.ts whatsapp.ts
       catalog.ts (filter/sort/search) appointments.ts payments/provider.ts utils.ts
  stores/ cart-store.ts wishlist-store.ts  (zustand + persist, localStorage)
  hooks/ use-hydrated.ts
  types/ product.ts store.ts order.ts appointment.ts review.ts coupon.ts admin.ts
  components/
    ui/        Button, Input, Select, Textarea, Badge, Dialog/Drawer, Price, Rating, SmartImage, EmptyState, DemoNotice, Container, SectionHeading
    layout/    AnnouncementBar, Header, MobileNav, LanguageSwitcher, SearchBar, Footer, WhatsAppFab
    home/      Hero, CategoryGrid, FeaturedProducts, NewArrivals, PromoBanner, EyeCareSection, ReviewsSection, StoreLocations, TrustStrip
    products/  ProductCard, ProductGrid, ProductListing (client), FilterPanel, FilterDrawer, SortSelect, ProductGallery, VariantPicker, QuantitySelector, AddToCart, WishlistButton, RelatedProducts
    cart/      CartLineItem, CouponForm, DestinationToggle, OrderSummary
    checkout/  CheckoutForm, PaymentMethodPreview, DemoConfirmation
    appointments/ AppointmentForm, SlotPicker, AppointmentConfirmation
    stores/    StoreCard, StoreHours, MapLink
    reviews/   ReviewSummary, ReviewCard, StoreReviews
messages/ en.json mr.json hi.json
public/images/ brand/ hero/ products/ categories/ stores/ editorial/ fallback/
docs/ ASSETS.md  VERIFICATION.md  PHASE2.md
README.md  .env.example
```

Principles:
- Server Components by default. Client components are only used for the header, cart, wishlist, filters, forms, the language switcher, and the gallery.
- Business logic lives in `lib/` as pure, unit-tested functions. Components only render.
- Category pages share one `ProductListing` component that receives a `category` preset. No page is duplicated.
- Pages are statically generated with `generateStaticParams` for every locale, product slug, category and store.

## 2. Domain types (Phase‑2 ready)
- **`Product`** has these fields:
  - `id`, `slug`, `name`, `brand?`, `category`, `shortDescription`, `description`
  - `pricePaise`, `originalPricePaise?`, `images[]`
  - `material`, `shape`, `colour`, `size {lens, bridge, temple}`, `fit`
  - `stockStatus`, `stockQty`, `variants[] {id, colour, sku, stockQty, images}`
  - `isFeatured`, `isNewArrival`, `popularity`, `createdAt`, `isActive`, `isSample: true`, `supportsPrescription`
- **`Store`** has these fields:
  - `slug`, `name`, `address`, `phone`, `whatsapp {number|null, verified}`, `hours[]`
  - `mapsUrl`, `reviewsUrl`, `rating? {value, count, retrievedAt, verified}`, `photos[]`
- **`Review`** has these fields: `storeSlug`, `author`, `text`, `date`, `rating`, `source: 'google'`, `sourceUrl`, `verificationStatus: 'verified' | 'pending-permission' | 'placeholder'`.
- **`Coupon`** has these fields: `code`, `type: 'percent' | 'flat'`, `value`, `minSubtotalPaise?`, `maxDiscountPaise?`, `startsAt`, `endsAt`, `isActive`, `usageLimit?`, `isDemo`.
- **`Order` / `OrderLine` / `PaymentStatus` / `OrderStatus`**, **`Appointment` / `TimeSlot`**, **`StockAdjustment`**: these are used by the demo and mirror future database tables.
- **`PaymentProvider`** is an interface: `createOrder`, `verifyPayment`.
  - The only implementation is `DemoPaymentProvider`, which never calls the network.
  - A Razorpay implementation is a documented stub only, for Phase 2 and server-side.

## 3. Central configuration — `src/config/site.ts`
Everything the owner might edit is in this one file:
- **Brand:** `brand.name = "VISION & CO."` (temporary) and the logo path.
- **Stores:** both stores, with each value carrying `verified: boolean` plus a `// VERIFY` comment.
- **Delivery:** `delivery = { puneFeePaise: 0, outsidePuneFeePaise: 9900 /* ILLUSTRATIVE */, freeThresholdPaise: 99900, thresholdBasis: 'merchandiseSubtotal' | 'afterDiscount' }`.
- **Other settings:** `announcement` (one key per locale), `currency`, `locales`, `defaultLocale`.
- **Demo flags:** `demoMode`, `showUnverifiedReviewExcerpts`, `showUnverifiedRatings`.
- **WhatsApp:** numbers default to `null`, which gives a disabled state with an "Number pending verification" tooltip, until the owner confirms them. A setting lets the demo fall back to the listed phone, clearly flagged.

`.env.example` lists only future server-side secrets (`RAZORPAY_KEY_SECRET`, `DATABASE_URL`, `GOOGLE_PLACES_API_KEY`). None are `NEXT_PUBLIC_`.

## 4. Design system
- **Tailwind v4 `@theme` tokens in `globals.css`:**
  - Colours: navy `#142B45`, primary `#173C73`, secondary `#315A9B`, ivory `#F7F5F0`, white, muted `#66717D`, border `#E5E3DD`, plus success, error and sale accents.
  - Radii are small (2–6px). Use a soft shadow scale, not pill shapes.
  - Containers: 1280px wide with fluid gutters (16px on mobile). Spacing uses a 4px base.
  - Breakpoints: sm, md, lg, xl.
- **Fonts (`next/font/google`, self-hosted at build):**
  - Display: **Fraunces** (editorial serif) with fallback to **Noto Serif Devanagari**.
  - UI/body: **Inter** with fallback to **Noto Sans Devanagari**.
  - Font stacks list Latin first, so Devanagari glyphs fall through automatically. When the locale is `mr` or `hi`, line-height is raised slightly via `:lang()`.
- **Components:**
  - Buttons: primary (navy solid), secondary (outline) and ghost. All have visible `focus-visible` rings.
  - Form controls have consistent sizes, inline error text, and `aria-invalid`/`aria-describedby`.
  - Product card: 4:5 image on ivory, hover reveals a second image, wishlist heart in the corner, and New/Best Seller/–x% badges driven only by data.
- **Motion:** subtle fade/translate on reveal and hover image swap, wrapped in `motion-safe:`, with `prefers-reduced-motion` respected.

## 5. Images and asset manifest
- **Sources:** hero, category, product and editorial images come from **Unsplash** (free licence, attribution kept anyway).
  - They are downloaded into `public/images/**` so the build never depends on hotlinks.
  - Each slot gets a distinct image: hero, 6 categories, product images (14 products × 2), editorial promo, eye-care, and illustrative store interiors.
- **Store photos:** Google Maps and grexa gallery photos are **not** downloaded.
  - Store cards use illustrative optical-retail imagery with a caption: "Illustrative image – not the actual store".
  - This stays until the owner supplies approved photos for `public/images/stores/`.
- **`SmartImage` wrapper:** wraps `next/image` with an `onError` fallback to a branded SVG placeholder in `public/images/fallback/`, so the page never shows a broken-image icon.
- **`docs/ASSETS.md`:** a table of file → purpose → source URL → photographer → licence → approval status.
- **Downloads blocked fallback:** if downloads are blocked, configure `images.remotePatterns` for `images.unsplash.com` and keep the fallback.

## 6. Data
- **`products.ts`:** 14 sample products. Examples:
  - Eyeglasses: rectangular acetate, round metal, tortoiseshell, clubmaster, titanium premium, everyday TR90, blue-light.
  - Sunglasses: aviator, wayfarer-style, oversized cat-eye, sport wrap.
  - Kids: flexible round and rectangular.
  - Prices are ₹1,299–₹8,999, labelled "Illustrative price".
  - Names are generic (e.g. "Aurora Rectangle Acetate"). The brand is "Sample Collection", not Ray-Ban or Oakley, so no authorisation to sell those brands is implied.
  - `isNewArrival`/`isFeatured` are set explicitly, and `createdAt` dates are realistic.
  - A visible "Sample inventory" notice appears on listings.
- **`categories.ts`:** 6 categories with slug, translation key and image.
- **`stores.ts`:** both stores from config. Universal Eyecare data is marked `verified: false`.
- **`reviews.ts`:**
  - Optical Express: the 5 excerpts above, attributed "Google review, shown on the business's website, retrieved 11 Oct 2026", with `verificationStatus: 'pending-permission'`. They display with a small "Pending owner confirmation" note and can be hidden with a config flag.
  - Universal Eyecare: **placeholder cards** clearly labelled "Reviews to be added after verification". No invented text.
  - Rating summaries show "as listed on Google, retrieved <date>, to be re-verified".
  - **No `AggregateRating`/`Review` JSON-LD** is added.
- **`coupons.ts`:**
  - `WELCOME10`: 10%, cap ₹500.
  - `FRAME100`: ₹100 flat, minimum ₹999.
  - `EXPIRED5`: demonstrates the expired path.
  - All are `isDemo`.
- **`appointment-slots.ts`:** per-store weekly template (30-minute slots within opening hours) plus a deterministic "booked" set derived from the date, so some slots are disabled.

## 7. Business logic (pure, unit-tested)
- **`currency.ts`:** integer paise only, and `formatINR(paise, locale)` via `Intl.NumberFormat('en-IN' | 'mr-IN' | 'hi-IN')`.
- **`coupons.ts`:** `validateCoupon(code, subtotal, now)` returns `{ok, discountPaise} | {ok:false, reason}`. Reasons are `invalid`, `expired`, `inactive`, `minNotMet`.
  - The percent discount uses `Math.floor` and is then capped.
  - Only **one coupon at a time**: applying a new one replaces the old one, with a message.
- **`delivery.ts`:** `calcDelivery(destination: 'pune'|'outside', basisPaise, config)`.
  - Pune costs 0.
  - Outside Pune is free when `basis >= threshold`; otherwise it costs `outsidePuneFeePaise`.
  - The basis follows `thresholdBasis`.
- **`pricing.ts`:** `calcOrderTotals(lines, coupon, destination)` returns `{subtotal, discount, delivery, total, freeShippingGapPaise}`.
  - It re-validates the coupon whenever anything changes. For example, if the subtotal drops below `FRAME100`'s minimum, the coupon is auto-removed with a notice.
- **`catalog.ts`:** `filterProducts(products, {q, category, price range, brands, shapes, colours})` and `sortProducts(by: 'featured'|'price-asc'|'price-desc'|'newest'|'popular')`.
  - Search is accent- and case-insensitive over name, brand, shape, colour and category.
- **`validation.ts`:** zod schemas.
  - Indian mobile: `^[6-9]\d{9}$` with an optional +91.
  - PIN: `^[1-9]\d{5}$`.
  - Email: optional.
  - Date: not in the past.
  - Error messages are translation keys.
- **`whatsapp.ts`:** `buildWhatsAppUrl(number, template, vars)` returns a `https://wa.me/<digits>?text=<encodeURIComponent>` URL, or `null` if the number is unverified or missing.
  - Templates: general, product (name + URL), appointment.
- **`appointments.ts`:** `getAvailableSlots(storeSlug, date, now)` disables past times on the current day.

## 8. State
- **`cart-store` (zustand `persist`, key `visionco-cart-v1`):**
  - Holds `lines {productId, variantId, qty}`, `couponCode`, `destination`.
  - Actions: add, setQty (1 to stock limit), remove, clear, apply/remove coupon, set destination.
  - Prices are always derived from the catalogue, never stored, which matches the Phase-2 server-trust model.
- **`wishlist-store`:** same persist pattern.
- **Hydration safety:** `useHydrated()` gates badge counts and cart contents. Server render shows the 0/skeleton state, so there are no hydration mismatches.

## 9. Pages — key behaviour
- **Home:** sections A–L as specified.
  - Announcement bar (from config, translated).
  - Sticky header with desktop nav, search, account (links to a "coming in production" notice page or dialog, never a dead button), wishlist and cart counts, language switcher, and WhatsApp.
  - Mobile drawer with focus trap, ESC to close and scroll lock.
  - Editorial hero (split layout: large image plus serif headline) with 2 CTAs.
  - 6 category cards, featured grid (8), new arrivals rail, promo banner, eye-care section with CTA, reviews per store (tabs), two store cards, trust strip, and footer.
- **Shop / category / new-arrivals / offers / search:**
  - All use `ProductListing`. Filters are synced to URL search params, so they are shareable and keep working after a language switch.
  - Includes a result count, "Clear all", an empty state, and a mobile filter drawer.
  - Offers lists products with an `originalPrice`, plus a coupon showcase.
- **Product:**
  - Gallery with thumbnails, keyboard support and arrow keys.
  - Variant (colour) picker, stock badge, quantity selector, add to cart (toast), wishlist, WhatsApp enquiry, specs table, delivery policy summary, and related products (same category).
  - Product metadata comes from `generateMetadata`. `Product` JSON-LD is omitted because prices are illustrative.
- **Cart:**
  - Line items, quantity steppers, remove, and a Pune / Outside Pune toggle.
  - Coupon form with inline success and error, and the summary with "Add ₹X more for free shipping".
  - Empty state and continue-shopping link.
- **Checkout:**
  - Persistent **Demo Mode banner**.
  - Form: name, email, mobile, address, city, state (default Maharashtra), PIN, destination (synced with the cart), order summary, and a payment preview (UPI/Card/Netbanking radios, disabled, "Available in production").
  - On a valid submit it shows a demo confirmation with a fake reference prefixed `DEMO-`, the text "This order has NOT been sent to the store", and then clears the cart.
- **Appointments:**
  - Store select (pre-selectable via `?store=`), a date input (min today, max +30 days), and a slot grid with disabled slots, plus validation.
  - Shows a demo confirmation stating it was not submitted, with an optional WhatsApp follow-up link if the number is verified.
- **Stores, store detail:**
  - Cards and a detail page with hours, map link, phone `tel:`, WhatsApp, reviews link, illustrative-image caption, and that store's reviews only.
- **Reviews:** both stores side by side with source notes.
- **About and Contact:**
  - The About text is drafted from verified facts only: two Pune stores, services listed on the reference site.
  - Contact shows per-store contact details and a WhatsApp chooser. There is no backend form, only `mailto`/WhatsApp.
- **Policies:** each has a "DRAFT – requires business approval" banner. The text describes intended rules (e.g. the delivery rules from config) and does not invent final terms.

## 10. Localisation
- **Routing:** `next-intl` with `localePrefix: 'always'` (`/en`, `/mr`, `/hi`), and `/` redirects to `/en` (Accept-Language detection on).
- **Language switcher:** keeps the current path and query, so filters and cart survive a switch.
- **Message files:** organised by namespace (`nav`, `home`, `product`, `filters`, `cart`, `checkout`, `delivery`, `coupon`, `appointment`, `validation`, `store`, `reviews`, `footer`, `empty`, `demo`, `policies`, `meta`).
  - Every key is present in all 3 files. A Vitest test asserts key parity.
- **Proper Marathi and Hindi copy:**
  - Brand and store names, product names, and "WhatsApp" stay in Latin script.
  - Product descriptions get localised fields: `name` stays the same; `shortDescription`/`description` are records keyed by locale.
- **Numbers:** prices are formatted with `en-IN` digits in all locales, for consistency and readability.
- **`<html lang>`** is set per locale.

## 11. SEO, accessibility, performance
- **Metadata:** `generateMetadata` per page (translated title and description) and Open Graph, with a default OG image.
- **Indexing files:** `sitemap.ts` covers all locales and routes, with hreflang alternates. `robots.ts` disallows `/checkout` and `/cart`.
- **Markup:** semantic landmarks, one `h1` per page, alt text from data, skip-to-content link, and labelled icon buttons.
- **Interactive elements:** dialogs use `role="dialog"`, `aria-modal` and a focus trap. All controls are keyboard reachable.
- **Contrast:** AA checked (navy on ivory passes).
- **Images:** `next/image` with `sizes`; the hero uses `priority`.
- **Layout:** no layout shift (fixed aspect ratios) and no horizontal overflow at 320px.

## 12. Implementation order
1. Environment, scaffold, tokens, fonts, i18n routing, config, types, data, and `lib/` with unit tests.
2. Layout shell: announcement bar, header, mobile nav, footer, language switcher, `SmartImage`, UI primitives.
3. **Homepage, finished to a high visual polish first**, so it is presentable early.
4. Catalogue: listing, filters, sort, search, product page, wishlist.
5. Cart, coupons, delivery, checkout demo.
6. Appointments, stores, reviews, about, contact, policies.
7. Complete the MR/HI translations and check Devanagari rendering.
8. QA pass, docs, README.

## 13. Verification
- **Automated checks:**
  - `npm run typecheck` (`tsc --noEmit`), `npm run lint`, `npm run test` (Vitest), and `npm run build`. All must pass.
- **Unit tests cover:**
  - Delivery: Pune is 0. Outside Pune is ₹99 at ₹998.99, and 0 at exactly ₹999 and above.
  - Coupons: cap, minimum, expired, invalid, replacement (no stacking).
  - Totals: paise arithmetic.
  - Filter and sort combinations.
  - WhatsApp URL encoding and null when unverified.
  - Slot availability for past dates and times.
  - Translation key parity across the 3 files.
- **Manual checks in a browser:**
  - Run `npm run dev` and review at 360px, 768px, 1280px and 1536px widths, in all 3 locales. Use Playwright smoke tests if installed, otherwise the Chrome tools.
  - Walk through: navigate every nav link, search, filter and sort, add to cart, change quantity, remove, reload to confirm persistence, apply and remove coupons, toggle destination, submit checkout, book an appointment, open WhatsApp links, and switch language mid-flow.
- **Final report:** state only the checks that were actually run, with their output.

## 14. Handoff docs
- **`README.md`:** install (nvm/Node 22), `npm install`, `npm run dev`, `npm run build && npm start`, where to edit config, and the demo limitations.
- **`docs/VERIFICATION.md`:** a checklist of the unverified items:
  - Universal Eyecare address, phone, hours and rating.
  - Both WhatsApp numbers and the courier fee.
  - Threshold basis (pre- or post-discount).
  - Review excerpt permissions, Universal Eyecare reviews, and store photos.
  - Final brand name and logo, real catalogue and prices, policy texts, and social links.
- **`docs/ASSETS.md`:** the image manifest.
- **`docs/PHASE2.md`:** the planned backend:
  - Next.js route handlers or a separate API, Postgres with Prisma.
  - Auth (Auth.js / Clerk) with role-based admin.
  - Razorpay with server-side amount computation and webhook signature verification.
  - Inventory adjustments, order and appointment management, and a slot-conflict check on the server.
  - Google Places API for live ratings (server-side key), a shipping integration (Shiprocket), and a CMS for banners and translations.

## Assumptions (change if needed)
- Package manager is npm, and Node is installed via nvm.
- The temporary brand name is "VISION & CO.".
- The illustrative courier fee is ₹99.
- `WELCOME10` is capped at ₹500 and `FRAME100` requires a ₹999 minimum.
- Optical Express review excerpts from its own website are shown, flagged "pending owner confirmation".
