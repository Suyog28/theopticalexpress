"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { LocaleLink, useT } from "@/i18n/client";
import { SearchForm } from "./search-form";
import { stripLocale } from "@/i18n/routing";
import { useCart, cartCount } from "@/stores/cart-store";
import { useWishlist } from "@/stores/wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { BrandLogo } from "./brand-logo";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { primaryNav } from "./nav-items";
import { cn } from "@/lib/utils";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="bg-primary absolute -top-0.5 -right-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full px-1 text-[0.625rem] font-semibold text-white tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

const iconBtn =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-sm text-navy transition-colors hover:bg-teal-soft hover:text-teal-deep";

export function Header() {
  const t = useT();
  const pathname = stripLocale(usePathname());
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const wishCount = useWishlist((s) => s.ids.length);
  const count = hydrated ? cartCount(lines) : 0;
  const wish = hydrated ? wishCount : 0;
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-line bg-white/90 supports-[backdrop-filter]:bg-white/75 backdrop-saturate-150 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-site">
        <div className="flex h-16 items-center gap-3 lg:h-[4.5rem] lg:gap-8">
          <button
            type="button"
            className={cn(iconBtn, "-ml-2 lg:hidden")}
            onClick={() => setMenuOpen(true)}
            aria-label={t("nav.openMenu")}
            aria-expanded={menuOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <LocaleLink href="/" className="shrink-0 rounded-sm" aria-label={t("nav.home")}>
            <BrandLogo />
          </LocaleLink>

          <SearchForm className="mx-auto hidden w-full max-w-md lg:block" />

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <LocaleLink
              href="/search"
              className={cn(iconBtn, "lg:hidden")}
              aria-label={t("nav.search")}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </LocaleLink>
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <LocaleLink
              href="/account"
              className={cn(iconBtn, "hidden sm:inline-flex")}
              aria-label={t("nav.account")}
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </LocaleLink>
            <LocaleLink
              href="/wishlist"
              className={iconBtn}
              aria-label={t("nav.wishlistWithCount", { count: wish })}
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              <CountBadge count={wish} />
            </LocaleLink>
            <LocaleLink
              href="/cart"
              className={cn(iconBtn, "-mr-2 lg:mr-0")}
              aria-label={t("nav.cartWithCount", { count })}
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <CountBadge count={count} />
            </LocaleLink>
          </div>
        </div>

        <nav aria-label={t("nav.mainNav")} className="-mt-1 hidden lg:block">
          <ul className="flex items-center justify-center gap-1 pb-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <LocaleLink
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "text-navy/80 hover:text-navy relative inline-flex h-10 items-center px-3.5 text-[0.9rem] font-medium transition-colors",
                    "after:bg-teal after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                    "aria-[current=page]:text-navy aria-[current=page]:after:scale-x-100",
                    item.href === "/offers" &&
                      "text-sale hover:text-sale aria-[current=page]:text-sale",
                  )}
                >
                  {t(item.label)}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </header>
  );
}
