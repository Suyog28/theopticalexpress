/**
 * Payment-provider abstraction.
 *
 * Phase 1 uses DemoPaymentProvider only — it never touches the network and never charges anyone.
 *
 * Phase 2 (e.g. Razorpay) MUST run server-side:
 *  1. The server recomputes the amount from its own catalogue + coupon rules (never trust the client).
 *  2. The server creates the gateway order using secret keys held in server env vars (never NEXT_PUBLIC_).
 *  3. Payment success is confirmed by verifying the gateway signature/webhook on the server
 *     before the order is marked paid and stock is decremented.
 */
import type { OrderTotals } from "@/types/order";

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export interface CreatePaymentResult {
  /** Gateway order id (Phase 2) or a demo reference. */
  providerOrderId: string;
  amountPaise: number;
  currency: "INR";
}

export interface PaymentProvider {
  readonly id: string;
  readonly isLive: boolean;
  createPayment(totals: OrderTotals, method: PaymentMethod): Promise<CreatePaymentResult>;
}

/** Generates a clearly-marked demo reference. Nothing is submitted anywhere. */
export function demoReference(now: Date = new Date(), random: () => number = Math.random): string {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = Math.floor(random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `DEMO-${stamp}-${suffix}`;
}

export const demoPaymentProvider: PaymentProvider = {
  id: "demo",
  isLive: false,
  async createPayment(totals) {
    return { providerOrderId: demoReference(), amountPaise: totals.totalPaise, currency: "INR" };
  },
};
