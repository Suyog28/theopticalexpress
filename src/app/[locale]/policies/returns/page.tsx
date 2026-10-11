import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/common/policy-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/policies/returns">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/policies/returns", "meta.returns");
}

export default async function ReturnsPolicyPage({
  params,
}: PageProps<"/[locale]/policies/returns">) {
  const { t, locale } = await resolveLocale(params);
  return <PolicyPage policy="returns" t={t} locale={locale} />;
}
