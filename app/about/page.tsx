import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HeartHandshake, MessageCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { WHATSAPP_BASE_URL } from "@/lib/business";
import LocationSection from "@/components/LocationSection";

export const metadata: Metadata = {
  title: "About Zohra-Zaika",
  description:
    "Learn about Zohra-Zaika Homemade Products and its range of Shahi pickles, Ananas Meetha, amla oil, masalas and chilli powder.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.7fr] lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-gold-soft uppercase">
              <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              About us
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight font-bold text-balance sm:text-5xl">
              Home-made flavours, a clear way to order.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
              Zohra-Zaika Homemade Products brings together the Shahi pickle
              collection, Shahi Ananas Meetha, Shahi Amla Oil, Masalas Master and
              Chilli Powder. The website is a catalogue and order-request tool:
              every order is confirmed by the business on WhatsApp.
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-[2rem] bg-cream shadow-2xl ring-1 ring-gold/40">
            <Image
              src="/logo.png"
              alt="Zohra-Zaika Homemade Products logo"
              fill
              sizes="320px"
              className="object-contain p-4"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-forest">
                What we make
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                The current catalogue is shown below. Pack sizes and prices are
                controlled by one central product list, so the shop, cart,
                WhatsApp message and support assistant always agree.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-gold/35 bg-white p-4 transition hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-md"
                    >
                      <span className="font-display text-base font-bold text-forest group-hover:underline">
                        {category.name}
                      </span>
                      <span className="mt-1 text-xs leading-relaxed text-cocoa/60">
                        {category.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-forest-deep"
                >
                  Shop all products
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1fa855]/50 px-5 py-2.5 text-sm font-bold text-[#157a3e] transition hover:bg-[#1fa855]/10"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-gold/40 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-2xl font-bold text-forest">
                How we handle your order
              </h2>
              <ol className="mt-4 space-y-4 text-sm leading-relaxed text-cocoa/70">
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream-dark text-xs font-bold text-forest">
                    1
                  </span>
                  <span>
                    You choose products and pack sizes on the website. The cart
                    calculates the configured subtotal.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream-dark text-xs font-bold text-forest">
                    2
                  </span>
                  <span>
                    You enter delivery details at checkout. Nothing is paid and no
                    order is submitted automatically.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cream-dark text-xs font-bold text-forest">
                    3
                  </span>
                  <span>
                    WhatsApp opens with a prefilled order. You send it, then
                    Zohra-Zaika confirms availability, delivery and any bulk price.
                  </span>
                </li>
              </ol>
              <p className="mt-5 rounded-2xl bg-cream px-4 py-3 text-xs leading-relaxed text-cocoa/60">
                We do not publish unverified reviews, awards, certifications or
                health claims. If information is missing, the business will
                confirm it with you directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LocationSection />
    </main>
  );
}
