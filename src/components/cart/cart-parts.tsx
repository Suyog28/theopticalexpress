"use client";

import { useState, type FormEvent } from "react";
import { Building2, MapPin, Tag, Trash2, X } from "lucide-react";
import { useLocale, useT, LocaleLink } from "@/i18n/client";
import { dynamicKey, type Translate } from "@/i18n/messages";
import type { CouponRejection } from "@/types/coupon";
import type { DeliveryDestination, OrderTotals, PricedLine } from "@/types/order";
import { getProductById, getVariant } from "@/lib/catalog";
import { validateCoupon } from "@/lib/coupons";
import { formatINR } from "@/lib/currency";
import { siteConfig } from "@/config/site";
import { maxQtyFor, useCart } from "@/stores/cart-store";
import { SmartImage } from "@/components/ui/smart-image";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/products/product-purchase";
import { cn } from "@/lib/utils";

export function couponErrorMessage(
  t: Translate,
  reason: CouponRejection,
  minSubtotalPaise?: number,
): string {
  if (reason === "min-not-met") {
    return t("coupon.min-not-met", { amount: formatINR(minSubtotalPaise ?? 0) });
  }
  return t(dynamicKey(`coupon.${reason}`));
}

// ─── Line item ────────────────────────────────────────────────────────────────
export function CartLineItem({ line, compact = false }: { line: PricedLine; compact?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const product = getProductById(line.productId);
  if (!product) return null;
  const variant = getVariant(product, line.variantId);
  const image = product.images[0];
  const colour = variant ? t(dynamicKey(`attributes.colour.${variant.colour}`)) : "";

  return (
    <li className={cn("flex gap-4", compact ? "py-3" : "py-6")}>
      <LocaleLink
        href={`/product/${product.slug}`}
        className={cn(
          "bg-ivory-deep relative shrink-0 overflow-hidden rounded-sm",
          compact ? "h-20 w-16" : "h-32 w-26 sm:h-36 sm:w-28",
        )}
      >
        {image && (
          <SmartImage
            src={image.src}
            alt={image.alt[locale]}
            fill
            sizes="112px"
            className="object-cover"
          />
        )}
        {compact && (
          <span className="bg-navy absolute -top-0 -right-0 flex h-5 min-w-5 items-center justify-center rounded-bl-sm px-1 text-[0.6875rem] font-semibold text-white">
            {line.qty}
          </span>
        )}
      </LocaleLink>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted text-[0.6875rem] tracking-[0.12em] uppercase">
              {product.brand} · {t("common.sample")}
            </p>
            <LocaleLink
              href={`/product/${product.slug}`}
              className="text-ink mt-0.5 block font-medium hover:underline"
            >
              {product.name}
            </LocaleLink>
            <p className="text-muted mt-0.5 text-sm">{t("cart.colour", { colour })}</p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatINR(line.lineTotalPaise)}</p>
        </div>
        {!compact && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <QuantityStepper
              size="sm"
              value={line.qty}
              max={maxQtyFor(line.productId, line.variantId)}
              onChange={(v) => setQty(line.productId, line.variantId, v)}
              label={t("product.quantity")}
            />
            <div className="flex items-center gap-3">
              {line.qty > 1 && (
                <span className="text-muted hidden text-xs sm:inline">
                  {t("cart.each", { price: formatINR(line.unitPricePaise) })}
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(line.productId, line.variantId)}
                className="text-muted hover:text-error inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
                aria-label={t("cart.removeItem", { name: product.name })}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t("cart.remove")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

// ─── Destination ───────────────────────────────────────────────────────────────
export function DestinationToggle({ name = "destination" }: { name?: string }) {
  const t = useT();
  const destination = useCart((s) => s.destination);
  const setDestination = useCart((s) => s.setDestination);
  const options: { value: DeliveryDestination; label: string; icon: typeof MapPin }[] = [
    { value: "pune", label: t("cart.pune"), icon: MapPin },
    { value: "outside-pune", label: t("cart.outsidePune"), icon: Building2 },
  ];
  return (
    <fieldset>
      <legend className="text-ink mb-2.5 text-sm font-medium">{t("cart.destination")}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            className={cn(
              "has-[:focus-visible]:outline-secondary flex h-12 cursor-pointer items-center justify-center gap-2 rounded-sm border text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
              destination === value
                ? "border-navy bg-navy text-white"
                : "border-line-strong text-ink hover:border-navy/50 bg-white",
            )}
          >
            <input
              type="radio"
              name={name}
              value={value}
              checked={destination === value}
              onChange={() => setDestination(value)}
              className="sr-only"
            />
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// ─── Coupon ─────────────────────────────────────────────────────────────────────
export function CouponForm({ totals }: { totals: OrderTotals }) {
  const t = useT();
  const stored = useCart((s) => s.couponCode);
  const apply = useCart((s) => s.applyCoupon);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    setInfo(null);
    if (!code.trim()) {
      setError(t("coupon.empty"));
      return;
    }
    const result = validateCoupon(code, totals.subtotalPaise);
    if (!result.ok) {
      setError(couponErrorMessage(t, result.reason, result.minSubtotalPaise));
      return;
    }
    if (stored && stored !== result.coupon.code) {
      setInfo(t("coupon.replaced", { old: stored, code: result.coupon.code }));
    }
    apply(result.coupon.code);
    setError(null);
    setCode("");
  }

  const applied = totals.couponCode;
  const dropped = stored && !applied && totals.couponRejection;

  return (
    <div>
      <form onSubmit={submit} noValidate>
        <label
          htmlFor="coupon"
          className="text-ink mb-2 flex items-center gap-1.5 text-sm font-medium"
        >
          <Tag className="h-3.5 w-3.5" aria-hidden="true" /> {t("coupon.label")}
        </label>
        <div className="flex gap-2">
          <input
            id="coupon"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder={t("coupon.placeholder")}
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? "coupon-error" : undefined}
            className="border-line-strong focus:border-secondary focus:ring-secondary/20 aria-[invalid=true]:border-error h-11 min-w-0 flex-1 rounded-sm border bg-white px-3 font-mono text-sm tracking-wider uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case focus:ring-2 focus:outline-none"
          />
          <Button type="submit" variant="secondary" className="h-11">
            {t("coupon.apply")}
          </Button>
        </div>
      </form>
      {error && (
        <p id="coupon-error" role="alert" className="text-error mt-2 text-xs font-medium">
          {error}
        </p>
      )}
      {info && (
        <p role="status" className="text-muted mt-2 text-xs">
          {info}
        </p>
      )}
      {applied && (
        <div
          role="status"
          className="bg-success-bg text-success mt-3 flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-xs"
        >
          <span>
            {t("coupon.applied", { code: applied, amount: formatINR(totals.discountPaise) })}
          </span>
          <button
            type="button"
            onClick={removeCoupon}
            className="hover:bg-success/10 rounded-sm p-1"
            aria-label={t("coupon.remove")}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
      {dropped && (
        <div
          role="status"
          className="bg-warning-bg text-warning mt-3 flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-xs"
        >
          <span>
            {t("coupon.dropped", {
              code: stored,
              reason: couponErrorMessage(t, totals.couponRejection!, couponMin(stored)),
            })}
          </span>
          <button
            type="button"
            onClick={removeCoupon}
            className="hover:bg-warning/10 rounded-sm p-1"
            aria-label={t("coupon.remove")}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
      <p className="text-muted mt-2 text-[0.6875rem]">{t("coupon.demoNote")}</p>
    </div>
  );
}

function couponMin(code: string): number | undefined {
  const r = validateCoupon(code, 0);
  return !r.ok ? r.minSubtotalPaise : undefined;
}

// ─── Summary ────────────────────────────────────────────────────────────────────
export function OrderSummary({
  totals,
  children,
}: {
  totals: OrderTotals;
  children?: React.ReactNode;
}) {
  const t = useT();
  const destination = useCart((s) => s.destination);
  const d = siteConfig.delivery;
  const row = "flex items-baseline justify-between gap-4 text-sm";

  return (
    <div>
      <dl className="space-y-3">
        <div className={row}>
          <dt className="text-muted">
            {t("cart.subtotal")}{" "}
            <span className="text-xs">
              (
              {totals.itemCount === 1
                ? t("cart.itemsOne")
                : t("cart.items", { count: totals.itemCount })}
              )
            </span>
          </dt>
          <dd className="tabular-nums">{formatINR(totals.subtotalPaise)}</dd>
        </div>
        {totals.discountPaise > 0 && (
          <div className={row}>
            <dt className="text-muted">
              {t("cart.discount")} <span className="font-mono text-xs">({totals.couponCode})</span>
            </dt>
            <dd className="text-success tabular-nums">−{formatINR(totals.discountPaise)}</dd>
          </div>
        )}
        <div className={row}>
          <dt className="text-muted">
            {t("cart.delivery")}{" "}
            <span className="text-xs">
              ({destination === "pune" ? t("cart.pune") : t("cart.outsidePune")})
            </span>
          </dt>
          <dd className="tabular-nums">
            {totals.deliveryIsFree ? (
              <span className="text-success font-medium">{t("cart.free")}</span>
            ) : (
              formatINR(totals.deliveryPaise)
            )}
          </dd>
        </div>
        <div className="border-line flex items-baseline justify-between gap-4 border-t pt-4">
          <dt className="text-ink font-semibold">{t("cart.total")}</dt>
          <dd className="font-display text-ink text-2xl tabular-nums">
            {formatINR(totals.totalPaise)}
          </dd>
        </div>
      </dl>

      <div className="text-muted mt-4 space-y-1.5 text-xs leading-relaxed">
        {destination === "pune" && <p>{t("cart.puneNote")}</p>}
        {destination === "outside-pune" && totals.freeDeliveryGapPaise > 0 && (
          <div>
            <p className="text-ink font-medium">
              {t("cart.freeGap", { amount: formatINR(totals.freeDeliveryGapPaise) })}
            </p>
            <div className="bg-line mt-2 h-1.5 overflow-hidden rounded-full" aria-hidden="true">
              <div
                className="bg-secondary h-full rounded-full transition-[width] duration-500"
                style={{
                  width: `${Math.min(100, (100 * (d.freeThresholdPaise - totals.freeDeliveryGapPaise)) / d.freeThresholdPaise)}%`,
                }}
              />
            </div>
          </div>
        )}
        {destination === "outside-pune" &&
          totals.freeDeliveryGapPaise === 0 &&
          totals.subtotalPaise > 0 && <p className="text-success">{t("cart.freeReached")}</p>}
        {destination === "outside-pune" && d.courierFeeIsIllustrative && (
          <p className="italic">
            {t("cart.courierIllustrative", { fee: formatINR(d.outsidePuneFeePaise) })}
          </p>
        )}
        {destination === "outside-pune" && d.thresholdBasis === "merchandise-subtotal" && (
          <p>{t("cart.thresholdBasis")}</p>
        )}
      </div>
      {children}
    </div>
  );
}
