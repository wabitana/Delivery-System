import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { claimDeliveryOrder, fetchOpenDeliveryOrders } from "../services/api.js";

export function DeliveryBoard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const rows = await fetchOpenDeliveryOrders();
    setOrders(rows);
  }

  useEffect(() => {
    load().catch(() => {}).finally(() => setLoading(false));
    const iv = setInterval(() => load().catch(() => {}), 5000);
    return () => clearInterval(iv);
  }, []);

  async function claim(id) {
    try {
      await claimDeliveryOrder(id);
      toast.success("Route claimed");
      load().catch(() => {});
    } catch {
      /* toast */
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Courier board</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Orders sitting in <span className="font-semibold">ready for pickup</span> without a rider appear here.
        </p>
      </div>

      {loading ? (
        <GlassCard className="p-8 animate-pulse text-transparent">Loading</GlassCard>
      ) : orders.length === 0 ? (
        <GlassCard className="p-8 text-center text-slate-600 dark:text-slate-300">
          Nothing waiting — kitchens might still be prepping.
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map(o => (
            <GlassCard key={o.id} className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">#{o.id}</p>
                  <p className="font-display text-lg font-semibold">{o.business_name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{o.customer_name}</p>
                </div>
                <p className="text-sm font-semibold">${Number(o.total).toFixed(2)}</p>
              </div>
              <p className="text-xs text-slate-500">{o.delivery_address}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => claim(o.id)}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-xs font-semibold text-white"
                >
                  Claim route
                </button>
                <Link to={`/orders/${o.id}`} className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold">
                  Preview
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
