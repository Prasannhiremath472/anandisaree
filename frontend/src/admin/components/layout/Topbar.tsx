import { Bell, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/admin/hooks/redux";
import { clearAuth } from "@/admin/store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/coupons": "Coupons",
  "/banners": "Banners",
  "/cms": "CMS & Blog",
  "/reviews": "Reviews",
  "/newsletter": "Newsletter",
  "/marketing": "Marketing",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Topbar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    dispatch(clearAuth());
    navigate("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-6">
      <h1 className="font-heading text-base font-semibold text-neutral-800">{TITLES[location.pathname] ?? "Admin"}</h1>
      <div className="flex items-center gap-5">
        <button aria-label="Notifications" className="text-neutral-500 hover:text-royal-600">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-gradient text-xs font-semibold text-white shadow-sm">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-neutral-800">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-neutral-500">{user?.role ?? ""}</p>
          </div>
        </div>
        <button aria-label="Logout" onClick={handleLogout} className="text-neutral-500 hover:text-royal-600">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
