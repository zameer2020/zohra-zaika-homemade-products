"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/catalog";

interface ProductImageProps {
  product: Product;
  className?: string;
  sizes?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  showBadge?: boolean;
  imageIndex?: number;
}

/**
 * Product image with a reserved aspect ratio, next/image optimisation and a
 * graceful fallback when a product has no photograph yet.
 */
export default function ProductImage({
  product,
  className = "aspect-[4/5]",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px",
  fit = "cover",
  priority = false,
  showBadge = true,
  imageIndex = 0,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const image = product.images[imageIndex];
  const showFallback = !image || failed;
  const accent = "#173d2b";

  return (
    <div
      className={`relative isolate overflow-hidden bg-cream-dark ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 25%, #fffdf6 0%, #f7ecd2 55%, ${accent}1f 100%)`,
      }}
    >
      {!showFallback ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={
            fit === "contain"
              ? "object-contain p-3 sm:p-4"
              : "object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          }
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span
            className="font-display grid h-20 w-20 place-items-center rounded-full text-3xl font-bold text-cream shadow-lg"
            style={{
              background: `linear-gradient(135deg, #173d2b, #3d1e12)`,
            }}
            aria-hidden="true"
          >
            {product.name.replace("Zohra-Zaika ", "").charAt(0)}
          </span>
          <p className="font-display text-lg font-bold text-forest">
            {product.name}
          </p>
          <p className="max-w-[220px] rounded-full bg-forest px-3 py-1 text-[11px] leading-snug font-bold text-cream">
            Photo coming soon
          </p>
        </div>
      )}

      {showBadge && product.badge ? (
        <span className="absolute top-3 left-3 rounded-full bg-forest/92 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-gold uppercase shadow-lg backdrop-blur">
          {product.badge}
        </span>
      ) : null}

      {product.availability !== "available" ? (
        <span className="absolute top-3 right-3 rounded-full bg-terracotta px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-lg">
          {product.availability === "coming-soon" ? "Coming soon" : "Unavailable"}
        </span>
      ) : null}
    </div>
  );
}
