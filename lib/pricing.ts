import {
  PRODUCTS,
  getVariant,
  isPurchasable,
  type Product,
} from "./catalog";
import { DELIVERY_CHARGE_PAISE } from "./business";

/**
 * Shared pricing engine for the cart, checkout, WhatsApp messages and tests.
 * Every monetary value is an integer number of paise.
 */

export const CONFIGURED_DISCOUNT_PAISE = 0;

export interface CartLineInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface PricedLine extends CartLineInput {
  productName: string;
  variantLabel: string;
  unitPricePaise: number;
  lineTotalPaise: number;
  bulkWeightGrams: number | null;
  veg: boolean;
}

export interface BulkQuote {
  productId: string;
  productName: string;
  weightGrams: number;
  thresholdGrams: number;
  ratePerKgPaise: number;
  standardSubtotalPaise: number;
  provisionalSubtotalPaise: number;
  savingsPaise: number;
  status: "pending";
  note: string;
}

export type TotalStatus = "confirmed" | "estimated";

export interface OrderSummary {
  lines: PricedLine[];
  rejectedLineCount: number;
  itemCount: number;
  subtotalPaise: number;
  discountPaise: number;
  bulkAdjustmentPaise: number;
  bulkQuotes: BulkQuote[];
  deliveryPaise: number | null;
  totalPaise: number;
  requiresDeliveryConfirmation: boolean;
  isEstimated: boolean;
  totalStatus: TotalStatus;
  totalLabel: string;
  isEmpty: boolean;
}

export interface CalculateOptions {
  products?: Product[];
  deliveryChargePaise?: number | null;
  discountPaise?: number;
}

