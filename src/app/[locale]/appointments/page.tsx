import type { Metadata } from "next";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Notice } from "@/components/ui/notice";
import { SmartImage } from "@/components/ui/smart-image";
import { AppointmentForm } from "@/components/appointments/appointment-form";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/appointments">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return pageMetadata(
    locale,
    "/appointments",
    "meta.appointments",
    undefined,
    "/images/editorial/eye-exam.jpg",
  );
}

export default async function AppointmentsPage({ params }: PageProps<"/[locale]/appointments">) {
  const { t } = await resolveLocale(params);
  return (
    <div className="container-site pt-6 pb-24 md:pt-8">
      <Breadcrumbs
        items={[{ href: "/", label: t("common.home") }, { label: t("nav.eyeCheckup") }]}
      />
      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div>
          <p className="eyebrow">{t("appointment.eyebrow")}</p>
          <h1 className="font-display text-headline text-ink mt-4">{t("appointment.title")}</h1>
          <p className="text-muted mt-4 max-w-xl md:text-lg">{t("appointment.intro")}</p>
          <Notice tone="demo" className="mt-8 mb-8">
            {t("appointment.demoBanner")}
          </Notice>
          <Suspense
            fallback={
              <div className="h-[36rem] animate-pulse rounded-md bg-white" aria-hidden="true" />
            }
          >
            <AppointmentForm />
          </Suspense>
        </div>
        <aside className="space-y-6">
          <div className="bg-ivory-deep relative aspect-[4/5] overflow-hidden rounded-sm">
            <SmartImage
              src="/images/editorial/eye-chart.jpg"
              alt={t("appointment.imageAlt")}
              fill
              sizes="(min-width: 1024px) 22rem, 100vw"
              className="object-cover"
            />
          </div>
          <div className="border-line rounded-md border bg-white p-6">
            <h2 className="font-display text-ink text-xl">{t("appointment.whatToExpect")}</h2>
            <ul className="text-muted mt-4 space-y-3 text-sm">
              {[t("appointment.expect1"), t("appointment.expect2"), t("appointment.expect3")].map(
                (x) => (
                  <li key={x} className="flex gap-3">
                    <Check className="text-secondary mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {x}
                  </li>
                ),
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
