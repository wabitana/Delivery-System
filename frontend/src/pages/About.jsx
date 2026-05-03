import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";

const pillars = [
  {
    title: "Unified commerce graph",
    body: "Stores, parcels, perishables, and routed services share one ledger — no duplicate onboarding flows."
  },
  {
    title: "Courier-grade observability",
    body: "Pickup milestones fan out as structured notifications so riders never miss funded shipments."
  },
  {
    title: "Trusted sandbox economics",
    body: "Wallet mocks emulate treasury rails without touching PCI scope — ideal for investor demos."
  }
];

export default function About() {
  return (
    <div className="space-y-20 pb-10">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Company narrative"
            title="Nimbus is built for general commerce logistics — not just meals."
            subtitle="From boutique retailers to cold-chain bundles, our mesh orchestrates seller posts, buyer carts, and courier alerts across one polished surface."
          />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/marketplace"
              className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              Explore marketplace
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-white/30 bg-white/50 px-6 py-3 text-sm font-semibold backdrop-blur dark:border-white/10 dark:bg-slate-900/40"
            >
              Partner with us
            </Link>
          </motion.div>
        </div>
        <GlassCard className="p-8">
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Executive snapshot</p>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Why now?</span> Buyers expect DoorDash-level UX even for non-food categories — we ship that baseline out of the box.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Who wins?</span> Operators gain telemetry; partners publish geo posts; couriers receive contextual alerts without noisy SMS bills.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">What ships today?</span> Auth, carts, vendor storefront posts with maps, dashboards, notification hub, and courier boards — all backed by MySQL constraints.
            </li>
          </ul>
        </GlassCard>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <GlassCard className="h-full p-6">
              <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      <GlassCard className="p-8">
        <SectionHeading
          align="center"
          eyebrow="Roadmap transparency"
          title="What “company-level” means on this codebase"
          subtitle="Every promise below maps to a module you can audit — controllers stay thin, models encapsulate SQL, notifications ride dedicated tables."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            "SOC-ready foundations with JWT rotation hooks.",
            "Structured courier inbox fed by SQL triggers from lifecycle transitions.",
            "Glass UI kit tuned for marketing sites & ops consoles simultaneously.",
            "Vendor geo storytelling via Leaflet + storefront posts."
          ].map(line => (
            <div key={line} className="rounded-2xl border border-white/15 bg-white/35 px-4 py-4 text-sm font-medium dark:border-white/10 dark:bg-slate-950/40">
              {line}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
