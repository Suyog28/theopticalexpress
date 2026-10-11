import { describe, expect, it } from "vitest";
import { filterProducts, inCollection, matchesQuery, newArrivals, sortProducts } from "./catalog";
import { products } from "@/data/products";

describe("catalogue data integrity", () => {
  it("has 12–16 sample products with unique ids and slugs", () => {
    expect(products.length).toBeGreaterThanOrEqual(12);
    expect(products.length).toBeLessThanOrEqual(16);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });
  it("marks every product as sample data with integer paise prices", () => {
    for (const p of products) {
      expect(p.isSample).toBe(true);
      expect(Number.isInteger(p.pricePaise)).toBe(true);
      if (p.originalPricePaise) expect(p.originalPricePaise).toBeGreaterThan(p.pricePaise);
      expect(p.variants.length).toBeGreaterThan(0);
      expect(p.images.length).toBeGreaterThan(0);
    }
  });
});

describe("filtering", () => {
  it("filters by category including collection tags", () => {
    const premium = filterProducts(products, { category: "premium" });
    expect(premium.length).toBeGreaterThan(0);
    expect(premium.every((p) => inCollection(p, "premium"))).toBe(true);
    const sun = filterProducts(products, { category: "sunglasses" });
    expect(sun.every((p) => p.department === "sunglasses")).toBe(true);
  });
  it("filters by price range (inclusive)", () => {
    const r = filterProducts(products, { minPricePaise: 200000, maxPricePaise: 300000 });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.pricePaise >= 200000 && p.pricePaise <= 300000)).toBe(true);
  });
  it("filters by shape, colour and brand together", () => {
    const r = filterProducts(products, { shapes: ["round"], colours: ["tortoise"] });
    expect(r.map((p) => p.slug)).toEqual(["riva-round-sunglasses"]);
    const b = filterProducts(products, { brands: ["Junior Line"] });
    expect(b.every((p) => p.department === "kids")).toBe(true);
  });
  it("searches case- and accent-insensitively across fields", () => {
    expect(filterProducts(products, { q: "AVIATOR" }).length).toBe(2);
    expect(filterProducts(products, { q: "tortoise cat" }).map((p) => p.slug)).toContain(
      "sienna-cat-eye",
    );
    expect(matchesQuery(products[0]!, "   ")).toBe(true);
    expect(filterProducts(products, { q: "zzzz-not-a-frame" })).toEqual([]);
  });
  it("supports offers-only and new-only filters", () => {
    expect(filterProducts(products, { offersOnly: true }).every((p) => p.originalPricePaise)).toBe(
      true,
    );
    expect(filterProducts(products, { newOnly: true }).every((p) => p.isNewArrival)).toBe(true);
  });
});

describe("sorting", () => {
  it("sorts by price ascending and descending", () => {
    const asc = sortProducts(products, "price-asc").map((p) => p.pricePaise);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const desc = sortProducts(products, "price-desc").map((p) => p.pricePaise);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });
  it("sorts by newest and popularity", () => {
    const newest = sortProducts(products, "newest").map((p) => p.createdAt);
    expect(newest).toEqual([...newest].sort().reverse());
    const pop = sortProducts(products, "popular").map((p) => p.popularity);
    expect(pop).toEqual([...pop].sort((a, b) => b - a));
  });
  it("does not mutate the input", () => {
    const before = products.map((p) => p.id);
    sortProducts(products, "price-desc");
    expect(products.map((p) => p.id)).toEqual(before);
  });
  it("lists only explicitly flagged new arrivals, newest first", () => {
    const list = newArrivals();
    expect(list.every((p) => p.isNewArrival)).toBe(true);
    expect(list[0]!.createdAt >= list[list.length - 1]!.createdAt).toBe(true);
  });
});
