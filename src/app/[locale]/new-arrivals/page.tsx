import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/products/listing-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/new-arrivals">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/new-arrivals", "meta.newArrivals");
}

export default async function NewArrivalsPage({ params }: PageProps<"/[locale]/new-arrivals">) {
  const { t } = await resolveLocale(params);
  return (
    <ListingPage
      t={t}
      title={t("listing.newTitle")}
      text={t("listing.newText")}
      crumb={t("nav.newArrivals")}
      preset={{ newOnly: true }}
      showCategoryFilter
    />
  );
}
