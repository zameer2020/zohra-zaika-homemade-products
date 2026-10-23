"use client";

import type { ProductVariant } from "@/lib/catalog";
import { formatINR } from "@/lib/format";

interface VariantPickerProps {
  variants: ProductVariant[];
  value: string;
  onChange: (variantId: string) => void;
  name: string;
  legend?: string;
  disabled?: boolean;
}

export default function VariantPicker({
  variants,
  value,
  onChange,
  name,
  legend = "Select pack size",
  disabled = false,
}: VariantPickerProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-xs font-bold tracking-[0.12em] text-cocoa/65 uppercase">
        {legend}
      </legend>
      <div
        className={`grid gap-2 ${
          variants.length > 2 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {variants.map((variant) => {
          const selected = variant.id === value;
          return (
            <label
              key={variant.id}
              className={`relative cursor-pointer rounded-xl border px-2 py-2.5 text-center transition focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-1 ${
                selected
                  ? "border-forest bg-forest text-cream shadow-sm"
                  : "border-forest/20 bg-cream text-cocoa hover:border-forest/50 hover:bg-cream-dark/50"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={variant.id}
                checked={selected}
                onChange={() => onChange(variant.id)}
                className="sr-only"
              />
              <span className="block text-sm font-bold">{variant.label}</span>
              <span
                className={`mt-0.5 block text-xs font-semibold ${
                  selected ? "text-gold-soft" : "text-terracotta"
                }`}
              >
                {formatINR(variant.pricePaise)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
