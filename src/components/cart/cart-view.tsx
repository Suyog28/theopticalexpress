"use client";

import { ArrowRight, Lock } from "lucide-react";
import { LocaleLink, useT } from "@/i18n/client";
import { useHydrated } from "@/hooks/use-hydrated";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartLineItem, CouponForm, DestinationToggle, OrderSummary } from "./cart-parts";
import { useOrderTotals } from "./use-order-totals";

export function CartSkeleton() {
  return (
    <div
      className="grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]"
      aria-hidden="true"
    >
      <div className="space-y-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="bg-ivory-deep h-32 w-26 rounded-sm" />
            <div className="flex-1 space-y-2 pt-2">
              <div className="bg-ivory-deep h-3 w-24 rounded" />
              <div className="bg-ivory-deep h-4 w-48 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-80 rounded-md bg-white" />
    </div>
  );
}

export function CartView() {
  const t = useT();
  const hydrated = useHydrated();
  const totals = useOrderTotals();

  if (!hydrated) return <CartSkeleton />;

  if (totals.lines.length === 0) {
    return (
      <EmptyState
        title={t("cart.emptyTitle")}
        text={t("cart.emptyText")}
        action={
          <LocaleLink href="/shop" className={buttonClasses()}>
            {t("cart.continue")}
          </LocaleLink>
        }
      />
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14">
      <section aria-labelledby="bag-items">
        <h2 id="bag-items" className="sr-only">
          {t("cart.title")}
        </h2>
        <ul className="divide-line border-line divide-y border-y">
          {totals.lines.map((line) => (
            <CartLineItem key={`${line.productId}-${line.variantId}`} line={line} />
          ))}
        </ul>
        <LocaleLink href="/shop" className={buttonClasses({ variant: "link", className: "mt-6" })}>
          {t("cart.continue")}
        </LocaleLink>
      </section>

      <aside
        aria-labelledby="summary-title"
        className="border-line rounded-md border bg-white p-6 lg:sticky lg:top-36"
      >
        <h2 id="summary-title" className="font-display text-ink text-xl">
          {t("cart.summary")}
        </h2>
        <div className="mt-6 space-y-6">
          <DestinationToggle />
          <CouponForm totals={totals} />
          <div className="border-line border-t pt-6">
            <OrderSummary totals={totals} />
          </div>
          <LocaleLink
            href="/checkout"
            className={buttonClasses({ size: "lg", className: "w-full" })}
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            {t("cart.checkout")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LocaleLink>
        </div>
      </aside>
    </div>
  );
}
