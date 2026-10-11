"use client";

import { useState } from "react";
import { Check, Copy, Ticket } from "lucide-react";
import { useT } from "@/i18n/client";
import { featuredCouponCodes } from "@/data/coupons";

const descriptions = { WELCOME10: "coupon.welcome10", FRAME100: "coupon.frame100" } as const;

export function CouponShowcase() {
  const t = useT();
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); the code is visible anyway.
    }
  }

  return (
    <section aria-labelledby="coupon-showcase" className="mb-12">
      <h2
        id="coupon-showcase"
        className="text-ink mb-4 text-sm font-semibold tracking-wide uppercase"
      >
        {t("coupon.offersTitle")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {featuredCouponCodes.map((code) => (
          <li
            key={code}
            className="border-navy/30 flex items-center gap-4 rounded-md border border-dashed bg-white p-5"
          >
            <span className="bg-navy/[0.06] text-navy flex h-11 w-11 shrink-0 items-center justify-center rounded-sm">
              <Ticket className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-navy font-mono text-lg font-semibold tracking-wider">{code}</p>
              <p className="text-muted text-sm">{t(descriptions[code])}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(code)}
              className="border-line-strong text-navy hover:border-navy inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-xs font-medium"
            >
              {copied === code ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copied === code ? t("coupon.copied") : t("coupon.copy")}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-muted mt-3 text-xs">{t("coupon.demoNote")}</p>
    </section>
  );
}
