import { formatINR } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function Price({
  pricePaise,
  originalPricePaise,
  size = "md",
  originalLabel,
  className,
}: {
  pricePaise: number;
  originalPricePaise?: number;
  size?: "sm" | "md" | "lg";
  /** Accessible label for the struck-through price, e.g. "Original price". */
  originalLabel?: string;
  className?: string;
}) {
  const hasDiscount = !!originalPricePaise && originalPricePaise > pricePaise;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "text-ink font-semibold tabular-nums",
          size === "sm" && "text-sm",
          size === "md" && "text-[0.9375rem]",
          size === "lg" && "text-2xl",
        )}
      >
        {formatINR(pricePaise)}
      </span>
      {hasDiscount && (
        <s className={cn("text-muted tabular-nums", size === "lg" ? "text-base" : "text-sm")}>
          {originalLabel && <span className="sr-only">{originalLabel}: </span>}
          {formatINR(originalPricePaise)}
        </s>
      )}
    </span>
  );
}
