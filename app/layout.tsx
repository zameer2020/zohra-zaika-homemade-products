import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zohra-Zaika | Homemade Pickles, Ananas Meetha, Oils & Masalas",
    template: "%s | Zohra-Zaika",
  },
  description:
    "Shop Zohra-Zaika Shahi Achar, Shahi Ananas Meetha, Shahi Amla Oil, Masalas Master and Chilli Powder. Exact pack sizes and prices, shared cart and WhatsApp ordering.",
  keywords: [
    "Zohra-Zaika",
    "Zohra Zaika",
    "homemade pickles",
    "shahi achar",
    "amla achar",
    "murga achar",
    "nimbu achar",
    "aam achar",
    "ananas meetha",
    "amla oil",
    "masalas master",
    "chilli powder",
    "Indian pickles online",
  ],
  openGraph: {
    title: "Zohra-Zaika | Homemade Pickles & Indian Products",
    description:
      "Shahi pickles, Ananas Meetha, amla oil, masalas and chilli powder. Browse exact pack sizes and prices, then order on WhatsApp.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zohra-Zaika | Homemade Pickles & Indian Products",
    description:
      "Browse Zohra-Zaika products and order on WhatsApp. Delivery and bulk prices are confirmed by the business.",
  },
};

export const viewport: Viewport = {
  themeColor: "#173d2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-cream"
        >
          Skip to content
        </a>
        <CartProvider>
          <Navbar />
          <div id="main-content">{children}</div>
          <Footer />
          <CartDrawer />
          <ChatWidget />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
