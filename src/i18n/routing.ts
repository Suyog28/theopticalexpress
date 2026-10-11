import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/types/i18n";

export { LOCALES, DEFAULT_LOCALE, isLocale };
export type { Locale };

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_LABELS: Record<Locale, { native: string; english: string; htmlLang: string }> =
  {
    en: { native: "English", english: "English", htmlLang: "en-IN" },
    mr: { native: "मराठी", english: "Marathi", htmlLang: "mr-IN" },
    hi: { native: "हिन्दी", english: "Hindi", htmlLang: "hi-IN" },
  };

/** Prefix an app path ("/shop") with a locale ("/mr/shop"). */
export function localePath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Remove the locale prefix from a pathname: "/mr/shop" → "/shop". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  if (parts[1] && isLocale(parts[1])) {
    const rest = `/${parts.slice(2).join("/")}`;
    return rest === "/" ? "/" : rest.replace(/\/$/, "");
  }
  return pathname;
}

/** Pick the best supported locale from an Accept-Language header. */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.toLowerCase().split("-")[0] ?? "", q: q ? Number(q.split("=")[1]) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) if (isLocale(lang)) return lang;
  return DEFAULT_LOCALE;
}
