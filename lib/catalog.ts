/**
 * Zohra-Zaika central product catalog.
 *
 * This file is the single source of truth for categories, products, pack
 * sizes, prices, availability and bulk-pricing policy. Product cards, product
 * pages, the cart, checkout, WhatsApp messages, SEO metadata and the support
 * chatbot all read from here.
 *
 * All money is stored as integer paise (1 rupee = 100 paise).
 */

export type CategoryId =
  | "shahi-achar"
  | "shahi-ananas-meetha"
  | "shahi-amla-oil"
  | "masalas-master"
  | "chilli-powder";

export type VariantUnit = "g" | "ml";

export type Availability = "available" | "coming-soon" | "unavailable";

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  accent: string;
}

export interface ProductVariant {
  /** Stable identifier used by the cart. Never derive prices from this. */
  id: string;
  /** Human-readable pack size, e.g. "250 g", "1 kg", "500 ml", "1 L". */
  label: string;
  /** Numeric size in `unit`. */
  size: number;
  unit: VariantUnit;
  /** Exact configured price in integer paise. */
  pricePaise: number;
  /**
   * Weight in grams used for bulk-weight calculations. Only set for products
   * whose bulk policy is weight-based. Liquid products use `null`.
   */
  bulkWeightGrams: number | null;
}

export interface CatalogImage {
  src: string;
  alt: string;
}

export interface BulkPolicy {
  /** Bulk pricing starts when the combined weight reaches this threshold. */
  thresholdGrams: number;
  /** Negotiable bulk rate in paise per kilogram. */
  ratePerKgPaise: number;
  /** Bulk prices are always provisional until the business confirms them. */
  provisional: true;
  note: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  description: string;
  longDescription: string;
  images: CatalogImage[];
  variants: ProductVariant[];
  availability: Availability;
  veg: boolean;
  badge?: string;
  details: string[];
  bulkPolicy?: BulkPolicy;
  /** Inclusive integer limits for one cart line. */
  minQuantity: number;
  maxQuantity: number;
}

export const BRAND_NAME = "Zohra-Zaika";
export const CATALOG_VERSION = 2;

export const CATEGORIES: Category[] = [
  {
    id: "shahi-achar",
    slug: "shahi-achar",
    name: "Shahi Achar",
    shortName: "Pickles",
    tagline: "The royal pickle collection",
    description:
      "Traditional Indian pickles prepared in small batches — Nimbu, Amla, Aam and Murga. Choose from 250 g, 500 g or 1 kg packs.",
    accent: "#173d2b",
  },
  {
    id: "shahi-ananas-meetha",
    slug: "shahi-ananas-meetha",
    name: "Shahi Ananas Meetha",
    shortName: "Ananas Meetha",
    tagline: "A royal sweet-and-tangy preparation",
    description:
      "A rich pineapple preparation with nuts, made for festive tables and special meals. Available in 200 g and 1 kg packs, with a provisional bulk rate from 2 kg.",
    accent: "#b8862b",
  },
  {
    id: "shahi-amla-oil",
    slug: "shahi-amla-oil",
    name: "Shahi Amla Oil",
    shortName: "Amla Oil",
    tagline: "Traditional amla hair oil",
    description:
      "Shahi Amla Oil, prepared for traditional hair care. Available in 500 ml and 1 litre packs.",
    accent: "#3f5a2a",
  },
  {
    id: "masalas-master",
    slug: "masalas-master",
    name: "Zohra-Zaika Masalas Master",
    shortName: "Masalas Master",
    tagline: "One masala, three favourites",
    description:
      "An all-in-one masala for chicken, fish and meat. Available in 250 g and 1 kg packs.",
    accent: "#a7341f",
  },
  {
    id: "chilli-powder",
    slug: "chilli-powder",
    name: "Zohra-Zaika Chilli Powder",
    shortName: "Chilli Powder",
    tagline: "Everyday Indian heat",
    description:
      "Zohra-Zaika Chilli Powder for everyday Indian cooking. Available in 250 g and 1 kg packs.",
    accent: "#a52a1a",
  },
];

