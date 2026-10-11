import { ExternalLink, Quote } from "lucide-react";
import type { StoreLocation } from "@/types/store";
import type { Review } from "@/types/review";
import type { Translate } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";
import { Rating } from "@/components/ui/rating";
import { Notice } from "@/components/ui/notice";
import { buttonClasses } from "@/components/ui/button";
import { getReviewsForStore } from "@/data/reviews";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const dateFmt: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  mr: new Intl.DateTimeFormat("mr-IN", { day: "numeric", month: "short", year: "numeric" }),
  hi: new Intl.DateTimeFormat("hi-IN", { day: "numeric", month: "short", year: "numeric" }),
};

export function formatDate(iso: string, locale: Locale): string {
  return dateFmt[locale].format(new Date(`${iso}T00:00:00+05:30`));
}

export function RatingSummary({
  store,
  t,
  locale,
}: {
  store: StoreLocation;
  t: Translate;
  locale: Locale;
}) {
  const r = store.rating;
  if (!r) return null;
  if (r.status !== "owner-confirmed" && !siteConfig.flags.showUnconfirmedRatings) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <span className="font-display text-ink text-4xl leading-none">{r.value.toFixed(1)}</span>
        <div>
          <Rating value={r.value} label={t("store.rating", { value: r.value.toFixed(1) })} />
          <p className="text-muted mt-1 text-xs">{t("store.ratingCount", { count: r.count })}</p>
        </div>
      </div>
      <p className="text-muted mt-2 max-w-xs text-[0.6875rem] leading-snug">
        {r.status === "unverified"
          ? t("store.ratingUnverifiedNote")
          : t("store.ratingNote", { date: formatDate(r.retrievedAt, locale) })}
      </p>
    </div>
  );
}

export function ReviewCard({
  review,
  locale,
  t,
}: {
  review: Review;
  locale: Locale;
  t: Translate;
}) {
  return (
    <figure className="border-line shadow-soft flex h-full flex-col rounded-md border bg-white p-6">
      <Quote className="text-secondary/40 h-6 w-6" aria-hidden="true" />
      {/* Review text is shown verbatim in its original language. */}
      <blockquote lang="en" className="text-ink mt-3 flex-1 text-[0.9375rem] leading-relaxed">
        <p>{review.text}</p>
      </blockquote>
      <figcaption className="border-line mt-5 border-t pt-4 text-sm">
        <span className="text-ink font-medium">{review.author}</span>
        <span className="text-muted mt-0.5 block text-xs">
          {t("reviews.reviewedOn", { date: formatDate(review.date, locale) })} · Google
        </span>
      </figcaption>
    </figure>
  );
}

/** One store's reviews. Never mixes reviews between stores. */
export function StoreReviews({
  store,
  t,
  locale,
  limit,
  className,
}: {
  store: StoreLocation;
  t: Translate;
  locale: Locale;
  limit?: number;
  className?: string;
}) {
  const all = getReviewsForStore(store.slug, siteConfig.flags.showPendingReviewExcerpts);
  const reviews = limit ? all.slice(0, limit) : all;
  const hasPending = reviews.some((r) => r.verificationStatus === "pending-permission");

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12", className)}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="font-display text-ink text-xl">{store.name}</p>
          <p className="text-muted text-sm">{store.area[locale]}</p>
        </div>
        <RatingSummary store={store} t={t} locale={locale} />
        <a
          href={store.reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ variant: "secondary", size: "sm", className: "self-start" })}
        >
          {t("reviews.readOnGoogle")}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {reviews.length > 0 ? (
        <div>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.id}>
                <ReviewCard review={r} locale={locale} t={t} />
              </li>
            ))}
          </ul>
          {hasPending && (
            <p className="text-muted mt-4 text-xs leading-relaxed">
              {t("reviews.pendingNote")} {t("reviews.noStarsNote")}
            </p>
          )}
        </div>
      ) : (
        <Notice tone="info" title={t("reviews.placeholderTitle")} className="self-start">
          {t("reviews.placeholderText", { store: store.shortName })}
        </Notice>
      )}
    </div>
  );
}
