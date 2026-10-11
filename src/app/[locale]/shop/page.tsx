import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/products/listing-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/shop", "meta.shop");
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop">) {
  const { t } = await resolveLocale(params);
  return (
    <ListingPage
      t={t}
      title={t("listing.shopTitle")}
      text={t("listing.shopText")}
      crumb={t("nav.shop")}
      showCategoryFilter
    />
  );
}
