export type CouponType = "percent" | "flat";

export interface Coupon {
  code: string;
  type: CouponType;
  /** Percent (0–100) for "percent"; paise for "flat". */
  value: number;
  minSubtotalPaise?: number;
  maxDiscountPaise?: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  /** Phase 2: enforced server-side. */
  usageLimit?: number;
  /** Illustrative demo promotion — not an approved live offer. */
  isDemo: boolean;
}

export type CouponRejection = "invalid" | "inactive" | "expired" | "not-started" | "min-not-met";

export type CouponResult =
  | { ok: true; coupon: Coupon; discountPaise: number }
  | { ok: false; reason: CouponRejection; minSubtotalPaise?: number };
