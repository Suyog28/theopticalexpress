"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { stores } from "@/config/site";
import { useLocale, useT } from "@/i18n/client";
import { dynamicKey } from "@/i18n/messages";
import { useHydrated } from "@/hooks/use-hydrated";
import { bookingDateRange, getAvailableSlots, isSlotAvailable } from "@/lib/appointments";
import { fieldErrors, makeAppointmentSchema } from "@/lib/validation";
import { formatTime12h } from "@/lib/time";
import { storeWhatsAppUrl } from "@/lib/whatsapp";
import type { AppointmentRequest } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea, describedBy } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const storeSlugs = stores.map((s) => s.slug);

const dateFmt = (locale: string, iso: string) =>
  new Intl.DateTimeFormat(`${locale}-IN`, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00+05:30`));

export function AppointmentForm() {
  const t = useT();
  const locale = useLocale();
  const hydrated = useHydrated();
  const params = useSearchParams();
  const initialStore = params.get("store");

  const [values, setValues] = useState({
    name: "",
    mobile: "",
    email: "",
    storeSlug: initialStore && storeSlugs.includes(initialStore) ? initialStore : "",
    date: "",
    time: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<AppointmentRequest | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Computed client-side only, so "today" is the visitor's actual today (no stale build-time date).
  const range = hydrated ? bookingDateRange() : null;
  const slots = useMemo(
    () =>
      hydrated && values.storeSlug && values.date
        ? getAvailableSlots(values.storeSlug, values.date)
        : [],
    [hydrated, values.storeSlug, values.date],
  );

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({
      ...v,
      [key]: value,
      ...(key === "storeSlug" || key === "date" ? { time: "" } : {}),
    }));
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
  }

  function err(key: string) {
    return errors[key] ? t(dynamicKey(errors[key]!)) : undefined;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = makeAppointmentSchema(storeSlugs).safeParse(values);
    const errs = parsed.success ? {} : fieldErrors(parsed.error);
    if (!errs.time && values.time && !isSlotAvailable(values.storeSlug, values.date, values.time)) {
      errs.time = "validation.slot";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // DEMO ONLY: nothing is sent to the store and no slot is reserved.
    setConfirmed({
      ...values,
      email: values.email || undefined,
      message: values.message || undefined,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmed) {
    const store = stores.find((s) => s.slug === confirmed.storeSlug)!;
    const wa = storeWhatsAppUrl(store, "appointment");
    return (
      <div className="border-line rounded-md border bg-white p-8 text-center md:p-12">
        <CheckCircle2
          className="text-success mx-auto h-12 w-12"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h2 className="font-display text-headline text-ink mt-5">
          {t("appointment.confirmTitle")}
        </h2>
        <p className="text-muted mx-auto mt-4 max-w-md">
          {t("appointment.confirmText", { store: store.name })}
        </p>
        <dl className="bg-ivory mx-auto mt-8 max-w-sm space-y-3 rounded-sm p-5 text-left text-sm">
          <div>
            <dt className="text-muted text-xs tracking-wide uppercase">
              {t("appointment.summaryStore")}
            </dt>
            <dd className="text-ink mt-0.5 font-medium">{store.name}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs tracking-wide uppercase">
              {t("appointment.summaryWhen")}
            </dt>
            <dd className="text-ink mt-0.5 font-medium">
              {dateFmt(locale, confirmed.date)} · {formatTime12h(confirmed.time)}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmed(null);
              setValues((v) => ({ ...v, date: "", time: "", message: "" }));
            }}
          >
            {t("appointment.bookAnother")}
          </Button>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-sm bg-[#1f8f4e] px-6 text-white"
            >
              {t("appointment.followUpWhatsApp")}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="border-line space-y-6 rounded-md border bg-white p-6 md:p-8"
    >
      <Field id="appt-store" label={t("appointment.store")} error={err("storeSlug")} required>
        <Select
          id="appt-store"
          name="storeSlug"
          value={values.storeSlug}
          onChange={(e) => set("storeSlug", e.target.value)}
          aria-invalid={!!errors.storeSlug}
          aria-describedby={describedBy("appt-store", err("storeSlug"))}
        >
          <option value="">{t("appointment.selectStore")}</option>
          {stores.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name} — {s.area[locale]}
            </option>
          ))}
        </Select>
      </Field>

      <Field id="appt-date" label={t("appointment.date")} error={err("date")} required>
        <Input
          id="appt-date"
          name="date"
          type="date"
          value={values.date}
          min={range?.min}
          max={range?.max}
          onChange={(e) => set("date", e.target.value)}
          aria-invalid={!!errors.date}
          aria-describedby={describedBy("appt-date", err("date"))}
        />
      </Field>

      <fieldset aria-describedby={errors.time ? "appt-time-error" : undefined}>
        <legend className="text-ink mb-2 text-sm font-medium">
          {t("appointment.slot")}
          <span aria-hidden="true" className="text-error ml-0.5">
            *
          </span>
        </legend>
        {!values.storeSlug || !values.date ? (
          <p className="border-line-strong text-muted rounded-sm border border-dashed px-4 py-5 text-center text-sm">
            {t("appointment.chooseDateFirst")}
          </p>
        ) : slots.length === 0 || slots.every((s) => !s.available) ? (
          <p className="border-line-strong text-muted rounded-sm border border-dashed px-4 py-5 text-center text-sm">
            {t("appointment.noSlots")}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {slots.map((slot) => {
              const selected = values.time === slot.time;
              const label = formatTime12h(slot.time);
              return (
                <label
                  key={slot.time}
                  className={cn(
                    "has-[:focus-visible]:outline-secondary flex h-10 items-center justify-center rounded-sm border text-sm tabular-nums transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                    !slot.available &&
                      "border-line bg-ivory text-muted/50 cursor-not-allowed line-through",
                    slot.available &&
                      !selected &&
                      "border-line-strong text-ink hover:border-navy cursor-pointer",
                    selected && "border-navy bg-navy text-white",
                  )}
                >
                  <input
                    type="radio"
                    name="time"
                    value={slot.time}
                    disabled={!slot.available}
                    checked={selected}
                    onChange={() => set("time", slot.time)}
                    className="sr-only"
                    aria-label={
                      slot.available ? label : t("appointment.slotUnavailable", { time: label })
                    }
                  />
                  {label}
                </label>
              );
            })}
          </div>
        )}
        {errors.time && (
          <p id="appt-time-error" role="alert" className="text-error mt-2 text-xs font-medium">
            {err("time")}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="appt-name"
          label={t("appointment.name")}
          error={err("name")}
          required
          className="sm:col-span-2"
        >
          <Input
            id="appt-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("appt-name", err("name"))}
          />
        </Field>
        <Field
          id="appt-mobile"
          label={t("appointment.mobile")}
          error={err("mobile")}
          hint={t("checkout.mobileHint")}
          required
        >
          <Input
            id="appt-mobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            aria-invalid={!!errors.mobile}
            aria-describedby={describedBy("appt-mobile", err("mobile"), true)}
          />
        </Field>
        <Field id="appt-email" label={t("appointment.email")} error={err("email")}>
          <Input
            id="appt-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("appt-email", err("email"))}
          />
        </Field>
      </div>

      <Field
        id="appt-message"
        label={t("appointment.message")}
        error={err("message")}
        hint={t("appointment.messageHint")}
      >
        <Textarea
          id="appt-message"
          name="message"
          rows={3}
          maxLength={500}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-describedby={describedBy("appt-message", err("message"), true)}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
        {t("appointment.submit")}
      </Button>
    </form>
  );
}
