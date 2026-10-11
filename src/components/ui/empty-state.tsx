import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Calm, centred empty state with a line-drawn spectacles motif. */
export function EmptyState({
  title,
  text,
  action,
  className,
}: {
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line-strong flex flex-col items-center rounded-md border border-dashed bg-white/60 px-6 py-16 text-center",
        className,
      )}
    >
      <svg viewBox="0 0 120 48" className="text-navy/25 mb-6 h-12 w-30" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="32" cy="26" r="17" />
          <circle cx="88" cy="26" r="17" />
          <path d="M49 24c4-4 18-4 22 0M15 22L3 14M105 22l12-8" />
        </g>
      </svg>
      <h2 className="font-display text-title text-ink">{title}</h2>
      {text && <p className="text-muted mt-2 max-w-sm text-sm">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
