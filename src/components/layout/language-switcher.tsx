"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useLocale, useT } from "@/i18n/client";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABELS, localePath, stripLocale } from "@/i18n/routing";
import type { Locale } from "@/types/i18n";
import { cn } from "@/lib/utils";

/**
 * Switches language while keeping the current page and query string (filters, search).
 * Cart and wishlist live in localStorage, so they survive the switch automatically.
 */
export function LanguageSwitcher({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();

  function change(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.push(localePath(next, stripLocale(pathname)) + search, { scroll: false });
  }

  return (
    <label
      className={cn(
        "relative inline-flex h-10 items-center gap-1.5 rounded-sm pr-1 pl-2.5 text-sm transition-colors",
        tone === "dark" ? "text-navy hover:bg-navy/[0.06]" : "text-white/90 hover:bg-white/10",
        className,
      )}
    >
      <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t("nav.language")}</span>
      <select
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
        className="cursor-pointer appearance-none bg-transparent pr-1 font-medium focus:outline-none"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={l} className="text-navy">
            {LOCALE_LABELS[l].native}
          </option>
        ))}
      </select>
    </label>
  );
}
