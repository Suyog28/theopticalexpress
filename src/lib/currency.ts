/**
 * Money is always handled as integer paise (₹1 = 100 paise) to avoid floating-point errors.
 * Convert to rupees only for display.
 */

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Format paise as an INR string, e.g. 249900 → "₹2,499". Uses Indian digit grouping in every locale. */
export function formatINR(paise: number): string {
  assertPaise(paise);
  return formatter.format(paise / 100);
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function assertPaise(value: number): void {
  if (!Number.isInteger(value)) {
    throw new Error(`Expected integer paise, received ${value}`);
  }
}

/** Percentage of `percent` applied to `paise`, rounded down to whole paise. */
export function percentOf(paise: number, percent: number): number {
  return Math.floor((paise * percent) / 100);
}

export function discountPercent(pricePaise: number, originalPricePaise?: number): number | null {
  if (!originalPricePaise || originalPricePaise <= pricePaise) return null;
  return Math.round(((originalPricePaise - pricePaise) / originalPricePaise) * 100);
}
