import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, stores } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StoreCard } from "@/components/stores/store-card";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/contact", "meta.contact");
}

/** No backend contact form in the demo — customers call, visit or (once verified) WhatsApp a store. */
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { t, locale } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs items={[{ href: "/", label: t("common.home") }, { label: t("nav.contact") }]} />
      <header className="mt-6 mb-10 max-w-2xl md:mb-14">
        <p className="eyebrow">{t("contact.eyebrow")}</p>
        <h1 className="font-display text-headline text-ink mt-4">{t("contact.title")}</h1>
        <p className="text-muted mt-4 md:text-lg">{t("contact.text")}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2" id="whatsapp">
        {stores.map((s) => (
          <StoreCard key={s.slug} store={s} t={t} locale={locale} headingLevel="h2" />
        ))}
      </div>
      <p className="text-muted mt-10 flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4" aria-hidden="true" />
        {siteConfig.email ? (
          <a href={`mailto:${siteConfig.email}`} className="text-ink underline underline-offset-4">
            {siteConfig.email}
          </a>
        ) : (
          t("contact.emailPending")
        )}
      </p>
    </div>
  );
}
