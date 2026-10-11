import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/common/policy-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/policies/privacy">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/policies/privacy", "meta.privacy");
}

export default async function PrivacyPolicyPage({
  params,
}: PageProps<"/[locale]/policies/privacy">) {
  const { t, locale } = await resolveLocale(params);
  return <PolicyPage policy="privacy" t={t} locale={locale} />;
}
