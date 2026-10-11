import type { CartLine, DeliveryDestination, OrderTotals, PricedLine } from "@/types/order";
import type { Product } from "@/types/product";
import { getProductById } from "./catalog";
import { validateCoupon } from "./coupons";
import { calcDelivery, type DeliveryConfig } from "./delivery";
import { siteConfig } from "@/config/site";

export interface TotalsInput {
  lines: CartLine[];
  couponCode: string | null;
  destination: DeliveryDestination;
  now?: Date;
  lookup?: (id: string) => Product | undefined;
  deliveryConfig?: DeliveryConfig;
}

/**
 * Compute order totals from cart lines. Prices are always looked up from the catalogue,
 * never trusted from client state — the same rule the Phase 2 server must apply.
 * An applied coupon is re-validated every time; if it no longer qualifies it is dropped
 * and `couponRejection` explains why.
 */
export function calcOrderTotals({
  lines,
  couponCode,
  destination,
  now = new Date(),
  lookup = getProductById,
  deliveryConfig = siteConfig.delivery,
}: TotalsInput): OrderTotals {
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = lookup(line.productId);
    if (!product || !product.isActive || line.qty <= 0) continue;
    const unitPricePaise = product.pricePaise;
    priced.push({ ...line, unitPricePaise, lineTotalPaise: unitPricePaise * line.qty });
  }

  const subtotalPaise = priced.reduce((sum, l) => sum + l.lineTotalPaise, 0);
  const itemCount = priced.reduce((sum, l) => sum + l.qty, 0);

  let discountPaise = 0;
  let appliedCode: string | null = null;
  let couponRejection: OrderTotals["couponRejection"] = null;
  if (couponCode && subtotalPaise > 0) {
    const result = validateCoupon(couponCode, subtotalPaise, now);
    if (result.ok) {
      discountPaise = result.discountPaise;
      appliedCode = result.coupon.code;
    } else {
      couponRejection = result.reason;
    }
  }

  const delivery = calcDelivery(destination, subtotalPaise, discountPaise, deliveryConfig);
  const totalPaise = subtotalPaise - discountPaise + delivery.feePaise;

  return {
    lines: priced,
    itemCount,
    subtotalPaise,
    discountPaise,
    couponCode: appliedCode,
    couponRejection,
    deliveryPaise: delivery.feePaise,
    deliveryIsFree: delivery.isFree,
    freeDeliveryGapPaise: destination === "outside-pune" ? delivery.gapToFreePaise : 0,
    totalPaise,
  };
}
