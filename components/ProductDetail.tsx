"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Info,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { getCategory, type Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { calculateOrder } from "@/lib/pricing";
import { useCart } from "@/lib/cart-context";
import {
  buildBulkQuoteUrl,
  whatsAppUrlForProductEnquiry,
} from "@/lib/whatsapp";
import ProductImage from "./ProductImage";
import VariantPicker from "./VariantPicker";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const category = getCategory(product.categoryId);
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];
  const purchasable = product.availability === "available";
  const maxQuantity = product.maxQuantity;

  const preview = useMemo(
    () =>
      calculateOrder([
        { productId: product.id, variantId: variant?.id ?? "", quantity },
      ]),
    [product.id, variant?.id, quantity],
  );

  const bulkQuote = preview.bulkQuotes[0];
  const weightGrams = variant
    ? (variant.bulkWeightGrams ?? 0) * quantity
    : 0;

  const handleAdd = () => {
    if (!variant || !purchasable) return;
    const success = addItem(product.id, variant.id, quantity);
    if (success) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2200);
    }
  };

  const handleBuyNow = () => {
    if (!variant || !purchasable) return;
    addItem(product.id, variant.id, quantity);
    openCart();
  };

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-cocoa/55">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-forest">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-forest">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/category/${category?.slug}`}
                className="hover:text-forest"
              >
                {category?.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-forest" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <ProductImage
              key={`${product.id}-${imageIndex}`}
              product={product}
              imageIndex={imageIndex}
              className="aspect-[4/5] max-h-[620px] w-full rounded-3xl border border-gold/30 shadow-lg"
              sizes="(max-width: 1024px) 100vw, 560px"
              priority
              showBadge={false}
              fit="cover"
            />
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show image ${index + 1} of ${product.name}`}
                    aria-pressed={index === imageIndex}
                    className={`shrink-0 overflow-hidden rounded-xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      index === imageIndex
                        ? "border-forest"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ProductImage
                      product={product}
                      imageIndex={index}
                      className="h-16 w-14"
                      sizes="56px"
                      showBadge={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${category?.slug}`}
                className="rounded-full bg-cream-dark px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-terracotta uppercase hover:bg-gold/30"
              >
                {category?.name}
              </Link>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                  product.veg
                    ? "bg-green-700/10 text-green-800"
                    : "bg-red-800/10 text-red-800"
                }`}
              >
                {product.veg ? "Veg" : "Non-veg"}
              </span>
              <span className="rounded-full bg-forest/10 px-3 py-1 text-[10px] font-bold tracking-wide text-forest uppercase">
                {product.availability === "available"
                  ? "Available"
                  : product.availability === "coming-soon"
                    ? "Coming soon"
                    : "Unavailable"}
              </span>
            </div>

            <h1 className="font-display mt-3 text-3xl leading-tight font-bold text-forest sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-cocoa/70">
              {product.longDescription}
            </p>

            <div className="mt-5 rounded-2xl border border-gold/35 bg-white p-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="font-display text-3xl font-bold text-forest">
                  {variant ? formatINR(variant.pricePaise) : "—"}
                </p>
                <p className="text-sm font-medium text-cocoa/55">
                  {variant ? `for ${variant.label}` : ""}
                </p>
              </div>

              <div className="mt-4">
                <VariantPicker
                  variants={product.variants}
                  value={variant?.id ?? ""}
                  onChange={(nextVariantId) => {
                    setVariantId(nextVariantId);
                    setQuantity(1);
                  }}
                  name={`detail-variant-${product.id}`}
                  disabled={!purchasable}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold tracking-[0.12em] text-cocoa/60 uppercase">
                  Quantity
                </span>
                <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-1.5 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1 || !purchasable}
                    aria-label="Decrease quantity"
                    className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-cream-dark disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span
                    className="min-w-7 text-center text-sm font-bold"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.min(maxQuantity, value + 1))
                    }
                    disabled={quantity >= maxQuantity || !purchasable}
                    aria-label="Increase quantity"
                    className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-cream-dark disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                {variant && (
                  <span className="text-sm text-cocoa/60">
                    Line total{" "}
                    <strong className="text-forest">
                      {formatINR(variant.pricePaise * quantity)}
                    </strong>
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!purchasable || !variant}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      Add to cart
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!purchasable || !variant}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-forest transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Buy now
                </button>
              </div>
              <span className="sr-only" role="status" aria-live="polite">
                {added
                  ? `${product.name} ${variant?.label} added to cart`
                  : ""}
              </span>

              <a
                href={whatsAppUrlForProductEnquiry(
                  product.id,
                  variant?.id,
                  quantity,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1fa855]/40 px-5 py-2.5 text-sm font-bold text-[#157a3e] transition hover:bg-[#1fa855]/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ask about this product
              </a>
            </div>

            {product.bulkPolicy && (
              <div className="mt-4 rounded-2xl border border-gold/50 bg-white p-5">
                <p className="flex items-start gap-2 text-sm font-bold text-forest">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
                  Bulk pricing from 2 kg
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-cocoa/70">
                  Provisional rate: {formatINR(product.bulkPolicy.ratePerKgPaise)}{" "}
                  per kg. The final bulk price is negotiable and must be confirmed
                  by Zohra-Zaika.
                </p>
                <div className="mt-3 rounded-xl bg-cream px-3 py-2.5 text-xs leading-relaxed text-cocoa/70">
                  <p>
                    Current selection:{" "}
                    <strong className="text-forest">
                      {(weightGrams / 1000).toFixed(weightGrams % 1000 === 0 ? 0 : 1)}{" "}
                      kg
                    </strong>
                    {bulkQuote
                      ? ` — estimated goods total ${formatINR(
                          bulkQuote.provisionalSubtotalPaise,
                        )} (standard ${formatINR(
                          bulkQuote.standardSubtotalPaise,
                        )}).`
                      : " — bulk rate starts at a combined 2 kg."}
                  </p>
                  {bulkQuote && (
                    <p className="mt-1 font-semibold text-terracotta">
                      Provisional quote only. The final amount requires
                      confirmation.
                    </p>
                  )}
                </div>
                <a
                  href={buildBulkQuoteUrl(product.name, weightGrams)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-forest-deep"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Request bulk quote on WhatsApp
                </a>
              </div>
            )}

            <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-gold/30">
              <h2 className="font-display text-lg font-bold text-forest">
                Product details
              </h2>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-cocoa/70">
                {product.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-gold/40 bg-cream-dark/40 px-4 py-3 text-xs leading-relaxed text-cocoa/65">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" aria-hidden="true" />
              <span>
                Delivery charge and serviceability are confirmed on WhatsApp.
                Nothing is paid on this website, and the order is not confirmed
                until Zohra-Zaika replies.
              </span>
            </div>

            <Link
              href={`/category/${category?.slug}`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-forest underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to {category?.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
