import { describe, expect, it } from "vitest";
import {
  PRODUCTS,
  getProductById,
  getVariant,
  type Product,
} from "../lib/catalog";
import {
  calculateOrder,
  normaliseCartLines,
  type CartLineInput,
} from "../lib/pricing";
import { formatINR } from "../lib/format";
import {
  buildOrderMessage,
  buildWhatsAppOrderUrl,
  createOrderReference,
} from "../lib/whatsapp";

const line = (productId: string, variantId: string, quantity = 1) => ({
  productId,
  variantId,
  quantity,
});

describe("catalog prices", () => {
  it("matches every configured variant price exactly", () => {
    const expected: Record<string, Record<string, number>> = {
      "shahi-nimbu-achar": { "250g": 11000, "500g": 22000, "1000g": 44000 },
      "shahi-amla-achar": { "250g": 7500, "500g": 15000, "1000g": 30000 },
      "shahi-aam-achar": { "250g": 7500, "500g": 15000, "1000g": 30000 },
      "shahi-murga-achar": { "250g": 20000, "500g": 40000, "1000g": 80000 },
      "shahi-ananas-meetha": { "200g": 15000, "1000g": 75000 },
      "shahi-amla-oil": { "500ml": 50000, "1000ml": 100000 },
      "zohra-zaika-masalas-master": { "250g": 7500, "1000g": 30000 },
      "zohra-zaika-chilli-powder": { "250g": 11000, "1000g": 44000 },
    };

    for (const [productId, variants] of Object.entries(expected)) {
      const product = getProductById(productId);
      expect(product, productId).toBeDefined();
      expect(
        Object.fromEntries(
          product!.variants.map((variant) => [variant.id, variant.pricePaise]),
        ),
      ).toEqual(variants);
    }
  });

  it("offers all three pickle pack sizes", () => {
    for (const product of PRODUCTS.filter(
      (item) => item.categoryId === "shahi-achar",
    )) {
      expect(product.variants.map((variant) => variant.id)).toEqual([
        "250g",
        "500g",
        "1000g",
      ]);
    }
  });

  it("uses millilitres for amla oil", () => {
    const oil = getProductById("shahi-amla-oil")!;
    expect(oil.variants.map((variant) => variant.unit)).toEqual(["ml", "ml"]);
    expect(oil.variants.map((variant) => variant.label)).toEqual([
      "500 ml",
      "1 L",
    ]);
  });
});

