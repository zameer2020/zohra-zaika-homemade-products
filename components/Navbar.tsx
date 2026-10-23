"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { WHATSAPP_BASE_URL } from "@/lib/business";
import Logo from "./Logo";

const LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/category/shahi-achar", label: "Pickles" },
  { href: "/category/shahi-ananas-meetha", label: "Ananas Meetha" },
  { href: "/category/shahi-amla-oil", label: "Amla Oil" },
  { href: "/category/masalas-master", label: "Masalas" },
  { href: "/category/chilli-powder", label: "Chilli Powder" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count, openCart, lastAddedAt } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        <Logo />

        <ul className="hidden items-center gap-4 xl:flex">
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/shop" && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[13px] font-semibold transition hover:text-forest ${
                    active ? "text-forest underline decoration-gold decoration-2 underline-offset-8" : "text-cocoa/75"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[#1fa855] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream transition hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span
              key={lastAddedAt ?? 0}
              aria-live="polite"
              className="animate-fade-up grid min-h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-forest"
            >
              {count}
            </span>
          </button>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-forest/20 text-forest transition hover:bg-cream-dark xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-gold/30 bg-cream px-4 py-3 xl:hidden"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/shop" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-[15px] font-semibold transition hover:bg-cream-dark hover:text-forest ${
                      active ? "bg-cream-dark text-forest" : "text-cocoa"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <a
                href={WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#1fa855] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Order on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
