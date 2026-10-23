"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { WHATSAPP_BASE_URL, WHATSAPP_DISPLAY } from "@/lib/business";

type ChatRole = "user" | "assistant";

interface ChatEntry {
  id: number;
  role: ChatRole;
  content: string;
}

const GREETING =
  "Assalamu alaikum! I can help with Zohra-Zaika products, pack sizes, prices and how to order on WhatsApp. What would you like to know?";

const QUICK_QUESTIONS = [
  "Show pickle prices",
  "Which pack sizes are available?",
  "How do I order?",
  "Tell me about Ananas Meetha bulk pricing",
];

let nextId = 1;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ChatEntry[]>([
    { id: 0, role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries, loading, error, open]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;
    if (text.length > 1000) {
      setError("Please keep your question under 1,000 characters.");
      return;
    }

    const userEntry: ChatEntry = {
      id: nextId++,
      role: "user",
      content: text,
    };
    const nextEntries = [...entries, userEntry];
    setEntries(nextEntries);
    setInput("");
    setError(null);
    setLoading(true);

    const history = nextEntries
      .filter((entry) => entry.role === "user" || entry.role === "assistant")
      .slice(-8)
      .map((entry) => ({ role: entry.role, content: entry.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      let data: { reply?: unknown; error?: unknown } = {};
      try {
        data = (await response.json()) as typeof data;
      } catch {
        data = {};
      }

      if (!response.ok || typeof data.reply !== "string") {
        setError(
          typeof data.error === "string"
            ? data.error
            : "I couldn’t answer that right now. Please try again or contact us on WhatsApp.",
        );
        return;
      }

      setEntries((previous) => [
        ...previous,
        {
          id: nextId++,
          role: "assistant",
          content: data.reply as string,
        },
      ]);
    } catch {
      setError(
        "I couldn’t reach the assistant. Please check your connection or contact us on WhatsApp.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Zohra-Zaika customer support chat"
          aria-expanded={false}
          className="fixed bottom-5 left-5 z-[60] inline-flex items-center gap-2.5 rounded-full bg-forest px-4 py-3 text-sm font-bold text-cream shadow-2xl ring-2 ring-gold/50 transition hover:-translate-y-0.5 hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/70"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-gold text-forest">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#1fa855] ring-2 ring-forest" />
          </span>
          Ask Zohra
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Zohra-Zaika customer support chat"
          className="fixed inset-x-3 bottom-3 z-[70] flex h-[min(78vh,580px)] flex-col overflow-hidden rounded-3xl border border-gold/40 bg-cream shadow-2xl sm:inset-x-auto sm:bottom-24 sm:left-5 sm:h-[560px] sm:w-[390px]"
        >
          <div className="flex items-start justify-between gap-3 bg-forest px-4 py-3.5 text-cream">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-forest">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-base leading-tight font-bold">
                  Zohra-Zaika Assistant
                </p>
                <p className="text-[11px] text-cream/65">
                  Products, prices & ordering
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
              className="grid h-8 w-8 place-items-center rounded-full text-cream/80 transition hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="cart-scroll flex-1 overflow-y-auto px-4 py-4"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="flex flex-col gap-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex ${
                    entry.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      entry.role === "user"
                        ? "rounded-br-sm bg-forest text-cream"
                        : "rounded-bl-sm border border-gold/30 bg-white text-cocoa"
                    }`}
                  >
                    {entry.content}
                  </div>
                </div>
              ))}

              {entries.length === 1 && !loading && (
                <div className="mt-1">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-cocoa/45 uppercase">
                    Quick questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void send(question)}
                        className="rounded-full border border-forest/20 bg-white px-3 py-1.5 text-left text-[12px] font-semibold text-forest transition hover:border-forest/50 hover:bg-cream-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-gold/30 bg-white px-4 py-3">
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin text-forest"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-cocoa/60">
                      Checking the catalog…
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div
                  className="rounded-2xl border border-terracotta/30 bg-terracotta/10 px-3.5 py-3 text-[13px] text-cocoa"
                  role="alert"
                >
                  <p>{error}</p>
                  <a
                    href={WHATSAPP_BASE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#157a3e] underline underline-offset-4"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Contact us on WhatsApp · {WHATSAPP_DISPLAY}
                  </a>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-gold/30 bg-white px-3 py-2.5"
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a question about Zohra-Zaika products
            </label>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                id="chat-input"
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                maxLength={1000}
                placeholder="Ask about products, packs or ordering…"
                className="max-h-24 min-h-10 flex-1 resize-none rounded-2xl border border-forest/20 bg-cream px-3.5 py-2.5 text-[13px] outline-none placeholder:text-cocoa/40 focus:border-forest focus:ring-2 focus:ring-gold/60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send question"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-cream transition hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] leading-snug text-cocoa/45">
              Answers use our catalog. Prices and orders are always confirmed on
              WhatsApp.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