describe("order totals", () => {
  it("calculates a single line and formats rupees", () => {
    const summary = calculateOrder([line("shahi-nimbu-achar", "250g", 2)]);
    expect(summary.lines[0].lineTotalPaise).toBe(22000);
    expect(summary.subtotalPaise).toBe(22000);
    expect(summary.totalPaise).toBe(22000);
    expect(summary.totalStatus).toBe("estimated");
    expect(formatINR(summary.totalPaise)).toBe("₹220");
  });

  it("supports multiple products with different sizes", () => {
    const summary = calculateOrder([
      line("shahi-amla-achar", "500g", 1),
      line("shahi-aam-achar", "250g", 2),
      line("shahi-nimbu-achar", "1000g", 1),
    ]);
    expect(summary.subtotalPaise).toBe(15000 + 15000 + 44000);
    expect(summary.itemCount).toBe(4);
    expect(summary.totalPaise).toBe(74000);
    expect(summary.lines).toHaveLength(3);
  });

  it("supports a mixed-category cart", () => {
    const summary = calculateOrder([
      line("shahi-murga-achar", "250g", 1),
      line("shahi-amla-oil", "500ml", 1),
      line("zohra-zaika-masalas-master", "1000g", 1),
      line("zohra-zaika-chilli-powder", "250g", 1),
    ]);
    expect(summary.lines).toHaveLength(4);
    expect(summary.subtotalPaise).toBe(20000 + 50000 + 30000 + 11000);
  });

  it("recalculates quantity updates and removal", () => {
    const two = calculateOrder([line("shahi-nimbu-achar", "500g", 2)]);
    const one = calculateOrder([line("shahi-nimbu-achar", "500g", 1)]);
    const removed = calculateOrder([]);
    expect(two.totalPaise).toBe(44000);
    expect(one.totalPaise).toBe(22000);
    expect(removed.totalPaise).toBe(0);
    expect(removed.isEmpty).toBe(true);
  });

  it("rejects invalid or unknown variants and quantities", () => {
    const normalised = normaliseCartLines([
      line("shahi-nimbu-achar", "999g", 1),
      line("not-a-product", "250g", 1),
      line("shahi-amla-achar", "250g", 0),
      line("shahi-amla-achar", "250g", 1.5),
      line("shahi-amla-achar", "250g", 4),
    ]);
    expect(normalised.lines).toEqual([
      { productId: "shahi-amla-achar", variantId: "250g", quantity: 4 },
    ]);
    expect(normalised.rejectedLineCount).toBe(4);
  });

  it("ignores client-submitted prices", () => {
    const tampered = {
      productId: "shahi-murga-achar",
      variantId: "1000g",
      quantity: 1,
      unitPricePaise: 1,
      lineTotalPaise: 1,
    } as unknown as CartLineInput;
    const summary = calculateOrder([tampered]);
    expect(summary.lines[0].unitPricePaise).toBe(80000);
    expect(summary.totalPaise).toBe(80000);
  });

  it("never sells a coming-soon product", () => {
    const comingSoon: Product = {
      ...getProductById("shahi-nimbu-achar")!,
      id: "coming-soon-test",
      availability: "coming-soon",
    };
    const normalised = normaliseCartLines(
      [line("coming-soon-test", "250g", 1)],
      [comingSoon],
    );
    expect(normalised.lines).toHaveLength(0);
    expect(normalised.rejectedLineCount).toBe(1);
  });

  it("returns an empty, non-estimated summary for an empty cart", () => {
    const summary = calculateOrder([]);
    expect(summary.isEmpty).toBe(true);
    expect(summary.isEstimated).toBe(false);
    expect(summary.requiresDeliveryConfirmation).toBe(false);
    expect(summary.totalPaise).toBe(0);
    expect(summary.totalLabel).toBe("Total");
  });

  it("keeps a pending delivery charge out of the confirmed total", () => {
    const summary = calculateOrder([line("shahi-amla-achar", "250g", 1)]);
    expect(summary.deliveryPaise).toBeNull();
    expect(summary.requiresDeliveryConfirmation).toBe(true);
    expect(summary.isEstimated).toBe(true);
    expect(summary.totalLabel).toContain("delivery pending");
    expect(summary.totalPaise).toBe(7500);
  });

  it("uses a configured delivery charge only when supplied", () => {
    const summary = calculateOrder([line("shahi-amla-achar", "250g", 1)], {
      deliveryChargePaise: 5000,
    });
    expect(summary.deliveryPaise).toBe(5000);
    expect(summary.totalPaise).toBe(12500);
    expect(summary.totalStatus).toBe("confirmed");
  });

  it("formats paise consistently", () => {
    expect(formatINR(0)).toBe("₹0");
    expect(formatINR(7500)).toBe("₹75");
    expect(formatINR(11000)).toBe("₹110");
    expect(formatINR(130000)).toBe("₹1,300");
    expect(formatINR(12345)).toBe("₹123.45");
  });
});

describe("Shahi Ananas Meetha bulk pricing", () => {
  it("does not apply bulk below 2 kg", () => {
    const summary = calculateOrder([line("shahi-ananas-meetha", "1000g", 1)]);
    expect(summary.subtotalPaise).toBe(75000);
    expect(summary.bulkQuotes).toHaveLength(0);
    expect(summary.totalPaise).toBe(75000);
  });

  it("does not apply bulk to a single 200 g pack", () => {
    const summary = calculateOrder([line("shahi-ananas-meetha", "200g", 1)]);
    expect(summary.bulkQuotes).toHaveLength(0);
    expect(summary.totalPaise).toBe(15000);
  });

  it("applies exactly ₹1,300 at exactly 2 kg", () => {
    const summary = calculateOrder([line("shahi-ananas-meetha", "1000g", 2)]);
    expect(summary.subtotalPaise).toBe(150000);
    expect(summary.bulkQuotes).toHaveLength(1);
    expect(summary.bulkQuotes[0].weightGrams).toBe(2000);
    expect(summary.bulkQuotes[0].provisionalSubtotalPaise).toBe(130000);
    expect(summary.bulkQuotes[0].status).toBe("pending");
    expect(summary.bulkAdjustmentPaise).toBe(-20000);
    expect(summary.totalPaise).toBe(130000);
    expect(summary.totalStatus).toBe("estimated");
  });

  it("supports mixed 200 g and 1 kg variants at 2 kg", () => {
    const summary = calculateOrder([
      line("shahi-ananas-meetha", "1000g", 1),
      line("shahi-ananas-meetha", "200g", 5),
    ]);
    expect(summary.bulkQuotes[0].weightGrams).toBe(2000);
    expect(summary.bulkQuotes[0].provisionalSubtotalPaise).toBe(130000);
    expect(summary.subtotalPaise).toBe(150000);
  });

  it("uses the provisional rate above 2 kg", () => {
    const summary = calculateOrder([
      line("shahi-ananas-meetha", "1000g", 2),
      line("shahi-ananas-meetha", "200g", 2),
    ]);
    expect(summary.bulkQuotes[0].weightGrams).toBe(2400);
    expect(summary.bulkQuotes[0].provisionalSubtotalPaise).toBe(156000);
    expect(summary.totalPaise).toBe(156000);
    expect(summary.totalStatus).toBe("estimated");
  });

  it("applies the bulk adjustment only to Ananas Meetha in a mixed cart", () => {
    const summary = calculateOrder([
      line("shahi-ananas-meetha", "1000g", 2),
      line("shahi-amla-achar", "250g", 1),
      line("shahi-amla-oil", "500ml", 1),
    ]);
    expect(summary.subtotalPaise).toBe(150000 + 7500 + 50000);
    expect(summary.bulkAdjustmentPaise).toBe(-20000);
    expect(summary.totalPaise).toBe(150000 + 7500 + 50000 - 20000);
  });

  it("keeps bulk pricing provisional even with a known delivery charge", () => {
    const summary = calculateOrder(
      [line("shahi-ananas-meetha", "1000g", 2)],
      { deliveryChargePaise: 5000 },
    );
    expect(summary.totalPaise).toBe(135000);
    expect(summary.isEstimated).toBe(true);
    expect(summary.totalLabel).toContain("bulk price pending");
  });
});

