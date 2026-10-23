# Zohra-Zaika Homemade Products

A premium, mobile-first catalogue and WhatsApp ordering site for **Zohra-Zaika
Homemade Products**. This is a separate version of the Zohra-Zaika site, built
in its own repository without touching the existing deployed project.

- Home-made pickles (Shahi Achar)
- Shahi Ananas Meetha
- Shahi Amla Oil
- Masalas Master
- Chilli Powder

## What is included

- Central catalogue in `lib/catalog.ts` — the only place product names, images,
  pack sizes and prices are defined.
- Shared pricing engine in `lib/pricing.ts` — every cart, checkout, WhatsApp
  message and test uses the same integer-paise calculations.
- Persistent shared cart using `productId + variantId` as the line identity.
- Cart validation against the live catalogue before checkout. Unavailable or
  coming-soon products are never sold.
- WhatsApp checkout with an exact, URL-encoded order message and a unique order
  reference.
- Real product photographs in `public/images/products/` with a branded fallback
  where no photograph exists (currently Chilli Powder).
- Server-only AI assistant using OpenRouter, configured by environment
  variables, with rate limiting, request limits, timeout handling and a WhatsApp
  fallback.
- Missing photographs, delivery charges, bulk pricing and business details are
  never invented.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Order WhatsApp number in international format. Defaults to the existing valid number. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for OpenRouter attribution headers. |
| `NEXT_PUBLIC_DELIVERY_CHARGE_PAISE` | Optional flat delivery charge in **paise**. Leave unset until the business confirms it. |
| `OPENROUTER_API_KEY` | **Server-only** OpenRouter key. Never prefix this with `NEXT_PUBLIC_`. |
| `OPENROUTER_MODEL` | OpenRouter model ID, e.g. `google/gemma-4-26b-a4b-it:free`. |
| `OPENROUTER_BASE_URL` | Optional custom OpenRouter-compatible endpoint. |

If `OPENROUTER_API_KEY` is unset, the chat UI shows a friendly message and a
WhatsApp link instead of failing. Do not commit `.env.local`.

### Delivery and bulk pricing

- **Delivery:** unconfirmed by default. The UI says "pending confirmation" and
  never shows free delivery unless a configured charge is `0`.
- **Shahi Ananas Meetha bulk:** from a combined 2 kg, the provisional rate is
  ₹650/kg. Exactly 2 kg is provisionally ₹1,300. The adjustment is always shown
  as provisional and requires confirmation on WhatsApp. The bulk rate is not
  applied below 2 kg.
- **Gifting:** no invented combo prices. Gift boxes are built from the normal
  catalogue and confirmed on WhatsApp.

## Testing and quality checks

```bash
npm test          # Vitest pricing/cart/WhatsApp tests
npm run lint      # ESLint
npm run build     # production build
```

The test suite covers every configured price, variant identities, mixed carts,
quantity changes, invalid lines, empty carts, Ananas bulk thresholds, pending
delivery, and WhatsApp message content/encoding.

## Deploying

This repository is ready for Vercel. Import the repository in Vercel, add the
environment variables, and deploy. Use Node.js 20+.

On Vercel, set `OPENROUTER_API_KEY` as a server-side environment variable (not a
`NEXT_PUBLIC_` variable). `NEXT_PUBLIC_*` values are visible to the browser and
must only contain public information.

## Project structure

```text
app/                 Routes, metadata, API route
components/          UI components (catalogue, cart, checkout, chat)
lib/catalog.ts       Product/category/price source of truth
lib/pricing.ts       Shared integer-paise pricing engine
lib/business.ts      WhatsApp, delivery and OpenRouter configuration
lib/cart-context.tsx Persistent shared cart
lib/whatsapp.ts      WhatsApp message and URL builders
public/images/       Real product photographs
tests/               Vitest suite
```
