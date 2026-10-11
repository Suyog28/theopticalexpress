import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/products/listing-page";
import { CouponShowcase } from "@/components/cart/coupon-showcase";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/offers">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/offers", "meta.offers");
}

export default async function OffersPage({ params }: PageProps<"/[locale]/offers">) {
  const { t } = await resolveLocale(params);
  return (
    <ListingPage
      t={t}
      title={t("listing.offersTitle")}
      text={t("listing.offersText")}
      crumb={t("nav.offers")}
      preset={{ offersOnly: true }}
      showCategoryFilter
      banner={<CouponShowcase />}
    />
  );
}
