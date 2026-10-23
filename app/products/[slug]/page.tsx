import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  PRODUCTS,
  getProductBySlug,
  type Product,
} from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Zohra-Zaika`,
      description: product.description,
      type: "website",
    },
  };
}

function productJsonLd(product: Product) {
  const availability =
    product.availability === "available"
      ? "https://schema.org/InStock"
      : product.availability === "coming-soon"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/OutOfStock";

  const images = product.images.map((image) => image.src);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.longDescription,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    ...(images.length > 0 ? { image: images } : {}),
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      priceCurrency: "INR",
      price: (variant.pricePaise / 100).toFixed(2),
      availability,
      itemCondition: "https://schema.org/NewCondition",
      name: variant.label,
    })),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((item) => item.id === product.categoryId);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
      {
        "@type": "ListItem",
        position: 3,
        name: category?.name ?? "Products",
        item: `/category/${category?.slug ?? ""}`,
      },
      { "@type": "ListItem", position: 4, name: product.name },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <ProductDetail product={product} />
    </main>
  );
}
