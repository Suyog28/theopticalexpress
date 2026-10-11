import type { Metadata } from "next";
import { Suspense } from "react";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/products/listing-page";
import { SearchHeader } from "@/components/products/search-header";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { ...pageMetadata(locale, "/search", "meta.search"), robots: { index: false } };
}

export default async function SearchPage({ params }: PageProps<"/[locale]/search">) {
  const { t } = await resolveLocale(params);
  return (
    <ListingPage t={t} title={t("listing.searchTitle")} crumb={t("nav.search")} showCategoryFilter>
      <Suspense>
        <SearchHeader />
      </Suspense>
    </ListingPage>
  );
}
