import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          // Products, Orders, Customers, Coupons, Banners, CMS, Reviews,
          // Newsletter, Marketing, Reports, Settings routes are added in Phase 4.
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
