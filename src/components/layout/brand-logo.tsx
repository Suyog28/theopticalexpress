import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Official logo (white frames + teal wordmark — designed for a dark background).
 * On light surfaces (tone="dark") it sits on a navy badge; on the navy footer it sits directly.
 */
export function BrandLogo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        tone === "dark" && "bg-navy rounded-[6px] px-3 py-1 sm:px-4",
        className,
      )}
    >
      <Image
        src={siteConfig.brand.logo}
        alt={siteConfig.brand.name}
        width={906}
        height={315}
        className={cn("w-auto", tone === "dark" ? "h-10 sm:h-12" : "h-20")}
        priority
      />
    </span>
  );
}
