"use client";

import { useMemo } from "react";
import { useCart } from "@/stores/cart-store";
import { calcOrderTotals } from "@/lib/pricing";

/** Live order totals derived from the persisted cart. Recomputed on any cart change. */
export function useOrderTotals() {
  const lines = useCart((s) => s.lines);
  const couponCode = useCart((s) => s.couponCode);
  const destination = useCart((s) => s.destination);
  return useMemo(
    () => calcOrderTotals({ lines, couponCode, destination }),
    [lines, couponCode, destination],
  );
}
