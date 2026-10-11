/**
 * Form validation schemas. Error messages are translation keys under "validation.*"
 * so the UI can show them in the active language.
 */
import { z } from "zod";
import { todayInIST } from "./time";

/** Indian mobile: optional +91/91/0 prefix, then 10 digits starting 6–9. */
export const INDIAN_MOBILE = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;
export const INDIAN_PIN = /^[1-9]\d{5}$/;

export function normalizeMobile(value: string): string {
  return value.replace(/[\s-]/g, "");
}

const mobile = z
  .string()
  .trim()
  .min(1, "validation.required")
  .refine((v) => INDIAN_MOBILE.test(normalizeMobile(v)), "validation.mobile");

const optionalEmail = z
  .string()
  .trim()
  .refine((v) => v === "" || z.email().safeParse(v).success, "validation.email");

const requiredText = (max = 120) =>
  z.string().trim().min(1, "validation.required").max(max, "validation.tooLong");

export const checkoutSchema = z.object({
  name: requiredText(80).refine((v) => v.length >= 2, "validation.name"),
  email: z
    .string()
    .trim()
    .min(1, "validation.required")
    .refine((v) => z.email().safeParse(v).success, "validation.email"),
  mobile,
  address: requiredText(240).refine((v) => v.length >= 8, "validation.address"),
  city: requiredText(60),
  state: requiredText(60),
  pin: z.string().trim().min(1, "validation.required").regex(INDIAN_PIN, "validation.pin"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export function makeAppointmentSchema(validStoreSlugs: string[], now: Date = new Date()) {
  const today = todayInIST(now);
  return z.object({
    name: requiredText(80).refine((v) => v.length >= 2, "validation.name"),
    mobile,
    email: optionalEmail,
    storeSlug: z.string().refine((v) => validStoreSlugs.includes(v), "validation.store"),
    date: z
      .string()
      .min(1, "validation.date")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "validation.date")
      .refine((v) => v >= today, "validation.pastDate"),
    time: z.string().min(1, "validation.slot"),
    message: z.string().trim().max(500, "validation.tooLong"),
  });
}

export type AppointmentInput = z.infer<ReturnType<typeof makeAppointmentSchema>>;

/** Flatten a zod error into { field: translationKey } (first error per field). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
