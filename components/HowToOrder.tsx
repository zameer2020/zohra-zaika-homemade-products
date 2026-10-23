import Link from "next/link";
import { ClipboardList, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { WHATSAPP_BASE_URL } from "@/lib/business";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Choose a product & pack",
    text: "Open a product, select the exact pack size and quantity, then add it to your shared cart.",
  },
  {
    icon: ClipboardList,
    title: "Review your order",
    text: "Check every line, pack size and subtotal. Delivery and bulk quotes stay marked pending until confirmed.",
  },
  {
    icon: MessageCircle,
    title: "Send on WhatsApp",
    text: "Enter your delivery details, press Place Order on WhatsApp, and send the prefilled message.",
  },
  {
    icon: Truck,
    title: "Wait for confirmation",
    text: "Zohra-Zaika confirms availability, delivery charge and any bulk price. Nothing is paid on this site.",
  },
];

export default function HowToOrder() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
              How ordering works
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-forest sm:text-4xl">
              From cart to WhatsApp in four steps
            </h2>
          </div>
          <a
            href={WHATSAPP_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Chat with us
          </a>
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-gold/40 bg-white p-6 shadow-sm"
            >
              <span className="font-display absolute top-5 right-5 text-3xl font-bold text-gold/35">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cream-dark text-forest">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-forest">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-xs text-cocoa/55">
          Prefer to browse first?{" "}
          <Link href="/shop" className="font-bold text-forest underline underline-offset-4">
            Open the full shop
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
