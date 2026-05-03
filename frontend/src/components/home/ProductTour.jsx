import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard.jsx";

const steps = [
  { label: "Discover sellers", caption: "Browse marketplace pins & storefront posts." },
  { label: "Authenticate", caption: "Customers sign in; vendors publish hubs." },
  { label: "Build basket", caption: "Atomic carts scoped to one fulfillment partner." },
  { label: "Secure checkout", caption: "Mock treasury captures funds instantly." },
  { label: "Live telemetry", caption: "Couriers ingest alerts + GPS breadcrumbs." }
];

export function ProductTour() {
  return (
    <GlassCard className="relative overflow-hidden p-0">
      <div className="border-b border-white/15 bg-white/40 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/40">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600 dark:text-brand-400">Guided tour</p>
        <h3 className="mt-2 font-display text-2xl font-bold">See the workflow animating itself</h3>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Inspired by enterprise launch films — the synthetic cursor glides through exactly how buyers, vendors, and couriers interoperate on Nimbus.
        </p>
      </div>

      <div className="relative h-[420px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 md:h-[460px]">
        <div className="absolute inset-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-inner backdrop-blur-2xl">
          {/* Fake chrome */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-rose-400/90" />
            <span className="h-3 w-3 rounded-full bg-amber-400/90" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
            <div className="ml-4 flex flex-1 items-center gap-3 rounded-full border border-white/15 bg-black/30 px-4 py-1 text-xs text-white/70">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white">Marketplace</span>
              <span className="rounded-full px-3 py-1 text-[11px] text-white/40">Search parcels</span>
              <span className="rounded-full px-3 py-1 text-[11px] text-white/40">Cart</span>
              <span className="ml-auto rounded-full bg-white/90 px-4 py-1 text-[11px] font-semibold text-slate-900">Sign in</span>
            </div>
          </div>

          <div className="relative h-[calc(100%-52px)]">
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]"
              animate={{ opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            {/* Spotlight trail */}
            {[12, 38, 62, 82].map((top, idx) => (
              <motion.div
                key={top}
                className="absolute left-[10%] right-[10%] rounded-2xl border border-white/10 bg-white/5"
                style={{ top: `${top}%`, height: "52px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.15, 0.45, 0.15] }}
                transition={{ duration: 5, repeat: Infinity, delay: idx * 0.4 }}
              />
            ))}

            {/* Cursor */}
            <motion.div
              className="pointer-events-none absolute flex flex-col items-center"
              animate={{
                top: ["14%", "22%", "42%", "62%", "78%", "14%"],
                left: ["18%", "48%", "30%", "62%", "38%", "18%"]
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-center gap-2 rounded-full border border-white/40 bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_12px_45px_rgba(56,189,248,0.35)]">
                Guided cursor
              </div>
              <div className="mt-1 h-8 w-8 rounded-full border-2 border-white/70 bg-gradient-to-br from-brand-400 to-accent-400 shadow-[0_0_35px_rgba(56,189,248,0.65)]" />
            </motion.div>

            <div className="absolute bottom-5 left-6 right-6 grid gap-3 md:grid-cols-5">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border border-white/15 bg-black/40 px-3 py-3 text-xs text-white/80 backdrop-blur"
                >
                  <p className="font-semibold text-white">{step.label}</p>
                  <p className="mt-1 text-[11px] text-white/60">{step.caption}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
