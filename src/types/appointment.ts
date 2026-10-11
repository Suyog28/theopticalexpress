export interface TimeSlot {
  /** "HH:MM" 24h */
  time: string;
  available: boolean;
}

export type AppointmentStatus =
  "requested" | "confirmed" | "rescheduled" | "cancelled" | "completed";

export interface AppointmentRequest {
  name: string;
  mobile: string;
  email?: string;
  storeSlug: string;
  /** "YYYY-MM-DD" */
  date: string;
  time: string;
  message?: string;
}

/** Phase 2 database shape. */
export interface Appointment extends AppointmentRequest {
  id: string;
  status: AppointmentStatus;
  createdAt: string;
  isDemo: boolean;
}
