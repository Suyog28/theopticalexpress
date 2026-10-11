/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — the single place to edit business details.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every business fact carries a verification `status`:
 *    "owner-confirmed" → confirmed by the owner, safe to publish
 *    "source-checked"  → matched a public source on the date in `source`
 *    "unverified"      → preliminary research; MUST be confirmed before launch
 *  Search this file for "VERIFY" to find every value awaiting confirmation.
 *  See docs/VERIFICATION.md for the full checklist.
 */
import type { StoreLocation } from "@/types/store";
import type { DeliveryDestination } from "@/types/order";
import type { Locale, Localized } from "@/types/i18n";

const RESEARCH_DATE = "2026-10-11";

export const siteConfig = {
  /** Client brand: THE OPTICAL EXPRESS. Logo file still needs to be supplied by the owner. */
  brand: {
    name: "THE OPTICAL EXPRESS",
    tagline: {
      en: "Eyewear & eye care in Pune",
      mr: "पुण्यातील चष्मे आणि नेत्रसेवा",
      hi: "पुणे में चश्मे और नेत्र देखभाल",
    } satisfies Localized,
    logo: "/images/brand/logo.png",
    isTemporary: false,
  },

  /** Canonical URL for sitemap / Open Graph. Override with NEXT_PUBLIC_SITE_URL. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  locales: ["en", "mr", "hi"] as const satisfies readonly Locale[],
  defaultLocale: "en" as Locale,
  currency: "INR",

  /** Announcement bar — one message per locale. */
  announcement: {
    en: "Free delivery across Pune  |  Free shipping outside Pune on orders ₹999 and above",
    mr: "संपूर्ण पुण्यात मोफत डिलिव्हरी  |  पुण्याबाहेर ₹999 व त्याहून अधिकच्या ऑर्डरवर मोफत शिपिंग",
    hi: "पूरे पुणे में मुफ़्त डिलीवरी  |  पुणे के बाहर ₹999 और उससे अधिक के ऑर्डर पर मुफ़्त शिपिंग",
  } satisfies Localized,

  /** Delivery rules. All amounts are integer paise (₹1 = 100 paise). */
  delivery: {
    puneFeePaise: 0,
    /** ILLUSTRATIVE courier fee — VERIFY the actual rate with the owner. */
    outsidePuneFeePaise: 9900,
    courierFeeIsIllustrative: true,
    /** Free outside-Pune delivery at or above this amount. */
    freeThresholdPaise: 99900,
    /**
     * Which amount is compared with the threshold:
     *  "merchandise-subtotal" → before coupon discount (default, per brief)
     *  "after-discount"       → after coupon discount
     * VERIFY with the owner.
     */
    thresholdBasis: "merchandise-subtotal" as "merchandise-subtotal" | "after-discount",
    defaultDestination: "pune" as DeliveryDestination,
  },

  /** Demo-mode switches. Phase 1 must keep `demoMode: true`. */
  flags: {
    demoMode: true,
    /** Show verbatim Google review excerpts that await owner permission (labelled as such). */
    showPendingReviewExcerpts: true,
    /** Show rating figures that have not been owner-confirmed (labelled with retrieval date). */
    showUnconfirmedRatings: true,
  },

  social: {
    /** No social profiles were found during research. Add URLs when the owner supplies them. */
    instagram: null as string | null,
    facebook: null as string | null,
  },

  /** Public contact email — none known yet. VERIFY */
  email: null as string | null,

  research: { date: RESEARCH_DATE },
};

