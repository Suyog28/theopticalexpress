import { Suspense, type ReactNode } from "react";
import type { Translate } from "@/i18n/messages";
import { ProductListing, type ListingPreset } from "./product-listing";
import { ProductGrid } from "./product-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { activeProducts, filterProducts, sortProducts } from "@/lib/catalog";

/**
 * Shared shell for every product listing (shop, categories, new arrivals, offers, search).
 * The static fallback renders the full preset list so the page is useful (and indexable)
 * before the client-side filters hydrate.
 */
export function ListingPage({
  t,
  title,
  text,
  preset = {},
  showCategoryFilter,
  crumb,
  banner,
  children,
}: {
  t: Translate;
  title: string;
  text?: string;
  preset?: ListingPreset;
  showCategoryFilter?: boolean;
  crumb: string;
  banner?: ReactNode;
  children?: ReactNode;
}) {
  const fallback = sortProducts(filterProducts(activeProducts(), preset), "featured");
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs items={[{ href: "/", label: t("common.home") }, { label: crumb }]} />
      <header className="mt-6 mb-8 max-w-2xl md:mb-10">
        <h1 className="font-display text-headline text-ink">{title}</h1>
        {text && <p className="text-muted mt-3 md:text-lg">{text}</p>}
        <p className="text-muted mt-4 text-xs">{t("common.sampleInventory")}</p>
      </header>
      {banner}
      {children}
      <Suspense fallback={<ProductGrid products={fallback} priorityCount={4} />}>
        <ProductListing preset={preset} showCategoryFilter={showCategoryFilter} />
      </Suspense>
    </div>
  );
}
