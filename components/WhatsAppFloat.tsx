"use client";

import { WHATSAPP_BASE_URL } from "@/lib/whatsapp";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 2 6.5L4 29l7.7-2c1.8 1 3.9 1.5 4.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.4 0-2.8-.4-4-1.1l-.3-.2-4.6 1.2 1.2-4.5-.2-.3c-.8-1.3-1.2-2.7-1.2-4.2 0-5 4-9 9-9s9 4 9 9-4 8.1-8.9 8.1zm5-6.1c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L13.4 12c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.4c.1.2 2.2 3.4 5.4 4.8 2.7 1.1 3.3.9 3.9.8.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_BASE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed right-5 bottom-5 z-[60] grid h-[56px] w-[56px] place-items-center rounded-full bg-[#1fa855] text-white shadow-2xl ring-4 ring-[#1fa855]/25 transition-transform hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1fa855] opacity-60" />
        <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          1
        </span>
      </span>
    </a>
  );
}
