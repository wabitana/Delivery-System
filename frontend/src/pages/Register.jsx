import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { authRegister } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer"
  });
  const [busy, setBusy] = useState(false);

  function update(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await authRegister({
        ...form,
        phone: form.phone || undefined
      });
      setAuth(data.token, data.user);
      toast.success("Account ready");
      navigate("/dashboard");
    } catch {
      /* interceptor */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <GlassCard className="p-8">
        <h1 className="font-display text-2xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Customers shop, vendors onboard kitchens, couriers claim deliveries.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Full name</label>
            <input
              required
              value={form.full_name}
              onChange={e => update("full_name", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => update("email", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={e => update("password", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</label>
            <select
              value={form.role}
              onChange={e => update("role", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="delivery">Courier</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          >
            {busy ? "Creating..." : "Join"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already onboard?{" "}
          <Link className="font-semibold text-brand-600 dark:text-brand-400" to="/login">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
