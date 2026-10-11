"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useT } from "@/i18n/client";
import { dynamicKey } from "@/i18n/messages";
import {
  PRICE_BANDS,
  SORT_KEYS,
  activeProducts,
  facets,
  filterProducts,
  sortProducts,
  type CatalogFilters,
  type SortKey,
} from "@/lib/catalog";
import {
  activeFilterCount,
  parseListingParams,
  serializeListingState,
  toCatalogFilters,
  type ListingState,
} from "@/lib/listing-params";
import { categories } from "@/data/categories";
import { ProductGrid } from "./product-grid";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { swatch } from "./product-card";
import { cn } from "@/lib/utils";
import type { ColourKey, FrameShape } from "@/types/product";

export interface ListingPreset {
  category?: CatalogFilters["category"];
  newOnly?: boolean;
  offersOnly?: boolean;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ProductListing({
  preset = {},
  showCategoryFilter = false,
}: {
  preset?: ListingPreset;
  showCategoryFilter?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Local state updates instantly; the URL follows (shareable, survives language switch).
  const urlKey = searchParams.toString();
  const [state, setState] = useState(() => parseListingParams(new URLSearchParams(urlKey)));
  // Re-sync only when the URL itself changes (back/forward, header search, language switch).
  const [seenKey, setSeenKey] = useState(urlKey);
  if (urlKey !== seenKey) {
    setSeenKey(urlKey);
    setState(parseListingParams(new URLSearchParams(urlKey)));
  }

  // Facets come from the preset scope (e.g. only sunglasses on the sunglasses page).
  const scope = useMemo(() => filterProducts(activeProducts(), preset), [preset]);
  const available = useMemo(() => facets(scope), [scope]);
  const results = useMemo(
    () => sortProducts(filterProducts(scope, toCatalogFilters(state, preset)), state.sort),
    [scope, state, preset],
  );

  function update(next: Partial<ListingState>) {
    const merged = { ...state, ...next };
    const qs = serializeListingState(merged);
    setState(merged);
    router.replace(`${pathname}${qs}`, { scroll: false });
  }
  function clearAll() {
    update({ price: null, brands: [], shapes: [], colours: [], category: null });
  }

  const activeCount = activeFilterCount(state);
  const countLabel =
    results.length === 1
      ? t("listing.resultsOne")
      : t("listing.results", { count: results.length });

  const chips: { label: string; remove: () => void }[] = [
    ...(state.category
      ? [
          {
            label: t(dynamicKey(`categories.${state.category}.name`)),
            remove: () => update({ category: null }),
          },
        ]
      : []),
    ...(state.price
      ? [
          {
            label: t(dynamicKey(`listing.priceBand.${state.price}`)),
            remove: () => update({ price: null }),
          },
        ]
      : []),
    ...state.brands.map((b) => ({
      label: b,
      remove: () => update({ brands: state.brands.filter((x) => x !== b) }),
    })),
    ...state.shapes.map((s) => ({
      label: t(dynamicKey(`attributes.shape.${s}`)),
      remove: () => update({ shapes: state.shapes.filter((x) => x !== s) }),
    })),
    ...state.colours.map((c) => ({
      label: t(dynamicKey(`attributes.colour.${c}`)),
      remove: () => update({ colours: state.colours.filter((x) => x !== c) }),
    })),
  ];

  const panel = (
    <FilterPanel
      state={state}
      available={available}
      showCategoryFilter={showCategoryFilter}
      onChange={update}
      idPrefix={drawerOpen ? "m" : "d"}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <aside aria-label={t("listing.filters")} className="hidden lg:block">
        <div className="sticky top-36">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-ink text-sm font-semibold tracking-wide uppercase">
              {t("listing.filters")}
            </h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-muted hover:text-navy text-xs underline underline-offset-4"
              >
                {t("listing.clearAll")}
              </button>
            )}
          </div>
          {!drawerOpen && panel}
        </div>
      </aside>

      <div>
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <p className="text-muted text-sm" aria-live="polite">
            {countLabel}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              {t("listing.filters")}
              {activeCount > 0 && (
                <span className="bg-navy ml-0.5 rounded-full px-1.5 text-[0.6875rem] text-white">
                  {activeCount}
                </span>
              )}
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted hidden sm:inline">{t("listing.sortBy")}</span>
              <span className="sr-only sm:hidden">{t("listing.sortBy")}</span>
              <select
                value={state.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className="border-line-strong text-ink focus:border-secondary focus:ring-secondary/20 h-9 cursor-pointer rounded-sm border bg-white px-2.5 pr-8 text-sm font-medium focus:ring-2 focus:outline-none"
              >
                {SORT_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {t(dynamicKey(`listing.sort.${k}`))}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2 pt-4"
            aria-label={t("listing.activeFilters")}
          >
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={c.remove}
                aria-label={t("listing.removeFilter", { label: c.label })}
                className="border-line-strong text-ink hover:border-navy inline-flex h-8 items-center gap-1.5 rounded-sm border bg-white pr-2 pl-3 text-xs font-medium"
              >
                {c.label}
                <X className="text-muted h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-muted hover:text-navy ml-1 text-xs underline underline-offset-4"
            >
              {t("listing.clearAll")}
            </button>
          </div>
        )}

        <div className="pt-8">
          {results.length > 0 ? (
            <ProductGrid products={results} priorityCount={4} className="xl:grid-cols-3" />
          ) : (
            <EmptyState
              title={t("listing.emptyTitle")}
              text={t("listing.emptyText")}
              action={
                <Button
                  variant="secondary"
                  onClick={() =>
                    update({
                      q: "",
                      price: null,
                      brands: [],
                      shapes: [],
                      colours: [],
                      category: null,
                    })
                  }
                >
                  {t("listing.clearAll")}
                </Button>
              }
            />
          )}
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t("listing.filters")}
        side="right"
        closeLabel={t("common.close")}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={clearAll}
              disabled={activeCount === 0}
            >
              {t("listing.clearAll")}
            </Button>
            <Button className="flex-1" onClick={() => setDrawerOpen(false)}>
              {t("listing.apply", { count: results.length })}
            </Button>
          </div>
        }
      >
        <div className="px-5 py-2">{drawerOpen && panel}</div>
      </Drawer>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-line border-b py-5 last:border-b-0">
      {/* Floated legend sits inside the fieldset box, giving predictable spacing. */}
      <legend className="text-ink float-left mb-3 w-full text-[0.8125rem] font-semibold">
        {title}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

