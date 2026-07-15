import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/admin/hooks/redux";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "CONTENT_MANAGER",
];

export function ProtectedRoute() {
  const { user, accessToken } = useAppSelector((s) => s.auth);

  if (!accessToken || !user || !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
