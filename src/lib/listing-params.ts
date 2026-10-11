/**
 * Serialise catalogue filters to/from URL search params so listings are shareable
 * and survive language switches.  e.g. ?q=round&shape=round,oval&colour=gold&price=1500-2500&sort=newest
 */
import { PRICE_BANDS, SORT_KEYS, type CatalogFilters, type SortKey } from "./catalog";
import type { CategorySlug, ColourKey, FrameShape } from "@/types/product";

export interface ListingState {
  q: string;
  sort: SortKey;
  price: string | null;
  brands: string[];
  shapes: FrameShape[];
  colours: ColourKey[];
  category: CategorySlug | null;
}

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function parseListingParams(params: URLSearchParams): ListingState {
  const sort = params.get("sort") as SortKey | null;
  const price = params.get("price");
  return {
    q: params.get("q") ?? "",
    sort: sort && SORT_KEYS.includes(sort) ? sort : "featured",
    price: price && PRICE_BANDS.some((b) => b.id === price) ? price : null,
    brands: list(params.get("brand")),
    shapes: list(params.get("shape")) as FrameShape[],
    colours: list(params.get("colour")) as ColourKey[],
    category: (params.get("category") as CategorySlug | null) || null,
  };
}

export function serializeListingState(state: ListingState): string {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.category) p.set("category", state.category);
  if (state.price) p.set("price", state.price);
  if (state.brands.length) p.set("brand", state.brands.join(","));
  if (state.shapes.length) p.set("shape", state.shapes.join(","));
  if (state.colours.length) p.set("colour", state.colours.join(","));
  if (state.sort !== "featured") p.set("sort", state.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function toCatalogFilters(
  state: ListingState,
  preset: Partial<CatalogFilters> = {},
): CatalogFilters {
  const band = PRICE_BANDS.find((b) => b.id === state.price);
  return {
    ...preset,
    q: state.q || undefined,
    category: preset.category ?? state.category ?? undefined,
    minPricePaise: band?.min,
    maxPricePaise: band?.max,
    brands: state.brands,
    shapes: state.shapes,
    colours: state.colours,
  };
}

export function activeFilterCount(state: ListingState): number {
  return (
    (state.price ? 1 : 0) +
    state.brands.length +
    state.shapes.length +
    state.colours.length +
    (state.category ? 1 : 0)
  );
}
