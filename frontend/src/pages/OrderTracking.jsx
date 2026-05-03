import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { completePayment, fetchOrder, simulateOrderStep } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

const STEPS = [
  "pending",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
  "delivered"
];

export function OrderTracking() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  async function load() {
    const data = await fetchOrder(id);
    setPayload(data);
  }

  useEffect(() => {
    let cancelled = false;
    load()
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    const iv = setInterval(() => {
      load().catch(() => {});
    }, 4000);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [id]);

  if (loading || !payload) {
    return <GlassCard className="p-10 animate-pulse text-transparent">Loading</GlassCard>;
  }

  const { order, items, payment, tracking } = payload;
  const activeIndex = STEPS.includes(order.status) ? STEPS.indexOf(order.status) : -1;

  async function pay() {
    setPaying(true);
    try {
      const res = await completePayment(order.id, {});
      setPayload(p => ({ ...p, order: res.order, payment: res.payment }));
      toast.success("Payment completed");
    } catch {
      /* toast */
    } finally {
      setPaying(false);
    }
  }

  async function simulate() {
    try {
      const res = await simulateOrderStep(order.id);
      setPayload(p => ({ ...p, order: res.order, tracking: res.tracking || p.tracking }));
      toast.success("Status advanced (demo)");
    } catch {
      /* toast */
    }
  }

  const isCustomer = user?.id === order.user_id;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Order #{order.id}</p>
          <h1 className="font-display text-3xl font-bold">{order.business_name}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{order.delivery_address}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {payment?.status === "pending" && isCustomer && (
            <button
              type="button"
              disabled={paying}
              onClick={pay}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-md disabled:opacity-40"
            >
              {paying ? "Processing..." : "Pay now (mock)"}
            </button>
          )}
          {isCustomer && payment?.status === "completed" && order.status !== "delivered" && order.status !== "cancelled" && (
            <button
              type="button"
              onClick={simulate}
              className="rounded-full border border-white/30 bg-white/50 px-5 py-2 text-sm font-semibold backdrop-blur dark:border-white/10 dark:bg-slate-900/40"
            >
              Simulate next step
            </button>
          )}
          <Link
            to="/dashboard"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold hover:bg-white/40 dark:border-white/10 dark:hover:bg-slate-900/60"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <GlassCard className="p-6">
        <h2 className="font-display text-lg font-semibold">Lifecycle</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-6">
          {STEPS.map((step, idx) => {
            const done = activeIndex > idx || order.status === "delivered";
            const current = order.status === step;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`min-w-[120px] shrink-0 rounded-2xl border px-3 py-3 text-center text-xs font-semibold capitalize md:min-w-0 ${
                  current
                    ? "border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300"
                    : done
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-800 dark:text-emerald-100"
                      : "border-white/20 bg-white/30 text-slate-500 dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-400"
                }`}
              >
                {step.replace(/_/g, " ")}
              </motion.div>
            );
          })}
        </div>
        {order.status === "cancelled" && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">This order was cancelled.</p>
        )}
      </GlassCard>

      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-semibold">Items</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map(li => (
              <li key={li.id} className="flex justify-between gap-3 border-b border-white/10 pb-2 dark:border-white/5">
                <span>
                  {li.product_name} × {li.quantity}
                </span>
                <span>${(Number(li.unit_price) * li.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>${Number(order.delivery_fee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-display text-lg font-semibold">Tracking timeline</h2>
          <div className="mt-4 space-y-4">
            {(tracking || []).map(row => (
              <div key={row.id} className="relative border-l border-white/25 pl-4 dark:border-white/10">
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-brand-500" />
                <p className="text-sm font-medium">{row.status_note}</p>
                <p className="text-xs text-slate-500">{new Date(row.created_at).toLocaleString()}</p>
              </div>
            ))}
            {(!tracking || tracking.length === 0) && (
              <p className="text-sm text-slate-500">Tracking updates will appear here.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
