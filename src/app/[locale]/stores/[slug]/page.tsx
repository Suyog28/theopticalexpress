import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { resolveLocale } from "@/i18n/server";
import { LOCALES } from "@/i18n/routing";
import { LocaleLink } from "@/i18n/client";
import { dynamicKey } from "@/i18n/messages";
import { pageMetadata } from "@/lib/seo";
import { getStore, telHref } from "@/lib/stores";
import { siteConfig, stores } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Notice } from "@/components/ui/notice";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonClasses } from "@/components/ui/button";
import { StoreHours, StoreWhatsAppButton, UnverifiedMark } from "@/components/stores/store-card";
import { StoreReviews, formatDate } from "@/components/reviews/store-reviews";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => stores.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await resolveLocale(params);
  const store = getStore(slug);
  if (!store) return {};
  return pageMetadata(
    locale,
    `/stores/${slug}`,
    { text: `${store.name} — ${store.area[locale]}` },
    store.address.value,
  );
}

export default async function StorePage({ params }: PageProps<"/[locale]/stores/[slug]">) {
  const { slug } = await params;
  const { t, locale } = await resolveLocale(params);
  const store = getStore(slug);
  if (!store) notFound();
  const other = stores.find((s) => s.slug !== store.slug);
  const unverified = store.address.status === "unverified";

  return (
    <div className="pb-24">
      <div className="container-site pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { href: "/", label: t("common.home") },
            { href: "/stores", label: t("store.pageTitle") },
            { label: store.name },
          ]}
        />
      </div>

      <section className="container-site mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="bg-ivory-deep relative aspect-[4/3] overflow-hidden rounded-sm">
          <SmartImage
            src={store.image}
            alt={store.imageIsIllustrative ? t("common.illustrativeImage") : store.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[50%_25%]"
          />
          {store.imageIsIllustrative && (
            <span className="bg-navy/75 absolute bottom-3 left-3 rounded-xs px-2 py-1 text-xs text-white backdrop-blur-sm">
              {t("common.illustrativeImage")}
            </span>
          )}
        </div>
        <div>
          <p className="eyebrow">{store.area[locale]}</p>
          <h1 className="font-display text-headline text-ink mt-4">{store.name}</h1>

          <Notice tone={unverified ? "warning" : "info"} className="mt-6">
            {unverified
              ? t("store.detailsUnverified")
              : t("store.detailsChecked", { date: formatDate(siteConfig.research.date, locale) })}
          </Notice>

          <dl className="mt-8 space-y-5">
            <div className="flex gap-4">
              <MapPin className="text-secondary mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {t("store.address")}
                </dt>
                <dd className="text-ink mt-1">
                  {store.address.value}
                  <UnverifiedMark show={store.address.status === "unverified"} t={t} />
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="text-secondary mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {t("store.phone")}
                </dt>
                <dd className="mt-1">
                  <a
                    href={telHref(store.phone.value)}
                    className="text-ink underline-offset-4 hover:underline"
                    aria-label={t("store.callStore", { store: store.name })}
                  >
                    {store.phone.value}
                  </a>
                  <UnverifiedMark show={store.phone.status === "unverified"} t={t} />
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="text-secondary mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <dt className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {t("store.hours")}
                </dt>
                <dd className="text-ink mt-1">
                  <StoreHours store={store} t={t} />
                  <UnverifiedMark show={store.hours.status === "unverified"} t={t} />
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-6">
            <h2 className="text-muted text-xs font-semibold tracking-wide uppercase">
              {t("store.services")}
            </h2>
            {store.services.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {store.services.map((s) => (
                  <li
                    key={s}
                    className="border-line text-ink rounded-sm border bg-white px-3 py-1.5 text-sm"
                  >
                    {t(dynamicKey(`store.service.${s}`))}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mt-2 text-sm">{t("store.servicesUnknown")}</p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LocaleLink
              href={`/appointments?store=${store.slug}`}
              className={buttonClasses({ size: "lg" })}
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {t("store.bookHere")}
            </LocaleLink>
            <a
              href={store.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {t("store.getDirections")}
              <span className="sr-only"> — {t("store.mapNote")}</span>
            </a>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1">
            <StoreWhatsAppButton store={store} t={t} className="-ml-3" />
            {store.whatsapp.status !== "owner-confirmed" && (
              <span className="text-muted text-xs">{t("store.whatsappPending")}</span>
            )}
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
        </div>
      </section>

      {store.gallery && store.gallery.length > 0 && (
        <section className="container-site mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {store.gallery.map((src) => (
            <div
              key={src}
              className="bg-ivory-deep relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <SmartImage
                src={src}
                alt={store.name}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover object-[50%_25%]"
              />
            </div>
          ))}
        </section>
      )}

      <section
        className="container-site border-line mt-20 border-t pt-14"
        aria-labelledby="store-reviews"
      >
        <h2 id="store-reviews" className="font-display text-title text-ink mb-8">
          {t("reviews.title")}
        </h2>
        <StoreReviews store={store} t={t} locale={locale} />
      </section>

      {other && (
        <section className="container-site mt-20">
          <div className="bg-navy flex flex-col items-start justify-between gap-4 rounded-md p-8 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-xs tracking-wide text-white/60 uppercase">
                {t("store.otherStore")}
              </p>
              <p className="font-display mt-1 text-2xl">{other.name}</p>
              <p className="text-sm text-white/70">{other.area[locale]}</p>
            </div>
            <LocaleLink
              href={`/stores/${other.slug}`}
              className={buttonClasses({ variant: "light" })}
            >
              {t("store.viewStore")}
            </LocaleLink>
          </div>
        </section>
      )}
    </div>
  );
}
