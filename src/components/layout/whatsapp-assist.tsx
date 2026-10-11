"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { stores } from "@/config/site";
import { storeWhatsAppUrl } from "@/lib/whatsapp";
import { useT } from "@/i18n/client";

/**
 * Floating WhatsApp assistant. Lets the customer pick a store; each store's button is
 * disabled with a "pending verification" note until its WhatsApp number is confirmed.
 */
export function WhatsAppAssist() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6">
      {open && (
        <div
          id="whatsapp-panel"
          role="dialog"
          aria-label={t("nav.whatsappHelp")}
          className="animate-toast border-line shadow-lift absolute right-0 bottom-16 w-[min(20rem,calc(100vw-2rem))] rounded-md border bg-white p-4"
        >
          <p className="font-display text-navy text-lg">{t("nav.needHelp")}</p>
          <p className="text-muted mt-1 text-xs">{t("contact.chooseStore")}</p>
          <ul className="mt-3 space-y-2">
            {stores.map((s) => {
              const url = storeWhatsAppUrl(s, "general");
              return (
                <li key={s.slug}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-line text-navy flex items-center justify-between rounded-sm border px-3 py-2.5 text-sm font-medium hover:border-[#25D366] hover:bg-[#25D366]/10"
                    >
                      <span>
                        {s.shortName}
                        <span className="text-muted mt-0.5 block text-xs font-normal tabular-nums">
                          {s.whatsapp.value}
                        </span>
                      </span>
                      <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                    </a>
                  ) : (
                    <div
                      aria-disabled="true"
                      className="border-line-strong text-muted rounded-sm border border-dashed px-3 py-2.5 text-sm"
                    >
                      <span className="text-navy/60 font-medium">{s.shortName}</span>
                      <span className="mt-0.5 block text-xs">{t("store.whatsappPending")}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="whatsapp-panel"
        aria-label={t("nav.whatsappHelp")}
        className="shadow-lift flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white ring-4 ring-[#25D366]/25 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <WhatsAppIcon className="h-7 w-7" />
        )}
      </button>
    </div>
  );
}
