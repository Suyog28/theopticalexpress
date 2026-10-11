import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/common/policy-page";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/currency";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/policies/shipping">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/policies/shipping", "meta.shipping");
}

export default async function ShippingPolicyPage({
  params,
}: PageProps<"/[locale]/policies/shipping">) {
  const { t, locale } = await resolveLocale(params);
  return (
    <PolicyPage
      policy="shipping"
      t={t}
      locale={locale}
      vars={{
        threshold: formatINR(siteConfig.delivery.freeThresholdPaise),
        fee: formatINR(siteConfig.delivery.outsidePuneFeePaise),
      }}
    />
  );
}