export function lineKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`;
}

interface NormalisedCart {
  lines: CartLineInput[];
  rejectedLineCount: number;
}

/**
 * Validate and de-duplicate cart lines against the live catalog.
 * Extra fields (including any client-submitted prices) are ignored.
 */
export function normaliseCartLines(
  raw: unknown,
  products: Product[] = PRODUCTS,
): NormalisedCart {
  if (!Array.isArray(raw)) {
    return { lines: [], rejectedLineCount: 0 };
  }

  const valid: CartLineInput[] = [];
  let rejectedLineCount = 0;

  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) {
      rejectedLineCount += 1;
      continue;
    }

    const candidate = entry as Record<string, unknown>;
    const productId =
      typeof candidate.productId === "string" ? candidate.productId : "";
    const variantId =
      typeof candidate.variantId === "string" ? candidate.variantId : "";
    const quantity = candidate.quantity;

    const product = products.find((item) => item.id === productId);
    if (!product || !isPurchasable(product)) {
      rejectedLineCount += 1;
      continue;
    }

    const variant = getVariant(product, variantId);
    if (!variant) {
      rejectedLineCount += 1;
      continue;
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < product.minQuantity ||
      quantity > product.maxQuantity
    ) {
      rejectedLineCount += 1;
      continue;
    }

    const existing = valid.find(
      (line) =>
        line.productId === productId && line.variantId === variantId,
    );

    if (existing) {
      existing.quantity = Math.min(
        product.maxQuantity,
        existing.quantity + quantity,
      );
    } else {
      valid.push({ productId, variantId, quantity });
    }
  }

  return { lines: valid, rejectedLineCount };
}

export function calculateOrder(
  raw: unknown,
  options: CalculateOptions = {},
): OrderSummary {
  const products = options.products ?? PRODUCTS;
  const { lines: normalisedLines, rejectedLineCount } = normaliseCartLines(
    raw,
    products,
  );

  const lines: PricedLine[] = [];

  for (const line of normalisedLines) {
    const product = products.find((item) => item.id === line.productId);
    const variant = product && getVariant(product, line.variantId);
    if (!product || !variant) continue;

    lines.push({
      ...line,
      productName: product.name,
      variantLabel: variant.label,
      unitPricePaise: variant.pricePaise,
      lineTotalPaise: variant.pricePaise * line.quantity,
      bulkWeightGrams: variant.bulkWeightGrams,
      veg: product.veg,
    });
  }

  const subtotalPaise = lines.reduce(
    (sum, line) => sum + line.lineTotalPaise,
    0,
  );

  const configuredDiscount = Math.max(
    0,
    Math.trunc(options.discountPaise ?? CONFIGURED_DISCOUNT_PAISE) || 0,
  );
  const discountPaise = Math.min(subtotalPaise, configuredDiscount);

  const bulkQuotes: BulkQuote[] = [];

  for (const product of products) {
    if (!product.bulkPolicy) continue;

    const productLines = lines.filter(
      (line) => line.productId === product.id,
    );
    if (productLines.length === 0) continue;

    const weightGrams = productLines.reduce(
      (sum, line) => sum + (line.bulkWeightGrams ?? 0) * line.quantity,
      0,
    );

    if (weightGrams < product.bulkPolicy.thresholdGrams) continue;

    const standardSubtotalPaise = productLines.reduce(
      (sum, line) => sum + line.lineTotalPaise,
      0,
    );
    const provisionalSubtotalPaise = Math.round(
      (weightGrams * product.bulkPolicy.ratePerKgPaise) / 1000,
    );
    const savingsPaise = Math.max(
      0,
      standardSubtotalPaise - provisionalSubtotalPaise,
    );

    bulkQuotes.push({
      productId: product.id,
      productName: product.name,
      weightGrams,
      thresholdGrams: product.bulkPolicy.thresholdGrams,
      ratePerKgPaise: product.bulkPolicy.ratePerKgPaise,
      standardSubtotalPaise,
      provisionalSubtotalPaise,
      savingsPaise,
      status: "pending",
      note: product.bulkPolicy.note,
    });
  }

  const configuredDelivery =
    options.deliveryChargePaise === undefined
      ? DELIVERY_CHARGE_PAISE
      : options.deliveryChargePaise;
  const deliveryPaise =
    configuredDelivery === null ||
    !Number.isFinite(configuredDelivery) ||
    configuredDelivery < 0
      ? null
      : Math.round(configuredDelivery);

  const bulkAdjustmentPaise = -bulkQuotes.reduce(
    (sum, quote) => sum + quote.savingsPaise,
    0,
  );

  const goodsTotalPaise =
    subtotalPaise - discountPaise + bulkAdjustmentPaise;
  const totalPaise = goodsTotalPaise + (deliveryPaise ?? 0);
  const isEmpty = lines.length === 0;
  const requiresDeliveryConfirmation =
    !isEmpty && deliveryPaise === null;
  const hasPendingBulk = bulkQuotes.length > 0;
  const isEstimated =
    !isEmpty && (requiresDeliveryConfirmation || hasPendingBulk);

  let totalLabel = "Total";
  if (isEmpty) {
    totalLabel = "Total";
  } else if (hasPendingBulk && requiresDeliveryConfirmation) {
    totalLabel = "Estimated total (bulk price + delivery pending)";
  } else if (hasPendingBulk) {
    totalLabel = "Estimated goods total (bulk price pending)";
  } else if (requiresDeliveryConfirmation) {
    totalLabel = "Estimated total (delivery pending)";
  }

  return {
    lines,
    rejectedLineCount,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotalPaise,
    discountPaise,
    bulkAdjustmentPaise,
    bulkQuotes,
    deliveryPaise,
    totalPaise,
    requiresDeliveryConfirmation,
    isEstimated,
    totalStatus: isEstimated ? "estimated" : "confirmed",
    totalLabel,
    isEmpty,
  };
}

export const EMPTY_ORDER: OrderSummary = calculateOrder([]);

/** Quantity limits for a specific product/variant, used by the UI. */
export function quantityLimits(
  productId: string,
  variantId: string,
  products: Product[] = PRODUCTS,
): { min: number; max: number } | null {
  const product = products.find((item) => item.id === productId);
  if (!product || !isPurchasable(product)) return null;
  if (!getVariant(product, variantId)) return null;
  return { min: product.minQuantity, max: product.maxQuantity };
}
