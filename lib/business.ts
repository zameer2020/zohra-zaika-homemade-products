/**
 * Central business configuration.
 *
 * Change the WhatsApp number, delivery rule and site URL here — never inside
 * individual components. The existing valid number is reused by default.
 */

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

const configuredNumber =
  digitsOnly(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "") || "919032219521";

export const WHATSAPP_NUMBER = configuredNumber;
export const WHATSAPP_DISPLAY = "+91 90322 19521";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * Delivery is intentionally unset because the current price list does not
 * contain a confirmed delivery charge. `null` means "pending confirmation".
 * Set NEXT_PUBLIC_DELIVERY_CHARGE_PAISE to an integer to publish a confirmed
 * flat charge. Do not guess a value.
 */
const deliveryEnv = process.env.NEXT_PUBLIC_DELIVERY_CHARGE_PAISE?.trim();
const parsedDelivery =
  deliveryEnv && /^\d+$/.test(deliveryEnv) ? Number(deliveryEnv) : null;

export const DELIVERY_CHARGE_PAISE: number | null =
  parsedDelivery !== null && Number.isSafeInteger(parsedDelivery)
    ? parsedDelivery
    : null;

export const BUSINESS = {
  name: "Zohra-Zaika",
  longName: "Zohra-Zaika Homemade Products",
  tagline: "Ghar Ka Swad, Shahi Andaaz!",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: WHATSAPP_DISPLAY,
  whatsappBaseUrl: WHATSAPP_BASE_URL,
  deliveryChargePaise: DELIVERY_CHARGE_PAISE,
  deliveryNote:
    DELIVERY_CHARGE_PAISE === null
      ? "Delivery charge and serviceability are confirmed on WhatsApp."
      : "A flat delivery charge of ₹" +
        (DELIVERY_CHARGE_PAISE / 100).toLocaleString("en-IN") +
        " applies.",
  orderNote:
    "This website prepares a WhatsApp message only. Your order is not confirmed until you send the message and Zohra-Zaika replies.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "",
} as const;

export const OPENROUTER = {
  endpoint:
    process.env.OPENROUTER_BASE_URL?.replace(/\/$/, "") ??
    "https://openrouter.ai/api/v1/chat/completions",
  model:
    process.env.OPENROUTER_MODEL?.trim() ||
    "google/gemma-4-31b-it:free",
  maxMessages: 8,
  maxMessageChars: 1000,
  maxTotalChars: 6000,
  timeoutMs: 20_000,
  rateLimit: {
    windowMs: 5 * 60 * 1000,
    maxRequests: 12,
  },
} as const;
