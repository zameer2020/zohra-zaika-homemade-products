import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProductsByCategory } from "@/lib/catalog";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  const pickles = getProductsByCategory("shahi-achar");

  return (
    <section id="pickles" className="scroll-mt-24 bg-cream-dark/35">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
              Shahi Achar
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-forest sm:text-4xl">
              The pickle collection
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-cocoa/70">
              Nimbu, Amla, Aam and Murga — each in its configured pack sizes.
              Choose a size on the card and add it straight to your shared cart.
            </p>
          </div>
          <Link
            href="/category/shahi-achar"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-forest underline-offset-4 hover:underline"
          >
            View Shahi Achar <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pickles.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
            />
          ))}
        </div>

        <p className="mt-6 rounded-2xl border border-gold/40 bg-cream px-5 py-3 text-center text-xs leading-relaxed text-cocoa/65">
          Prices are in Indian Rupees. Delivery charge and serviceability are
          confirmed on WhatsApp — they are not included in the cart total.
        </p>
      </div>
    </section>
  );
}
