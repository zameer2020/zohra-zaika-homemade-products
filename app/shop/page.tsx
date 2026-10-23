import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Shop the full Zohra-Zaika range: Shahi Achar, Shahi Ananas Meetha, Shahi Amla Oil, Masalas Master and Chilli Powder with exact pack sizes and prices.",
};

export default function ShopPage() {
  return (
    <main>
      <section className="border-b border-gold/30 bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-cream/55">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-gold-soft">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="text-gold-soft" aria-current="page">
                Shop
              </li>
            </ol>
          </nav>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            The full Zohra-Zaika shop
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-[15px]">
            Browse all five collections in one place. Every card shows the
            configured pack sizes and prices; choose a size before adding to your
            shared cart.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
          <ShopBrowser />
          <p className="mt-6 rounded-2xl border border-gold/40 bg-white px-5 py-3 text-center text-xs leading-relaxed text-cocoa/60">
            Delivery charge is not configured on the website and remains pending
            until confirmed on WhatsApp. Ananas Meetha bulk orders from 2 kg are
            provisional and require business confirmation.
          </p>
        </div>
      </section>
    </main>
  );
}
