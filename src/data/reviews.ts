/**
 * Google review excerpts.
 *
 * THE OPTICAL EXPRESS: copied VERBATIM (including original spelling) from the Google reviews
 * displayed on the business's own website, the-optical-express.grexa.site, on 2026-10-11.
 * Per-review star ratings are not displayed there, so `rating` is null.
 * Status is "pending-permission" until the owner confirms they may be reused here.
 *
 * UNIVERSAL EYECARE: no reviews could be retrieved from a permitted source yet.
 * Do NOT copy reviews from one store to the other.
 */
import type { Review } from "@/types/review";

const OE_SOURCE = "https://the-optical-express.grexa.site/";
const OE_NOTE = "Google review, as displayed on the business website (retrieved 2026-10-11)";

const oe = (id: string, author: string, date: string, text: string): Review => ({
  id,
  storeSlug: "the-optical-express",
  author,
  text,
  date,
  rating: null,
  source: "google",
  sourceNote: OE_NOTE,
  sourceUrl: OE_SOURCE,
  verificationStatus: "pending-permission",
});

export const reviews: Review[] = [
  oe(
    "oe-1",
    "Kishori Upadhye",
    "2026-09-15",
    "The staff at the shop is very helpful. Customers are treated with respect and courtesy.",
  ),
  oe(
    "oe-2",
    "Sayali Salvi",
    "2026-09-12",
    "I have purchased contact lens from OPTICAL EXPRESS i have both spherical and cylindrical eye power they suggested me celebration yearly contact lenses and that suggestions turned superb they delivered contact lenses within 24 hours with best vision and superb comfort. owner and staff is really nice and coprative Really nice experience in OPTICAL EXPRESS",
  ),
  oe("oe-3", "Vaishali Karve -Phadke", "2026-07-20", "Excellent service! Highly recommended!"),
  oe(
    "oe-4",
    "Rohit Ajit Dharmadhikari",
    "2026-07-13",
    "We had very good experience with The Optical Express. Mr. Mangesh is polite and understands the customer requirements very well. He suggested the perfect fit and gave add ons and upgrades free of cost. Highly recommended for a good service and budget friendly eye wear.",
  ),
  oe(
    "oe-5",
    "Amit Mandhre",
    "2026-06-24",
    "Large selection, reasonable pricing and excellent customer service. All of my family's optical needs are met here. Highly recommended local neighborhood store.",
  ),
  oe(
    "oe-6",
    "sharad dhumal",
    "2026-05-26",
    "Amazing customer service and perfect fitting for my new specs. Thank you!",
  ),
  oe(
    "oe-7",
    "Rahul Joglekar",
    "2026-04-27",
    "Good and prompt service, polite and courteous staff members, they are proactive to follow up for servicing of the product. Strongly recommended",
  ),
];

export function getReviewsForStore(storeSlug: string, includePending: boolean): Review[] {
  return reviews.filter(
    (r) => r.storeSlug === storeSlug && (includePending || r.verificationStatus === "verified"),
  );
}