const checkbox =
  "h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-xs border border-line-strong bg-white checked:border-navy checked:bg-navy checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 8.5l2.5 2.5L12 5.5%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22/></svg>')] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";
const radio =
  "h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-line-strong bg-white checked:border-[5px] checked:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary";

function FilterPanel({
  state,
  available,
  showCategoryFilter,
  onChange,
  idPrefix,
}: {
  state: ListingState;
  available: ReturnType<typeof facets>;
  showCategoryFilter: boolean;
  onChange: (next: Partial<ListingState>) => void;
  idPrefix: string;
}) {
  const t = useT();
  const row = "flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink";

  return (
    <div>
      {showCategoryFilter && (
        <FilterGroup title={t("listing.category")}>
          <div className="space-y-0.5">
            <label className={row}>
              <input
                type="radio"
                name={`${idPrefix}-category`}
                className={radio}
                checked={!state.category}
                onChange={() => onChange({ category: null })}
              />
              {t("listing.all")}
            </label>
            {categories.map((c) => (
              <label key={c.slug} className={row}>
                <input
                  type="radio"
                  name={`${idPrefix}-category`}
                  className={radio}
                  checked={state.category === c.slug}
                  onChange={() => onChange({ category: c.slug })}
                />
                {t(dynamicKey(`categories.${c.slug}.name`))}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title={t("listing.price")}>
        <div className="space-y-0.5">
          <label className={row}>
            <input
              type="radio"
              name={`${idPrefix}-price`}
              className={radio}
              checked={!state.price}
              onChange={() => onChange({ price: null })}
            />
            {t("listing.all")}
          </label>
          {PRICE_BANDS.map((b) => (
            <label key={b.id} className={row}>
              <input
                type="radio"
                name={`${idPrefix}-price`}
                className={radio}
                checked={state.price === b.id}
                onChange={() => onChange({ price: b.id })}
              />
              {t(dynamicKey(`listing.priceBand.${b.id}`))}
            </label>
          ))}
        </div>
      </FilterGroup>

      {available.brands.length > 1 && (
        <FilterGroup title={t("listing.brand")}>
          <div className="space-y-0.5">
            {available.brands.map((b) => (
              <label key={b} className={row}>
                <input
                  type="checkbox"
                  className={checkbox}
                  checked={state.brands.includes(b)}
                  onChange={() => onChange({ brands: toggle(state.brands, b) })}
                />
                {b}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title={t("listing.shape")}>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 lg:grid-cols-1">
          {available.shapes.map((s: FrameShape) => (
            <label key={s} className={row}>
              <input
                type="checkbox"
                className={checkbox}
                checked={state.shapes.includes(s)}
                onChange={() => onChange({ shapes: toggle(state.shapes, s) })}
              />
              {t(dynamicKey(`attributes.shape.${s}`))}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t("listing.colour")}>
        <div className="flex flex-wrap gap-2">
          {available.colours.map((c: ColourKey) => {
            const selected = state.colours.includes(c);
            const label = t(dynamicKey(`attributes.colour.${c}`));
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ colours: toggle(state.colours, c) })}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-sm border bg-white pr-2.5 pl-2 text-xs transition-colors",
                  selected
                    ? "border-navy text-navy"
                    : "border-line text-muted hover:border-navy/40",
                )}
              >
                <span
                  className={cn("h-3.5 w-3.5 rounded-full ring-1 ring-black/10", swatch[c])}
                  aria-hidden="true"
                />
                {label}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}
