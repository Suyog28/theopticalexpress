"use client";

import { Check, X } from "lucide-react";
import { useToasts } from "@/stores/toast-store";
import { LocaleLink, useT } from "@/i18n/client";

export function Toaster() {
  const t = useT();
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:right-6 sm:bottom-6 sm:left-auto sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="animate-toast bg-navy shadow-lift pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-md px-4 py-3 text-sm text-white"
        >
          <Check className="h-4 w-4 shrink-0 text-white/80" aria-hidden="true" />
          <span className="flex-1">{toast.message}</span>
          {toast.action && (
            <LocaleLink
              href={toast.action.href}
              className="shrink-0 font-semibold underline underline-offset-4"
            >
              {toast.action.label}
            </LocaleLink>
          )}
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="-mr-1 shrink-0 rounded-sm p-1 text-white/60 hover:text-white"
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
