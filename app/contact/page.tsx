import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import LocationSection from "@/components/LocationSection";

export const metadata: Metadata = {
  title: "Contact & Ordering",
  description:
    "Contact Zohra-Zaika on WhatsApp for product questions, delivery information and order confirmation. View the map for directions.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <p className="text-xs font-bold tracking-[0.2em] text-gold-soft uppercase">
            Contact
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            We are here to help
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-[15px]">
            Ask about products, pack sizes, delivery or a bulk order. WhatsApp is
            our order-confirmation channel.
          </p>
        </div>
      </section>
      <ContactSection />
      <LocationSection />
    </main>
  );
}
