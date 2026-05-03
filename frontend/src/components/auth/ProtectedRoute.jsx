import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";

export function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
