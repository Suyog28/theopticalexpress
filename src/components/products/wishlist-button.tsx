"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/stores/wishlist-store";
import { useToasts } from "@/stores/toast-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  productName,
  className,
  variant = "floating",
}: {
  productId: string;
  productName: string;
  className?: string;
  variant?: "floating" | "outline";
}) {
  const t = useT();
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.ids.includes(productId)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useToasts((s) => s.show);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={t(saved ? "product.removeFromWishlist" : "product.addToWishlist", {
        name: productName,
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(productId);
        if (added)
          toast(t("product.savedToWishlist"), { label: t("nav.wishlist"), href: "/wishlist" });
      }}
      className={cn(
        "inline-flex items-center justify-center transition-[color,background-color,transform] duration-200 active:scale-90",
        variant === "floating" &&
          "text-navy shadow-soft h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
        variant === "outline" &&
          "border-navy/80 text-navy hover:bg-navy/[0.04] h-12 w-12 shrink-0 rounded-sm border",
        className,
      )}
    >
      <Heart
        className={cn("h-[1.05rem] w-[1.05rem] transition-colors", saved && "fill-sale text-sale")}
        aria-hidden="true"
      />
    </button>
  );
}
