import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CheckoutView } from "@/components/checkout/checkout-view";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { ...pageMetadata(locale, "/checkout", "meta.checkout"), robots: { index: false } };
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  const { t } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[
          { href: "/", label: t("common.home") },
          { href: "/cart", label: t("cart.title") },
          { label: t("checkout.title") },
        ]}
      />
      <h1 className="font-display text-headline text-ink mt-6 mb-8">{t("checkout.title")}</h1>
      <CheckoutView />
    </div>
  );
}
