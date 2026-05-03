import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { authLogin } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore(s => s.setAuth);
  const [email, setEmail] = useState("customer@demo.com");
  const [password, setPassword] = useState("Customer12345!");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await authLogin({ email, password });
      setAuth(data.token, data.user);
      toast.success("Welcome back");
      const redirect = location.state?.from || "/dashboard";
      navigate(redirect, { replace: true });
    } catch {
      /* toast via interceptor */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <GlassCard className="p-8">
        <h1 className="font-display text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Use seeded demo accounts or your own registration.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          >
            {busy ? "Signing in..." : "Continue"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Need an account?{" "}
          <Link className="font-semibold text-brand-600 dark:text-brand-400" to="/register">
            Register
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
