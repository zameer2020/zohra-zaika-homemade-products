import { BUSINESS } from "./business";
import { getProductById, getVariant } from "./catalog";
import { formatINR } from "./format";
import { calculateOrder, type OrderSummary } from "./pricing";

export const WHATSAPP_NUMBER = BUSINESS.whatsappNumber;
export const WHATSAPP_DISPLAY = BUSINESS.whatsappDisplay;
export const WHATSAPP_BASE_URL = BUSINESS.whatsappBaseUrl;

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  pin: string;
  notes?: string;
}

export interface OrderMessageInput {
  items: unknown;
  customer: CustomerDetails;
  reference: string;
  summary?: OrderSummary;
}

/** Human-readable, collision-resistant order reference. */
export function createOrderReference(now: Date = new Date()): string {
  const date = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZZ-${date}-${random}`;
}

export function buildOrderMessage({
  items,
  customer,
  reference,
  summary = calculateOrder(items),
}: OrderMessageInput): string {
  const itemBlocks = summary.lines.map((line, index) =>
    [
      `${index + 1}. ${line.productName}`,
      `Pack size: ${line.variantLabel}`,
      `Unit price: ${formatINR(line.unitPricePaise)}`,
      `Quantity: ${line.quantity}`,
      `Line total: ${formatINR(line.lineTotalPaise)}`,
    ].join("\n"),
  );

  const deliveryText =
    summary.deliveryPaise === null
      ? "Pending confirmation"
      : formatINR(summary.deliveryPaise);

  const bulkText =
    summary.bulkQuotes.length === 0
      ? "Not applicable"
      : summary.bulkQuotes
          .map((quote) => {
            const kg = (quote.weightGrams / 1000).toFixed(
              quote.weightGrams % 1000 === 0 ? 0 : 1,
            );
            return `${quote.productName} — ${kg} kg estimated at ${formatINR(
              quote.provisionalSubtotalPaise,
            )} (${formatINR(quote.ratePerKgPaise)}/kg provisional). PENDING CONFIRMATION — final bulk price is not agreed yet.`;
          })
          .join("\n");

  const totalLine = summary.isEstimated
    ? `${summary.totalLabel}: ${formatINR(summary.totalPaise)}`
    : `Total: ${formatINR(summary.totalPaise)}`;

  const pendingNotes: string[] = [];
  if (summary.requiresDeliveryConfirmation) {
    pendingNotes.push("delivery charge");
  }
  if (summary.bulkQuotes.length > 0) {
    pendingNotes.push("negotiable bulk pricing");
  }

  return [
    "ZOHRA-ZAIKA — ORDER REQUEST",
    "",
    `Order Reference: ${reference}`,
    "",
    "CUSTOMER",
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Address: ${customer.address.trim()}`,
    `City/PIN: ${customer.city.trim()} - ${customer.pin.trim()}`,
    `Notes: ${customer.notes?.trim() || "—"}`,
    "",
    "ORDER ITEMS",
    ...itemBlocks,
    "",
    "ORDER SUMMARY",
    `Subtotal: ${formatINR(summary.subtotalPaise)}`,
    `Discount: ${formatINR(summary.discountPaise)}`,
    summary.bulkAdjustmentPaise < 0
      ? `Provisional bulk adjustment: -${formatINR(
          Math.abs(summary.bulkAdjustmentPaise),
        )}`
      : "Provisional bulk adjustment: ₹0",
    `Delivery: ${deliveryText}`,
    totalLine,
    `Bulk quote status: ${bulkText}`,
    "",
    summary.isEstimated
      ? `Please confirm ${
          pendingNotes.length > 0 ? pendingNotes.join(" and ") : "the total"
        } before finalising this order.`
      : "Please confirm product availability and delivery.",
    "This message is an order request only. It is not confirmed or paid until Zohra-Zaika replies.",
    "Thank you!",
  ].join("\n");
}

export function buildWhatsAppOrderUrl(input: OrderMessageInput): string {
  const message = buildOrderMessage(input);
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

/** Generic cart enquiry used from the cart drawer (no customer data). */
export function buildCartEnquiryUrl(items: unknown): string {
  const summary = calculateOrder(items);
  const lines = summary.lines.map(
    (line, index) =>
      `${index + 1}. ${line.productName} — ${line.variantLabel} × ${line.quantity} = ${formatINR(line.lineTotalPaise)}`,
  );

  const message = [
    "Hello Zohra-Zaika!",
    "",
    "I would like to check availability and delivery for these items:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatINR(summary.subtotalPaise)}`,
    "Delivery: Please confirm",
    summary.bulkQuotes.length > 0
      ? "Bulk quote: Pending confirmation (provisional estimate only)"
      : "",
    "",
    "This is an enquiry, not a confirmed order. Please confirm availability and delivery.",
    "Thank you!",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

/** Explicit bulk quote request for Shahi Ananas Meetha. */
export function buildBulkQuoteUrl(
  productName = "Shahi Ananas Meetha",
  weightGrams?: number,
): string {
  const weightText =
    weightGrams && weightGrams >= 2000
      ? `Approximate quantity: ${(weightGrams / 1000).toFixed(
          weightGrams % 1000 === 0 ? 0 : 1,
        )} kg`
      : "Approximate quantity: 2 kg or more";

  const message = [
    "Hello Zohra-Zaika!",
    "",
    `BULK QUOTE REQUEST — ${productName}`,
    weightText,
    "I understand the website rate from 2 kg is provisional (₹650 per kg) and requires your confirmation.",
    "",
    "Please confirm the final bulk price, availability and delivery charge.",
    "This is a quote request, not a confirmed order.",
    "Thank you!",
  ].join("\n");

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

/** Product enquiry that always reads the pack size and price from the catalog. */
export function whatsAppUrlForProductEnquiry(
  productId: string,
  variantId?: string,
  quantity = 1,
): string {
  const product = getProductById(productId);
  if (!product) {
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
      "Hello Zohra-Zaika! I would like to ask about your products.",
    )}`;
  }

  const variant = variantId ? getVariant(product, variantId) : undefined;
  const quantityText =
    Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

  const message = [
    "Hello Zohra-Zaika!",
    "",
    `I would like to ask about ${product.name}${
      variant ? ` — ${variant.label}` : ""
    }.`,
    variant
      ? `Listed price: ${formatINR(variant.pricePaise)} × ${quantityText}`
      : "",
    "",
    "Please confirm availability and delivery. This is an enquiry, not a confirmed order.",
    "Thank you!",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export function whatsAppUrlForContact(
  name: string,
  phone: string,
  message: string,
): string {
  const text = [
    "Hello Zohra-Zaika!",
    "",
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    "",
    message.trim(),
    "",
    "Please share details about products and ordering.",
    "Thank you!",
  ].join("\n");
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}
