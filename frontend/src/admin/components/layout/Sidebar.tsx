import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  Tag,
  Clapperboard,
  Image,
  Mail,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/admin/utils";

const NAV_ITEMS = [
  { key: "nav.dashboard", to: "/", icon: LayoutDashboard },
  { key: "nav.products", to: "/products", icon: Package },
  { key: "nav.orders", to: "/orders", icon: ShoppingCart },
  { key: "nav.customers", to: "/customers", icon: Users },
  { key: "nav.feedback", to: "/reviews", icon: MessageSquare },
  { key: "nav.reports", to: "/reports", icon: BarChart3 },
  { key: "nav.coupons", to: "/coupons", icon: Tag },
  { key: "nav.reels", to: "/reels", icon: Clapperboard },
] as const;

const MARKETING_ITEMS = [
  { key: "nav.banners", to: "/banners", icon: Image },
  { key: "nav.newsletter", to: "/newsletter", icon: Mail },
] as const;

const TAIL_ITEMS = [
  { key: "nav.cmsBlog", to: "/cms", icon: FileText },
  { key: "nav.settings", to: "/settings", icon: Settings },
] as const;

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-royal-600/5 hover:text-royal-600",
    isActive && "bg-royal-gradient text-white shadow-sm hover:text-white"
  );

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-hidden border-r border-black/5 bg-sidebar-gradient lg:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-black/5 px-6">
        <img src="/images/anandi-sarees-logo-crop.png" alt="Anandi Sarees" className="h-10 rounded" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {NAV_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
            <Icon className="h-4 w-4" />
            {t(key)}
          </NavLink>
        ))}

        <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{t("nav.marketing")}</p>
        {MARKETING_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-4 w-4" />
            {t(key)}
          </NavLink>
        ))}

        <div className="my-2 border-t border-black/5" />
        {TAIL_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-4 w-4" />
            {t(key)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
