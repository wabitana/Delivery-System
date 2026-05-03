import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";

export function Home() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex rounded-full border border-white/30 bg-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600 backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:text-brand-400"
          >
            Glass UI · Live tracking · Mock payments
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl"
          >
            City-wide delivery with{" "}
            <span className="gradient-text">cinema-grade</span> polish.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300"
          >
            Browse curated kitchens, build your cart, checkout with a realistic payment stub, and watch your order glide through
            every milestone — all wired to a proper Express + MySQL core.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/products"
              className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:opacity-95"
            >
              Explore menu
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-white/40 bg-white/50 px-6 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-white/70 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900/70"
            >
              Create account
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <GlassCard className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-500/20" />
            <div className="absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-accent-400/25 blur-3xl dark:bg-accent-500/15" />
            <div className="relative space-y-4">
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Live stack preview</p>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  JWT sessions with role-aware dashboards (customer, vendor, courier).
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent-500" />
                  Single-restaurant carts with transactional checkout + immutable order lines.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Courier board for batch claiming when orders hit “ready for pickup”.
                </li>
              </ul>
              <div className="rounded-2xl border border-white/20 bg-white/40 p-4 text-xs text-slate-500 backdrop-blur dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-400">
                Tip: run the SQL seed to unlock demo logins for every persona — check the README.
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Motion-native UX",
            body: "Page transitions, hover micro-interactions, and the floating assistant keep the experience lively without clutter."
          },
          {
            title: "Operational clarity",
            body: "Vendors advance orders through a deliberate lifecycle while couriers emit tracking breadcrumbs customers can read."
          },
          {
            title: "Developer ergonomics",
            body: "Predictable REST endpoints, Joi validation, and MySQL constraints mean you can evolve this into production traffic."
          }
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className="h-full p-5">
              <h3 className="font-display text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{card.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