describe("WhatsApp order message", () => {
  const customer = {
    name: "Ayesha Khan",
    phone: "9876543210",
    address: "12 Rose Lane, Charminar",
    city: "Hyderabad",
    pin: "500002",
    notes: "Please call before delivery",
  };

  it("contains the reference, customer, items and calculations", () => {
    const items = [
      line("shahi-nimbu-achar", "250g", 2),
      line("shahi-amla-achar", "500g", 1),
    ];
    const message = buildOrderMessage({
      items,
      customer,
      reference: "ZZ-260101-TEST",
    });

    expect(message).toContain("ZOHRA-ZAIKA — ORDER REQUEST");
    expect(message).toContain("Order Reference: ZZ-260101-TEST");
    expect(message).toContain("Name: Ayesha Khan");
    expect(message).toContain("Phone: 9876543210");
    expect(message).toContain("Shahi Nimbu Achar");
    expect(message).toContain("Pack size: 250 g");
    expect(message).toContain("Unit price: ₹110");
    expect(message).toContain("Quantity: 2");
    expect(message).toContain("Line total: ₹220");
    expect(message).toContain("Subtotal: ₹370");
    expect(message).toContain("Delivery: Pending confirmation");
    expect(message).toContain("Estimated total (delivery pending): ₹370");
  });

  it("marks bulk orders as provisional", () => {
    const message = buildOrderMessage({
      items: [line("shahi-ananas-meetha", "1000g", 2)],
      customer,
      reference: "ZZ-260101-BULK",
    });
    expect(message).toContain("PENDING CONFIRMATION");
    expect(message).toContain("₹1,300");
    expect(message).not.toContain("Total: ₹1,300");
    expect(message).toContain("final bulk price is not agreed yet");
  });

  it("URL-encodes the message safely", () => {
    const url = buildWhatsAppOrderUrl({
      items: [line("shahi-murga-achar", "250g", 1)],
      customer,
      reference: "ZZ-260101-URL",
    });
    expect(url.startsWith("https://wa.me/919032219521?text=")).toBe(true);
    const encoded = url.split("?text=")[1];
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toContain("Shahi Murga Achar");
    expect(encoded).not.toContain("\n");
    expect(encoded).toContain("%0A");
  });

  it("creates a unique-looking reference", () => {
    const reference = createOrderReference(new Date("2026-10-23T00:00:00Z"));
    expect(reference).toMatch(/^ZZ-261023-[A-Z0-9]{4}$/);
  });
});

describe("catalog integrity", () => {
  it("has unique product ids, slugs and valid category links", () => {
    expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(
      PRODUCTS.length,
    );
    expect(new Set(PRODUCTS.map((product) => product.slug)).size).toBe(
      PRODUCTS.length,
    );
    for (const product of PRODUCTS) {
      expect(product.variants.length).toBeGreaterThan(0);
      for (const variant of product.variants) {
        expect(getVariant(product, variant.id)).toBeDefined();
        expect(Number.isInteger(variant.pricePaise)).toBe(true);
        expect(variant.pricePaise).toBeGreaterThan(0);
      }
    }
  });
});
