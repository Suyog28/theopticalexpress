"use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { LocaleLink, useLocale, useT } from "@/i18n/client";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { WishlistButton } from "./wishlist-button";
import { defaultVariant, productStockStatus } from "@/lib/catalog";
import { discountPercent } from "@/lib/currency";
import { useCart } from "@/stores/cart-store";
import { useToasts } from "@/stores/toast-store";
import { cn } from "@/lib/utils";
import { dynamicKey } from "@/i18n/messages";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const add = useCart((s) => s.add);
  const toast = useToasts((s) => s.show);
  const pct = discountPercent(product.pricePaise, product.originalPricePaise);
  const outOfStock = productStockStatus(product) === "out-of-stock";
  const [first, second] = product.images;
  const href = `/product/${product.slug}`;
  const colours = [...new Set(product.variants.map((v) => v.colour))];

  return (
    <article className="group relative flex flex-col">
      <div className="bg-ivory-deep relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-line transition-shadow duration-500 group-hover:shadow-lift">
        {first && (
          <SmartImage
            src={first.src}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className={cn(
              "object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03]",
              second && "group-hover:opacity-0",
            )}
          />
        )}
        {second && (
          <SmartImage
            src={second.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
          />
        )}

        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {product.isNewArrival && <Badge tone="ivory">{t("product.new")}</Badge>}
          {product.isBestSeller && <Badge tone="navy">{t("product.bestSeller")}</Badge>}
          {pct && <Badge tone="sale">{t("product.off", { percent: pct })}</Badge>}
        </div>

        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute top-2.5 right-2.5 z-10"
        />

        <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden translate-y-2 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <button
            type="button"
            disabled={outOfStock}
            aria-label={outOfStock ? undefined : t("product.quickAdd", { name: product.name })}
            onClick={() => {
              add(product.id, defaultVariant(product).id);
              toast(t("product.addedToCart"), { label: t("product.viewBag"), href: "/cart" });
            }}
            className="text-navy shadow-soft hover:bg-teal-deep flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white/95 text-sm font-medium backdrop-blur-sm hover:text-white disabled:opacity-60"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {outOfStock ? t("product.outOfStock") : t("product.addToCart")}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="text-muted text-[0.6875rem] font-medium tracking-[0.12em] uppercase">
          {product.brand} · {t("common.sample")}
        </p>
        <h3 className="text-ink mt-1 text-[0.9375rem] leading-snug font-medium">
          <LocaleLink
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {product.name}
          </LocaleLink>
        </h3>
        <p className="text-muted mt-0.5 line-clamp-1 text-[0.8125rem]">
          {t(dynamicKey(`attributes.shape.${product.shape}`))} ·{" "}
          {t(dynamicKey(`attributes.material.${product.material}`))}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Price
            pricePaise={product.pricePaise}
            originalPricePaise={product.originalPricePaise}
            originalLabel={t("product.originalPrice")}
          />
          <span
            className="flex -space-x-1"
            aria-label={colours.map((c) => t(dynamicKey(`attributes.colour.${c}`))).join(", ")}
          >
            {colours.map((c) => (
              <span
                key={c}
                className={cn("ring-ivory h-3.5 w-3.5 rounded-full ring-2", swatch[c])}
                aria-hidden="true"
              />
            ))}
          </span>
        </div>
        {/* Mobile: always-visible add button (no hover on touch devices) */}
        <button
          type="button"
          disabled={outOfStock}
          aria-label={outOfStock ? undefined : t("product.quickAdd", { name: product.name })}
          onClick={() => {
            add(product.id, defaultVariant(product).id);
            toast(t("product.addedToCart"), { label: t("product.viewBag"), href: "/cart" });
          }}
          className="border-teal-deep/60 text-teal-deep active:bg-teal-deep relative z-10 mt-3 flex h-9 items-center justify-center gap-1.5 rounded-full border text-[0.8125rem] font-medium active:text-white disabled:opacity-50 md:hidden"
          lang={locale}
        >
          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
          {outOfStock ? t("product.outOfStock") : t("product.addToCart")}
        </button>
      </div>
    </article>
  );
}

export const swatch: Record<string, string> = {
  black: "bg-[#1b1b1d]",
  tortoise: "bg-[radial-gradient(circle_at_30%_30%,#c58a4a,#5a2e14_60%,#2a1408)]",
  gold: "bg-[linear-gradient(135deg,#f1d58a,#b8892e)]",
  silver: "bg-[linear-gradient(135deg,#f2f2f2,#a8adb3)]",
  gunmetal: "bg-[linear-gradient(135deg,#7a7f86,#3b3f45)]",
  clear: "bg-[linear-gradient(135deg,#ffffff,#dfe6ec)] ring-inset",
  brown: "bg-[#6b4226]",
  pink: "bg-[#e79bb5]",
  blue: "bg-[#2f5aa0]",
  white: "bg-[#f3eee3]",
};
