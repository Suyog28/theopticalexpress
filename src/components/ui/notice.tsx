import type { ReactNode } from "react";
import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline notice used for demo-mode and verification messages. */
export function Notice({
  children,
  tone = "info",
  className,
  title,
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "demo";
  className?: string;
  title?: ReactNode;
}) {
  const Icon = tone === "warning" ? TriangleAlert : Info;
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-sm border px-4 py-3 text-sm leading-relaxed",
        tone === "info" && "border-line text-muted bg-white",
        tone === "warning" && "border-warning/20 bg-warning-bg text-warning",
        tone === "demo" && "border-secondary/25 bg-secondary/[0.07] text-primary",
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
