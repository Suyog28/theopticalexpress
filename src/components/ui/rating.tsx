import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Visual star rating. Provide `label` for screen readers (e.g. "5.0 out of 5"). */
export function Rating({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={label}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block h-4 w-4" aria-hidden="true">
            <Star className="text-navy/20 absolute inset-0 h-4 w-4" strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-4 w-4 fill-[#c08a2e] text-[#c08a2e]" strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
