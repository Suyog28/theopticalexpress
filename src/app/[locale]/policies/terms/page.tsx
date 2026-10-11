import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/common/policy-page";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/policies/terms">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/policies/terms", "meta.terms");
}

export default async function TermsPolicyPage({ params }: PageProps<"/[locale]/policies/terms">) {
  const { t, locale } = await resolveLocale(params);
  return <PolicyPage policy="terms" t={t} locale={locale} />;
}
