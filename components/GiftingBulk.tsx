import Link from "next/link";
import { Gift, MessageCircle, PackageCheck } from "lucide-react";
import { buildBulkQuoteUrl } from "@/lib/whatsapp";
import { formatINR } from "@/lib/format";

export default function GiftingBulk() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e4d36] via-[#173d2b] to-[#0e2419] p-7 text-cream shadow-xl sm:p-9">
            <div className="jaali-pattern absolute inset-0 opacity-25" aria-hidden="true" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-gold uppercase">
                <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Bulk & festive orders
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold">
                Shahi Ananas Meetha, by the kilo
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/75">
                From a combined 2 kg, the provisional rate is{" "}
                <strong className="text-gold-soft">
                  {formatINR(65000)} per kg
                </strong>
                . For 2 kg that is an estimated{" "}
                <strong className="text-gold-soft">{formatINR(130000)}</strong>.
                The bulk price is negotiable and must be confirmed by
                Zohra-Zaika before the order is finalised.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href={buildBulkQuoteUrl("Shahi Ananas Meetha", 2000)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-forest transition hover:brightness-105"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Request a bulk quote
                </a>
                <Link
                  href="/products/shahi-ananas-meetha"
                  className="inline-flex items-center justify-center rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-white/10"
                >
                  View Ananas Meetha
                </Link>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-gold/40 bg-cream p-7 shadow-sm sm:p-9">
            <p className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-terracotta uppercase">
              <Gift className="h-3.5 w-3.5" aria-hidden="true" />
              Gifting & family packs
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold text-forest">
              Build a gift box your way
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-cocoa/70">
              Mix pickles, Ananas Meetha, amla oil, masalas and chilli powder in
              one cart. Tell us the occasion in the order notes and we will
              confirm gift packing, availability and delivery on WhatsApp.
            </p>
            <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-xs leading-relaxed text-cocoa/65 ring-1 ring-gold/30">
              No combo price is promised online. Gifting and bulk pricing are
              confirmed by the business before you pay anything.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition hover:bg-forest-deep"
            >
              Start a gift cart
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
