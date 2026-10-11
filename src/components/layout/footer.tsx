import { MapPin, Phone } from "lucide-react";
import { siteConfig, stores } from "@/config/site";
import type { Translate } from "@/i18n/messages";
import { LocaleLink } from "@/i18n/client";
import { telHref } from "@/lib/stores";
import { BrandLogo } from "./brand-logo";
import { LanguageSwitcher } from "./language-switcher";

export function Footer({ t }: { t: Translate }) {
  const year = new Date().getFullYear();
  const col = "text-sm text-white/70 transition-colors hover:text-white";
  const heading = "mb-4 text-xs font-semibold tracking-[0.14em] text-teal uppercase";

  return (
    <footer className="bg-navy mt-auto bg-[radial-gradient(50rem_20rem_at_100%_0%,rgb(0_165_181/0.18),transparent_60%)] text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-10">
        <div>
          <BrandLogo tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            {t("footer.demoNote")}
          </p>
          {siteConfig.brand.isTemporary && (
            <p className="mt-3 text-xs text-white/45">
              {t("common.tempBrandNote", { brand: siteConfig.brand.name })}
            </p>
          )}
          <div className="mt-6">
            <LanguageSwitcher tone="light" className="-ml-2.5" />
          </div>
        </div>

        <div>
          <h2 className={heading}>{t("footer.shop")}</h2>
          <ul className="space-y-2.5">
            <li>
              <LocaleLink className={col} href="/category/eyeglasses">
                {t("categories.eyeglasses.name")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/category/sunglasses">
                {t("categories.sunglasses.name")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/category/kids">
                {t("categories.kids.name")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/category/premium">
                {t("categories.premium.name")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/category/blue-light">
                {t("categories.blue-light.name")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/new-arrivals">
                {t("nav.newArrivals")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/offers">
                {t("nav.offers")}
              </LocaleLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>{t("footer.help")}</h2>
          <ul className="space-y-2.5">
            <li>
              <LocaleLink className={col} href="/appointments">
                {t("nav.eyeCheckup")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/reviews">
                {t("nav.reviews")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/about">
                {t("nav.about")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/contact">
                {t("nav.contact")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/policies/shipping">
                {t("meta.shipping")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/policies/returns">
                {t("meta.returns")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/policies/privacy">
                {t("meta.privacy")}
              </LocaleLink>
            </li>
            <li>
              <LocaleLink className={col} href="/policies/terms">
                {t("meta.terms")}
              </LocaleLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={heading}>{t("footer.stores")}</h2>
          <ul className="space-y-6">
            {stores.map((s) => (
              <li key={s.slug} className="text-sm">
                <LocaleLink
                  href={`/stores/${s.slug}`}
                  className="font-medium text-white hover:underline"
                >
                  {s.name}
                </LocaleLink>
                <p className="mt-1.5 flex gap-2 text-white/60">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{s.address.value}</span>
                </p>
                <a
                  href={telHref(s.phone.value)}
                  className="mt-1 inline-flex items-center gap-2 text-white/75 hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {s.phone.value}
                </a>
                {s.phone.status === "unverified" && (
                  <span className="ml-2 text-[0.6875rem] text-white/40">
                    ({t("common.toBeConfirmed")})
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-white/40">{t("footer.socialPending")}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>{t("footer.rights", { year, brand: siteConfig.brand.name })}</p>
          <p>{t("footer.photoCredit")}</p>
        </div>
      </div>
    </footer>
  );
}
