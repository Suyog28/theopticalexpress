"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine, DeliveryDestination } from "@/types/order";
import { getProductById, getVariant } from "@/lib/catalog";
import { siteConfig } from "@/config/site";

/**
 * Demo cart, persisted to localStorage. Only ids and quantities are stored —
 * prices are always re-derived from the catalogue (see lib/pricing.ts).
 */
interface CartState {
  lines: CartLine[];
  couponCode: string | null;
  destination: DeliveryDestination;
  add: (productId: string, variantId: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  remove: (productId: string, variantId: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  setDestination: (d: DeliveryDestination) => void;
}

/** Clamp to 1…available stock (max 10 per line in the demo). */
export function maxQtyFor(productId: string, variantId: string): number {
  const product = getProductById(productId);
  const variant = product && getVariant(product, variantId);
  return Math.min(10, variant?.stockQty ?? 0);
}

const same = (l: CartLine, productId: string, variantId: string) =>
  l.productId === productId && l.variantId === variantId;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      couponCode: null,
      destination: siteConfig.delivery.defaultDestination,
      add: (productId, variantId, qty = 1) =>
        set((s) => {
          const max = maxQtyFor(productId, variantId);
          if (max <= 0) return s;
          const existing = s.lines.find((l) => same(l, productId, variantId));
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                same(l, productId, variantId) ? { ...l, qty: Math.min(max, l.qty + qty) } : l,
              ),
            };
          }
          return { lines: [...s.lines, { productId, variantId, qty: Math.min(max, qty) }] };
        }),
      setQty: (productId, variantId, qty) =>
        set((s) => {
          const max = maxQtyFor(productId, variantId);
          const next = Math.max(1, Math.min(max, Math.floor(qty)));
          return {
            lines: s.lines.map((l) => (same(l, productId, variantId) ? { ...l, qty: next } : l)),
          };
        }),
      remove: (productId, variantId) =>
        set((s) => ({ lines: s.lines.filter((l) => !same(l, productId, variantId)) })),
      clear: () => set({ lines: [], couponCode: null }),
      applyCoupon: (code) => set({ couponCode: code.trim().toUpperCase() }),
      removeCoupon: () => set({ couponCode: null }),
      setDestination: (destination) => set({ destination }),
    }),
    {
      name: "visionco-cart-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Drop lines for products that no longer exist (catalogue changes between visits).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CartState>;
        const lines = (p.lines ?? []).filter((l) => {
          const product = getProductById(l.productId);
          return !!product && product.isActive && !!getVariant(product, l.variantId);
        });
        return {
          ...current,
          ...p,
          lines,
          destination: p.destination === "outside-pune" ? "outside-pune" : "pune",
        };
      },
    },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}
