import { BOOKING_WINDOW_DAYS, slotTemplates } from "@/data/appointment-slots";
import type { TimeSlot } from "@/types/appointment";
import { addDays, fromMinutes, minutesNowInIST, toMinutes, todayInIST } from "./time";

/** Minimum lead time before a same-day slot can be requested. */
export const SAME_DAY_LEAD_MINUTES = 60;

/**
 * Small deterministic hash so the demo shows the same "already booked" slots
 * for a given store/date on every render (server and client agree).
 */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function isMockBooked(storeSlug: string, date: string, time: string): boolean {
  return hash(`${storeSlug}|${date}|${time}`) % 4 === 0;
}

export function bookingDateRange(now: Date = new Date()): { min: string; max: string } {
  const min = todayInIST(now);
  return { min, max: addDays(min, BOOKING_WINDOW_DAYS) };
}

/**
 * MOCK availability for a store on a date. In Phase 2 this must come from the backend,
 * which also prevents double-booking at submit time.
 */
export function getAvailableSlots(
  storeSlug: string,
  date: string,
  now: Date = new Date(),
): TimeSlot[] {
  const template = slotTemplates[storeSlug];
  if (!template || !date) return [];
  const { min, max } = bookingDateRange(now);
  if (date < min || date > max) return [];

  const isToday = date === min;
  const cutoff = minutesNowInIST(now) + SAME_DAY_LEAD_MINUTES;
  const slots: TimeSlot[] = [];
  for (
    let t = toMinutes(template.first);
    t <= toMinutes(template.last);
    t += template.intervalMinutes
  ) {
    const time = fromMinutes(t);
    const past = isToday && t < cutoff;
    slots.push({ time, available: !past && !isMockBooked(storeSlug, date, time) });
  }
  return slots;
}

export function isSlotAvailable(
  storeSlug: string,
  date: string,
  time: string,
  now: Date = new Date(),
) {
  return getAvailableSlots(storeSlug, date, now).some((s) => s.time === time && s.available);
}
