"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, CreditCard, Landmark, Lock, Smartphone } from "lucide-react";
import { LocaleLink, useT } from "@/i18n/client";
import { dynamicKey, type MessageKey } from "@/i18n/messages";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCart } from "@/stores/cart-store";
import { checkoutSchema, fieldErrors, type CheckoutInput } from "@/lib/validation";
import { demoPaymentProvider } from "@/lib/payments/provider";
import { formatINR } from "@/lib/currency";
import type { OrderTotals } from "@/types/order";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field, Input, describedBy } from "@/components/ui/form";
import { Notice } from "@/components/ui/notice";
import { EmptyState } from "@/components/ui/empty-state";
import { CartLineItem, DestinationToggle, OrderSummary } from "@/components/cart/cart-parts";
import { CartSkeleton } from "@/components/cart/cart-view";
import { useOrderTotals } from "@/components/cart/use-order-totals";
import { cn } from "@/lib/utils";

const EMPTY: CheckoutInput = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  city: "Pune",
  state: "Maharashtra",
  pin: "",
};

const FIELDS: {
  name: keyof CheckoutInput;
  label: MessageKey;
  type?: string;
  autoComplete: string;
  hint?: MessageKey;
  inputMode?: "numeric" | "tel" | "email";
  full?: boolean;
}[] = [
  { name: "name", label: "checkout.name", autoComplete: "name", full: true },
  {
    name: "email",
    label: "checkout.email",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    name: "mobile",
    label: "checkout.mobile",
    type: "tel",
    autoComplete: "tel",
    hint: "checkout.mobileHint",
    inputMode: "tel",
  },
  {
    name: "address",
    label: "checkout.address",
    autoComplete: "street-address",
    hint: "checkout.addressHint",
    full: true,
  },
  { name: "city", label: "checkout.city", autoComplete: "address-level2" },
  { name: "state", label: "checkout.state", autoComplete: "address-level1" },
  { name: "pin", label: "checkout.pin", autoComplete: "postal-code", inputMode: "numeric" },
];

interface Confirmation {
  reference: string;
  totals: OrderTotals;
  destination: string;
}

