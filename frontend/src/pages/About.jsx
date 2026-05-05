import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";

const pillars = [
  {
    title: "Unified delivery network",
    body: "Local shops, parcel services, and specialized couriers share one digital ecosystem — eliminating fragmented onboarding."
  },
  {
    title: "Real-time visibility",
    body: "Every pickup and drop-off milestone is tracked with automated alerts so dispatchers and drivers stay perfectly synced."
  },
  {
    title: "Secure demo infrastructure",
    body: "Integrated payment simulations allow for realistic transaction testing without requiring complex PCI compliance."
  }
];

export default function About() {
  return (
    <div className="space-y-20 pb-10">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Platform Mission"
            title="A universal delivery cloud built for every type of commerce."
            subtitle="From local retail to city-wide courier services, our platform orchestrates vendor listings, customer orders, and driver alerts in one unified workspace."
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
              Become a partner
            </Link>
          </motion.div>
        </div>
        <GlassCard className="p-8">
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Platform Snapshot</p>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Why choose us?</span> Customers expect premium tracking for every purchase — we provide that professional infrastructure out of the box.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">Who benefits?</span> Businesses gain live data; vendors can map their reach; and couriers receive clear, real-time job instructions.
            </li>
            <li>
              <span className="font-semibold text-slate-900 dark:text-white">What’s included?</span> Secure login, shopping carts, map-based storefronts, live tracking, and driver boards — all powered by a reliable database.
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
          eyebrow="Development Standards"
          title="Professional architecture for modern delivery"
          subtitle="Our codebase is built for scale — featuring secure user sessions, automated database triggers for order updates, and a modular design."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            "Secure authentication with modern session protection.",
            "Live driver inboxes powered by real-time order status updates.",
            "Premium user interface designed for both web and mobile access.",
            "Interactive location services for vendors and customers via mapping tools."
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