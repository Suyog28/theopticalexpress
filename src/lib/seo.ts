import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getTranslator, type MessageKey } from "@/i18n/messages";
import { LOCALES, LOCALE_LABELS, localePath, type Locale } from "@/i18n/routing";

/** hreflang alternates for a locale-agnostic path like "/shop". */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: Object.fromEntries([
      ...LOCALES.map((l) => [LOCALE_LABELS[l].htmlLang, localePath(l, path)]),
      ["x-default", localePath("en", path)],
    ]),
  };
}

export function pageMetadata(
  locale: Locale,
  path: string,
  title: MessageKey | { text: string },
  description?: string,
  image?: string,
): Metadata {
  const t = getTranslator(locale);
  const titleText = typeof title === "string" ? t(title) : title.text;
  const desc = description ?? t("meta.siteDescription");
  return {
    title: titleText,
    description: desc,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: `${titleText} · ${siteConfig.brand.name}`,
      description: desc,
      url: localePath(locale, path),
      siteName: siteConfig.brand.name,
      locale: LOCALE_LABELS[locale].htmlLang.replace("-", "_"),
      type: "website",
      images: [{ url: image ?? "/images/hero/hero-tortoiseshell.jpg", width: 1200, height: 800 }],
    },
  };
}
