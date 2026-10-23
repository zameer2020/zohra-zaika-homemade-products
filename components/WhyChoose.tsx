import { ChefHat, Layers, MessageCircle, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Clear pack sizes",
    text: "Every product shows its configured packs and exact price before you add it to the cart.",
  },
  {
    icon: ChefHat,
    title: "Small-batch preparation",
    text: "Pickles and preparations are made in small batches after your order, not held as old stock.",
  },
  {
    icon: MessageCircle,
    title: "One shared cart",
    text: "Mix pickles, Ananas Meetha, amla oil, masalas and chilli powder in a single WhatsApp order.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent totals",
    text: "Delivery and negotiable bulk pricing are clearly marked pending until Zohra-Zaika confirms them.",
  },
];

export default function WhyChoose() {
  return (
    <section id="why-us" className="scroll-mt-24 bg-cream-dark/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-terracotta uppercase">
          Why Zohra-Zaika
        </p>
        <h2 className="font-display mt-2 text-center text-3xl font-bold text-forest sm:text-4xl">
          A straightforward way to order
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-gold/40 bg-white p-6 shadow-sm"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-gold">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-forest">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cocoa/70">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
