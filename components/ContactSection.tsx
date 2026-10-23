"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import {
  WHATSAPP_BASE_URL,
  WHATSAPP_DISPLAY,
  whatsAppUrlForContact,
} from "@/lib/whatsapp";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    message?: string;
  }>({});
  const [opened, setOpened] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      next.phone = "Please enter a valid phone number (10–13 digits).";
    }
    if (message.trim().length < 5) next.message = "Please write a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    const url = whatsAppUrlForContact(name.trim(), phone.trim(), message.trim());
    window.open(url, "_blank", "noopener,noreferrer");
    setOpened(true);
  };

  return (
    <section id="contact" className="scroll-mt-24 bg-forest text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-gold-soft uppercase">
          Contact
        </p>
        <h2 className="font-display mx-auto mt-2 max-w-2xl text-center text-3xl font-bold text-balance sm:text-4xl">
          Ask us about a product or your order
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-cream/75">
          Zohra-Zaika Homemade Products — we reply on WhatsApp. Orders, delivery
          and bulk prices are confirmed by the business.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-gold/30 sm:p-8">
            <h3 className="font-display text-xl font-bold text-gold">
              Order & enquiries
            </h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <span className="text-cream/55">Brand: </span>
                <span className="font-semibold">Zohra-Zaika Homemade Products</span>
              </li>
              <li>
                <span className="text-cream/55">WhatsApp: </span>
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold-soft underline-offset-4 hover:underline"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="text-sm leading-relaxed text-cream/65">
                Prefer to see the range first? Browse the shop or use the map on
                the Contact page for directions.
              </li>
            </ul>
            <a
              href={WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-6 py-3 text-[15px] font-bold text-white transition hover:brightness-95"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <p className="mt-4 text-xs leading-relaxed text-cream/55">
              WhatsApp is our order confirmation channel. Delivery charges are
              confirmed there. Nothing is charged automatically on this website.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl bg-cream p-6 text-cocoa sm:p-8"
            aria-label="Contact form (opens WhatsApp)"
          >
            <h3 className="font-display text-xl font-bold text-forest">
              Send a message via WhatsApp
            </h3>
            <p className="mt-1 text-sm text-cocoa/65">
              This form does not store or send messages itself — it opens
              WhatsApp with your message prefilled.
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-sm font-bold text-forest"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-xl border border-forest/25 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-forest focus:ring-2 focus:ring-gold/60"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    className="mt-1 text-[13px] font-medium text-terracotta"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="text-sm font-bold text-forest"
                >
                  Phone number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Your phone number"
                  className="mt-1 w-full rounded-xl border border-forest/25 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-forest focus:ring-2 focus:ring-gold/60"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                />
                {errors.phone && (
                  <p
                    id="contact-phone-error"
                    className="mt-1 text-[13px] font-medium text-terracotta"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-bold text-forest"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Hi! I'd like to ask about..."
                  className="mt-1 w-full resize-y rounded-xl border border-forest/25 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-forest focus:ring-2 focus:ring-gold/60"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1 text-[13px] font-medium text-terracotta"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-[15px] font-bold text-cream transition hover:bg-forest-deep"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send via WhatsApp
              </button>

              {opened && (
                <p
                  role="status"
                  className="rounded-xl bg-white px-4 py-3 text-xs leading-relaxed text-cocoa/70 ring-1 ring-gold/30"
                >
                  WhatsApp was opened with your message. Please press send there;
                  this form does not confirm an order by itself.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
