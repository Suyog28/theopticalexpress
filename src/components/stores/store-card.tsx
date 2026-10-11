import {
  CalendarCheck,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import type { StoreLocation } from "@/types/store";
import type { Translate } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";
import { LocaleLink } from "@/i18n/client";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { storeWhatsAppUrl } from "@/lib/whatsapp";
import { telHref } from "@/lib/stores";
import { formatTime12h } from "@/lib/time";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function StoreHours({ store, t }: { store: StoreLocation; t: Translate }) {
  return (
    <>
      {store.hours.value.map((h, i) => (
        <span key={i}>
          {h.days.length === 7
            ? t("store.daily", { open: formatTime12h(h.open), close: formatTime12h(h.close) })
            : `${formatTime12h(h.open)} – ${formatTime12h(h.close)}`}
        </span>
      ))}
    </>
  );
}

export function UnverifiedMark({ show, t }: { show: boolean; t: Translate }) {
  if (!show) return null;
  return (
    <span className="text-warning ml-1.5 text-[0.6875rem] font-medium">
      ({t("common.toBeConfirmed")})
    </span>
  );
}

export function StoreWhatsAppButton({
  store,
  t,
  template = "general",
  productName,
  label,
  className,
}: {
  store: StoreLocation;
  t: Translate;
  template?: "general" | "product" | "appointment";
  productName?: string;
  /** Visible label; defaults to "WhatsApp". */
  label?: string;
  className?: string;
}) {
  const text = label ?? t("store.whatsapp");
  const url = storeWhatsAppUrl(store, template, { productName });
  if (!url) {
    return (
      <span
        aria-disabled="true"
        title={t("store.whatsappPending")}
        className={buttonClasses({
          variant: "ghost",
          size: "sm",
          className: cn("text-muted cursor-not-allowed opacity-70", className),
        })}
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>
          {text}
          <span className="sr-only"> — {t("store.whatsappPending")}</span>
        </span>
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses({ variant: "ghost", size: "sm", className })}
    >
      <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
      {text}
    </a>
  );
}

export function StoreCard({
  store,
  t,
  locale,
  className,
  headingLevel = "h3",
}: {
  store: StoreLocation;
  t: Translate;
  locale: Locale;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const rating = store.rating;
  const showRating =
    rating && (rating.status === "owner-confirmed" || siteConfig.flags.showUnconfirmedRatings);

  return (
    <article
      className={cn(
        "border-line shadow-soft flex flex-col overflow-hidden rounded-md border bg-white",
        className,
      )}
    >
      <div className="bg-ivory-deep relative aspect-[16/9]">
        <SmartImage
          src={store.image}
          alt={store.imageIsIllustrative ? t("common.illustrativeImage") : store.name}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover object-[50%_25%]"
        />
        {store.imageIsIllustrative && (
          <span className="bg-navy/75 absolute bottom-2 left-2 rounded-xs px-2 py-1 text-[0.6875rem] text-white backdrop-blur-sm">
            {t("common.illustrativeImage")}
          </span>
        )}
        {showRating && rating && (
          <span className="text-navy shadow-soft absolute top-3 right-3 inline-flex items-center gap-1 rounded-xs bg-white/95 px-2 py-1 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-[#c08a2e] text-[#c08a2e]" aria-hidden="true" />
            {rating.value.toFixed(1)}
            <span className="text-muted font-normal">({rating.count})</span>
            {rating.status === "unverified" && (
              <span className="sr-only">{t("common.pendingVerification")}</span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">{store.area[locale]}</p>
            <H className="font-display text-ink text-2xl">{store.name}</H>
          </div>
          {store.address.status === "unverified" && (
            <Badge tone="warning">{t("common.pendingVerification")}</Badge>
          )}
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="sr-only">{t("store.address")}</dt>
            <MapPin className="text-secondary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <dd className="text-muted">
              {store.address.value}
              <UnverifiedMark show={store.address.status === "unverified"} t={t} />
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">{t("store.phone")}</dt>
            <Phone className="text-secondary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <dd>
              <a
                href={telHref(store.phone.value)}
                className="text-ink underline-offset-4 hover:underline"
              >
                {store.phone.value}
              </a>
              <UnverifiedMark show={store.phone.status === "unverified"} t={t} />
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">{t("store.hours")}</dt>
            <Clock className="text-secondary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <dd className="text-muted">
              <StoreHours store={store} t={t} />
              <UnverifiedMark show={store.hours.status === "unverified"} t={t} />
            </dd>
          </div>
        </dl>

        <div className="border-line mt-6 flex flex-wrap gap-x-1 gap-y-1 border-t pt-4">
          <a
            href={store.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {t("store.getDirections")}
            <span className="sr-only"> — {t("store.mapNote")}</span>
          </a>
          <a
            href={telHref(store.phone.value)}
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {t("store.call")}
          </a>
          <StoreWhatsAppButton store={store} t={t} />
          <a
            href={store.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "ghost", size: "sm" })}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {t("store.googleReviews")}
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <LocaleLink
            href={`/appointments?store=${store.slug}`}
            className={buttonClasses({ variant: "primary", size: "md", className: "flex-1" })}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {t("store.bookHere")}
          </LocaleLink>
          <LocaleLink
            href={`/stores/${store.slug}`}
            className={buttonClasses({ variant: "secondary", size: "md", className: "flex-1" })}
          >
            {t("store.viewStore")}
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}
