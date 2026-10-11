import type { MessageKey } from "@/i18n/messages";

export interface NavItem {
  href: string;
  label: MessageKey;
}

export const primaryNav: NavItem[] = [
  { href: "/category/eyeglasses", label: "nav.eyeglasses" },
  { href: "/category/sunglasses", label: "nav.sunglasses" },
  { href: "/category/kids", label: "nav.kids" },
  { href: "/new-arrivals", label: "nav.newArrivals" },
  { href: "/offers", label: "nav.offers" },
  { href: "/appointments", label: "nav.eyeCheckup" },
  { href: "/stores", label: "nav.stores" },
];

export const secondaryNav: NavItem[] = [
  { href: "/shop", label: "nav.shop" },
  { href: "/reviews", label: "nav.reviews" },
  { href: "/about", label: "nav.about" },
  { href: "/contact", label: "nav.contact" },
];
