"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import {
  CATEGORIES,
  PRODUCTS,
  getProductsByCategory,
  type CategoryId,
} from "@/lib/catalog";
import ProductCard from "./ProductCard";

type Filter = CategoryId | "all";

export default function ShopBrowser() {
  const [filter, setFilter] = useState<Filter>("all");

  const products = useMemo(
    () =>
      filter === "all" ? PRODUCTS : getProductsByCategory(filter as CategoryId),
    [filter],
  );

  return (
    <div>
      <div className="rounded-3xl border border-gold/35 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 px-2 text-[10px] font-bold tracking-[0.14em] text-cocoa/45 uppercase">
            <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
            Category
          </span>
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              filter === "all"
                ? "bg-forest text-cream"
                : "bg-cream text-cocoa/70 hover:text-forest"
            }`}
          >
            All products ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((category) => {
            const count = getProductsByCategory(category.id).length;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                aria-pressed={filter === category.id}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  filter === category.id
                    ? "bg-forest text-cream"
                    : "bg-cream text-cocoa/70 hover:text-forest"
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-cocoa/55" role="status">
          Showing {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <p className="text-[11px] text-cocoa/45">Prices in INR</p>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}
