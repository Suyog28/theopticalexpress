import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "ivory" | "sale" | "outline" | "warning" | "success";

const tones: Record<Tone, string> = {
  navy: "bg-teal-deep text-white",
  ivory: "bg-white/90 text-navy backdrop-blur-sm",
  sale: "bg-sale text-white",
  outline: "border border-line-strong text-muted bg-white",
  warning: "bg-warning-bg text-warning",
  success: "bg-success-bg text-success",
};

export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.6875rem] leading-none font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
