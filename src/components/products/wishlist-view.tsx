"use client";

import { useWishlist } from "@/stores/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { LocaleLink, useT } from "@/i18n/client";
import { getProductById } from "@/lib/catalog";
import { ProductGrid } from "./product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClasses } from "@/components/ui/button";
import type { Product } from "@/types/product";

export function WishlistView() {
  const t = useT();
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  if (!hydrated)
    return <div className="bg-ivory-deep/50 h-96 animate-pulse rounded-md" aria-hidden="true" />;

  const products = ids.map((id) => getProductById(id)).filter((p): p is Product => !!p);
  if (products.length === 0) {
    return (
      <EmptyState
        title={t("wishlist.emptyTitle")}
        text={t("wishlist.emptyText")}
        action={
          <LocaleLink href="/shop" className={buttonClasses()}>
            {t("wishlist.browse")}
          </LocaleLink>
        }
      />
    );
  }
  return (
    <div>
      <p className="text-muted mb-6 text-sm">{t("wishlist.count", { count: products.length })}</p>
      <ProductGrid products={products} />
    </div>
  );
}
