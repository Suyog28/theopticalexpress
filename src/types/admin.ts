/**
 * Phase 2 admin domain models. Nothing in the Phase 1 demo reads or writes these;
 * they document the shapes a future database/API must support.
 * Admin features MUST sit behind server-side authentication and role-based authorization.
 */

export type StockAdjustmentReason =
  "restock" | "sale" | "cancellation" | "return" | "damage" | "correction";

export interface StockAdjustment {
  id: string;
  productId: string;
  variantId: string;
  delta: number;
  reason: StockAdjustmentReason;
  orderId?: string;
  note?: string;
  createdAt: string;
  createdBy: string;
}

export interface Banner {
  id: string;
  placement: "hero" | "promo" | "announcement";
  image?: string;
  /** Translation-keyed or per-locale content. */
  content: Record<string, string>;
  href?: string;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}

export interface Shipment {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: "label-created" | "in-transit" | "delivered" | "returned";
  updatedAt: string;
}

export type AdminRole = "owner" | "store-manager" | "staff";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  /** Store slugs the user may manage. */
  stores: string[];
}
