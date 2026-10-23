import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle } from "lucide-react";
import {
  CATEGORIES,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/catalog";
import { buildBulkQuoteUrl } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.id);
  const isAnanas = category.id === "shahi-ananas-meetha";

  return (
    <main>
      <section className="border-b border-gold/30 bg-forest text-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-cream/55">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-gold-soft">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-soft">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="text-gold-soft" aria-current="page">
                {category.name}
              </li>
            </ol>
          </nav>
          <h1 className="font-display mt-3 text-4xl font-bold sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 sm:text-[15px]">
            {category.description}
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
          {isAnanas && (
            <div className="mb-6 rounded-3xl border border-gold/50 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-terracotta uppercase">
                    Bulk pricing
                  </p>
                  <h2 className="font-display mt-1 text-xl font-bold text-forest">
                    2 kg or more: provisional ₹650 per kg
                  </h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-cocoa/65">
                    For example, exactly 2 kg is provisionally ₹1,300. This is an
                    estimate only; the final bulk price is negotiated and
                    confirmed by Zohra-Zaika.
                  </p>
                </div>
                <a
                  href={buildBulkQuoteUrl("Shahi Ananas Meetha", 2000)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-forest-deep"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Request bulk quote
                </a>
              </div>
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-gold/40 bg-white p-8 text-center">
              <p className="font-display text-2xl font-bold text-forest">
                Products coming soon
              </p>
              <p className="mt-2 text-sm text-cocoa/65">
                Please contact us on WhatsApp for the latest availability.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/shop"
              className="text-sm font-bold text-forest underline-offset-4 hover:underline"
            >
              ← Back to all products
            </Link>
            <p className="text-xs text-cocoa/50">
              Prices in Indian Rupees · delivery confirmed on WhatsApp
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
