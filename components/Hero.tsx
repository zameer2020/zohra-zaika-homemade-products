import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { CATEGORIES, PRODUCTS, getProductById } from "@/lib/catalog";
import { WHATSAPP_BASE_URL } from "@/lib/business";
import ProductImage from "./ProductImage";

const HERO_IDS = [
  "shahi-ananas-meetha",
  "shahi-murga-achar",
  "shahi-nimbu-achar",
];

export default function Hero() {
  const heroProducts = HERO_IDS.map((id) => getProductById(id)).filter(
    (product): product is NonNullable<typeof product> => Boolean(product),
  );

  return (
    <section id="home" className="relative overflow-hidden bg-forest text-cream">
      <div className="jaali-pattern absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-terracotta/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-gold-soft uppercase">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Zohra-Zaika · Homemade Products
          </p>
          <h1 className="font-display mt-5 text-4xl leading-[1.05] font-bold text-balance sm:text-5xl lg:text-[3.6rem]">
            The royal taste of home, in every jar.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Shahi pickles, Ananas Meetha, amla oil, masalas and chilli powder —
            prepared with care and packed in clear, honest sizes.
          </p>
          <p className="mt-3 text-sm font-semibold tracking-wide text-gold-soft">
            Ghar Ka Swad, Shahi Andaaz!
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-[15px] font-bold text-forest transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
            >
              Shop all products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/category/shahi-achar"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/30 bg-white/10 px-6 py-3 text-[15px] font-semibold text-cream transition hover:bg-white/15"
            >
              Explore Shahi pickles
            </Link>
            <a
              href={WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1fa855]/50 bg-[#1fa855]/15 px-6 py-3 text-[15px] font-semibold text-cream transition hover:bg-[#1fa855]/25"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Order on WhatsApp
            </a>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="sr-only">Product lines</dt>
              <dd className="font-display text-2xl font-bold text-gold">
                {CATEGORIES.length}
              </dd>
              <dd className="text-cream/65">Product collections</dd>
            </div>
            <div>
              <dt className="sr-only">Products</dt>
              <dd className="font-display text-2xl font-bold text-gold">
                {PRODUCTS.length}
              </dd>
              <dd className="text-cream/65">Products to explore</dd>
            </div>
            <div>
              <dt className="sr-only">Ordering</dt>
              <dd className="font-display text-2xl font-bold text-gold">1-tap</dd>
              <dd className="text-cream/65">WhatsApp checkout</dd>
            </div>
          </dl>

          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-cream/55">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
            No online payment. Review your cart, send the order on WhatsApp, and
            we confirm availability, delivery and any bulk price.
          </p>
        </div>

        <div
          className="relative mx-auto w-full max-w-lg"
          aria-label="A selection of Zohra-Zaika products"
        >
          <div className="rounded-[2rem] border border-gold/30 bg-gradient-to-br from-[#1e4d36] to-[#0e2419] p-4 shadow-2xl sm:p-6">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {heroProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    index === 0 ? "translate-y-0" : index === 1 ? "translate-y-5" : "translate-y-2"
                  }`}
                >
                  <ProductImage
                    product={product}
                    className="aspect-[3/4] rounded-2xl ring-2 ring-gold/50"
                    sizes="(max-width: 640px) 30vw, 150px"
                    showBadge={false}
                    fit="cover"
                  />
                  <p className="mt-2 text-center text-[10px] leading-tight font-bold text-cream/90 sm:text-[11px]">
                    {product.name.replace("Zohra-Zaika ", "")}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold text-cream/75 sm:text-[11px]">
              {["Small batch", "Clear pack sizes", "WhatsApp ordering"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-gold/30 bg-white/5 px-3 py-1"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
