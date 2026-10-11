"use client";

import { useState } from "react";
import { FlaskConical, X } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Small, dismissible-per-session label reminding reviewers this is a demo build. */
export function DemoRibbon({
  label,
  text,
  closeLabel,
}: {
  label: string;
  text: string;
  closeLabel: string;
}) {
  const [hidden, setHidden] = useState(false);
  if (!siteConfig.flags.demoMode || hidden) return null;
  return (
    <div
      title={text}
      className="border-line text-muted shadow-soft fixed bottom-4 left-16 z-30 hidden items-center gap-2 rounded-full border bg-white/95 py-1.5 pr-1.5 pl-3 text-xs backdrop-blur md:flex"
    >
      <FlaskConical className="text-secondary h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="text-navy font-semibold uppercase">{label}</span>
      <span className="sr-only">{text}</span>
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="text-muted hover:text-navy rounded-full p-1"
        aria-label={closeLabel}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
