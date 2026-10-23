import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Review your Zohra-Zaika cart and send a WhatsApp order request with your delivery details. Nothing is paid on the website.",
};

export default function CheckoutPage() {
  return (
    <main>
      <section className="border-b border-gold/30 bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:py-12">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-cream/55">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-gold-soft">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/shop" className="hover:text-gold-soft">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gold-soft" aria-current="page">
                Checkout
              </li>
            </ol>
          </nav>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            Review & send your order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-[15px]">
            Enter your delivery details and send the prefilled order on WhatsApp.
            Delivery charges and any bulk price are confirmed by Zohra-Zaika
            before the order is finalised.
          </p>
        </div>
      </section>

      <CheckoutForm />

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-forest underline-offset-4 hover:underline"
        >
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
