"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ShoppingBag } from "lucide-react";
import { getCategory, type Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import ProductImage from "./ProductImage";
import VariantPicker from "./VariantPicker";

function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border-[1.5px] bg-white ${
        veg ? "border-green-700" : "border-red-800"
      }`}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          veg ? "bg-green-700" : "bg-red-800"
        }`}
      />
    </span>
  );
}

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const category = getCategory(product.categoryId);
  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    if (!variant) return;
    const success = addItem(product.id, variant.id, 1);
    if (success) setAdded(true);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gold/35 bg-white shadow-[0_2px_14px_rgba(23,61,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_18px_40px_rgba(23,61,43,0.12)]">
      <Link
        href={`/products/${product.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          product={product}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold tracking-[0.16em] text-terracotta uppercase">
            {category?.shortName ?? "Zohra-Zaika"}
          </p>
          <VegMark veg={product.veg} />
        </div>

        <h3 className="font-display mt-1.5 text-xl leading-snug font-bold text-forest">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-forest-deep focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cocoa/70">
          {product.description}
        </p>

        <div className="mt-auto pt-4">
          <VariantPicker
            variants={product.variants}
            value={variant?.id ?? ""}
            onChange={setVariantId}
            name={`card-variant-${product.id}`}
            legend="Pack size"
            disabled={product.availability !== "available"}
          />

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-2xl font-bold text-forest">
                {variant ? formatINR(variant.pricePaise) : "—"}
              </p>
              <p className="text-xs font-medium text-cocoa/55">
                {variant ? `for ${variant.label}` : "Unavailable"}
              </p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-forest underline-offset-4 hover:underline"
            >
              Details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {product.bulkPolicy ? (
            <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-[11px] leading-snug font-semibold text-forest/80">
              2 kg+ bulk rate is provisional — final quote confirmed on WhatsApp.
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!variant || product.availability !== "available"}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" /> Added to cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Add to cart
              </>
            )}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {added ? `${product.name} ${variant?.label} added to cart` : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
