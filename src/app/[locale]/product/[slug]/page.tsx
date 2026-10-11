import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import { resolveLocale } from "@/i18n/server";
import { LOCALES } from "@/i18n/routing";
import { dynamicKey } from "@/i18n/messages";
import { pageMetadata } from "@/lib/seo";
import { activeProducts, getProductBySlug, relatedProducts } from "@/lib/catalog";
import { discountPercent, formatINR } from "@/lib/currency";
import { siteConfig, stores } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchase } from "@/components/products/product-purchase";
import { ProductGrid } from "@/components/products/product-grid";
import { StoreWhatsAppButton } from "@/components/stores/store-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => activeProducts().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await resolveLocale(params);
  const product = getProductBySlug(slug);
  if (!product) return {};
  // Product JSON-LD is intentionally omitted: prices and stock are illustrative sample data.
  return pageMetadata(
    locale,
    `/product/${slug}`,
    { text: product.name },
    product.shortDescription[locale],
    product.images[0]?.src,
  );
}

export default async function ProductPage({ params }: PageProps<"/[locale]/product/[slug]">) {
  const { slug } = await params;
  const { t, locale } = await resolveLocale(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const pct = discountPercent(product.pricePaise, product.originalPricePaise);
  const related = relatedProducts(product, 4);
  const d = siteConfig.delivery;

  const specs: [string, string][] = [
    [t("product.material"), t(dynamicKey(`attributes.material.${product.material}`))],
    [t("product.shape"), t(dynamicKey(`attributes.shape.${product.shape}`))],
    [t("product.fit"), t(dynamicKey(`attributes.fit.${product.fit}`))],
    [t("product.size"), t(dynamicKey(`attributes.size.${product.size.label}`))],
    [
      t("product.measurements"),
      t("product.measurementsValue", {
        lens: product.size.lens,
        bridge: product.size.bridge,
        temple: product.size.temple,
      }),
    ],
    [
      t("product.prescription"),
      product.supportsPrescription ? t("product.prescriptionYes") : t("product.prescriptionNo"),
    ],
    [t("product.brandLine"), `${product.brand} (${t("common.sample")})`],
    [t("product.sku"), product.variants.map((v) => v.sku).join(", ")],
  ];

  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[
          { href: "/", label: t("common.home") },
          {
            href: `/category/${product.department}`,
            label: t(dynamicKey(`categories.${product.department}.name`)),
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="outline">{t("product.sampleBadge")}</Badge>
            {product.isNewArrival && <Badge tone="navy">{t("product.new")}</Badge>}
            {product.isBestSeller && <Badge tone="navy">{t("product.bestSeller")}</Badge>}
            {pct && <Badge tone="sale">{t("product.off", { percent: pct })}</Badge>}
          </div>
          <p className="text-muted mt-5 text-xs font-medium tracking-[0.14em] uppercase">
            {product.brand}
          </p>
          <h1 className="font-display text-headline text-ink mt-2">{product.name}</h1>
          <p className="text-muted mt-3 md:text-lg">{product.shortDescription[locale]}</p>

          <div className="mt-6">
            <Price
              pricePaise={product.pricePaise}
              originalPricePaise={product.originalPricePaise}
              size="lg"
              originalLabel={t("product.originalPrice")}
            />
            <p className="text-muted mt-1 text-xs">{t("common.illustrativePrice")}</p>
          </div>

          <div className="border-line mt-8 border-t pt-8">
            <ProductPurchase product={product} />
          </div>

          <div className="border-line mt-8 rounded-md border bg-white p-5">
            <h2 className="text-ink text-sm font-semibold">{t("product.enquireWhatsApp")}</h2>
            <ul className="mt-2 space-y-1">
              {stores.map((s) => (
                <li key={s.slug} className="flex flex-wrap items-center gap-x-2">
                  <StoreWhatsAppButton
                    store={s}
                    t={t}
                    template="product"
                    productName={product.name}
                    label={s.shortName}
                    className="-ml-3"
                  />
                  {s.whatsapp.status !== "owner-confirmed" && (
                    <span className="text-muted text-xs">{t("store.whatsappPending")}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-line mt-4 rounded-md border bg-white p-5">
            <h2 className="text-ink flex items-center gap-2 text-sm font-semibold">
              <Truck className="text-secondary h-4 w-4" aria-hidden="true" />
              {t("product.deliveryTitle")}
            </h2>
            <ul className="text-muted mt-3 space-y-1.5 text-sm">
              <li>{t("product.deliveryPune")}</li>
              <li>
                {t("product.deliveryOutside", {
                  threshold: formatINR(d.freeThresholdPaise),
                  fee: formatINR(d.outsidePuneFeePaise),
                })}
              </li>
            </ul>
            {d.courierFeeIsIllustrative && (
              <p className="text-muted mt-2 text-xs italic">{t("product.courierIllustrative")}</p>
            )}
          </div>

          <div className="mt-10 grid gap-8">
            <section>
              <h2 className="text-ink text-sm font-semibold tracking-wide uppercase">
                {t("product.description")}
              </h2>
              <p className="text-muted mt-3 leading-relaxed">{product.description[locale]}</p>
            </section>
            <section>
              <h2 className="text-ink text-sm font-semibold tracking-wide uppercase">
                {t("product.details")}
              </h2>
              <dl className="divide-line border-line mt-3 divide-y border-y text-sm">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[9rem_minmax(0,1fr)] gap-4 py-3">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-muted mt-2 text-xs">{t("product.measurementsHelp")}</p>
            </section>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-line mt-24 border-t pt-16">
          <SectionHeading title={t("product.related")} />
          <ProductGrid products={related} className="mt-10" />
        </section>
      )}
    </div>
  );
}
