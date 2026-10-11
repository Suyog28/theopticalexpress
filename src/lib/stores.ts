import { stores } from "@/config/site";
import type { OpeningHours, StoreLocation } from "@/types/store";
import { dayOfWeek, minutesNowInIST, todayInIST, toMinutes } from "./time";

export function getStore(slug: string): StoreLocation | undefined {
  return stores.find((s) => s.slug === slug);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function isEveryDay(hours: OpeningHours[]): boolean {
  return hours.length === 1 && hours[0]!.days.length === 7;
}

/** Whether the store is open at `now` (IST), based on configured hours. */
export function isOpenNow(store: StoreLocation, now: Date = new Date()): boolean {
  const dow = dayOfWeek(todayInIST(now));
  const minutes = minutesNowInIST(now);
  return store.hours.value.some(
    (h) => h.days.includes(dow) && minutes >= toMinutes(h.open) && minutes < toMinutes(h.close),
  );
}
