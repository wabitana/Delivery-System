import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";

const envRoot = import.meta.env.VITE_API_URL?.trim()
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "";

export const api = axios.create({
  baseURL: envRoot ? `${envRoot}/api` : "/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg =
      err.response?.data?.message ||
      (Array.isArray(err.response?.data?.details)
        ? err.response.data.details.join(", ")
        : null) ||
      err.message ||
      "Request failed";
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired — please sign in again.");
    } else if (err.response?.status !== 422) {
      toast.error(typeof msg === "string" ? msg : "Something went wrong");
    }
    return Promise.reject(err);
  }
);

export async function authLogin(body) {
  const { data } = await api.post("/auth/login", body);
  return data;
}

export async function authRegister(body) {
  const { data } = await api.post("/auth/register", body);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export async function fetchProducts(params) {
  const { data } = await api.get("/products", { params });
  return data;
}

export async function fetchProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
}

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data.categories;
}

export async function fetchVendors() {
  const { data } = await api.get("/vendors");
  return data.vendors;
}

export async function fetchCart() {
  const { data } = await api.get("/cart");
  return data;
}

export async function addCartItem(body) {
  const { data } = await api.post("/cart", body);
  return data;
}

export async function patchCartItem(productId, body) {
  const { data } = await api.patch(`/cart/items/${productId}`, body);
  return data;
}

export async function removeCartItem(productId) {
  const { data } = await api.delete(`/cart/items/${productId}`);
  return data;
}

export async function clearCart() {
  const { data } = await api.delete("/cart");
  return data;
}

export async function checkout(body) {
  const { data } = await api.post("/orders/checkout", body);
  return data;
}

export async function completePayment(orderId, body) {
  const { data } = await api.post(`/payments/order/${orderId}/complete`, body || {});
  return data;
}

export async function fetchOrders(scope) {
  const { data } = await api.get("/orders", { params: scope ? { scope } : {} });
  return data.orders;
}

export async function fetchOrder(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
}

export async function simulateOrderStep(id) {
  const { data } = await api.post(`/orders/${id}/simulate-step`);
  return data;
}

export async function fetchDashboardUser() {
  const { data } = await api.get("/dashboard/user");
  return data.dashboard;
}

export async function fetchDashboardVendor() {
  const { data } = await api.get("/dashboard/vendor");
  return data.dashboard;
}

export async function fetchVendorMine() {
  const { data } = await api.get("/vendors/mine");
  return data.vendor;
}

export async function createVendor(body) {
  const { data } = await api.post("/vendors", body);
  return data.vendor;
}

export async function createProduct(body) {
  const { data } = await api.post("/products", body);
  return data.product;
}

export async function updateProduct(id, body) {
  const { data } = await api.patch(`/products/${id}`, body);
  return data.product;
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

export async function claimDeliveryOrder(orderId) {
  const { data } = await api.post(`/delivery/orders/${orderId}/claim`);
  return data.order;
}

export async function fetchOpenDeliveryOrders() {
  const { data } = await api.get("/delivery/open-orders");
  return data.orders;
}

export async function fetchReviewsVendor(vendorId) {
  const { data } = await api.get(`/reviews/vendor/${vendorId}`);
  return data;
}

export async function fetchVendorPosts() {
  const { data } = await api.get("/vendor-posts");
  return data.posts;
}

export async function fetchMyVendorPosts() {
  const { data } = await api.get("/vendor-posts/mine");
  return data.posts;
}

export async function createVendorPost(body) {
  const { data } = await api.post("/vendor-posts", body);
  return data.post;
}

export async function deleteVendorPost(id) {
  await api.delete(`/vendor-posts/${id}`);
}

export async function fetchUnreadNotificationCount() {
  const { data } = await api.get("/notifications/unread-count");
  return data.count;
}

export async function fetchNotifications(params) {
  const { data } = await api.get("/notifications", { params });
  return data.notifications;
}

export async function markNotificationRead(id) {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  await api.patch("/notifications/read-all");
}

export async function patchProfile(body) {
  const { data } = await api.patch("/users/me", body);
  return data.user;
}
