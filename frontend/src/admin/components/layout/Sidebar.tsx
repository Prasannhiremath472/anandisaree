import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  FolderTree,
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
  { key: "nav.categories", to: "/categories", icon: FolderTree },
  { key: "nav.orders", to: "/orders", icon: ShoppingCart },
  { key: "nav.customers", to: "/customers", icon: Users },
  { key: "nav.reviews", to: "/reviews", icon: MessageSquare },
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
    "flex items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-royal-600/5 hover:text-royal-600",
    isActive && "bg-royal-gradient text-white shadow-sm hover:text-white"
  );

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="hidden w-48 shrink-0 flex-col overflow-hidden border-r border-black/5 bg-sidebar-gradient lg:flex">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/5 px-5">
        <img src="/images/anandi-sarees-logo-crop.png" alt="Anandi Sarees" className="h-8 rounded" />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
            <Icon className="h-3.5 w-3.5" />
            {t(key)}
          </NavLink>
        ))}

        <p className="mt-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{t("nav.marketing")}</p>
        {MARKETING_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-3.5 w-3.5" />
            {t(key)}
          </NavLink>
        ))}

        <div className="my-1.5 border-t border-black/5" />
        {TAIL_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-3.5 w-3.5" />
            {t(key)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
