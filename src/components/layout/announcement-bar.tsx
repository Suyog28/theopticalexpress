import { Star, Truck } from "lucide-react";
import { siteConfig, stores } from "@/config/site";
import { LocaleLink } from "@/i18n/client";
import type { Translate } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";

export function AnnouncementBar({ locale, t }: { locale: Locale; t: Translate }) {
  const rating = stores[0]?.rating;
  return (
    <div className="bg-navy-900 text-white">
      {rating && (
        <LocaleLink
          href="/reviews"
          className="container-site flex min-h-9 items-center justify-center gap-2 border-b border-white/10 py-2 text-[0.8125rem] font-medium hover:underline"
        >
          <Star className="h-3.5 w-3.5 fill-[#e0a93b] text-[#e0a93b]" aria-hidden="true" />
          <span>
            {rating.value.toFixed(1)} · {rating.count} {t("common.ratingStrip")} ·{" "}
            {stores[0]!.shortName}
          </span>
        </LocaleLink>
      )}
      <p className="container-site flex min-h-9 items-center justify-center gap-2 py-2 text-center text-[0.75rem] leading-snug tracking-wide sm:text-[0.8125rem]">
        <Truck className="hidden h-3.5 w-3.5 shrink-0 opacity-80 sm:block" aria-hidden="true" />
        <span className="whitespace-pre-wrap">{siteConfig.announcement[locale]}</span>
      </p>
    </div>
  );
}
