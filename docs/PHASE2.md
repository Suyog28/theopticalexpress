# Phase 2 — production e-commerce

Phase 1 is a static, client-side demo. This document lists what Phase 2 must add and where the
Phase 1 code was designed to plug in.

## Integration boundaries already in place

| Concern | Phase 1 | Phase 2 replacement |
| --- | --- | --- |
| Catalogue | `src/data/products.ts` + `src/lib/catalog.ts` (pure functions) | DB/API query returning the same `Product` type (`src/types/product.ts`) |
| Pricing | `src/lib/pricing.ts` — prices always looked up by id, never trusted from the client | Run the **same function on the server** at checkout; persist the result on the order |
| Coupons | `src/data/coupons.ts` + `src/lib/coupons.ts` | Coupons table; server-side validation incl. usage limits (`Coupon.usageLimit`) |
| Delivery | `src/lib/delivery.ts` + `siteConfig.delivery` | Same logic server-side; config editable in admin; courier integration (e.g. Shiprocket) for rates/tracking (`Shipment` type) |
| Payments | `src/lib/payments/provider.ts` → `DemoPaymentProvider` | Razorpay (or approved gateway) provider implemented **server-side** |
| Orders | Simulated client-side, `DEMO-` reference | `Order` table (`src/types/order.ts`) with `OrderStatus` / `PaymentStatus` |
| Appointments | `src/lib/appointments.ts` (mock availability) | Slots table per store; server validates availability **and** prevents double-booking in a transaction |
| Reviews | `src/data/reviews.ts` (typed static data) | Google Business Profile / Places API via a **server-side** key, cached; respect Google terms |
| Translations | `messages/*.json` | Keep files, or move to a CMS; product copy already per-locale (`Localized`) |
| Store/business config | `src/config/site.ts` | Admin-editable settings table |

## Payments (Razorpay example)

1. Client sends cart line ids + quantities + coupon code + destination — **never amounts**.
2. Server recomputes totals with `calcOrderTotals`, creates a pending order, creates the Razorpay
   order with `RAZORPAY_KEY_SECRET` (server env only — never `NEXT_PUBLIC_`).
3. Client opens Checkout with the Razorpay order id.
4. Server verifies the payment signature (and the webhook, `RAZORPAY_WEBHOOK_SECRET`) before
   marking the order `paid`, decrementing stock (`StockAdjustment`) and sending notifications.
5. Refunds/cancellations go through the server and write stock adjustments for returned items.

## Admin dashboard

Must use real server-side authentication (e.g. Auth.js) with role-based authorization
(`AdminUser.role`: owner / store-manager / staff, scoped to `stores`). All mutations go through
protected route handlers or server actions that re-check the session and role.

Capabilities (see brief §13): products & variants & images, categories, prices/discounts, stock and
low-stock warnings, new-arrival/featured flags, coupons & banners (`Banner` type), orders &
shipments, refunds, appointments & slot management per store, store details, WhatsApp numbers,
review links, delivery thresholds/fees, translations.

## Suggested stack

- Next.js route handlers / server actions (same repo) or a separate API
- PostgreSQL + Prisma (types in `src/types/*` map 1:1 to tables)
- Object storage for product images (S3/R2) via `next/image` `remotePatterns`
- Auth.js for admin; customer accounts optional (OTP login is common in India)
- Transactional email/SMS/WhatsApp Business API for notifications (opt-in only)
- Re-enable Next.js **Cache Components** (`cacheComponents: true` + `partialPrefetching: true`) once
  pages read server data; it was disabled in Phase 1 because every page is static

## Before go-live checklist

- [ ] All items in `docs/VERIFICATION.md` confirmed
- [ ] `siteConfig.flags.demoMode = false` (also lifts `noindex` and the robots block)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain
- [ ] Real catalogue, photography, policies (legal review), privacy notice (DPDP Act 2023)
- [ ] Payment gateway in live mode with server-side verification
- [ ] Analytics/cookie consent if used
