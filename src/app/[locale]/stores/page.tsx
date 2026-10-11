import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { stores } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StoreCard } from "@/components/stores/store-card";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/stores">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/stores", "meta.stores");
}

export default async function StoresPage({ params }: PageProps<"/[locale]/stores">) {
  const { t, locale } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[{ href: "/", label: t("common.home") }, { label: t("store.pageTitle") }]}
      />
      <header className="mt-6 mb-10 max-w-2xl md:mb-14">
        <h1 className="font-display text-headline text-ink">{t("store.pageTitle")}</h1>
        <p className="text-muted mt-4 md:text-lg">{t("store.pageText")}</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        {stores.map((s) => (
          <StoreCard key={s.slug} store={s} t={t} locale={locale} headingLevel="h2" />
        ))}
      </div>
    </div>
  );
}
