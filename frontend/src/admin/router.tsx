import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { ProtectedRoute } from "@/admin/components/ProtectedRoute";
import { Login } from "@/admin/pages/Login";
import { Dashboard } from "@/admin/pages/Dashboard";
import { Products } from "@/admin/pages/products/Products";
import { ProductForm } from "@/admin/pages/products/ProductForm";
import { Orders } from "@/admin/pages/orders/Orders";
import { OrderDetail } from "@/admin/pages/orders/OrderDetail";
import { Customers } from "@/admin/pages/customers/Customers";
import { CustomerDetail } from "@/admin/pages/customers/CustomerDetail";
import { Coupons } from "@/admin/pages/coupons/Coupons";
import { CouponForm } from "@/admin/pages/coupons/CouponForm";
import { Banners } from "@/admin/pages/banners/Banners";
import { BannerForm } from "@/admin/pages/banners/BannerForm";
import { CmsAndBlog } from "@/admin/pages/cms/CmsAndBlog";
import { BlogForm } from "@/admin/pages/cms/BlogForm";
import { Reviews } from "@/admin/pages/reviews/Reviews";
import { Newsletter } from "@/admin/pages/newsletter/Newsletter";
import { Marketing } from "@/admin/pages/marketing/Marketing";
import { Reports } from "@/admin/pages/reports/Reports";
import { Settings } from "@/admin/pages/settings/Settings";

export const adminRouter = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <Dashboard /> },

            { path: "products", element: <Products /> },
            { path: "products/new", element: <ProductForm /> },
            { path: "products/:id/edit", element: <ProductForm /> },

            { path: "orders", element: <Orders /> },
            { path: "orders/:id", element: <OrderDetail /> },

            { path: "customers", element: <Customers /> },
            { path: "customers/:id", element: <CustomerDetail /> },

            { path: "coupons", element: <Coupons /> },
            { path: "coupons/new", element: <CouponForm /> },
            { path: "coupons/:id/edit", element: <CouponForm /> },

            { path: "banners", element: <Banners /> },
            { path: "banners/new", element: <BannerForm /> },
            { path: "banners/:id/edit", element: <BannerForm /> },

            { path: "cms", element: <CmsAndBlog /> },
            { path: "cms/blog/new", element: <BlogForm /> },
            { path: "cms/blog/:id/edit", element: <BlogForm /> },

            { path: "reviews", element: <Reviews /> },
            { path: "newsletter", element: <Newsletter /> },
            { path: "marketing", element: <Marketing /> },
            { path: "reports", element: <Reports /> },
            { path: "settings", element: <Settings /> },
          ],
        },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename: "/admin" }
);
