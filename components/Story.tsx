import Image from "next/image";
import { HeartHandshake } from "lucide-react";

export default function Story() {
  return (
    <section id="story" className="scroll-mt-24 bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold/40 via-cream-dark to-terracotta/25 p-6 sm:p-8"
          role="img"
          aria-label="Zohra-Zaika homemade products brand"
        >
          <div className="jaali-pattern absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-forest/10">
            <div className="relative h-64 w-full sm:h-80">
              <Image
                src="/logo.png"
                alt="Zohra-Zaika Homemade Products brand logo"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-contain p-4"
              />
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-cream">
            {["Pickles", "Ananas", "Oil · Masala"].map((label) => (
              <span
                key={label}
                className="rounded-xl bg-forest px-2 py-2.5 ring-1 ring-gold/40"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            Our story
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold text-balance text-forest sm:text-4xl">
            The taste of tradition, made with care
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-cocoa/75">
            <p>
              Zohra-Zaika is a home-made food brand built around the flavours we
              grew up loving. The range began with Shahi pickles and now includes
              Shahi Ananas Meetha, Shahi Amla Oil, Masalas Master and Chilli
              Powder.
            </p>
            <p>
              Products are prepared in small batches after you order. Pack sizes
              and prices on this website are the current configured list. If
              something is unavailable, or a bulk price needs negotiation, the
              business confirms it with you directly on WhatsApp before the order
              is finalised.
            </p>
            <p className="rounded-2xl border border-gold/40 bg-cream px-4 py-3 text-sm font-medium text-forest">
              We do not publish reviews, awards or health claims that have not
              been verified. What you see here is the product list and ordering
              process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
