import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import mr from "../../messages/mr.json";
import hi from "../../messages/hi.json";
import { createTranslator, type Messages } from "./messages";
import { negotiateLocale, localePath, stripLocale } from "./routing";

function leaves(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else Object.assign(out, leaves(v, key));
  }
  return out;
}

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const enLeaves = leaves(en);

describe.each([
  ["mr", mr],
  ["hi", hi],
])("%s translations", (_name, dict) => {
  const d = leaves(dict);
  it("has exactly the same keys as English", () => {
    expect(Object.keys(d).sort()).toEqual(Object.keys(enLeaves).sort());
  });
  it("has no empty strings", () => {
    for (const [k, v] of Object.entries(d)) expect(v.trim(), k).not.toBe("");
  });
  it("keeps the same {placeholders} as English", () => {
    for (const [k, v] of Object.entries(enLeaves)) {
      expect(placeholders(d[k] ?? ""), k).toEqual(placeholders(v));
    }
  });
  it("is actually translated (uses Devanagari) for prose strings", () => {
    const devanagari = /[ऀ-ॿ]/;
    const translated = Object.values(d).filter((v) => devanagari.test(v)).length;
    expect(translated / Object.keys(d).length).toBeGreaterThan(0.85);
  });
});

describe("translator", () => {
  it("interpolates variables", () => {
    const t = createTranslator(en as Messages);
    expect(t("product.lowStock", { count: 2 })).toBe("Only 2 left");
  });
  it("falls back to English for a missing key", () => {
    const partial = { ...(mr as Messages), nav: { ...(mr as Messages).nav, home: undefined } };
    const t = createTranslator(partial as unknown as Messages);
    expect(t("nav.home")).toBe("Home");
  });
});

describe("locale routing helpers", () => {
  it("negotiates from Accept-Language", () => {
    expect(negotiateLocale("mr-IN,mr;q=0.9,en;q=0.8")).toBe("mr");
    expect(negotiateLocale("en-US,hi;q=0.9")).toBe("en");
    expect(negotiateLocale("fr-FR,hi;q=0.5")).toBe("hi");
    expect(negotiateLocale(null)).toBe("en");
  });
  it("adds and strips locale prefixes", () => {
    expect(localePath("hi", "/")).toBe("/hi");
    expect(localePath("mr", "/shop")).toBe("/mr/shop");
    expect(stripLocale("/mr/product/x")).toBe("/product/x");
    expect(stripLocale("/en")).toBe("/");
  });
});
