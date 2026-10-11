import type { Coupon, CouponResult } from "@/types/coupon";
import { coupons as defaultCoupons } from "@/data/coupons";
import { percentOf } from "./currency";

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function findCoupon(code: string, list: Coupon[] = defaultCoupons): Coupon | undefined {
  const normalized = normalizeCouponCode(code);
  return list.find((c) => c.code === normalized);
}

/** Discount for a coupon that has already passed validation. Never exceeds the subtotal. */
export function couponDiscount(coupon: Coupon, subtotalPaise: number): number {
  let discount = coupon.type === "percent" ? percentOf(subtotalPaise, coupon.value) : coupon.value;
  if (coupon.maxDiscountPaise !== undefined) discount = Math.min(discount, coupon.maxDiscountPaise);
  return Math.max(0, Math.min(discount, subtotalPaise));
}

/**
 * Validate a coupon code against the merchandise subtotal at time `now`.
 * Only one coupon can ever be applied — callers replace, never stack.
 */
export function validateCoupon(
  code: string,
  subtotalPaise: number,
  now: Date = new Date(),
  list: Coupon[] = defaultCoupons,
): CouponResult {
  const coupon = findCoupon(code, list);
  if (!coupon) return { ok: false, reason: "invalid" };
  if (!coupon.isActive) return { ok: false, reason: "inactive" };
  if (now < new Date(coupon.startsAt)) return { ok: false, reason: "not-started" };
  if (now > new Date(coupon.endsAt)) return { ok: false, reason: "expired" };
  if (coupon.minSubtotalPaise !== undefined && subtotalPaise < coupon.minSubtotalPaise) {
    return { ok: false, reason: "min-not-met", minSubtotalPaise: coupon.minSubtotalPaise };
  }
  return { ok: true, coupon, discountPaise: couponDiscount(coupon, subtotalPaise) };
}
