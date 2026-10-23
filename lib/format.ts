/** Formatting helpers. Money is always handled as integer paise. */

const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format integer paise as Indian rupees.
 * Examples: 11000 -> "₹110", 130000 -> "₹1,300", 12345 -> "₹123.45".
 */
export function formatINR(paise: number): string {
  if (!Number.isFinite(paise)) return "₹0";
  const safePaise = Math.round(paise);
  const rupees = safePaise / 100;
  return `₹${rupeeFormatter.format(rupees)}`;
}

/** Format rupees (used only for clearly-labelled whole-rupee inputs). */
export function formatRupees(rupees: number): string {
  return formatINR(Math.round(rupees * 100));
}

export function formatQuantity(quantity: number): string {
  return Number.isFinite(quantity) ? String(Math.trunc(quantity)) : "0";
}

export function pluralise(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
