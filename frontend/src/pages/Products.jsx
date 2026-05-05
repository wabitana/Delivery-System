import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import { SectionHeading } from "../components/ui/SectionHeading.jsx";
import { MiniMap } from "../components/maps/MiniMap.jsx";
import { fetchCategories, fetchProducts, fetchVendorPosts, fetchVendors } from "../services/api.js";

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="glass-panel overflow-hidden">
          <div className="aspect-[4/3] animate-pulse bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchCategories(), fetchProducts({}), fetchVendorPosts(), fetchVendors()])
      .then(([cats, pdata, vp, ven]) => {
        if (cancelled) return;
        setCategories(cats);
        setProducts(pdata.products || []);
        setPosts(vp || []);
        setVendors(ven || []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      fetchProducts({
        q: q.trim() || undefined,
        category_id: categoryId || undefined
      }).then(pdata => {
        if (!cancelled) setProducts(pdata.products || []);
      });
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, categoryId]);

  const filtersLabel = useMemo(() => {
    const parts = [];
    if (q.trim()) parts.push(`Searching for “${q.trim()}”`);
    if (categoryId) {
      const cat = categories.find(c => String(c.id) === String(categoryId));
      if (cat) parts.push(cat.name);
    }
    return parts.length ? parts.join(" · ") : "All platform items";
  }, [q, categoryId, categories]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600 dark:text-brand-400">Marketplace</p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">General Delivery Catalog</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Discover products from local shops and retailers. Browse featured storefront updates on the map, followed by a wide range of items ready for delivery to your doorstep.
          </p>
        </div>
        <GlassCard className="w-full max-w-md p-4 md:w-auto">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Universal Search</label>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search electronics, essentials, gifts..."
            className="mt-1 w-full rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm outline-none ring-brand-500/30 focus:ring-2 dark:border-white/10 dark:bg-slate-950/40"
          />
        </GlassCard>
      </div>

      {!loading && posts.length > 0 && (
        <section className="space-y-4">
          <SectionHeading
            eyebrow="Shop Updates"
            title="Featured Storefronts"
            subtitle="View the latest posts and local service alerts from our verified delivery partners."
          />
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
            {posts.map(post => (
              <GlassCard key={post.id} className="min-w-[280px] space-y-4 p-5 md:min-w-0">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{post.business_name}</p>
                  <h3 className="font-display text-xl font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.body}</p>
                </div>
                <MiniMap
                  lat={post.latitude ?? post.vendor_latitude}
                  lng={post.longitude ?? post.vendor_longitude}
                  label={post.business_name}
                  height={170}
                />
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {!loading && vendors.length > 0 && (
        <section className="space-y-4">
          <SectionHeading
            eyebrow="Delivery Network"
            title="Local Fulfillment Hubs"
            subtitle="Explore our active delivery zones and find storefronts nearest to you."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {vendors.map(v => (
              <GlassCard key={v.id} className="space-y-4 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{v.business_name}</h3>
                    {v.tagline && <p className="text-sm text-brand-600 dark:text-brand-300">{v.tagline}</p>}
                    <p className="text-sm text-slate-600 dark:text-slate-300">{v.address}</p>
                  </div>
                  <Link className="text-sm font-semibold text-accent-600 dark:text-accent-300" to="/marketplace">
                    View Items →
                  </Link>
                </div>
                <MiniMap lat={v.latitude} lng={v.longitude} label={v.business_name} height={200} />
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <FilterChip active={!categoryId} onClick={() => setCategoryId("")}>
          All Categories
        </FilterChip>
        {categories.map(c => (
          <FilterChip key={c.id} active={String(categoryId) === String(c.id)} onClick={() => setCategoryId(String(c.id))}>
            {c.name}
          </FilterChip>
        ))}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{filtersLabel}</p>

      {loading ? (
        <SkeletonGrid />
      ) : products.length === 0 ? (
        <GlassCard className="p-10 text-center text-slate-600 dark:text-slate-300">No items found matching these filters.</GlassCard>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.03, 0.24) }}
            >
              <Link to={`/products/${p.id}`} className="group block">
                <GlassCard className="overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">📦</div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {p.vendor_name}
                    </div>
                  </div>
                  <div className="space-y-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-semibold leading-snug">{p.name}</h2>
                      <span className="shrink-0 rounded-full bg-brand-500/15 px-3 py-1 text-sm font-semibold text-brand-700 dark:text-brand-300">
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>
                    {p.category_name && (
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{p.category_name}</p>
                    )}
                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{p.description}</p>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md"
          : "border border-white/30 bg-white/40 text-slate-700 hover:bg-white/60 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/70"
      }`}
    >
      {children}
    </button>
  );
}