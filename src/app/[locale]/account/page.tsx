import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { resolveLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { LocaleLink } from "@/i18n/client";
import { buttonClasses } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/account">): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  return { ...pageMetadata(locale, "/account", "meta.account"), robots: { index: false } };
}

/** Account entry point. Real accounts need server-side auth (Phase 2) — no fake login here. */
export default async function AccountPage({ params }: PageProps<"/[locale]/account">) {
  const { t } = await resolveLocale(params);
  return (
    <div className="container-site flex justify-center py-20 md:py-28">
      <div className="max-w-lg text-center">
        <span className="bg-navy/[0.06] text-navy mx-auto flex h-14 w-14 items-center justify-center rounded-full">
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="font-display text-title text-ink mt-6 md:text-4xl">{t("account.title")}</h1>
        <p className="text-muted mt-4">{t("account.text")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LocaleLink href="/wishlist" className={buttonClasses({ variant: "secondary" })}>
            {t("account.toWishlist")}
          </LocaleLink>
          <LocaleLink href="/cart" className={buttonClasses()}>
            {t("account.toCart")}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
