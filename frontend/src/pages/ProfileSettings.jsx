import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { patchProfile, fetchMe } from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export default function ProfileSettings() {
  const { token, user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    avatar_url: "",
    current_password: "",
    new_password: ""
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm(f => ({
      ...f,
      full_name: user.full_name || "",
      phone: user.phone || "",
      avatar_url: user.avatar_url || ""
    }));
  }, [user]);

  useEffect(() => {
    if (!token) return;
    fetchMe()
      .then(u => updateUser(u))
      .catch(() => {});
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        full_name: form.full_name,
        phone: form.phone || null,
        avatar_url: form.avatar_url || null
      };
      if (form.new_password) {
        payload.current_password = form.current_password;
        payload.new_password = form.new_password;
      }
      const u = await patchProfile(payload);
      updateUser(u);
      toast.success("Profile synchronized");
      setForm(f => ({ ...f, current_password: "", new_password: "" }));
    } catch {
      /* interceptor */
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-300">Sign in to edit account preferences.</p>
      </GlassCard>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Account intelligence</h1>
        <p className="text-slate-600 dark:text-slate-300">Tune identity signals, portrait assets, and rotating credentials.</p>
      </div>
      <GlassCard className="p-8">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Legal name" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} />
            <Field label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Avatar URL</label>
            <input
              value={form.avatar_url}
              onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))}
              placeholder="https://"
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
            />
          </div>
          <div className="grid gap-4 border-t border-white/15 pt-4 dark:border-white/10 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current password</label>
              <input
                type="password"
                value={form.current_password}
                onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">New password</label>
              <input
                type="password"
                value={form.new_password}
                onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          >
            {busy ? "Saving..." : "Commit changes"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
      />
    </div>
  );
}
