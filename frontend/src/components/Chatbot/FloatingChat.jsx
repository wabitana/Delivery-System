import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQ = [
  { keys: ["hours", "open", "when"], text: "Fulfillment partners publish SLAs on their storefront posts — demo hubs stay active around the clock." },
  { keys: ["fee", "delivery fee", "cost"], text: "Shipping economics are recomputed per checkout with configurable delivery fee + tax rates." },
  { keys: ["track", "where", "order"], text: "Open Dashboard → jump into any shipment for milestone telemetry + courier breadcrumbs." },
  { keys: ["pay", "payment", "card"], text: "Treasury flow is mocked via wallet completion — swap for PSP tokens when you graduate beyond demos." },
  { keys: ["vendor", "sell", "partner"], text: "Register as a vendor, anchor HQ lat/long, publish spotlight posts, then list SKUs from Vendor ops." },
  { keys: ["notify", "notification", "courier"], text: "Couriers receive bell alerts when shipments fund or reach pickup-ready states." },
  { keys: ["hello", "hi", "hey"], text: "Hey! Ask about marketplace posts, logistics personas, or billing mocks." }
];

function replyFor(message) {
  const m = message.toLowerCase();
  for (const row of FAQ) {
    if (row.keys.some(k => m.includes(k))) return row.text;
  }
  if (m.trim().length < 2) return "Ask me about tracking, fees, hours, or vendor signup.";
  return "I’m a lightweight onboard assistant. Try: “track my order”, “delivery fee”, or “become a vendor”.";
}

function TypingLine() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => {
      setDots(d => (d.length >= 3 ? "." : `${d}.`));
    }, 320);
    return () => clearInterval(id);
  }, []);
  return <span className="text-slate-500 dark:text-slate-400">Assistant is typing{dots}</span>;
}

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi — I’m Nimbus Assist. Ask about shipments, geo posts, notifications, or onboarding." }
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const answer = replyFor(text);
    window.setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "assistant", text: answer }]);
    }, 550 + Math.random() * 400);
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-xl shadow-brand-500/30"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-2xl leading-none">💬</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="glass-panel fixed bottom-24 right-6 z-50 flex h-[min(420px,70vh)] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 dark:border-white/10">
              <div>
                <p className="font-display text-sm font-semibold">Nimbus Assist</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">FAQ & onboarding tips</p>
              </div>
              <button
                type="button"
                className="rounded-full px-2 py-1 text-xs text-slate-500 hover:bg-white/40 dark:hover:bg-slate-800/80"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${i}-${msg.role}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                      : "mr-auto border border-white/20 bg-white/50 dark:border-white/10 dark:bg-slate-900/60"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {typing && (
                <div className="mr-auto rounded-2xl border border-white/20 bg-white/50 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900/60">
                  <TypingLine />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              className="flex gap-2 border-t border-white/15 p-3 dark:border-white/10"
              onSubmit={e => {
                e.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-xl border border-white/25 bg-white/50 px-3 py-2 text-sm outline-none ring-brand-500/30 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-slate-900/50"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
