import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { WishlistView } from "@/components/products/wishlist-view";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/wishlist">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { ...pageMetadata(locale, "/wishlist", "meta.wishlist"), robots: { index: false } };
}

export default async function WishlistPage({ params }: PageProps<"/[locale]/wishlist">) {
  const { t } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[{ href: "/", label: t("common.home") }, { label: t("wishlist.title") }]}
      />
      <h1 className="font-display text-headline text-ink mt-6 mb-8">{t("wishlist.title")}</h1>
      <WishlistView />
    </div>
  );
}
