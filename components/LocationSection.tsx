import { ExternalLink, MapPin } from "lucide-react";

// Owner-supplied embed. Keep in one place so it is easy to replace.
export const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d484.85700649964235!2d78.50949!3d13.5444206!3m2!1i1024!2i768!4f13.1!3m3!1m1!2s!5e0!3m2!1sen!2sin!4v1792178004963!5m2!1sen!2sin";

export const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=13.5444206,78.50949";

export default function LocationSection() {
  return (
    <section id="location" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
          Find us
        </p>
        <h2 className="font-display mt-2 text-center text-3xl font-bold text-forest sm:text-4xl">
          Zohra-Zaika on the map
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-cocoa/70">
          Use the map for directions. Delivery availability and charges are
          confirmed on WhatsApp before your order is finalised.
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-gold/40 shadow-sm">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              src={MAP_EMBED_SRC}
              title="Map showing the Zohra-Zaika location"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl bg-cream px-5 py-4 text-sm sm:flex-row">
          <p className="flex items-start gap-2 text-cocoa/70">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-terracotta"
              aria-hidden="true"
            />
            <span>
              Open the map for directions. You can also order from anywhere on
              WhatsApp; delivery charge is confirmed by the business.
            </span>
          </p>
          <a
            href={MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 font-bold text-cream transition hover:bg-forest-deep"
          >
            Open in Google Maps
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
