import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GlassCard } from "../components/ui/GlassCard.jsx";
import {
  createProduct,
  createVendor,
  createVendorPost,
  deleteProduct,
  deleteVendorPost,
  fetchDashboardUser,
  fetchDashboardVendor,
  fetchMyVendorPosts,
  fetchOrders,
  fetchProducts,
  fetchVendorMine,
  updateOrderStatus,
  updateProduct
} from "../services/api.js";
import { useAuthStore } from "../store/authStore.js";

export function Dashboard() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("overview");
  const [userDash, setUserDash] = useState(null);
  const [orders, setOrders] = useState([]);
  const [vendorDash, setVendorDash] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(undefined);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendorPosts, setVendorPosts] = useState([]);
  const [vendorForm, setVendorForm] = useState({
    business_name: "",
    address: "",
    description: "",
    tagline: "",
    latitude: "",
    longitude: "",
    cover_image_url: ""
  });
  const [postForm, setPostForm] = useState({
    title: "",
    body: "",
    latitude: "",
    longitude: ""
  });
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    category_id: ""
  });

  async function refreshCustomer() {
    const [dash, ord] = await Promise.all([fetchDashboardUser(), fetchOrders()]);
    setUserDash(dash);
    setOrders(ord);
  }

  async function refreshVendor() {
    const mine = await fetchVendorMine();
    setVendorProfile(mine);
    if (!mine) {
      setVendorPosts([]);
      return;
    }
    const [vd, vo, vp, vposts] = await Promise.all([
      fetchDashboardVendor(),
      fetchOrders("vendor"),
      fetchProducts({ vendor_id: mine.id, include_unavailable: "1" }),
      fetchMyVendorPosts()
    ]);
    setVendorDash(vd);
    setVendorOrders(vo);
    setVendorProducts(vp.products || []);
    setVendorPosts(vposts || []);
  }

  useEffect(() => {
    refreshCustomer().catch(() => {});
    if (user?.role === "vendor") {
      refreshVendor().catch(() => {});
    }
  }, [user?.role]);

  async function submitVendor(e) {
    e.preventDefault();
    try {
      const v = await createVendor({
        business_name: vendorForm.business_name,
        address: vendorForm.address,
        description: vendorForm.description,
        tagline: vendorForm.tagline || undefined,
        latitude: vendorForm.latitude ? Number(vendorForm.latitude) : undefined,
        longitude: vendorForm.longitude ? Number(vendorForm.longitude) : undefined,
        cover_image_url: vendorForm.cover_image_url || undefined
      });
      setVendorProfile(v);
      toast.success("Kitchen live");
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  async function submitProduct(e) {
    e.preventDefault();
    if (!vendorProfile) return;
    try {
      await createProduct({
        name: productForm.name,
        price: Number(productForm.price),
        description: productForm.description,
        category_id: productForm.category_id ? Number(productForm.category_id) : null
      });
      toast.success("Menu item added");
      setProductForm({ name: "", price: "", description: "", category_id: "" });
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  async function toggleAvailability(p) {
    try {
      await updateProduct(p.id, { is_available: !p.is_available });
      toast.success("Updated");
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  async function removeProduct(id) {
    try {
      await deleteProduct(id);
      toast.success("Removed");
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  async function submitVendorPost(e) {
    e.preventDefault();
    if (!vendorProfile) return;
    try {
      await createVendorPost({
        title: postForm.title,
        body: postForm.body,
        latitude: postForm.latitude ? Number(postForm.latitude) : null,
        longitude: postForm.longitude ? Number(postForm.longitude) : null
      });
      toast.success("Storefront post published");
      setPostForm({ title: "", body: "", latitude: "", longitude: "" });
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  async function removeVendorPost(id) {
    try {
      await deleteVendorPost(id);
      toast.success("Post removed");
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  async function changeOrderStatus(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      toast.success("Order updated");
      refreshVendor().catch(() => {});
    } catch {
      /* toast */
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Signed in as <span className="font-semibold">{user?.full_name}</span> ({user?.role})
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
          Overview
        </TabButton>
        {user?.role === "vendor" && (
          <TabButton active={tab === "vendor"} onClick={() => setTab("vendor")}>
            Vendor ops
          </TabButton>
        )}
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-6 lg:col-span-1">
            <h2 className="font-display text-lg font-semibold">Your pulse</h2>
            {userDash ? (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Lifetime orders</dt>
                  <dd className="font-semibold">{userDash.total_orders}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Delivered</dt>
                  <dd className="font-semibold">{userDash.delivered_orders}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Spend</dt>
                  <dd className="font-semibold">${Number(userDash.lifetime_spend).toFixed(2)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Loading metrics...</p>
            )}
          </GlassCard>

          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Recent orders</h2>
              <button
                type="button"
                className="text-sm font-medium text-brand-600 dark:text-brand-400"
                onClick={() => refreshCustomer()}
              >
                Refresh
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {orders.slice(0, 8).map(o => (
                <div
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/40 px-3 py-3 text-sm dark:border-white/10 dark:bg-slate-950/30"
                >
                  <div>
                    <p className="font-semibold">{o.business_name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{o.status.replace(/_/g, " ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(o.total).toFixed(2)}</p>
                    <Link className="text-xs text-brand-600 dark:text-brand-400" to={`/orders/${o.id}`}>
                      Track
                    </Link>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-slate-500">No orders yet.</p>}
            </div>
          </GlassCard>
        </div>
      )}

      {tab === "vendor" && user?.role === "vendor" && (
        <div className="space-y-8">
          {!vendorProfile ? (
            <GlassCard className="p-6">
              <h2 className="font-display text-lg font-semibold">Launch your logistics hub</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Publish HQ coordinates so buyers & couriers visualize coverage instantly.
              </p>
              <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitVendor}>
                <input
                  required
                  placeholder="Business name"
                  value={vendorForm.business_name}
                  onChange={e => setVendorForm(f => ({ ...f, business_name: e.target.value }))}
                  className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                />
                <input
                  placeholder="Tagline"
                  value={vendorForm.tagline}
                  onChange={e => setVendorForm(f => ({ ...f, tagline: e.target.value }))}
                  className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                />
                <input
                  required
                  placeholder="HQ / pickup address"
                  value={vendorForm.address}
                  onChange={e => setVendorForm(f => ({ ...f, address: e.target.value }))}
                  className="md:col-span-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                />
                <input
                  placeholder="Latitude"
                  value={vendorForm.latitude}
                  onChange={e => setVendorForm(f => ({ ...f, latitude: e.target.value }))}
                  className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                />
                <input
                  placeholder="Longitude"
                  value={vendorForm.longitude}
                  onChange={e => setVendorForm(f => ({ ...f, longitude: e.target.value }))}
                  className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                />
                <input
                  placeholder="Cover image URL"
                  value={vendorForm.cover_image_url}
                  onChange={e => setVendorForm(f => ({ ...f, cover_image_url: e.target.value }))}
                  className="md:col-span-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                />
                <textarea
                  placeholder="Store narrative / SLA highlights"
                  value={vendorForm.description}
                  onChange={e => setVendorForm(f => ({ ...f, description: e.target.value }))}
                  className="md:col-span-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                  rows={3}
                />
                <button
                  type="submit"
                  className="md:col-span-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 py-3 text-sm font-semibold text-white"
                >
                  Save hub profile
                </button>
              </form>
            </GlassCard>
          ) : (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                <GlassCard className="p-6">
                  <h3 className="font-display text-lg font-semibold">Kitchen metrics</h3>
                  {vendorDash ? (
                    <dl className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Open tickets</dt>
                        <dd className="font-semibold">{vendorDash.open_orders}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">All-time orders</dt>
                        <dd className="font-semibold">{vendorDash.total_orders}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Menu SKUs</dt>
                        <dd className="font-semibold">{vendorDash.products}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Revenue</dt>
                        <dd className="font-semibold">${Number(vendorDash.revenue).toFixed(2)}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">Loading...</p>
                  )}
                </GlassCard>

                <GlassCard className="p-6 lg:col-span-2">
                  <h3 className="font-display text-lg font-semibold">Publish SKU</h3>
                  <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitProduct}>
                    <input
                      required
                      placeholder="Name"
                      value={productForm.name}
                      onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                      className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                    />
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                      className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                    />
                    <input
                      placeholder="Category id (optional)"
                      value={productForm.category_id}
                      onChange={e => setProductForm(f => ({ ...f, category_id: e.target.value }))}
                      className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                    />
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                      className="md:col-span-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                      rows={2}
                    />
                    <button
                      type="submit"
                      className="md:col-span-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                    >
                      Publish SKU
                    </button>
                  </form>
                </GlassCard>
              </div>

              <GlassCard className="p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold">Storefront posts</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Featured dispatches appear ahead of SKUs on the marketplace — pin corridors or promos with geo context.
                    </p>
                  </div>
                </div>
                <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submitVendorPost}>
                  <input
                    required
                    placeholder="Headline"
                    value={postForm.title}
                    onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))}
                    className="md:col-span-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                  />
                  <textarea
                    placeholder="Story"
                    value={postForm.body}
                    onChange={e => setPostForm(f => ({ ...f, body: e.target.value }))}
                    className="md:col-span-2 rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                    rows={2}
                  />
                  <input
                    placeholder="Pin latitude"
                    value={postForm.latitude}
                    onChange={e => setPostForm(f => ({ ...f, latitude: e.target.value }))}
                    className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                  />
                  <input
                    placeholder="Pin longitude"
                    value={postForm.longitude}
                    onChange={e => setPostForm(f => ({ ...f, longitude: e.target.value }))}
                    className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950/40"
                  />
                  <button
                    type="submit"
                    className="md:col-span-2 rounded-full bg-gradient-to-r from-accent-500 to-brand-500 py-3 text-sm font-semibold text-white"
                  >
                    Push live to marketplace
                  </button>
                </form>
                <div className="mt-6 space-y-3">
                  {vendorPosts.map(vp => (
                    <div
                      key={vp.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/35 px-3 py-3 text-sm dark:border-white/10 dark:bg-slate-950/40"
                    >
                      <div>
                        <p className="font-semibold">{vp.title}</p>
                        <p className="text-xs text-slate-500">{vp.body}</p>
                      </div>
                      <button type="button" className="text-xs font-semibold text-red-600" onClick={() => removeVendorPost(vp.id)}>
                        Retire
                      </button>
                    </div>
                  ))}
                  {vendorPosts.length === 0 && <p className="text-sm text-slate-500">No spotlight posts yet.</p>}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold">Orders inbox</h3>
                  <button
                    type="button"
                    className="text-sm text-brand-600 dark:text-brand-400"
                    onClick={() => refreshVendor()}
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase text-slate-500">
                      <tr>
                        <th className="pb-2 pr-4">ID</th>
                        <th className="pb-2 pr-4">Customer</th>
                        <th className="pb-2 pr-4">Total</th>
                        <th className="pb-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {vendorOrders.map(o => (
                        <tr key={o.id}>
                          <td className="py-3 pr-4 font-mono text-xs">#{o.id}</td>
                          <td className="py-3 pr-4">{o.customer_name}</td>
                          <td className="py-3 pr-4">${Number(o.total).toFixed(2)}</td>
                          <td className="py-3 pr-4">
                            {o.status === "pending" ? (
                              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                                Awaiting customer payment
                              </span>
                            ) : ["out_for_delivery", "delivered"].includes(o.status) ? (
                              <span className="text-xs capitalize text-slate-500">{o.status.replace(/_/g, " ")}</span>
                            ) : (
                              <select
                                value={o.status}
                                onChange={e => changeOrderStatus(o.id, e.target.value)}
                                className="rounded-lg border border-white/30 bg-white/60 px-2 py-1 text-xs dark:border-white/10 dark:bg-slate-950/40"
                              >
                                {["confirmed", "preparing", "ready_for_pickup", "cancelled"].map(s => (
                                  <option key={s} value={s}>
                                    {s.replace(/_/g, " ")}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {vendorOrders.length === 0 && <p className="mt-4 text-sm text-slate-500">No tickets yet.</p>}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-display text-lg font-semibold">Menu catalog</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {vendorProducts.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/40 px-3 py-3 text-sm dark:border-white/10 dark:bg-slate-950/30"
                    >
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.is_available ? "Available" : "Paused"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="text-xs underline" onClick={() => toggleAvailability(p)}>
                          Toggle
                        </button>
                        <button type="button" className="text-xs text-red-600" onClick={() => removeProduct(p.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md"
          : "border border-white/30 bg-white/40 text-slate-700 hover:bg-white/60 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
