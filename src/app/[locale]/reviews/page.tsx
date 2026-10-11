import type { Metadata } from "next";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { stores } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StoreReviews } from "@/components/reviews/store-reviews";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/reviews">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(locale, "/reviews", "meta.reviews");
}

/** Each store's reviews are shown in its own section — never merged. No review JSON-LD is emitted. */
export default async function ReviewsPage({ params }: PageProps<"/[locale]/reviews">) {
  const { t, locale } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[{ href: "/", label: t("common.home") }, { label: t("reviews.title") }]}
      />
      <header className="mt-6 mb-12 max-w-2xl">
        <h1 className="font-display text-headline text-ink">{t("reviews.title")}</h1>
        <p className="text-muted mt-4 md:text-lg">{t("reviews.text")}</p>
      </header>
      <div className="space-y-16">
        {stores.map((s) => (
          <section key={s.slug} aria-label={s.name} className="border-line border-t pt-10">
            <StoreReviews store={s} t={t} locale={locale} />
          </section>
        ))}
      </div>
    </div>
  );
}
