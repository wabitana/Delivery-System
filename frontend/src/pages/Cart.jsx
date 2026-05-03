import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { clearCart, fetchCart, patchCartItem, removeCartItem } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export function Cart() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!token) return;
    const d = await fetchCart();
    setData(d);
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }
    reload().finally(() => setLoading(false));
  }, [token]);

  const summary = useMemo(() => {
    if (!data) return { subtotal: 0, count: 0 };
    const items = data.items || [];
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return { subtotal: data.subtotal ?? 0, count };
  }, [data]);

  if (!token) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">Sign in to view your cart.</p>
        <button
          type="button"
          className="mt-4 text-brand-600 dark:text-brand-400"
          onClick={() => navigate("/login", { state: { from: "/cart" } })}
        >
          Go to login
        </button>
      </GlassCard>
    );
  }

  if (loading) {
    return <GlassCard className="p-8 animate-pulse text-transparent">Loading</GlassCard>;
  }

  const items = data?.items || [];

  async function updateQty(productId, quantity) {
    try {
      const d = await patchCartItem(productId, { quantity });
      setData(d);
    } catch {
      /* toast */
    }
  }

  async function remove(productId) {
    try {
      const d = await removeCartItem(productId);
      setData(d);
      toast.success("Removed");
    } catch {
      /* toast */
    }
  }

  async function empty() {
    try {
      const d = await clearCart();
      setData(d);
      toast.success("Cart cleared");
    } catch {
      /* toast */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
      <GlassCard className="divide-y divide-white/15 dark:divide-white/10">
        <div className="flex items-center justify-between p-5">
          <div>
            <h1 className="font-display text-2xl font-bold">Your cart</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{summary.count} items · one restaurant per checkout</p>
          </div>
          {items.length > 0 && (
            <button type="button" onClick={empty} className="text-sm font-medium text-red-600 dark:text-red-400">
              Clear
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="p-10 text-center text-slate-600 dark:text-slate-300">
            Nothing here yet.{" "}
            <Link to="/products" className="font-semibold text-brand-600 dark:text-brand-400">
              Browse the menu
            </Link>
          </div>
        ) : (
          items.map(row => (
            <div key={row.cart_item_id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <div className="h-20 w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 md:h-16 md:w-24">
                {row.image_url ? (
                  <img src={row.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">🍽️</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{row.name}</p>
                <p className="text-xs text-slate-500">{row.business_name}</p>
                <p className="mt-1 text-sm">${Number(row.price).toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-white/30 bg-white/50 p-1 dark:border-white/10 dark:bg-slate-950/40">
                  <button
                    type="button"
                    className="rounded-full px-2"
                    onClick={() => updateQty(row.product_id, Math.max(1, row.quantity - 1))}
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm">{row.quantity}</span>
                  <button type="button" className="rounded-full px-2" onClick={() => updateQty(row.product_id, row.quantity + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="text-sm text-red-600 dark:text-red-400" onClick={() => remove(row.product_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </GlassCard>

      <GlassCard className="space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Subtotal</span>
          <span>${Number(summary.subtotal).toFixed(2)}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Taxes and delivery fee are calculated during checkout using live cart totals.
        </p>
        <Link
          to="/checkout"
          className={`block rounded-full bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-center text-sm font-semibold text-white shadow-lg ${
            items.length === 0 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Proceed to checkout
        </Link>
      </GlassCard>
    </div>
  );
}
