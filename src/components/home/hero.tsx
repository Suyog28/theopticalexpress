import { SmartImage as Image } from "@/components/ui/smart-image";
import { ArrowRight, CalendarCheck } from "lucide-react";
import type { Translate } from "@/i18n/messages";
import { LocaleLink } from "@/i18n/client";
import { buttonClasses } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Hero image and copy are configured here + in messages/*.json (home.hero*). */
export const heroConfig = {
  image: "/images/hero/hero-tortoiseshell.jpg",
};

export function Hero({ t }: { t: Translate }) {
  return (
    <section className="bg-navy relative overflow-hidden bg-[radial-gradient(60rem_30rem_at_85%_0%,rgb(0_165_181/0.28),transparent_60%)]">
      <div className="container-site grid items-center gap-10 pt-8 pb-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-8 md:pt-8 lg:gap-16 lg:pb-16">
        <div className="relative z-10 order-2 md:order-1">
          <p className="eyebrow !text-teal animate-fade-up mb-5">{t("home.heroEyebrow")}</p>
          <h1 className="font-display text-display animate-fade-up text-balance text-white [animation-delay:80ms]">
            {t("home.heroTitle")}
          </h1>
          <p className="animate-fade-up mt-6 text-white/70 max-w-md text-base leading-relaxed text-pretty [animation-delay:160ms] md:text-lg">
            {t("home.heroText")}
          </p>
          <div className="animate-fade-up mt-9 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <LocaleLink href="/shop" className={buttonClasses({ size: "lg" })}>
              {t("home.heroPrimary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LocaleLink>
            <LocaleLink
              href="/appointments"
              className={buttonClasses({ variant: "secondary", size: "lg", className: "!border-white/40 !text-white hover:!bg-white hover:!text-navy" })}
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {t("home.heroSecondary")}
            </LocaleLink>
          </div>
          <p className="mt-10 flex text-white/60 items-center gap-3 text-xs tracking-wide">
            <span className="bg-teal h-px w-8" aria-hidden="true" />
            {t("home.heroCaption")}
          </p>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="bg-ivory-deep relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-auto md:h-[min(34rem,calc(100dvh-16rem))] md:min-h-[24rem]">
            <Image
              src={heroConfig.image}
              alt={t("home.heroAlt")}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="animate-fade-in object-cover object-[50%_30%]"
            />
          </div>
          {/* Editorial detail card */}
          <div className="shadow-lift absolute -bottom-6 -left-4 hidden max-w-[15rem] rounded-2xl bg-white p-5 lg:block">
            <p className="eyebrow">{siteConfig.brand.name}</p>
            <p className="font-display text-ink mt-2 text-lg leading-snug">
              {t("categories.premium.name")}
            </p>
            <p className="text-muted mt-1 text-sm">{t("categories.premium.blurb")}</p>
            <LocaleLink
              href="/category/premium"
              className="text-navy mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              {t("common.viewAll")} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
