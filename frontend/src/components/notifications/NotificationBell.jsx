import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead
} from "../../services/api.js";
import { useAuthStore } from "../../store/authStore.js";

export function NotificationBell() {
  const { token } = useAuthStore();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  async function refresh() {
    if (!token) return;
    try {
      const c = await fetchUnreadNotificationCount();
      setCount(c);
    } catch {
      /* silent */
    }
  }

  async function loadList() {
    if (!token) return;
    try {
      const rows = await fetchNotifications({});
      setItems(rows);
    } catch {
      /* silent */
    }
  }

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 12000);
    return () => clearInterval(iv);
  }, [token]);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) loadList();
  }, [open, token]);

  if (!token) return null;

  async function readOne(id) {
    try {
      await markNotificationRead(id);
      setItems(prev => prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
      refresh();
    } catch {
      toast.error("Could not update notification");
    }
  }

  async function readAll() {
    try {
      await markAllNotificationsRead();
      setItems(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setCount(0);
      toast.success("Inbox cleared");
    } catch {
      toast.error("Could not clear inbox");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen(o => !o)}
        className="relative rounded-full border border-white/30 bg-white/50 p-2 text-slate-800 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
      >
        <span className="text-lg leading-none">🔔</span>
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-1 -top-1 min-h-[1.1rem] min-w-[1.1rem] rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-1 text-[10px] font-bold text-white"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="glass-panel absolute right-0 z-[80] mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 dark:border-white/10">
              <p className="font-display text-sm font-semibold">Mission control</p>
              <button type="button" className="text-xs font-semibold text-brand-600 dark:text-brand-400" onClick={readAll}>
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">You're fully caught up.</p>
              )}
              {items.map(n => (
                <button
                  type="button"
                  key={n.id}
                  className={`flex w-full flex-col gap-1 border-b border-white/10 px-4 py-3 text-left text-sm transition hover:bg-white/40 dark:border-white/5 dark:hover:bg-slate-900/60 ${
                    !n.read_at ? "bg-brand-500/5" : ""
                  }`}
                  onClick={() => !n.read_at && readOne(n.id)}
                >
                  <span className="font-semibold">{n.title}</span>
                  {n.body && <span className="text-xs text-slate-600 dark:text-slate-300">{n.body}</span>}
                  {n.data?.orderId && (
                    <Link className="text-xs font-semibold text-brand-600 dark:text-brand-400" to={`/orders/${n.data.orderId}`} onClick={e => e.stopPropagation()}>
                      Open shipment #{n.data.orderId}
                    </Link>
                  )}
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">{new Date(n.created_at).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
