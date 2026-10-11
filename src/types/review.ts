export type ReviewVerificationStatus =
  /** Confirmed by the owner for reuse on this site. */
  | "verified"
  /** Copied verbatim from a public source; owner permission to reuse still pending. */
  | "pending-permission";

export interface Review {
  id: string;
  storeSlug: string;
  author: string;
  /** Verbatim review text. Never paraphrase or edit. */
  text: string;
  /** ISO date as displayed by the source. */
  date: string;
  /** Per-review star rating, or null when the source does not display it. */
  rating: number | null;
  source: "google";
  sourceNote: string;
  sourceUrl: string;
  verificationStatus: ReviewVerificationStatus;
}
