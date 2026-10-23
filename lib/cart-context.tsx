"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, getProductById, getVariant, isPurchasable } from "./catalog";
import {
  calculateOrder,
  normaliseCartLines,
  type CartLineInput,
  type OrderSummary,
} from "./pricing";

export type CartItem = CartLineInput;

interface CartContextValue {
  items: CartItem[];
  count: number;
  summary: OrderSummary;
  isCartOpen: boolean;
  hydrated: boolean;
  lastAddedAt: number | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, variantId: string, quantity?: number) => boolean;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  updateVariant: (
    productId: string,
    oldVariantId: string,
    newVariantId: string,
  ) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  /** Re-check every line against the catalog before checkout. */
  revalidateCart: () => OrderSummary;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "zohra-zaika-cart-v2";

function readStoredCart(): unknown {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate after mount so server and first client render both show an
    // empty cart (avoids a hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(normaliseCartLines(readStoredCart()).lines);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode); cart still works in memory.
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      const product = getProductById(productId);
      if (!product || !isPurchasable(product)) return false;
      if (!getVariant(product, variantId)) return false;

      const safeQuantity = Math.min(
        product.maxQuantity,
        Math.max(product.minQuantity, Math.floor(quantity) || 1),
      );

      setItems((previous) => {
        const existing = previous.find(
          (item) =>
            item.productId === productId && item.variantId === variantId,
        );
        if (existing) {
          return previous.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? {
                  ...item,
                  quantity: Math.min(
                    product.maxQuantity,
                    item.quantity + safeQuantity,
                  ),
                }
              : item,
          );
        }
        return [
          ...previous,
          { productId, variantId, quantity: safeQuantity },
        ];
      });
      setLastAddedAt(Date.now());
      return true;
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      const product = PRODUCTS.find((item) => item.id === productId);
      const variant = product && getVariant(product, variantId);
      if (!product || !variant || !isPurchasable(product)) return;
      if (!Number.isInteger(quantity)) return;

      if (quantity <= 0) {
        setItems((previous) =>
          previous.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId
              ),
          ),
        );
        return;
      }

      const safeQuantity = Math.min(
        product.maxQuantity,
        Math.max(product.minQuantity, quantity),
      );

      setItems((previous) =>
        previous.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: safeQuantity }
            : item,
        ),
      );
    },
    [],
  );

  const updateVariant = useCallback(
    (productId: string, oldVariantId: string, newVariantId: string) => {
      if (oldVariantId === newVariantId) return;
      const product = getProductById(productId);
      if (!product || !isPurchasable(product)) return;
      if (!getVariant(product, newVariantId)) return;

      setItems((previous) => {
        const moving = previous.find(
          (item) =>
            item.productId === productId &&
            item.variantId === oldVariantId,
        );
        if (!moving) return previous;

        const withoutMoving = previous.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.variantId === oldVariantId
            ),
        );
        const target = withoutMoving.find(
          (item) =>
            item.productId === productId &&
            item.variantId === newVariantId,
        );

        if (target) {
          return withoutMoving.map((item) =>
            item.productId === productId &&
            item.variantId === newVariantId
              ? {
                  ...item,
                  quantity: Math.min(
                    product.maxQuantity,
                    item.quantity + moving.quantity,
                  ),
                }
              : item,
          );
        }

        return [
          ...withoutMoving,
          { ...moving, variantId: newVariantId },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      setItems((previous) =>
        previous.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.variantId === variantId
            ),
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const revalidateCart = useCallback(() => {
    const normalised = normaliseCartLines(items);
    if (
      normalised.lines.length !== items.length ||
      normalised.rejectedLineCount > 0
    ) {
      setItems(normalised.lines);
    }
    const summary = calculateOrder(normalised.lines);
    return {
      ...summary,
      rejectedLineCount: normalised.rejectedLineCount,
    };
  }, [items]);

  const summary = useMemo(() => calculateOrder(items), [items]);

  const value = useMemo(
    () => ({
      items,
      count: summary.itemCount,
      summary,
      isCartOpen,
      hydrated,
      lastAddedAt,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      updateVariant,
      removeItem,
      clearCart,
      revalidateCart,
    }),
    [
      items,
      summary,
      isCartOpen,
      hydrated,
      lastAddedAt,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      updateVariant,
      removeItem,
      clearCart,
      revalidateCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
