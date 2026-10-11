import { describe, expect, it } from "vitest";
import {
  buildWhatsAppUrl,
  sanitizeWhatsAppNumber,
  storeWhatsAppUrl,
  whatsappMessage,
} from "./whatsapp";
import { getAvailableSlots, isSlotAvailable } from "./appointments";
import { checkoutSchema, fieldErrors, makeAppointmentSchema } from "./validation";
import { stores } from "@/config/site";
import { demoReference } from "./payments/provider";
import { reviews } from "@/data/reviews";

describe("whatsapp links", () => {
  it("URL-encodes the message", () => {
    const url = buildWhatsAppUrl("+91 98765 43210", "Hello & welcome? 50% off #1");
    expect(url).toBe(
      "https://wa.me/919876543210?text=Hello%20%26%20welcome%3F%2050%25%20off%20%231",
    );
  });
  it("returns null for missing or implausible numbers", () => {
    expect(buildWhatsAppUrl(null, "hi")).toBeNull();
    expect(sanitizeWhatsAppNumber("12345")).toBeNull();
  });
  it("links every store to its own wa.me number", () => {
    const urls = stores.map((s) => storeWhatsAppUrl(s, "general"));
    expect(urls[0]).toMatch(/^https:\/\/wa\.me\/918983790869\?text=/);
    for (const u of urls) expect(u).not.toBeNull();
  });
  it("is disabled for a store whose number is not owner-confirmed", () => {
    const pending = {
      ...stores[0]!,
      whatsapp: { ...stores[0]!.whatsapp, status: "unverified" as const },
    };
    expect(storeWhatsAppUrl(pending, "general")).toBeNull();
  });
  it("works once a store number is confirmed", () => {
    const confirmed = {
      ...stores[0]!,
      whatsapp: { value: "919876543210", status: "owner-confirmed" as const, source: "owner" },
    };
    const url = storeWhatsAppUrl(confirmed, "product", { productName: "Aurora Rectangle" });
    expect(url).toContain("https://wa.me/919876543210?text=");
    expect(decodeURIComponent(url!.split("text=")[1]!)).toContain("Aurora Rectangle");
  });
  it("builds distinct templates", () => {
    const v = { storeName: "Store" };
    expect(whatsappMessage("appointment", v)).toMatch(/eye check-up/);
    expect(whatsappMessage("general", v)).not.toEqual(whatsappMessage("appointment", v));
  });
});

describe("appointment availability (mock)", () => {
  // 11 Oct 2026, 14:10 IST
  const now = new Date("2026-10-11T14:10:00+05:30");
  it("disables same-day slots before now + lead time", () => {
    const slots = getAvailableSlots("the-optical-express", "2026-10-11", now);
    for (const s of slots.filter((s) => s.time <= "15:00")) expect(s.available).toBe(false);
  });
  it("returns nothing for past dates or beyond the booking window", () => {
    expect(getAvailableSlots("the-optical-express", "2026-10-10", now)).toEqual([]);
    expect(getAvailableSlots("the-optical-express", "2026-12-31", now)).toEqual([]);
  });
  it("has some available and some booked slots on a future day, deterministically", () => {
    const a = getAvailableSlots("universal-eyecare", "2026-10-14", now);
    const b = getAvailableSlots("universal-eyecare", "2026-10-14", now);
    expect(a).toEqual(b);
    expect(a.some((s) => s.available)).toBe(true);
    expect(a.some((s) => !s.available)).toBe(true);
  });
  it("rejects unknown stores", () => {
    expect(getAvailableSlots("nope", "2026-10-14", now)).toEqual([]);
    expect(isSlotAvailable("nope", "2026-10-14", "11:00", now)).toBe(false);
  });
});

describe("validation", () => {
  it("accepts valid Indian checkout details", () => {
    const r = checkoutSchema.safeParse({
      name: "Asha Patil",
      email: "asha@example.com",
      mobile: "+91 98765 43210",
      address: "12, Sahakarnagar Road",
      city: "Pune",
      state: "Maharashtra",
      pin: "411009",
    });
    expect(r.success).toBe(true);
  });
  it("returns translation keys for invalid fields", () => {
    const r = checkoutSchema.safeParse({
      name: "",
      email: "bad",
      mobile: "12345",
      address: "x",
      city: "",
      state: "Maharashtra",
      pin: "011009",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const e = fieldErrors(r.error);
      expect(e.name).toBe("validation.required");
      expect(e.email).toBe("validation.email");
      expect(e.mobile).toBe("validation.mobile");
      expect(e.pin).toBe("validation.pin");
    }
  });
  it("rejects past appointment dates", () => {
    const schema = makeAppointmentSchema(
      ["the-optical-express"],
      new Date("2026-10-11T10:00:00+05:30"),
    );
    const r = schema.safeParse({
      name: "Ravi",
      mobile: "9876543210",
      email: "",
      storeSlug: "the-optical-express",
      date: "2026-10-10",
      time: "11:00",
      message: "",
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).date).toBe("validation.pastDate");
  });
});

describe("demo safety", () => {
  it("marks simulated references as DEMO", () => {
    expect(demoReference(new Date("2026-10-11T00:00:00Z"), () => 0.5)).toMatch(/^DEMO-261011-/);
  });
  it("never attributes reviews to a store they were not written for", () => {
    expect(reviews.every((r) => r.storeSlug === "the-optical-express")).toBe(true);
  });
});
