import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { LocaleLink } from "@/i18n/client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonClasses } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/about", "meta.about");
}

/** Copy is limited to verified facts: two Pune stores and the services listed publicly. */
export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { t } = await resolveLocale(params);
  const values = [
    [t("about.value1Title"), t("about.value1")],
    [t("about.value2Title"), t("about.value2")],
    [t("about.value3Title"), t("about.value3")],
  ];
  return (
    <div className="pb-24">
      <div className="container-site pt-6 md:pt-8">
        <Breadcrumbs items={[{ href: "/", label: t("common.home") }, { label: t("nav.about") }]} />
      </div>
      <section className="container-site mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">{t("about.eyebrow")}</p>
          <h1 className="font-display text-headline text-ink mt-4 text-balance">
            {t("about.title")}
          </h1>
          <p className="text-ink mt-6 text-lg leading-relaxed">
            {t("about.lead", { brand: siteConfig.brand.name })}
          </p>
          <p className="text-muted mt-4 leading-relaxed">{t("about.p1")}</p>
          <p className="text-muted mt-4 leading-relaxed">{t("about.p2")}</p>
          <p className="text-muted mt-4 text-sm leading-relaxed italic">{t("about.p3")}</p>
          <LocaleLink href="/stores" className={buttonClasses({ size: "lg", className: "mt-8" })}>
            {t("about.storesCta")}
          </LocaleLink>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-ivory-deep relative col-span-2 aspect-[16/10] overflow-hidden rounded-sm">
            <SmartImage
              src="/images/stores/illustrative-display.jpg"
              alt={t("common.illustrativeImage")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="bg-ivory-deep relative aspect-square overflow-hidden rounded-sm">
            <SmartImage
              src="/images/editorial/community.jpg"
              alt={t("about.imageAlt")}
              fill
              sizes="25vw"
              className="object-cover object-top"
            />
          </div>
          <div className="bg-ivory-deep relative aspect-square overflow-hidden rounded-sm">
            <SmartImage
              src="/images/editorial/collection-books.jpg"
              alt={t("about.imageAlt2")}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <section className="container-site mt-24">
        <h2 className="font-display text-title text-ink">{t("about.valuesTitle")}</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map(([title, text], i) => (
            <li key={title} className="border-line rounded-md border bg-white p-6">
              <span className="font-display text-secondary/60 text-3xl">0{i + 1}</span>
              <h3 className="font-display text-ink mt-3 text-xl">{title}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
