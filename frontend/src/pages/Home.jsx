import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";
import { ProductTour } from "../components/home/ProductTour.jsx";

const metrics = [
  { label: "Fulfillment personas", value: "4", hint: "Customer · Vendor · Courier · Admin" },
  { label: "Stateful integrations", value: "18+", hint: "REST surfaces wired end-to-end" },
  { label: "Courier alerts / order", value: "3+", hint: "Lifecycle + treasury events" }
];

const capabilities = [
  "Glass morphism UI kit with persistent dark scheme.",
  "Vendor storefront posts ge pinned to interactive maps.",
  "Transactional carts enforced per fulfillment partner.",
  "JWT hardened dashboards + granular notifications.",
  "Leaflet-powered previews for buyers & couriers.",
  "Animated onboarding theater inspired by BigTech launches.",
  "Operational telemetry exported via REST + SQL views.",
  "Mock treasury capturing checkout flows without PCI.",
  "Courier boards fed by SQL-filtered open routes.",
  "Profile intelligence center with rotating credentials.",
  "Reviews & ratings anchored per delivered shipment.",
  "Category taxonomy ready for non-food inventory.",
  "Admin-ready category composer with Joi guards.",
  "Delivery simulation timeline for investor demos.",
  "Structured tracking breadcrumbs per milestone.",
  "Multi-role navbar & responsive mobile sheet.",
  "Floating contextual assistant with FAQ brain.",
  "About narrative tuned for enterprise storytelling.",
  "Partners grid + compliance placeholders.",
  "Future-ready JSON payloads on notifications."
];

export function Home() {
  return (
    <div className="space-y-24 pb-10">
      <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex rounded-full border border-white/30 bg-white/45 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-brand-600 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-brand-300"
          >
            General delivery cloud
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            Orchestrate <span className="gradient-text">every shipment narrative</span> in one luminous workspace.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300"
          >
            Nimbus Logistics Cloud pairs cinematic UX with hardened Express + MySQL services — ideal for retailers, dark stores, parcel networks, and hybrid fleets that refuse generic templates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/marketplace"
              className="rounded-full bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-brand-500/30"
            >
              Launch marketplace
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-white/35 bg-white/55 px-8 py-3 text-sm font-semibold text-slate-900 backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
            >
              Read the manifesto
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <GlassCard className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_55%)]" />
            <div className="relative space-y-6">
              <p className="text-sm font-semibold text-accent-500 dark:text-accent-300">Signals streaming live</p>
              <div className="grid gap-4">
                {metrics.map(m => (
                  <div key={m.label} className="rounded-2xl border border-white/25 bg-white/40 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/40">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{m.label}</p>
                    <p className="font-display text-4xl font-bold">{m.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.hint}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Metrics illustrative — swap with Prometheus exporters when you graduate beyond demo sandboxes.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Capability lattice"
          title="Twenty engineered surfaces shipping simultaneously"
          subtitle="Every bullet maps to working modules — notifications, vendor geo posts, dashboards, Leaflet previews, animated onboarding, profile intelligence, and more."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={cap}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.02, 0.2) }}
              className="rounded-2xl border border-white/20 bg-white/45 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/35 dark:text-slate-200"
            >
              <span className="mr-2 font-display text-xs text-brand-500">{String(idx + 1).padStart(2, "0")}</span>
              {cap}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Experience cinema"
          title="Auto-guided tour — Microsoft & Google-grade storytelling"
          subtitle="Watch the synthetic cursor traverse search, authentication, basket composition, treasury capture, and courier telemetry without leaving the landing surface."
        />
        <ProductTour />
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <GlassCard className="p-8 lg:col-span-2">
          <SectionHeading
            eyebrow="Operational truth"
            title="Why teams graduate from spreadsheets to Nimbus"
            subtitle="Roles inherit contextual workspaces — vendors publish geo posts, couriers subscribe to SQL-fed alerts, finance audits immutable ledgers."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Fulfillment integrity</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Checkout spins up payments + tracking rows inside one SQL transaction — no orphaned carts when traffic spikes.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-accent-600 dark:text-accent-300">Geo storytelling</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Vendor posts pin corridor launches so buyers instantly visualize coverage — crucial for general merchandise SLAs.
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="space-y-4 p-8">
          <p className="font-display text-xl font-semibold">Launch checklist</p>
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>1. Run SQL schema + additive migration for notifications.</li>
            <li>2. Seed demo personas & storefront posts.</li>
            <li>3. Start API (`npm run dev`) + Vite frontend.</li>
            <li>4. Sign in as courier → confirm bell notifications fire.</li>
          </ol>
          <Link className="inline-flex text-sm font-semibold text-brand-600 dark:text-brand-400" to="/settings">
            Tune executive profile →
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
