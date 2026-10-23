import Link from "next/link";
import { ChevronRight, MessageCircle, PackageCheck, Sparkles, Truck } from "lucide-react";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductsSection from "@/components/ProductsSection";
import GiftingBulk from "@/components/GiftingBulk";
import Story from "@/components/Story";
import WhyChoose from "@/components/WhyChoose";
import HowToOrder from "@/components/HowToOrder";
import { WHATSAPP_BASE_URL } from "@/lib/business";

const TRUST = [
  {
    icon: Sparkles,
    title: "Home-made range",
    text: "Pickles, Ananas Meetha, amla oil, masalas and chilli powder.",
  },
  {
    icon: PackageCheck,
    title: "Clear pack sizes",
    text: "Every price is tied to a configured pack size, not a vague estimate.",
  },
  {
    icon: Truck,
    title: "Honest delivery",
    text: "Delivery charge is confirmed on WhatsApp — never invented online.",
  },
];

export default function Home() {
  return (
    <main>
      <Hero />

      <section className="border-y border-gold/30 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {TRUST.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream-dark text-forest">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-forest">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-cocoa/60">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CategoryGrid />
      <ProductsSection />
      <GiftingBulk />
      <Story />
      <WhyChoose />
      <HowToOrder />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-cream px-6 py-8 sm:px-10">
            <div className="jaali-pattern absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-terracotta uppercase">
                  Ready to order?
                </p>
                <h2 className="font-display mt-2 max-w-xl text-3xl font-bold text-balance text-forest">
                  Build your cart, then send it on WhatsApp.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-cocoa/65">
                  We confirm product availability, delivery charge and any
                  negotiable bulk price before the order is finalised.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep"
                >
                  Start shopping
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1fa855]/50 px-6 py-3 text-sm font-bold text-[#157a3e] transition hover:bg-[#1fa855]/10"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
