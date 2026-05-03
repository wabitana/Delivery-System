import { Link } from "react-router-dom";

const cols = [
  {
    title: "Platform",
    links: [
      { to: "/marketplace", label: "Marketplace" },
      { to: "/about", label: "About Nimbus" },
      { to: "/settings", label: "Account settings" },
      { to: "/dashboard", label: "Operations hub" }
    ]
  },
  {
    title: "Personas",
    links: [
      { to: "/register", label: "Business signup" },
      { to: "/delivery", label: "Courier console" },
      { to: "/login", label: "Customer login" },
      { to: "/cart", label: "Basket" }
    ]
  },
  {
    title: "Compliance",
    links: [
      { href: "#", label: "Privacy (demo)" },
      { href: "#", label: "Terms (demo)" },
      { href: "#", label: "Trust center (demo)" },
      { href: "#", label: "API status (demo)" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/15 bg-white/40 py-14 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.4fr_2fr] md:px-6">
        <div>
          <p className="font-display text-xl font-semibold">
            Nimbus<span className="gradient-text"> Logistics Cloud</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            A general-purpose delivery mesh that connects storefront intelligence, courier telemetry, and buyer journeys — engineered for modern operations teams.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-400">© {new Date().getFullYear()} Nimbus Labs Demo</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {cols.map(col => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{col.title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map(link =>
                  link.to ? (
                    <li key={link.label}>
                      <Link className="text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400" to={link.to}>
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <span className="cursor-default text-slate-500 dark:text-slate-400">{link.label}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
