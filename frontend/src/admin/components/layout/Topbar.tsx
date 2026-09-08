import { Bell, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/admin/hooks/redux";
import { clearAuth } from "@/admin/store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";

const TITLE_KEYS: Record<string, string> = {
  "/": "nav.dashboard",
  "/products": "nav.products",
  "/orders": "nav.orders",
  "/customers": "nav.customers",
  "/coupons": "nav.coupons",
  "/banners": "nav.banners",
  "/cms": "nav.cmsBlog",
  "/reviews": "nav.feedback",
  "/reels": "nav.reels",
  "/newsletter": "nav.newsletter",
  "/marketing": "nav.marketing",
  "/reports": "nav.reports",
  "/settings": "nav.settings",
};

export function Topbar() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    dispatch(clearAuth());
    navigate("/login");
  }

  const titleKey = TITLE_KEYS[location.pathname];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/5 bg-white px-6">
      <h1 className="font-heading text-base font-semibold text-neutral-800">{titleKey ? t(titleKey) : t("nav.admin")}</h1>
      <div className="flex items-center gap-5">
        <LanguageSwitcher />
        <button aria-label={t("topbar.notifications")} className="text-neutral-500 hover:text-royal-600">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-gradient text-xs font-semibold text-white shadow-sm">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-neutral-800">{user?.name ?? t("nav.admin")}</p>
            <p className="text-xs text-neutral-500">{user?.role ?? ""}</p>
          </div>
        </div>
        <button aria-label={t("topbar.logout")} onClick={handleLogout} className="text-neutral-500 hover:text-royal-600">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
