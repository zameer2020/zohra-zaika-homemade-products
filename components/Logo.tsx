import Image from "next/image";
import Link from "next/link";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Zohra-Zaika — home"
    >
      <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-gold">
        <Image
          src="/logo.png"
          alt="Zohra-Zaika Homemade Products logo"
          fill
          sizes="40px"
          className="object-cover"
          priority
        />
      </span>
      <span className="leading-tight">
        <span
          className={`font-display block font-bold text-forest ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          Zohra-Zaika
        </span>
        {!compact && (
          <span className="block text-[10px] font-medium tracking-[0.18em] text-terracotta uppercase">
            Homemade Products
          </span>
        )}
      </span>
    </Link>
  );
}
