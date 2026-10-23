"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/format";
import { createOrderReference, buildWhatsAppOrderUrl } from "@/lib/whatsapp";

interface FormState {
  name: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  address: "",
  city: "",
  pin: "",
  notes: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  const phoneDigits = form.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    errors.phone = "Enter a valid phone number with 10–13 digits.";
  }
  if (form.address.trim().length < 10) {
    errors.address = "Please enter your complete delivery address.";
  }
  if (form.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }
  if (!/^\d{6}$/.test(form.pin.trim())) {
    errors.pin = "Enter a valid 6-digit PIN code.";
  }
  if (form.notes.trim().length > 500) {
    errors.notes = "Notes must be 500 characters or fewer.";
  }
  return errors;
}

export default function CheckoutForm() {
  const { items, summary, hydrated, revalidateCart, openCart } = useCart();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "opening" | "opened" | "invalid"
  >("idle");
  const [reference, setReference] = useState("");

  const update = (field: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    }
    if (status === "opened" || status === "invalid") setStatus("idle");
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`checkout-${firstField}`)?.focus();
      return;
    }

    const validated = revalidateCart();
    if (validated.isEmpty) {
      setStatus("invalid");
      return;
    }
    if (validated.rejectedLineCount > 0) {
      setStatus("invalid");
      return;
    }

    setStatus("opening");
    const orderReference = createOrderReference();
    setReference(orderReference);

    const url = buildWhatsAppOrderUrl({
      items,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        pin: form.pin.trim(),
        notes: form.notes.trim(),
      },
      reference: orderReference,
      summary: validated,
    });

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    setStatus(opened ? "opened" : "invalid");
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-center gap-2 text-cocoa/60">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading your cart…
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream-dark text-forest">
          <MessageCircle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="font-display mt-5 text-3xl font-bold text-forest">
          Your cart is empty
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-cocoa/70">
          Add a product and pack size before starting checkout. Nothing is
          charged on this website — the final order is confirmed on WhatsApp.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep"
        >
          Browse the shop
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-14">
      <form onSubmit={onSubmit} noValidate className="order-2 lg:order-1">
        <div className="rounded-3xl border border-gold/35 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-sm font-bold text-cream">
              1
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-forest">
                Customer details
              </h2>
              <p className="text-xs text-cocoa/60">
                Used only to prepare your WhatsApp order message.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              id="checkout-name"
              label="Full name"
              required
              error={errors.name}
              className="sm:col-span-1"
            >
              <input
                id="checkout-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "checkout-name-error" : undefined}
                placeholder="Your full name"
                className={inputClass(Boolean(errors.name))}
              />
            </Field>

            <Field
              id="checkout-phone"
              label="Phone number"
              required
              error={errors.phone}
            >
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "checkout-phone-error" : undefined
                }
                placeholder="10-digit mobile number"
                className={inputClass(Boolean(errors.phone))}
              />
            </Field>

            <Field
              id="checkout-address"
              label="Full delivery address"
              required
              error={errors.address}
              className="sm:col-span-2"
            >
              <textarea
                id="checkout-address"
                name="address"
                rows={3}
                autoComplete="street-address"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={
                  errors.address ? "checkout-address-error" : undefined
                }
                placeholder="House/flat number, street, area, landmark"
                className={`${inputClass(Boolean(errors.address))} resize-y`}
              />
            </Field>

            <Field
              id="checkout-city"
              label="City"
              required
              error={errors.city}
            >
              <input
                id="checkout-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "checkout-city-error" : undefined}
                placeholder="City"
                className={inputClass(Boolean(errors.city))}
              />
            </Field>

            <Field
              id="checkout-pin"
              label="PIN code"
              required
              error={errors.pin}
            >
              <input
                id="checkout-pin"
                name="pin"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={form.pin}
                onChange={(event) =>
                  update("pin", event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                aria-invalid={Boolean(errors.pin)}
                aria-describedby={errors.pin ? "checkout-pin-error" : undefined}
                placeholder="6-digit PIN code"
                className={inputClass(Boolean(errors.pin))}
              />
            </Field>

            <Field
              id="checkout-notes"
              label="Order notes (optional)"
              error={errors.notes}
              className="sm:col-span-2"
            >
              <textarea
                id="checkout-notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={
                  errors.notes ? "checkout-notes-error" : undefined
                }
                placeholder="Delivery instructions, preferred date, spice preferences…"
                className={`${inputClass(Boolean(errors.notes))} resize-y`}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-gold/35 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-sm font-bold text-cream">
              2
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-forest">
                Review & send
              </h2>
              <p className="text-xs text-cocoa/60">
                The total is recalculated from the catalog before sending.
              </p>
            </div>
          </div>

          {status === "opened" && (
            <div
              className="mt-5 rounded-2xl border border-green-700/25 bg-green-50 px-4 py-3 text-sm text-green-900"
              role="status"
            >
              <p className="flex items-start gap-2 font-semibold">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                WhatsApp was opened with order {reference}.
              </p>
              <p className="mt-1 pl-6 text-xs leading-relaxed">
                Your order is <strong>not confirmed yet</strong>. Please press
                send in WhatsApp and wait for Zohra-Zaika to confirm
                availability, delivery and any bulk price.
              </p>
            </div>
          )}

          {status === "invalid" && (
            <div
              className="mt-5 rounded-2xl border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
              role="alert"
            >
              Some cart items were no longer available. Please return to the
              cart, review it, and try again.
            </div>
          )}

          <div className="mt-5 rounded-2xl bg-cream px-4 py-3 text-sm">
            <p className="flex items-start gap-2 text-cocoa/75">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                aria-hidden="true"
              />
              This website does not take payment and does not submit an order
              automatically. WhatsApp opens with a prefilled message for you to
              review and send.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === "opening"}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1fa855] px-6 py-3.5 text-[15px] font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-70"
          >
            {status === "opening" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Preparing WhatsApp…
              </>
            ) : (
              <>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Place Order on WhatsApp
              </>
            )}
          </button>

          <button
            type="button"
            onClick={openCart}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-forest/20 px-6 py-2.5 text-sm font-bold text-forest transition hover:bg-cream"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit cart
          </button>
        </div>
      </form>

      <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-gold/40 bg-forest p-6 text-cream shadow-xl sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold">Order summary</h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold-soft hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Shop
            </Link>
          </div>

          <ul className="mt-5 space-y-4">
            {summary.lines.map((line) => (
              <li
                key={`${line.productId}-${line.variantId}`}
                className="flex items-start justify-between gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold">{line.productName}</p>
                  <p className="mt-0.5 text-xs text-cream/65">
                    {line.variantLabel} · {formatINR(line.unitPricePaise)} ×{" "}
                    {line.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-gold-soft">
                  {formatINR(line.lineTotalPaise)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-white/15 pt-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/70">Subtotal</dt>
              <dd className="font-semibold">{formatINR(summary.subtotalPaise)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/70">Discount</dt>
              <dd className="font-semibold">
                {formatINR(summary.discountPaise)}
              </dd>
            </div>
            {summary.bulkAdjustmentPaise < 0 && (
              <div className="flex items-start justify-between gap-4">
                <dt className="max-w-[70%] text-xs leading-snug text-cream/70">
                  Provisional bulk estimate
                  {summary.bulkQuotes.map((quote) => (
                    <span key={quote.productId} className="mt-0.5 block text-[11px] text-cream/55">
                      {quote.productName} · {(quote.weightGrams / 1000).toFixed(
                        quote.weightGrams % 1000 === 0 ? 0 : 1,
                      )}{" "}
                      kg at {formatINR(quote.ratePerKgPaise)}/kg
                    </span>
                  ))}
                </dt>
                <dd className="font-semibold text-gold-soft">
                  −{formatINR(Math.abs(summary.bulkAdjustmentPaise))}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-cream/70">Delivery</dt>
              <dd className="text-right text-xs font-semibold text-gold-soft">
                {summary.deliveryPaise === null
                  ? "Pending confirmation"
                  : formatINR(summary.deliveryPaise)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-white/15 pt-3">
              <dt className="font-display max-w-[65%] text-base font-bold">
                {summary.totalLabel}
              </dt>
              <dd className="font-display text-2xl font-bold text-gold">
                {formatINR(summary.totalPaise)}
              </dd>
            </div>
          </dl>

          {summary.isEstimated && (
            <p className="mt-4 rounded-xl bg-white/5 px-3 py-2.5 text-[11px] leading-relaxed text-cream/70 ring-1 ring-gold/20">
              {summary.bulkQuotes.length > 0
                ? "The Ananas Meetha bulk amount is an estimate only. The final bulk price requires confirmation. "
                : ""}
              {summary.requiresDeliveryConfirmation
                ? "Delivery is not included in this amount; it will be confirmed on WhatsApp."
                : ""}
            </p>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-cream/50">
            All prices are in Indian Rupees. The order is not confirmed until
            Zohra-Zaika replies on WhatsApp.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-bold text-forest">
        {label}
        {required ? (
          <span className="ml-1 text-terracotta" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `mt-1.5 w-full rounded-xl border bg-cream px-4 py-2.5 text-[15px] outline-none transition placeholder:text-cocoa/35 focus:ring-2 focus:ring-gold/60 ${
    hasError
      ? "border-terracotta focus:border-terracotta"
      : "border-forest/20 focus:border-forest"
  }`;
}
