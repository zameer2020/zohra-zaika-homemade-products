import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { WHATSAPP_BASE_URL, WHATSAPP_DISPLAY } from "@/lib/business";
import { MAP_DIRECTIONS_URL } from "./LocationSection";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0f2a1e] text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="[&_span]:!text-cream [&_.font-display]:!text-cream">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/65">
            Ghar Ka Swad, Shahi Andaaz! Home-made pickles, Ananas Meetha, amla
            oil, masalas and chilli powder.
          </p>
          <a
            href={WHATSAPP_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cream hover:text-gold-soft"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {WHATSAPP_DISPLAY}
          </a>
        </div>

        <nav aria-label="Shop categories">
          <h2 className="text-sm font-bold tracking-wider text-gold uppercase">
            Shop
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-gold-soft">
                All products
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-gold-soft"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold tracking-wider text-gold uppercase">
            Popular products
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PRODUCTS.slice(0, 5).map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:text-gold-soft"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wider text-gold uppercase">
            Order & help
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-gold-soft">
                About Zohra-Zaika
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-soft">
                Contact & directions
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-gold-soft">
                Checkout
              </Link>
            </li>
            <li>
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-gold-soft"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Open in Google Maps
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-cream/50">
            Checkout prepares a WhatsApp message. Orders, delivery charges and
            negotiable bulk prices are confirmed by Zohra-Zaika before payment.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs leading-relaxed text-cream/55 sm:px-6">
          <p>
            © Zohra-Zaika Homemade Products. All rights reserved.
          </p>
          <p className="mt-1">
            Prices in Indian Rupees. Product images and pack sizes are shown as
            configured. Delivery charge: confirmed on WhatsApp.
          </p>
        </div>
      </div>
    </footer>
  );
}