export function CheckoutView() {
  const t = useT();
  const hydrated = useHydrated();
  const totals = useOrderTotals();
  const destination = useCart((s) => s.destination);
  const clear = useCart((s) => s.clear);
  const [values, setValues] = useState<CheckoutInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!hydrated) return <CartSkeleton />;
  if (confirmation) return <DemoConfirmation confirmation={confirmation} />;

  if (totals.lines.length === 0) {
    return (
      <EmptyState
        title={t("checkout.emptyTitle")}
        text={t("checkout.emptyText")}
        action={
          <LocaleLink href="/shop" className={buttonClasses()}>
            {t("checkout.keepShopping")}
          </LocaleLink>
        }
      />
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    // DEMO ONLY: no network call, no payment, nothing is sent to the store.
    const payment = await demoPaymentProvider.createPayment(totals, "upi");
    setConfirmation({ reference: payment.providerOrderId, totals, destination });
    clear();
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div>
      <Notice tone="demo" className="mb-8">
        {t("checkout.demoBanner")}
      </Notice>
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14"
      >
        <div className="space-y-10">
          {hasErrors && (
            <p role="alert" className="bg-error-bg text-error rounded-sm px-4 py-3 text-sm">
              {t("checkout.fixErrors")}
            </p>
          )}
          <section>
            <h2 className="font-display text-ink text-xl">{t("checkout.shipping")}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => {
                const id = `checkout-${f.name}`;
                const error = errors[f.name] ? t(dynamicKey(errors[f.name]!)) : undefined;
                const hint = f.hint ? t(f.hint) : undefined;
                return (
                  <Field
                    key={f.name}
                    id={id}
                    label={t(f.label)}
                    error={error}
                    hint={hint}
                    required
                    className={cn(f.full && "sm:col-span-2")}
                  >
                    <Input
                      id={id}
                      name={f.name}
                      type={f.type ?? "text"}
                      inputMode={f.inputMode}
                      autoComplete={f.autoComplete}
                      value={values[f.name]}
                      required
                      aria-invalid={!!error}
                      aria-describedby={describedBy(id, error, hint)}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, [f.name]: e.target.value }));
                        if (errors[f.name]) setErrors(({ [f.name]: _removed, ...rest }) => rest);
                      }}
                    />
                  </Field>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-ink mb-5 text-xl">{t("checkout.destination")}</h2>
            <DestinationToggle name="checkout-destination" />
          </section>

          <section>
            <h2 className="font-display text-ink text-xl">{t("checkout.payment")}</h2>
            <p className="text-muted mt-2 text-sm">{t("checkout.paymentPreview")}</p>
            <fieldset disabled className="mt-4 grid gap-2 sm:grid-cols-3">
              <legend className="sr-only">{t("checkout.payment")}</legend>
              {[
                { key: "upi", icon: Smartphone },
                { key: "card", icon: CreditCard },
                { key: "netbanking", icon: Landmark },
              ].map(({ key, icon: Icon }) => (
                <label
                  key={key}
                  className="border-line-strong text-muted flex cursor-not-allowed items-center gap-3 rounded-sm border border-dashed bg-white/60 px-4 py-3 text-sm"
                >
                  <input type="radio" name="payment" className="sr-only" />
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>
                    <span className="text-ink/70 block font-medium">
                      {t(dynamicKey(`checkout.methods.${key}`))}
                    </span>
                    <span className="text-[0.6875rem]">{t("checkout.notActive")}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          </section>
        </div>

        <aside className="border-line rounded-md border bg-white p-6 lg:sticky lg:top-36">
          <h2 className="font-display text-ink text-xl">{t("cart.summary")}</h2>
          <ul className="divide-line border-line mt-4 divide-y border-y">
            {totals.lines.map((line) => (
              <CartLineItem key={`${line.productId}-${line.variantId}`} line={line} compact />
            ))}
          </ul>
          <div className="mt-5">
            <OrderSummary totals={totals} />
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
            <Lock className="h-4 w-4" aria-hidden="true" />
            {submitting ? t("checkout.submitting") : t("checkout.submit")}
          </Button>
          <p className="text-muted mt-3 text-center text-[0.6875rem]">{t("checkout.demoBanner")}</p>
        </aside>
      </form>
    </div>
  );
}

function DemoConfirmation({ confirmation }: { confirmation: Confirmation }) {
  const t = useT();
  const { totals } = confirmation;
  return (
    <div className="mx-auto max-w-xl text-center">
      <CheckCircle2
        className="text-success mx-auto h-12 w-12"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h2 className="font-display text-headline text-ink mt-5">{t("checkout.confirmTitle")}</h2>
      <p className="text-muted mt-4">{t("checkout.confirmText")}</p>
      <div className="border-line mt-8 rounded-md border bg-white p-6 text-left">
        <p className="text-muted text-xs tracking-wide uppercase">{t("checkout.reference")}</p>
        <p className="text-navy mt-1 font-mono text-lg font-semibold">{confirmation.reference}</p>
        <p className="text-muted mt-5 text-xs tracking-wide uppercase">
          {t("checkout.summaryTitle")}
        </p>
        <dl className="mt-2 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{t("cart.subtotal")}</dt>
            <dd>{formatINR(totals.subtotalPaise)}</dd>
          </div>
          {totals.discountPaise > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">{t("cart.discount")}</dt>
              <dd>−{formatINR(totals.discountPaise)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">{t("cart.delivery")}</dt>
            <dd>{totals.deliveryIsFree ? t("cart.free") : formatINR(totals.deliveryPaise)}</dd>
          </div>
          <div className="border-line flex justify-between border-t pt-2 font-semibold">
            <dt>{t("cart.total")}</dt>
            <dd>{formatINR(totals.totalPaise)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LocaleLink href="/" className={buttonClasses()}>
          {t("checkout.backHome")}
        </LocaleLink>
        <LocaleLink href="/shop" className={buttonClasses({ variant: "secondary" })}>
          {t("checkout.keepShopping")}
        </LocaleLink>
      </div>
    </div>
  );
}
