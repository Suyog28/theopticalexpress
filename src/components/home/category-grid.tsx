import { ArrowUpRight } from "lucide-react";
import type { Translate } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";
import { LocaleLink } from "@/i18n/client";
import { SmartImage } from "@/components/ui/smart-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/data/categories";

export function CategoryGrid({ t, locale }: { t: Translate; locale: Locale }) {
  return (
    <section className="section-y bg-white">
      <div className="container-site">
        <SectionHeading eyebrow={t("home.categoriesEyebrow")} title={t("home.categoriesTitle")} />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-5">
          {categories.map((c) => (
            <li key={c.slug}>
              <LocaleLink
                href={`/category/${c.slug}`}
                className="group bg-ivory-deep relative flex aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-[5/4]"
              >
                <SmartImage
                  src={c.image}
                  alt={c.imageAlt[locale]}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <span
                  className="from-navy-900/75 via-navy-900/10 absolute inset-0 bg-gradient-to-t to-transparent"
                  aria-hidden="true"
                />
                <span className="relative mt-auto flex w-full items-end justify-between gap-3 p-4 text-white sm:p-6">
                  <span>
                    <span className="font-display block text-lg leading-tight sm:text-2xl">
                      {t(`categories.${c.slug}.name`)}
                    </span>
                    <span className="mt-1 hidden text-sm text-white/80 sm:block">
                      {t(`categories.${c.slug}.blurb`)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
