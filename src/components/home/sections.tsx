import { SmartImage as Image } from "@/components/ui/smart-image";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CreditCard,
  Store,
  Truck,
} from "lucide-react";
import type { Translate } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";
import { LocaleLink } from "@/i18n/client";
import { buttonClasses } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductCard } from "@/components/products/product-card";
import { StoreCard } from "@/components/stores/store-card";
import { StoreReviews } from "@/components/reviews/store-reviews";
import { Tabs } from "@/components/ui/tabs";
import { featuredProducts, newArrivals } from "@/lib/catalog";
import { stores } from "@/config/site";

export function FeaturedProducts({ t }: { t: Translate }) {
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("home.featuredEyebrow")}
          title={t("home.featuredTitle")}
          action={
            <LocaleLink href="/shop" className={buttonClasses({ variant: "link" })}>
              {t("common.viewAll")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LocaleLink>
          }
        />
        <ProductGrid products={featuredProducts(8)} className="mt-10 lg:mt-14" />
        <p className="text-muted mt-8 text-xs">{t("common.sampleInventory")}</p>
      </div>
    </section>
  );
}

export function NewArrivalsRail({ t }: { t: Translate }) {
  const items = newArrivals(6);
  return (
    <section className="section-y border-line overflow-hidden border-y bg-white">
      <div className="container-site grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
        <div className="flex flex-col justify-between gap-6">
          <SectionHeading
            eyebrow={t("home.newEyebrow")}
            title={t("home.newTitle")}
            text={t("home.newText")}
          />
          <LocaleLink
            href="/new-arrivals"
            className={buttonClasses({ variant: "secondary", className: "self-start" })}
          >
            {t("common.viewAll")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </LocaleLink>
        </div>
        <ul
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          aria-label={t("home.newTitle")}
        >
          {items.map((p) => (
            <li key={p.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-[31%]">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PromoBanner({ t }: { t: Translate }) {
  return (
    <section className="section-y">
      <div className="container-site">
        <div className="bg-navy relative grid overflow-hidden rounded-[2rem] bg-[radial-gradient(40rem_20rem_at_0%_100%,rgb(0_165_181/0.3),transparent_60%)] text-white md:grid-cols-2">
          <div className="relative min-h-80 md:min-h-[32rem]">
            <Image
              src="/images/editorial/campaign-frames.jpg"
              alt={t("home.promoAlt")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[50%_25%]"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-white/60">{t("home.promoEyebrow")}</p>
            <h2 className="font-display text-headline mt-5 text-balance">{t("home.promoTitle")}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/75">{t("home.promoText")}</p>
            <LocaleLink
              href="/shop"
              className={buttonClasses({
                variant: "light",
                size: "lg",
                className: "mt-9 self-start",
              })}
            >
              {t("home.promoCta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EyeCareSection({ t }: { t: Translate }) {
  const points = [t("home.eyecarePoint1"), t("home.eyecarePoint2"), t("home.eyecarePoint3")];
  return (
    <section className="section-y bg-ivory-deep/60">
      <div className="container-site grid items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div className="bg-ivory-deep relative aspect-[4/3] overflow-hidden rounded-[2rem] md:aspect-[5/6]">
          <Image
            src="/images/editorial/eye-exam.jpg"
            alt={t("home.eyecareAlt")}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">{t("home.eyecareEyebrow")}</p>
          <h2 className="font-display text-headline text-ink mt-5 text-balance">
            {t("home.eyecareTitle")}
          </h2>
          <p className="text-muted mt-5 max-w-lg leading-relaxed">{t("home.eyecareText")}</p>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="text-ink flex items-start gap-3">
                <span className="bg-teal text-navy-900 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <LocaleLink
            href="/appointments"
            className={buttonClasses({ size: "lg", className: "mt-10" })}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {t("home.eyecareCta")}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection({ t, locale }: { t: Translate; locale: Locale }) {
  return (
    <section className="section-y">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("home.reviewsEyebrow")}
          title={t("home.reviewsTitle")}
          text={t("reviews.text")}
          action={
            <LocaleLink href="/reviews" className={buttonClasses({ variant: "link" })}>
              {t("common.viewAll")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LocaleLink>
          }
        />
        <Tabs
          className="mt-10"
          label={t("reviews.title")}
          items={stores.map((s) => ({
            id: s.slug,
            label: s.name,
            content: <StoreReviews store={s} t={t} locale={locale} limit={3} />,
          }))}
        />
      </div>
    </section>
  );
}

export function StoreLocations({ t, locale }: { t: Translate; locale: Locale }) {
  return (
    <section className="section-y border-line border-t bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("home.storesEyebrow")}
          title={t("home.storesTitle")}
          text={t("store.pageText")}
        />
        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2">
          {stores.map((s) => (
            <StoreCard key={s.slug} store={s} t={t} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustStrip({ t }: { t: Translate }) {
  const items = [
    { icon: Truck, title: t("trust.puneTitle"), text: t("trust.puneText") },
    { icon: Store, title: t("trust.outsideTitle"), text: t("trust.outsideText") },
    { icon: WhatsAppIcon, title: t("trust.whatsappTitle"), text: t("trust.whatsappText") },
    { icon: CalendarCheck, title: t("trust.appointmentTitle"), text: t("trust.appointmentText") },
    {
      icon: CreditCard,
      title: t("trust.paymentTitle"),
      text: t("trust.paymentText"),
      planned: true,
    },
  ];
  return (
    <section aria-label={t("trust.puneTitle")} className="border-line bg-ivory border-t">
      <ul className="container-site grid grid-cols-1 gap-x-8 gap-y-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(({ icon: Icon, title, text, planned }) => (
          <li key={title} className="flex gap-3.5">
            <Icon
              className="text-secondary mt-0.5 h-5 w-5 shrink-0"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <div>
              <p className="text-ink text-sm font-semibold">{title}</p>
              <p className={planned ? "text-muted mt-1 text-xs italic" : "text-muted mt-1 text-xs"}>
                {text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
