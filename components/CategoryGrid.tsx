import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CATEGORIES,
  getProductsByCategory,
  getStartingPricePaise,
} from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function CategoryGrid() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
              Shop by collection
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-forest sm:text-4xl">
              Five collections, one kitchen
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest underline-offset-4 hover:underline"
          >
            View everything <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const products = getProductsByCategory(category.id);
            const lead = products[0];
            const starting = products.length
              ? Math.min(...products.map(getStartingPricePaise))
              : null;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`group flex flex-col overflow-hidden rounded-3xl border border-gold/35 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  category.id === "shahi-ananas-meetha"
                    ? "col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                {lead ? (
                  <ProductImage
                    product={lead}
                    className="aspect-[4/3]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                    showBadge={false}
                  />
                ) : (
                  <div className="aspect-[4/3] bg-cream-dark" />
                )}
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <p className="font-display text-[15px] leading-snug font-bold text-forest sm:text-base">
                    {category.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-cocoa/60">
                    {category.tagline}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                    <span className="text-[11px] font-semibold text-cocoa/55">
                      {products.length} {products.length === 1 ? "product" : "products"}
                    </span>
                    {starting !== null && (
                      <span className="text-xs font-bold text-terracotta">
                        from {formatINR(starting)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
