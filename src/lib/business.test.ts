import { describe, expect, it } from "vitest";
import { calcDelivery } from "./delivery";
import { couponDiscount, validateCoupon } from "./coupons";
import { calcOrderTotals } from "./pricing";
import { discountPercent, formatINR, percentOf } from "./currency";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types/product";
import { products } from "@/data/products";

const NOW = new Date("2026-10-11T12:00:00+05:30");
const cfg = siteConfig.delivery;

describe("currency", () => {
  it("formats paise as INR with Indian grouping", () => {
    expect(formatINR(249900)).toBe("₹2,499");
    expect(formatINR(12345678)).toBe("₹1,23,456.78");
    expect(formatINR(0)).toBe("₹0");
  });
  it("rejects non-integer paise", () => {
    expect(() => formatINR(10.5)).toThrow();
  });
  it("rounds percentages down to whole paise", () => {
    expect(percentOf(99999, 10)).toBe(9999);
  });
  it("computes discount percent only for genuine markdowns", () => {
    expect(discountPercent(249900, 299900)).toBe(17);
    expect(discountPercent(249900)).toBeNull();
    expect(discountPercent(249900, 199900)).toBeNull();
  });
});

describe("delivery rules", () => {
  it("is always free within Pune", () => {
    expect(calcDelivery("pune", 10000, 0, cfg).feePaise).toBe(0);
    expect(calcDelivery("pune", 500000, 0, cfg).feePaise).toBe(0);
  });
  it("charges the courier fee outside Pune below ₹999", () => {
    const q = calcDelivery("outside-pune", 99899, 0, cfg);
    expect(q.feePaise).toBe(cfg.outsidePuneFeePaise);
    expect(q.gapToFreePaise).toBe(1);
  });
  it("is free outside Pune at exactly ₹999", () => {
    expect(calcDelivery("outside-pune", 99900, 0, cfg).feePaise).toBe(0);
  });
  it("is free outside Pune above ₹999", () => {
    expect(calcDelivery("outside-pune", 250000, 0, cfg).isFree).toBe(true);
  });
  it("uses the merchandise subtotal (pre-discount) by default", () => {
    expect(calcDelivery("outside-pune", 99900, 10000, cfg).feePaise).toBe(0);
  });
  it("can use the post-discount amount when configured", () => {
    const after = { ...cfg, thresholdBasis: "after-discount" as const };
    expect(calcDelivery("outside-pune", 99900, 10000, after).feePaise).toBe(
      cfg.outsidePuneFeePaise,
    );
  });
  it("charges nothing for an empty cart", () => {
    expect(calcDelivery("outside-pune", 0, 0, cfg).feePaise).toBe(0);
  });
});

describe("coupons", () => {
  it("applies WELCOME10 as 10% off", () => {
    const r = validateCoupon("welcome10", 249900, NOW);
    expect(r.ok && r.discountPaise).toBe(24990);
  });
  it("caps WELCOME10 at ₹500", () => {
    const r = validateCoupon("WELCOME10", 1000000, NOW);
    expect(r.ok && r.discountPaise).toBe(50000);
  });
  it("applies FRAME100 as ₹100 off at or above ₹999", () => {
    const r = validateCoupon(" frame100 ", 99900, NOW);
    expect(r.ok && r.discountPaise).toBe(10000);
  });
  it("rejects FRAME100 below its minimum", () => {
    const r = validateCoupon("FRAME100", 99899, NOW);
    expect(r).toEqual({ ok: false, reason: "min-not-met", minSubtotalPaise: 99900 });
  });
  it("rejects unknown codes", () => {
    expect(validateCoupon("NOPE", 100000, NOW)).toEqual({ ok: false, reason: "invalid" });
  });
  it("rejects expired codes", () => {
    expect(validateCoupon("MONSOON15", 100000, NOW)).toEqual({ ok: false, reason: "expired" });
  });
  it("never discounts more than the subtotal", () => {
    const r = validateCoupon("WELCOME10", 0, NOW);
    expect(r.ok && r.discountPaise).toBe(0);
    expect(
      couponDiscount(
        {
          code: "X",
          type: "flat",
          value: 50000,
          startsAt: "",
          endsAt: "",
          isActive: true,
          isDemo: true,
        },
        20000,
      ),
    ).toBe(20000);
  });
});

describe("order totals", () => {
  const p = (price: number): Product => ({ ...products[0]!, id: `t-${price}`, pricePaise: price });
  const catalogue = new Map<string, Product>([
    ["a", { ...p(49900), id: "a" }],
    ["b", { ...p(25000), id: "b" }],
  ]);
  const lookup = (id: string) => catalogue.get(id);

  it("sums lines in paise and adds outside-Pune delivery below threshold", () => {
    const t = calcOrderTotals({
      lines: [{ productId: "a", variantId: "v", qty: 1 }],
      couponCode: null,
      destination: "outside-pune",
      now: NOW,
      lookup,
    });
    expect(t.subtotalPaise).toBe(49900);
    expect(t.deliveryPaise).toBe(cfg.outsidePuneFeePaise);
    expect(t.totalPaise).toBe(49900 + cfg.outsidePuneFeePaise);
    expect(t.freeDeliveryGapPaise).toBe(99900 - 49900);
  });

  it("recalculates when quantity crosses the free-delivery threshold", () => {
    const t = calcOrderTotals({
      lines: [{ productId: "a", variantId: "v", qty: 2 }],
      couponCode: null,
      destination: "outside-pune",
      now: NOW,
      lookup,
    });
    expect(t.subtotalPaise).toBe(99800);
    expect(t.deliveryPaise).toBe(cfg.outsidePuneFeePaise);
    const t2 = calcOrderTotals({
      lines: [
        { productId: "a", variantId: "v", qty: 2 },
        { productId: "b", variantId: "v", qty: 1 },
      ],
      couponCode: null,
      destination: "outside-pune",
      now: NOW,
      lookup,
    });
    expect(t2.deliveryPaise).toBe(0);
    expect(t2.totalPaise).toBe(124800);
  });

  it("drops a coupon that no longer qualifies and reports why", () => {
    const t = calcOrderTotals({
      lines: [{ productId: "a", variantId: "v", qty: 1 }],
      couponCode: "FRAME100",
      destination: "pune",
      now: NOW,
      lookup,
    });
    expect(t.discountPaise).toBe(0);
    expect(t.couponCode).toBeNull();
    expect(t.couponRejection).toBe("min-not-met");
  });

  it("applies a coupon and free Pune delivery", () => {
    const t = calcOrderTotals({
      lines: [{ productId: "a", variantId: "v", qty: 3 }],
      couponCode: "WELCOME10",
      destination: "pune",
      now: NOW,
      lookup,
    });
    expect(t.subtotalPaise).toBe(149700);
    expect(t.discountPaise).toBe(14970);
    expect(t.deliveryPaise).toBe(0);
    expect(t.totalPaise).toBe(134730);
  });

  it("ignores unknown products and non-positive quantities", () => {
    const t = calcOrderTotals({
      lines: [
        { productId: "zzz", variantId: "v", qty: 1 },
        { productId: "a", variantId: "v", qty: 0 },
      ],
      couponCode: null,
      destination: "outside-pune",
      now: NOW,
      lookup,
    });
    expect(t.subtotalPaise).toBe(0);
    expect(t.totalPaise).toBe(0);
  });
});