const PRODUCT_IMAGES = {
  nimbu: "/images/products/shahi-nimbu-achar.jpg",
  amla: "/images/products/shahi-amla-achar.png",
  aam: "/images/products/shahi-aam-achar.png",
  murga: "/images/products/shahi-murga-achar.png",
  ananas: "/images/products/shahi-ananas-meetha.png",
  ananas1: "/images/products/shahi-ananas-meetha-1.jpg",
  ananas2: "/images/products/shahi-ananas-meetha-2.jpg",
  ananas3: "/images/products/shahi-ananas-meetha-3.jpg",
  amlaOil: "/images/products/shahi-amla-oil.png",
  masalas: "/images/products/masalas-master.jpg",
} as const;

function grams(size: number, id: string, pricePaise: number): ProductVariant {
  return {
    id,
    label: id === "1000g" ? "1 kg" : `${size} g`,
    size,
    unit: "g",
    pricePaise,
    bulkWeightGrams: size,
  };
}

function millilitres(
  size: number,
  id: string,
  pricePaise: number,
): ProductVariant {
  return {
    id,
    label: id === "1000ml" ? "1 L" : `${size} ml`,
    size,
    unit: "ml",
    pricePaise,
    bulkWeightGrams: null,
  };
}

export const PRODUCTS: Product[] = [
  {
    id: "shahi-nimbu-achar",
    slug: "shahi-nimbu-achar",
    name: "Shahi Nimbu Achar",
    brand: BRAND_NAME,
    categoryId: "shahi-achar",
    description:
      "A tangy and flavourful lemon pickle made for lovers of traditional taste.",
    longDescription:
      "Shahi Nimbu Achar brings the bright, tangy character of traditional Indian lemon pickle to everyday meals. Prepared in small batches in the Zohra-Zaika kitchen and packed in your chosen size.",
    images: [
      {
        src: PRODUCT_IMAGES.nimbu,
        alt: "Zohra-Zaika Shahi Nimbu Achar jar surrounded by fresh lemons",
      },
    ],
    variants: [
      grams(250, "250g", 11000),
      grams(500, "500g", 22000),
      grams(1000, "1000g", 44000),
    ],
    availability: "available",
    veg: true,
    badge: "Tangy favourite",
    details: [
      "Choose from 250 g, 500 g and 1 kg packs.",
      "Made in small batches after your order.",
      "Store in a cool, dry place and use a clean, dry spoon.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
  {
    id: "shahi-amla-achar",
    slug: "shahi-amla-achar",
    name: "Shahi Amla Achar",
    brand: BRAND_NAME,
    categoryId: "shahi-achar",
    description:
      "A delightful traditional amla pickle packed with bold Indian flavours.",
    longDescription:
      "Shahi Amla Achar is a traditional Indian amla pickle with a bold, rounded flavour. Each batch is prepared with care and packed in 250 g, 500 g or 1 kg packs.",
    images: [
      {
        src: PRODUCT_IMAGES.amla,
        alt: "Zohra-Zaika Shahi Amla Achar with whole amla and spices",
      },
    ],
    variants: [
      grams(250, "250g", 7500),
      grams(500, "500g", 15000),
      grams(1000, "1000g", 30000),
    ],
    availability: "available",
    veg: true,
    badge: "Traditional",
    details: [
      "Choose from 250 g, 500 g and 1 kg packs.",
      "Made in small batches after your order.",
      "Store in a cool, dry place and use a clean, dry spoon.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
  {
    id: "shahi-aam-achar",
    slug: "shahi-aam-achar",
    name: "Shahi Aam Achar",
    brand: BRAND_NAME,
    categoryId: "shahi-achar",
    description:
      "Classic homemade mango pickle, made in small batches after you order.",
    longDescription:
      "Shahi Aam Achar is a classic Indian mango pickle inspired by traditional homemade recipes. Choose the pack size that suits your table.",
    images: [
      {
        src: PRODUCT_IMAGES.aam,
        alt: "Zohra-Zaika Shahi Aam Achar with raw mangoes and red chilli",
      },
    ],
    variants: [
      grams(250, "250g", 7500),
      grams(500, "500g", 15000),
      grams(1000, "1000g", 30000),
    ],
    availability: "available",
    veg: true,
    badge: "Classic homemade",
    details: [
      "Choose from 250 g, 500 g and 1 kg packs.",
      "Made in small batches after your order.",
      "Store in a cool, dry place and use a clean, dry spoon.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
  {
    id: "shahi-murga-achar",
    slug: "shahi-murga-achar",
    name: "Shahi Murga Achar",
    brand: BRAND_NAME,
    categoryId: "shahi-achar",
    description:
      "A royal chicken pickle made in traditional homemade style with rich spices.",
    longDescription:
      "Shahi Murga Achar is a non-vegetarian chicken pickle prepared in the traditional Zohra-Zaika style with a rich spice blend. Available in 250 g, 500 g and 1 kg packs.",
    images: [
      {
        src: PRODUCT_IMAGES.murga,
        alt: "Zohra-Zaika Shahi Murga Achar with chicken pieces and whole spices",
      },
    ],
    variants: [
      grams(250, "250g", 20000),
      grams(500, "500g", 40000),
      grams(1000, "1000g", 80000),
    ],
    availability: "available",
    veg: false,
    badge: "Royal non-veg",
    details: [
      "Contains chicken. Not suitable for vegetarians.",
      "Choose from 250 g, 500 g and 1 kg packs.",
      "Made in small batches after your order.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
  {
    id: "shahi-ananas-meetha",
    slug: "shahi-ananas-meetha",
    name: "Shahi Ananas Meetha",
    brand: BRAND_NAME,
    categoryId: "shahi-ananas-meetha",
    description:
      "A rich sweet-and-tangy pineapple preparation with nuts, made for festive tables.",
    longDescription:
      "Shahi Ananas Meetha is a royal pineapple preparation finished with nuts. It is available in a 200 g pack and a 1 kg pack. Orders of 2 kg or more qualify for a provisional bulk rate of ₹650 per kg — the final bulk price is confirmed by the business before the order is accepted.",
    images: [
      {
        src: PRODUCT_IMAGES.ananas,
        alt: "Zohra-Zaika Shahi Ananas Meetha garnished with nuts",
      },
      {
        src: PRODUCT_IMAGES.ananas1,
        alt: "Close-up of Zohra-Zaika Shahi Ananas Meetha in a serving bowl",
      },
      {
        src: PRODUCT_IMAGES.ananas2,
        alt: "Zohra-Zaika Shahi Ananas Meetha garnished with almonds and cherries",
      },
      {
        src: PRODUCT_IMAGES.ananas3,
        alt: "Three bowls of Zohra-Zaika Shahi Ananas Meetha",
      },
    ],
    variants: [grams(200, "200g", 15000), grams(1000, "1000g", 75000)],
    availability: "available",
    veg: true,
    badge: "Festive special",
    details: [
      "Available in 200 g and 1 kg packs.",
      "Bulk orders from 2 kg: provisional ₹650 per kg, subject to confirmation.",
      "Final bulk price, availability and delivery are confirmed on WhatsApp.",
    ],
    bulkPolicy: {
      thresholdGrams: 2000,
      ratePerKgPaise: 65000,
      provisional: true,
      note: "Bulk rate applies from a combined 2 kg. The bulk price is provisional and must be confirmed by Zohra-Zaika before the order is finalised.",
    },
    minQuantity: 1,
    maxQuantity: 30,
  },
  {
    id: "shahi-amla-oil",
    slug: "shahi-amla-oil",
    name: "Shahi Amla Oil",
    brand: BRAND_NAME,
    categoryId: "shahi-amla-oil",
    description:
      "Traditional Shahi Amla Oil, prepared for everyday hair care.",
    longDescription:
      "Shahi Amla Oil is part of the Zohra-Zaika home-made range. It is sold in liquid measures: a 500 ml bottle or a 1 litre bottle. Store away from direct sunlight.",
    images: [
      {
        src: PRODUCT_IMAGES.amlaOil,
        alt: "Zohra-Zaika Shahi Amla Oil with amla fruit, herbs and a wooden spoon",
      },
    ],
    variants: [
      millilitres(500, "500ml", 50000),
      millilitres(1000, "1000ml", 100000),
    ],
    availability: "available",
    veg: true,
    badge: "Hair care",
    details: [
      "Sold by volume: 500 ml or 1 L.",
      "For external use only.",
      "Store in a cool, dry place away from direct sunlight.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
  {
    id: "zohra-zaika-masalas-master",
    slug: "zohra-zaika-masalas-master",
    name: "Zohra-Zaika Masalas Master",
    brand: BRAND_NAME,
    categoryId: "masalas-master",
    description: "All-in-one masala for chicken, fish and meat.",
    longDescription:
      "Zohra-Zaika Masalas Master is an all-in-one masala for chicken, fish and meat. Available in 250 g and 1 kg packs.",
    images: [
      {
        src: PRODUCT_IMAGES.masalas,
        alt: "Zohra-Zaika Masalas Master pack with chicken, fish and mutton",
      },
    ],
    variants: [grams(250, "250g", 7500), grams(1000, "1000g", 30000)],
    availability: "available",
    veg: false,
    badge: "Chicken · Fish · Meat",
    details: [
      "All-in-one masala for chicken, fish and meat.",
      "Available in 250 g and 1 kg packs.",
      "Follow the pack directions for use.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
  {
    id: "zohra-zaika-chilli-powder",
    slug: "zohra-zaika-chilli-powder",
    name: "Zohra-Zaika Chilli Powder",
    brand: BRAND_NAME,
    categoryId: "chilli-powder",
    description: "Zohra-Zaika Chilli Powder for everyday Indian cooking.",
    longDescription:
      "Zohra-Zaika Chilli Powder is part of the home-made range for everyday Indian cooking. Available in 250 g and 1 kg packs.",
    images: [],
    variants: [grams(250, "250g", 11000), grams(1000, "1000g", 44000)],
    availability: "available",
    veg: true,
    badge: "Pantry staple",
    details: [
      "Available in 250 g and 1 kg packs.",
      "Store in a cool, dry place in an airtight container.",
    ],
    minQuantity: 1,
    maxQuantity: 20,
  },
];

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductsByCategory(categoryId: CategoryId): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export function getVariant(
  product: Product,
  variantId: string,
): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId);
}

export function isPurchasable(product: Product): boolean {
  return product.availability === "available" && product.variants.length > 0;
}

export function getStartingPricePaise(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.pricePaise));
}

export function formatVariantLabel(variant: ProductVariant): string {
  return variant.label;
}

/** Compact catalog context for the server-side chatbot prompt. */
export function getChatCatalogSnapshot() {
  return {
    brand: BRAND_NAME,
    categories: CATEGORIES.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
    })),
    products: PRODUCTS.map((product) => ({
      name: product.name,
      slug: product.slug,
      category: getCategory(product.categoryId)?.name ?? product.categoryId,
      availability: product.availability,
      description: product.description,
      variants: product.variants.map((variant) => ({
        packSize: variant.label,
        price: `₹${(variant.pricePaise / 100).toLocaleString("en-IN")}`,
      })),
      bulkPolicy: product.bulkPolicy
        ? {
            thresholdGrams: product.bulkPolicy.thresholdGrams,
            ratePerKg: `₹${(product.bulkPolicy.ratePerKgPaise / 100).toLocaleString("en-IN")} per kg`,
            status: "provisional, requires business confirmation",
          }
        : null,
    })),
  };
}
