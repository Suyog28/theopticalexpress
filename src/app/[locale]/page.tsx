import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import {
  EyeCareSection,
  FeaturedProducts,
  NewArrivalsRail,
  PromoBanner,
  ReviewsSection,
  StoreLocations,
  TrustStrip,
} from "@/components/home/sections";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/", "meta.home");
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <Hero t={t} />
      <CategoryGrid t={t} locale={locale} />
      <FeaturedProducts t={t} />
      <NewArrivalsRail t={t} />
      <PromoBanner t={t} />
      <EyeCareSection t={t} />
      <ReviewsSection t={t} locale={locale} />
      <StoreLocations t={t} locale={locale} />
      <TrustStrip t={t} />
    </>
  );
}
