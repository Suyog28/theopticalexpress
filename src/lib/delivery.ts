import { siteConfig } from "@/config/site";
import type { DeliveryDestination } from "@/types/order";

export type DeliveryConfig = typeof siteConfig.delivery;

export interface DeliveryQuote {
  feePaise: number;
  isFree: boolean;
  /** How much more is needed for free delivery (0 when already free or not applicable). */
  gapToFreePaise: number;
  /** The amount that was compared with the threshold. */
  basisPaise: number;
}

/**
 * Delivery rules:
 *  - Within Pune: always free.
 *  - Outside Pune: free when the basis amount ≥ threshold, otherwise the courier fee.
 * The basis is the merchandise subtotal or the post-discount amount, per config.
 */
export function calcDelivery(
  destination: DeliveryDestination,
  subtotalPaise: number,
  discountPaise: number,
  config: DeliveryConfig = siteConfig.delivery,
): DeliveryQuote {
  const basisPaise =
    config.thresholdBasis === "after-discount"
      ? Math.max(0, subtotalPaise - discountPaise)
      : subtotalPaise;

  if (subtotalPaise === 0) {
    return { feePaise: 0, isFree: true, gapToFreePaise: 0, basisPaise };
  }
  if (destination === "pune") {
    return {
      feePaise: config.puneFeePaise,
      isFree: config.puneFeePaise === 0,
      gapToFreePaise: 0,
      basisPaise,
    };
  }
  if (basisPaise >= config.freeThresholdPaise) {
    return { feePaise: 0, isFree: true, gapToFreePaise: 0, basisPaise };
  }
  return {
    feePaise: config.outsidePuneFeePaise,
    isFree: false,
    gapToFreePaise: config.freeThresholdPaise - basisPaise,
    basisPaise,
  };
}
