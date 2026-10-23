"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getProductById, getVariant } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { buildCartEnquiryUrl } from "@/lib/whatsapp";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const {
    items,
    count,
    summary,
    isCartOpen,
    closeCart,
    updateQuantity,
    updateVariant,
    removeItem,
    clearCart,
  } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const closeWithReset = useCallback(() => {
    setConfirmClear(false);
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (!isCartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWithReset();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isCartOpen, closeWithReset]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeWithReset}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <aside className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-gold/40 px-5 py-4">
          <h2 className="font-display flex items-center gap-2 text-xl font-bold text-forest">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            Your Cart
            <span className="rounded-full bg-forest px-2 py-0.5 text-xs font-bold text-cream">
              {count}
            </span>
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeWithReset}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-cream-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="cart-scroll flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream-dark text-forest">
                  <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                </span>
                <p className="font-display mt-4 text-2xl font-bold text-forest">
                  Your cart is empty
                </p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-cocoa/70">
                  Explore our pickles, Ananas Meetha, amla oil, masalas and
                  chilli powder.
                </p>
                <Link
                  href="/shop"
                  onClick={closeWithReset}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-bold text-cream transition hover:bg-forest-deep"
                >
                  Continue shopping
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const product = getProductById(item.productId);
                const variant = product && getVariant(product, item.variantId);
                if (!product || !variant) return null;

                return (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="rounded-2xl border border-gold/35 bg-white p-3.5 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeWithReset}
                        className="shrink-0"
                        aria-label={`View ${product.name}`}
                      >
                        <ProductImage
                          product={product}
                          className="h-20 w-16 rounded-xl"
                          sizes="64px"
                          showBadge={false}
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeWithReset}
                              className="font-display block truncate text-[15px] font-bold text-forest hover:underline"
                            >
                              {product.name}
                            </Link>
                            <p className="mt-0.5 text-xs text-cocoa/60">
                              {variant.label} · {formatINR(variant.pricePaise)} each
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            aria-label={`Remove ${product.name} ${variant.label}`}
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-terracotta transition hover:bg-terracotta/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-semibold text-cocoa/65">
                            <span className="sr-only">
                              Pack size for {product.name}
                            </span>
                            <select
                              value={item.variantId}
                              onChange={(event) =>
                                updateVariant(
                                  item.productId,
                                  item.variantId,
                                  event.target.value,
                                )
                              }
                              className="rounded-lg border border-forest/25 bg-cream px-2 py-1 text-xs font-bold text-forest focus:border-forest focus:outline-none focus:ring-2 focus:ring-gold/60"
                              aria-label={`Pack size for ${product.name}`}
                            >
                              {product.variants.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label} — {formatINR(option.pricePaise)}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="inline-flex items-center gap-1 rounded-full border border-forest/20 px-1 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= product.minQuantity}
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-cream-dark disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                            >
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <span
                              className="min-w-5 text-center text-sm font-bold"
                              aria-live="polite"
                              aria-label={`Quantity ${item.quantity}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity + 1,
                                )
                              }
                              disabled={item.quantity >= product.maxQuantity}
                              aria-label={`Increase quantity of ${product.name}`}
                              className="grid h-6 w-6 place-items-center rounded-full transition hover:bg-cream-dark disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                            >
                              <Plus className="h-3 w-3" aria-hidden="true" />
                            </button>
                          </div>

                          <p className="font-display text-base font-bold text-forest">
                            {formatINR(variant.pricePaise * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold/40 bg-white px-5 py-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-cocoa/65">Subtotal</dt>
                <dd className="font-semibold text-cocoa">
                  {formatINR(summary.subtotalPaise)}
                </dd>
              </div>

              {summary.bulkAdjustmentPaise < 0 && (
                <div className="flex items-center justify-between gap-4 text-forest">
                  <dt className="max-w-[65%] text-xs leading-snug">
                    Provisional bulk estimate
                    {summary.bulkQuotes.map((quote) => (
                      <span key={quote.productId} className="block text-[11px] text-cocoa/55">
                        {quote.productName} · {(quote.weightGrams / 1000).toFixed(
                          quote.weightGrams % 1000 === 0 ? 0 : 1,
                        )}{" "}
                        kg at {formatINR(quote.ratePerKgPaise)}/kg
                      </span>
                    ))}
                  </dt>
                  <dd className="font-semibold text-forest">
                    −{formatINR(Math.abs(summary.bulkAdjustmentPaise))}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <dt className="text-cocoa/65">Delivery</dt>
                <dd className="text-right text-xs font-semibold text-terracotta">
                  {summary.deliveryPaise === null
                    ? "Pending confirmation"
                    : formatINR(summary.deliveryPaise)}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-t border-forest/10 pt-2">
                <dt className="font-display text-base font-bold text-forest">
                  {summary.totalLabel}
                </dt>
                <dd
                  className="font-display text-xl font-bold text-forest"
                  aria-live="polite"
                >
                  {formatINR(summary.totalPaise)}
                </dd>
              </div>
            </dl>

            {summary.isEstimated && (
              <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-[11px] leading-relaxed text-cocoa/65">
                {summary.bulkQuotes.length > 0
                  ? "The bulk price shown is provisional and must be confirmed on WhatsApp. "
                  : ""}
                {summary.requiresDeliveryConfirmation
                  ? "Delivery charge is not included yet and will be confirmed on WhatsApp."
                  : ""}
              </p>
            )}

            <div className="mt-3 grid gap-2">
              <Link
                href="/checkout"
                onClick={closeWithReset}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-[15px] font-bold text-cream transition hover:bg-forest-deep"
              >
                Checkout & order on WhatsApp
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={buildCartEnquiryUrl(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1fa855]/40 px-5 py-2.5 text-sm font-bold text-[#157a3e] transition hover:bg-[#1fa855]/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Ask about this cart
              </a>
              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href="/shop"
                  onClick={closeWithReset}
                  className="text-xs font-bold text-forest underline-offset-4 hover:underline"
                >
                  Continue shopping
                </Link>
                {confirmClear ? (
                  <span className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="font-bold text-terracotta underline underline-offset-4"
                    >
                      Confirm clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="font-semibold text-cocoa/60 hover:text-cocoa"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-xs font-semibold text-cocoa/55 hover:text-terracotta"
                  >
                    Clear cart
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
