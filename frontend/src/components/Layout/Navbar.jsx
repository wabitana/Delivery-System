import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X, Truck } from "./icons.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { fetchCart } from "../../services/api.js";
import { NotificationBell } from "../notifications/NotificationBell.jsx";

const linkCls =
  "rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setCartCount(0);
      return undefined;
    }
    let cancelled = false;
    fetchCart()
      .then(data => {
        if (!cancelled) {
          const n = (data.items || []).reduce((s, i) => s + i.quantity, 0);
          setCartCount(n);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  const authed = !!token && !!user;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass-nav relative flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2 md:px-5">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md">
            <Truck className="h-5 w-5" />
          </span>
          <span>
            Nimbus<span className="gradient-text"> Logistics</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
            Marketplace
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
            About
          </NavLink>
          {authed && (
            <>
              <NavLink to="/cart" className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
                Cart
                {cartCount > 0 && (
                  <span className="ml-1 rounded-full bg-brand-500 px-1.5 text-[11px] text-white dark:bg-brand-600">
                    {cartCount}
                  </span>
                )}
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
                Dashboard
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
                Profile
              </NavLink>
              {user.role === "delivery" && (
                <NavLink to="/delivery" className={({ isActive }) => `${linkCls} ${isActive ? "!bg-white/80 dark:!bg-slate-800/80 !text-brand-600 dark:!text-brand-400" : ""}`}>
                  Courier
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {authed && <NotificationBell />}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-white/30 bg-white/40 p-2 text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {authed ? (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 md:inline-block"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95 md:inline-block"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="rounded-full border border-white/30 bg-white/50 p-2 md:hidden dark:bg-slate-800/60"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel fixed left-4 right-4 top-24 z-40 mx-auto flex max-w-5xl flex-col gap-2 p-4 md:hidden"
        >
          <MobileNavLink to="/" onClick={() => setOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/marketplace" onClick={() => setOpen(false)}>
            Marketplace
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setOpen(false)}>
            About
          </MobileNavLink>
          {authed && (
            <>
              <MobileNavLink to="/cart" onClick={() => setOpen(false)}>
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </MobileNavLink>
              <MobileNavLink to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/settings" onClick={() => setOpen(false)}>
                Profile
              </MobileNavLink>
              {user.role === "delivery" && (
                <MobileNavLink to="/delivery" onClick={() => setOpen(false)}>
                  Courier board
                </MobileNavLink>
              )}
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400"
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
              >
                Sign out
              </button>
            </>
          )}
          {!authed && (
            <MobileNavLink to="/login" onClick={() => setOpen(false)}>
              Sign in
            </MobileNavLink>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/50 dark:hover:bg-slate-800/80">
      {children}
    </Link>
  );
}
