import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CartView } from "@/components/cart/cart-view";

export async function generateMetadata({ params }: PageProps<"/[locale]/cart">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { ...pageMetadata(locale, "/cart", "meta.cart"), robots: { index: false } };
}

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  const { t } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs items={[{ href: "/", label: t("common.home") }, { label: t("cart.title") }]} />
      <h1 className="font-display text-headline text-ink mt-6 mb-8 md:mb-12">{t("cart.title")}</h1>
      <CartView />
    </div>
  );
}
