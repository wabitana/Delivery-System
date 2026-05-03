import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { addCartItem, fetchProduct } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchProduct(id)
      .then(p => !cancelled && setProduct(p))
      .catch(() => !cancelled && setProduct(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleAdd() {
    if (!token) {
      toast.error("Sign in to add items to your cart.");
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    try {
      await addCartItem({ product_id: Number(id), quantity: qty });
      toast.success("Added to cart");
    } catch {
      /* toasted globally */
    }
  }

  if (loading) {
    return (
      <GlassCard className="p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!product) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-brand-600 dark:text-brand-400">
          Back to menu
        </Link>
      </GlassCard>
    );
  }

  const available = !!product.is_available && product.vendor_status === "active";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <GlassCard className="overflow-hidden p-0">
          <div className="aspect-square bg-slate-200 dark:bg-slate-800">
            {product.image_url ? (
              <img src={product.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-7xl">🍽️</div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      <GlassCard className="space-y-5 p-6 md:p-8">
        <div>
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{product.vendor_name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{product.name}</h1>
          {product.category_name && (
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{product.category_name}</p>
          )}
        </div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">${Number(product.price).toFixed(2)}</p>
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>

        {!available && (
          <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
            Currently unavailable from this kitchen.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-white/30 bg-white/50 p-1 dark:border-white/10 dark:bg-slate-950/40">
            <button
              type="button"
              className="rounded-full px-3 py-1 text-lg"
              onClick={() => setQty(q => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold">{qty}</span>
            <button type="button" className="rounded-full px-3 py-1 text-lg" onClick={() => setQty(q => q + 1)}>
              +
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={!available}
            onClick={handleAdd}
            className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to cart
          </motion.button>
          <Link to="/products" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline dark:text-slate-300">
            Continue browsing
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
