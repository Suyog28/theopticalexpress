import type { CouponRejection } from "./coupon";

export type DeliveryDestination = "pune" | "outside-pune";

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
}

export interface PricedLine extends CartLine {
  unitPricePaise: number;
  lineTotalPaise: number;
}

export interface OrderTotals {
  lines: PricedLine[];
  itemCount: number;
  subtotalPaise: number;
  discountPaise: number;
  couponCode: string | null;
  /** Set when a previously applied coupon no longer qualifies. */
  couponRejection: CouponRejection | null;
  deliveryPaise: number;
  deliveryIsFree: boolean;
  /** Amount still needed for free outside-Pune delivery (0 when not applicable). */
  freeDeliveryGapPaise: number;
  totalPaise: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pin: string;
}

export type OrderStatus =
  "pending-payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export type PaymentStatus = "pending" | "authorized" | "captured" | "failed" | "refunded";

/** Phase 2 database shape. In the demo an Order is only ever simulated client-side. */
export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  customer: CustomerDetails;
  destination: DeliveryDestination;
  totals: OrderTotals;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  isDemo: boolean;
}
