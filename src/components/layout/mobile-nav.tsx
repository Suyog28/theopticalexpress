"use client";

import { ChevronRight, Heart, User } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { LocaleLink, useT } from "@/i18n/client";
import { LanguageSwitcher } from "./language-switcher";
import { SearchForm } from "./search-form";
import { primaryNav, secondaryNav } from "./nav-items";
import { cn } from "@/lib/utils";

export function MobileNav({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const t = useT();
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("nav.mainNav")}
      side="left"
      closeLabel={t("nav.closeMenu")}
    >
      {/* Close the drawer when any link inside it is followed, or a search is submitted. */}
      <div
        className="flex min-h-full flex-col"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) onClose();
        }}
        onSubmit={onClose}
      >
        <div className="px-5 pt-4">
          <SearchForm id="mobile-search" />
        </div>
        <nav aria-label={t("nav.mainNav")} className="px-2 py-3">
          <ul>
            <li>
              <LocaleLink
                href="/"
                className="font-display text-navy hover:bg-navy/[0.04] flex items-center justify-between rounded-sm px-3 py-3.5 text-xl"
              >
                {t("nav.home")}
                <ChevronRight className="text-muted h-4 w-4" aria-hidden="true" />
              </LocaleLink>
            </li>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <LocaleLink
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "font-display text-navy hover:bg-navy/[0.04] aria-[current=page]:bg-navy/[0.05] flex items-center justify-between rounded-sm px-3 py-3.5 text-xl",
                    item.href === "/offers" && "text-sale",
                  )}
                >
                  {t(item.label)}
                  <ChevronRight className="text-muted h-4 w-4" aria-hidden="true" />
                </LocaleLink>
              </li>
            ))}
          </ul>
          <hr className="border-line mx-3 my-3" />
          <ul className="grid grid-cols-2 gap-x-2">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <LocaleLink
                  href={item.href}
                  className="text-muted hover:text-navy block rounded-sm px-3 py-2.5 text-sm"
                >
                  {t(item.label)}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-line mt-auto flex items-center gap-2 border-t px-5 py-4">
          <LanguageSwitcher className="-ml-2.5" />
          <LocaleLink
            href="/account"
            className="text-navy ml-auto inline-flex h-10 items-center gap-2 px-2 text-sm"
          >
            <User className="h-4 w-4" aria-hidden="true" /> {t("nav.account")}
          </LocaleLink>
          <LocaleLink
            href="/wishlist"
            className="text-navy inline-flex h-10 items-center gap-2 px-2 text-sm"
          >
            <Heart className="h-4 w-4" aria-hidden="true" /> {t("nav.wishlist")}
          </LocaleLink>
        </div>
      </div>
    </Drawer>
  );
}
