import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
          404
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold text-forest">
          We couldn’t find that page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa/65">
          The product or page may have moved. Browse the shop to see the current
          Zohra-Zaika range.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/shop"
            className="rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream transition hover:bg-forest-deep"
          >
            Go to shop
          </Link>
          <Link
            href="/"
            className="rounded-full border border-forest/25 px-6 py-3 text-sm font-bold text-forest transition hover:bg-white"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
