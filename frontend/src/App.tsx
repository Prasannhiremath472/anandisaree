import { lazy, Suspense } from "react";
import StorefrontApp from "@/StorefrontApp";

const AdminApp = lazy(() => import("@/admin/AdminApp"));

const isAdminRoute = window.location.pathname.startsWith("/admin");

export default function App() {
  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-neutral-400">Loading admin panel...</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  return <StorefrontApp />;
}