export const stores: StoreLocation[] = [
  {
    slug: "the-optical-express",
    name: "THE OPTICAL EXPRESS",
    shortName: "The Optical Express",
    area: { en: "Sahakarnagar", mr: "सहकारनगर", hi: "सहकारनगर" },
    address: {
      value:
        "Opp. Relax Veg, Shop No. 2, Suvarna Apartment, Tulshibagwale Colony Road, near Bagul Garden, Sahakarnagar No. 2, Pune, Maharashtra 411009",
      status: "source-checked",
      source: `the-optical-express.grexa.site, checked ${RESEARCH_DATE}`,
    },
    phone: {
      value: "+91 89837 90869",
      status: "source-checked",
      source: `the-optical-express.grexa.site, checked ${RESEARCH_DATE}`,
    },
    // Owner asked for the store phone to be used as the WhatsApp enquiry number.
    whatsapp: {
      value: "+91 89837 90869",
      status: "owner-confirmed",
      source: "Owner instruction: use store contact number for WhatsApp enquiries",
    },
    hours: {
      value: [{ days: [0, 1, 2, 3, 4, 5, 6], open: "10:00", close: "21:30" }],
      status: "source-checked",
      source: `the-optical-express.grexa.site, checked ${RESEARCH_DATE}`,
    },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=THE+OPTICAL+EXPRESS+Sahakarnagar+Pune",
    reviewsUrl:
      "https://www.google.com/maps/search/?api=1&query=THE+OPTICAL+EXPRESS+Sahakarnagar+Pune",
    rating: {
      value: 5.0,
      count: "252+",
      retrievedAt: RESEARCH_DATE,
      status: "source-checked",
      source: "Google rating as displayed on the-optical-express.grexa.site",
    },
    // Real store photos from the business's Google listing (via its own website).
    image: "/images/stores/the-optical-express-storefront.jpg",
    imageIsIllustrative: false,
    gallery: [
      "/images/stores/the-optical-express-interior-wide.jpg",
      "/images/stores/the-optical-express-interior-sunglasses.jpg",
      "/images/stores/the-optical-express-interior-frames.jpg",
      "/images/stores/the-optical-express-interior-counter.jpg",
      "/images/stores/the-optical-express-sunglasses-wall.jpg",
      "/images/stores/the-optical-express-interior-entrance.jpg",
      "/images/stores/the-optical-express-eye-test-room.jpg",
    ],
    // Services as listed on the business website.
    services: ["prescriptions", "fitting", "repairs", "eyeCare"],
  },
  {
    slug: "universal-eyecare",
    name: "Universal Eyecare",
    shortName: "Universal Eyecare",
    area: { en: "Mitra Mandal Chowk", mr: "मित्र मंडळ चौक", hi: "मित्र मंडल चौक" },
    // VERIFY: no public listing could be retrieved on the research date.
    address: {
      value:
        "Shop No. 2, near Mitra Mandal Chowk, opposite Purohit Hospital, Parvati Gaon, Parvati Paytha, Pune, Maharashtra 411009",
      status: "unverified",
      source: "Initial research brief — not yet confirmed",
    },
    phone: {
      value: "+91 83172 33588",
      status: "unverified",
      source: "Initial research brief — not yet confirmed",
    },
    whatsapp: {
      value: "+91 83172 33588",
      status: "owner-confirmed",
      source: "Owner instruction: use store contact number for WhatsApp enquiries",
    },
    hours: {
      value: [{ days: [0, 1, 2, 3, 4, 5, 6], open: "10:00", close: "22:00" }],
      status: "unverified",
      source: "Initial research brief — not yet confirmed",
    },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Universal+Eyecare+Mitra+Mandal+Chowk+Pune",
    reviewsUrl:
      "https://www.google.com/maps/search/?api=1&query=Universal+Eyecare+Mitra+Mandal+Chowk+Pune",
    rating: {
      value: 4.9,
      count: "46",
      retrievedAt: "initial research",
      status: "unverified",
      source: "Initial research brief — re-check on Google Maps",
    },
    image: "/images/stores/illustrative-frame-display.jpg",
    imageIsIllustrative: true,
    // VERIFY: services not yet confirmed — left empty rather than guessed.
    services: [],
  },
];

export type SiteConfig = typeof siteConfig;
