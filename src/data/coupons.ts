/**
 * ILLUSTRATIVE DEMO COUPONS — not approved live promotions.
 * Amounts are integer paise. In Phase 2 coupons are validated server-side.
 */
import type { Coupon } from "@/types/coupon";

export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    maxDiscountPaise: 50000, // ₹500 cap
    startsAt: "2026-01-01T00:00:00+05:30",
    endsAt: "2027-12-31T23:59:59+05:30",
    isActive: true,
    isDemo: true,
  },
  {
    code: "FRAME100",
    type: "flat",
    value: 10000, // ₹100
    minSubtotalPaise: 99900, // ₹999 minimum
    startsAt: "2026-01-01T00:00:00+05:30",
    endsAt: "2027-12-31T23:59:59+05:30",
    isActive: true,
    isDemo: true,
  },
  {
    // Demonstrates the "expired" path in the demo.
    code: "MONSOON15",
    type: "percent",
    value: 15,
    startsAt: "2026-06-01T00:00:00+05:30",
    endsAt: "2026-08-31T23:59:59+05:30",
    isActive: true,
    isDemo: true,
  },
];

/** Codes promoted on the Offers page. */
export const featuredCouponCodes = ["WELCOME10", "FRAME100"] as const;
