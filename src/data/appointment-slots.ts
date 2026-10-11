/**
 * MOCK appointment availability for the demo.
 * Real availability must come from the backend in Phase 2 (with server-side conflict checks).
 */

export interface SlotTemplate {
  /** "HH:MM" 24h, first and last bookable start time. */
  first: string;
  last: string;
  intervalMinutes: number;
}

export const slotTemplates: Record<string, SlotTemplate> = {
  "the-optical-express": { first: "10:30", last: "20:30", intervalMinutes: 30 },
  "universal-eyecare": { first: "10:30", last: "21:00", intervalMinutes: 30 },
};

/** How far ahead customers may request an appointment. */
export const BOOKING_WINDOW_DAYS = 30;
