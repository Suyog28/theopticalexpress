/** Both stores operate in India Standard Time; all scheduling uses Asia/Kolkata. */
export const STORE_TIME_ZONE = "Asia/Kolkata";

const dateParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: STORE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: STORE_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** "YYYY-MM-DD" for `now` in IST. */
export function todayInIST(now: Date = new Date()): string {
  return dateParts.format(now);
}

/** Minutes since midnight for `now` in IST. */
export function minutesNowInIST(now: Date = new Date()): number {
  const [h, m] = timeParts.format(now).split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Add whole days to a "YYYY-MM-DD" date string (calendar arithmetic, timezone-free). */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Day of week (0 = Sunday) for a "YYYY-MM-DD" date. */
export function dayOfWeek(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getUTCDay();
}

/** "21:30" → "9:30 PM" */
export function formatTime12h(hhmm: string): string {
  const total = toMinutes(hhmm);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}
