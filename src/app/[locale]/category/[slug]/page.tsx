import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { ListingPage } from "@/components/products/listing-page";
import { categories, getCategory } from "@/data/categories";
import { LOCALES } from "@/i18n/routing";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => categories.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(
    locale,
    `/category/${slug}`,
    { text: t(`categories.${category.slug}.name`) },
    t(`categories.${category.slug}.blurb`),
    category.image,
  );
}

export default async function CategoryPage({ params }: PageProps<"/[locale]/category/[slug]">) {
  const { slug } = await params;
  const { t } = await resolveLocale(params);
  const category = getCategory(slug);
  if (!category) notFound();
  const name = t(`categories.${category.slug}.name`);
  return (
    <ListingPage
      t={t}
      title={name}
      text={t(`categories.${category.slug}.blurb`)}
      crumb={name}
      preset={{ category: category.slug }}
    />
  );
}
