/**
 * WhatsApp click-to-chat links (https://wa.me/<number>?text=<message>).
 * Returns null when a store's WhatsApp number has not been confirmed, so the UI can
 * show a disabled "pending verification" state instead of messaging an unverified number.
 */
import type { StoreLocation } from "@/types/store";

export type WhatsAppTemplate = "general" | "product" | "appointment";

export interface WhatsAppVars {
  storeName: string;
  productName?: string;
  productUrl?: string;
}

/** Message templates are kept in English so staff receive consistent enquiries. */
export function whatsappMessage(template: WhatsAppTemplate, vars: WhatsAppVars): string {
  switch (template) {
    case "product":
      return `Hello ${vars.storeName}, I'd like to know more about the ${vars.productName ?? "frame"}${
        vars.productUrl ? ` (${vars.productUrl})` : ""
      }. Is it available?`;
    case "appointment":
      return `Hello ${vars.storeName}, I'd like to book an eye check-up. Please share available times.`;
    case "general":
    default:
      return `Hello ${vars.storeName}, I have a question about your eyewear.`;
  }
}

/** Digits only; must be a plausible international number (country code + subscriber). */
export function sanitizeWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function buildWhatsAppUrl(
  number: string | null | undefined,
  message: string,
): string | null {
  const digits = sanitizeWhatsAppNumber(number);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** A store's WhatsApp link, or null unless its number is owner-confirmed. */
export function storeWhatsAppUrl(
  store: StoreLocation,
  template: WhatsAppTemplate,
  vars: Omit<WhatsAppVars, "storeName"> = {},
): string | null {
  if (store.whatsapp.status !== "owner-confirmed") return null;
  return buildWhatsAppUrl(
    store.whatsapp.value,
    whatsappMessage(template, { storeName: store.shortName, ...vars }),
  );
}
