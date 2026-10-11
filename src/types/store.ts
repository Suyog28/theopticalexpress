import type { Localized } from "./i18n";

/**
 * How much a business fact can be trusted.
 * - owner-confirmed: confirmed by the business owner — safe to publish.
 * - source-checked: matches a public source (e.g. the business's own website) on the given date.
 * - unverified: preliminary research only — must be confirmed before publication.
 */
export type VerificationStatus = "owner-confirmed" | "source-checked" | "unverified";

export interface Verifiable<T> {
  value: T;
  status: VerificationStatus;
  /** Where the value came from and when it was checked. */
  source: string;
}

export interface OpeningHours {
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  /** 24h "HH:MM" */
  open: string;
  close: string;
}

export interface StoreRating {
  value: number;
  count: string;
  retrievedAt: string;
  status: VerificationStatus;
  source: string;
}

export interface StoreLocation {
  slug: string;
  name: string;
  shortName: string;
  area: Localized;
  address: Verifiable<string>;
  phone: Verifiable<string>;
  /** E.164 digits without "+", or null until a WhatsApp Business number is confirmed. */
  whatsapp: Verifiable<string | null>;
  hours: Verifiable<OpeningHours[]>;
  mapsUrl: string;
  reviewsUrl: string;
  rating: StoreRating | null;
  image: string;
  imageIsIllustrative: boolean;
  /** Extra real photos shown on the store page. */
  gallery?: string[];
  services: string[];
}
