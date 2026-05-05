import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";
import { ProductTour } from "../components/home/ProductTour.jsx";

const metrics = [
  { label: "Platform Roles", value: "4", hint: "Customer · Storefront · Courier · Admin" },
  { label: "Active Connections", value: "18+", hint: "Live delivery & payment APIs" },
  { label: "Real-time Alerts", value: "3+", hint: "Order status + dispatch events" }
];

const capabilities = [
  "Modern delivery dashboard with persistent dark mode.",
  "Interactive maps with pinned local storefronts.",
  "Secure checkout carts for multiple delivery partners.",
  "Verified account access and instant push notifications.",
  "Live route previews for customers and drivers.",
  "Engaging user onboarding for new platform members.",
  "Detailed delivery data exported via REST and SQL.",
  "Integrated payment processing for secure checkouts.",
  "Driver dispatch boards with optimized route filtering.",
  "Secure profile management with credential protection.",
  "Customer reviews tied to verified delivery history.",
  "Versatile inventory system for any product category.",
  "Storefront manager with data validation guards.",
  "Live delivery simulation for platform demonstrations.",
  "Milestone-based tracking from warehouse to doorstep.",
  "Mobile-responsive navigation for on-the-go users.",
  "24/7 AI-powered support and FAQ assistant.",
  "Brand story focused on community delivery logistics.",
  "Verified partner network and compliance tracking.",
  "Standardized data formats for all system alerts."
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
            Online General Delivery Platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            Manage <span className="gradient-text">every delivery step</span> through one seamless interface.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300"
          >
            Our General Delivery Cloud combines high-end user experience with a robust backend — perfect for local retailers, courier networks, and delivery fleets looking for professional scale.
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
              Browse Marketplace
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-white/35 bg-white/55 px-8 py-3 text-sm font-semibold text-slate-900 backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:text-white"
            >
              Our Mission
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <GlassCard className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.25),_transparent_55%)]" />
            <div className="relative space-y-6">
              <p className="text-sm font-semibold text-accent-500 dark:text-accent-300">Live System Status</p>
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
                Live monitoring data — integrated with professional telemetry for production-ready delivery tracking.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Platform Features"
          title="Full-stack delivery modules ready to ship"
          subtitle="From driver alerts to vendor dashboards and real-time package tracking, every module is designed for reliability."
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
          eyebrow="Guided Experience"
          title="Platform Tour — See how local delivery works"
          subtitle="Follow a sample order from the moment a customer clicks 'buy' to the final delivery confirmation at the door."
        />
        <ProductTour />
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <GlassCard className="p-8 lg:col-span-2">
          <SectionHeading
            eyebrow="Platform Integrity"
            title="Why businesses trust our delivery network"
            subtitle="Customized workspaces for every user: vendors manage stock, couriers pick up routes, and admins oversee the whole city."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Transaction Security</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Every order is processed through secure database transactions, preventing lost orders during high-traffic peaks.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-accent-600 dark:text-accent-300">Smart Logistics</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Automated route mapping allows customers to see exactly where their delivery is in the city in real-time.
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="space-y-4 p-8">
          <p className="font-display text-xl font-semibold">Technical Setup</p>
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li>1. Initialize database schema & notification migration.</li>
            <li>2. Load demo storefronts and delivery personas.</li>
            <li>3. Launch the API server and platform frontend.</li>
            <li>4. Test driver alerts to confirm live notifications.</li>
          </ol>
          <Link className="inline-flex text-sm font-semibold text-brand-600 dark:text-brand-400" to="/settings">
            Configure Admin Settings →
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}