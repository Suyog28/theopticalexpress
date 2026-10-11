import { products as allProducts } from "@/data/products";
import type {
  CategorySlug,
  ColourKey,
  FrameShape,
  Product,
  ProductVariant,
  StockStatus,
} from "@/types/product";

export const LOW_STOCK_THRESHOLD = 3;

export function activeProducts(list: Product[] = allProducts): Product[] {
  return list.filter((p) => p.isActive);
}

export function getProductBySlug(slug: string): Product | undefined {
  return activeProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stockQty, 0);
}

export function stockStatusOf(qty: number): StockStatus {
  if (qty <= 0) return "out-of-stock";
  if (qty <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function productStockStatus(product: Product): StockStatus {
  return stockStatusOf(totalStock(product));
}

/** First variant with stock, else the first variant. */
export function defaultVariant(product: Product): ProductVariant {
  const first = product.variants[0];
  if (!first) throw new Error(`Product ${product.id} has no variants`);
  return product.variants.find((v) => v.stockQty > 0) ?? first;
}

export function inCollection(product: Product, slug: CategorySlug): boolean {
  return product.department === slug || product.collections.includes(slug);
}

export function productColours(product: Product): ColourKey[] {
  return product.variants.map((v) => v.colour);
}

// ─── Filtering & sorting ────────────────────────────────────────────────────

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "popular";
export const SORT_KEYS: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "popular"];

export interface CatalogFilters {
  q?: string;
  category?: CategorySlug;
  minPricePaise?: number;
  maxPricePaise?: number;
  brands?: string[];
  shapes?: FrameShape[];
  colours?: ColourKey[];
  newOnly?: boolean;
  offersOnly?: boolean;
}

/** Lower-case, strip accents/diacritics for forgiving search. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function matchesQuery(product: Product, q: string): boolean {
  const terms = normalizeSearch(q).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalizeSearch(
    [
      product.name,
      product.brand,
      product.shape,
      product.material,
      product.department,
      ...product.collections,
      ...product.variants.map((v) => v.colour),
      product.shortDescription.en,
    ].join(" "),
  );
  return terms.every((t) => haystack.includes(t));
}

export function filterProducts(list: Product[], f: CatalogFilters): Product[] {
  return list.filter((p) => {
    if (!p.isActive) return false;
    if (f.category && !inCollection(p, f.category)) return false;
    if (f.q && !matchesQuery(p, f.q)) return false;
    if (f.minPricePaise !== undefined && p.pricePaise < f.minPricePaise) return false;
    if (f.maxPricePaise !== undefined && p.pricePaise > f.maxPricePaise) return false;
    if (f.brands?.length && !f.brands.includes(p.brand)) return false;
    if (f.shapes?.length && !f.shapes.includes(p.shape)) return false;
    if (f.colours?.length && !p.variants.some((v) => f.colours!.includes(v.colour))) return false;
    if (f.newOnly && !p.isNewArrival) return false;
    if (f.offersOnly && !(p.originalPricePaise && p.originalPricePaise > p.pricePaise))
      return false;
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  const byNewest = (a: Product, b: Product) => b.createdAt.localeCompare(a.createdAt);
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.pricePaise - b.pricePaise || a.name.localeCompare(b.name));
    case "price-desc":
      return sorted.sort((a, b) => b.pricePaise - a.pricePaise || a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort(byNewest);
    case "popular":
      return sorted.sort((a, b) => b.popularity - a.popularity);
    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.popularity - a.popularity,
      );
  }
}

/** Facet values present in a product list, for building filter controls. */
export function facets(list: Product[]) {
  const brands = [...new Set(list.map((p) => p.brand))].sort();
  const shapes = [...new Set(list.map((p) => p.shape))].sort() as FrameShape[];
  const colours = [
    ...new Set(list.flatMap((p) => p.variants.map((v) => v.colour))),
  ].sort() as ColourKey[];
  const prices = list.map((p) => p.pricePaise);
  return {
    brands,
    shapes,
    colours,
    minPricePaise: prices.length ? Math.min(...prices) : 0,
    maxPricePaise: prices.length ? Math.max(...prices) : 0,
  };
}

export const PRICE_BANDS: { id: string; min?: number; max?: number }[] = [
  { id: "under-1500", max: 149999 },
  { id: "1500-2500", min: 150000, max: 249999 },
  { id: "2500-4000", min: 250000, max: 399999 },
  { id: "4000-plus", min: 400000 },
];

export function relatedProducts(product: Product, limit = 4): Product[] {
  return sortProducts(
    activeProducts().filter((p) => p.id !== product.id && p.department === product.department),
    "popular",
  ).slice(0, limit);
}

export function featuredProducts(limit = 8): Product[] {
  return sortProducts(
    activeProducts().filter((p) => p.isFeatured),
    "popular",
  ).slice(0, limit);
}

export function newArrivals(limit?: number): Product[] {
  const list = sortProducts(
    activeProducts().filter((p) => p.isNewArrival),
    "newest",
  );
  return limit ? list.slice(0, limit) : list;
}
