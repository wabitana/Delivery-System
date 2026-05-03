import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { checkout, fetchCart } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export function Checkout() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("120 Market Street, Apt 4B");
  const [notes, setNotes] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(2.99);
  const [taxRate, setTaxRate] = useState(0.08);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchCart().then(setCart).catch(() => {});
  }, [token]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal ?? 0;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  async function onSubmit(e) {
    e.preventDefault();
    if (!items.length) {
      toast.error("Cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const res = await checkout({
        delivery_address: address,
        notes,
        delivery_fee: deliveryFee,
        tax_rate: taxRate
      });
      toast.success("Order created");
      navigate(`/orders/${res.order.id}`);
    } catch {
      /* toast */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <GlassCard className="p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold">Checkout</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Finalize delivery details. Payment is mocked — no card data leaves your browser.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Delivery address
            </label>
            <textarea
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Notes for courier
            </label>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Delivery fee (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={deliveryFee}
                onChange={e => setDeliveryFee(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Tax rate
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="0.5"
                value={taxRate}
                onChange={e => setTaxRate(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || !items.length}
            className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>
      </GlassCard>

      <GlassCard className="space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold">Receipt preview</h2>
        <div className="space-y-2 text-sm">
          {items.map(i => (
            <div key={i.cart_item_id} className="flex justify-between gap-3">
              <span className="text-slate-600 dark:text-slate-300">
                {i.name} × {i.quantity}
              </span>
              <span>${(Number(i.price) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          {items.length === 0 && <p className="text-slate-500">Cart is empty.</p>}
        </div>
        <div className="space-y-2 border-t border-white/15 pt-3 text-sm dark:border-white/10">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
