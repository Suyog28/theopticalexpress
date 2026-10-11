import type { MetadataRoute } from "next";
import { siteConfig, stores } from "@/config/site";
import { categories } from "@/data/categories";
import { activeProducts } from "@/lib/catalog";
import { LOCALES, LOCALE_LABELS, localePath } from "@/i18n/routing";

const STATIC_PATHS = [
  "/",
  "/shop",
  "/new-arrivals",
  "/offers",
  "/appointments",
  "/stores",
  "/reviews",
  "/about",
  "/contact",
  "/policies/shipping",
  "/policies/returns",
  "/policies/privacy",
  "/policies/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...categories.map((c) => `/category/${c.slug}`),
    ...activeProducts().map((p) => `/product/${p.slug}`),
    ...stores.map((s) => `/stores/${s.slug}`),
  ];
  const abs = (p: string) => new URL(p, siteConfig.siteUrl).toString();
  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: abs(localePath(locale, path)),
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, abs(localePath(l, path))]),
        ),
      },
    })),
  );
}
