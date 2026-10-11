"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { useT } from "@/i18n/client";
import { dynamicKey } from "@/i18n/messages";
import { defaultVariant, stockStatusOf } from "@/lib/catalog";
import { useCart } from "@/stores/cart-store";
import { useToasts } from "@/stores/toast-store";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "./wishlist-button";
import { swatch } from "./product-card";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const t = useT();
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div
      className={cn("border-line-strong inline-flex items-center rounded-sm border bg-white", h)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={t("product.decrease")}
        className={cn(
          "text-navy flex items-center justify-center disabled:opacity-30",
          size === "sm" ? "w-8" : "w-11",
        )}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <output
        aria-live="polite"
        className={cn("min-w-8 text-center font-medium tabular-nums", size === "sm" && "text-sm")}
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t("product.increase")}
        className={cn(
          "text-navy flex items-center justify-center disabled:opacity-30",
          size === "sm" ? "w-8" : "w-11",
        )}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ProductPurchase({ product }: { product: Product }) {
  const t = useT();
  const add = useCart((s) => s.add);
  const toast = useToasts((s) => s.show);
  const [variantId, setVariantId] = useState(defaultVariant(product).id);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? defaultVariant(product);
  const status = stockStatusOf(variant.stockQty);
  const max = Math.min(10, variant.stockQty);

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-ink mb-3 text-sm">
          <span className="font-medium">{t("product.colour")}:</span>{" "}
          <span className="text-muted">{t(dynamicKey(`attributes.colour.${variant.colour}`))}</span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {product.variants.map((v) => {
            const selected = v.id === variantId;
            const out = v.stockQty <= 0;
            const label = t(dynamicKey(`attributes.colour.${v.colour}`));
            return (
              <label
                key={v.id}
                className={cn(
                  "has-[:focus-visible]:outline-secondary relative flex h-11 cursor-pointer items-center gap-2 rounded-sm border bg-white pr-3.5 pl-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                  selected
                    ? "border-navy text-navy"
                    : "border-line text-muted hover:border-navy/40",
                  out && "opacity-55",
                )}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={selected}
                  onChange={() => {
                    setVariantId(v.id);
                    setQty(1);
                  }}
                  className="sr-only"
                />
                <span
                  className={cn("h-5 w-5 rounded-full ring-1 ring-black/10", swatch[v.colour])}
                  aria-hidden="true"
                />
                <span className={cn(out && "line-through")}>{label}</span>
                {out && <span className="sr-only">— {t("product.outOfStock")}</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          status === "in-stock" && "text-success",
          status === "low-stock" && "text-warning",
          status === "out-of-stock" && "text-error",
        )}
      >
        <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
        {status === "in-stock" && t("product.inStock")}
        {status === "low-stock" && t("product.lowStock", { count: variant.stockQty })}
        {status === "out-of-stock" && t("product.outOfStock")}
      </p>

      <div className="flex flex-wrap items-stretch gap-3">
        {status !== "out-of-stock" && (
          <QuantityStepper
            value={qty}
            max={max}
            onChange={(v) => setQty(Math.max(1, Math.min(max, v)))}
            label={t("product.quantity")}
          />
        )}
        <Button
          size="lg"
          className="h-12 min-w-48 flex-1"
          disabled={status === "out-of-stock"}
          onClick={() => {
            add(product.id, variant.id, qty);
            toast(t("product.addedToCart"), { label: t("product.viewBag"), href: "/cart" });
          }}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {status === "out-of-stock" ? t("product.outOfStock") : t("product.addToCart")}
        </Button>
        <WishlistButton productId={product.id} productName={product.name} variant="outline" />
      </div>
    </div>
  );
}
