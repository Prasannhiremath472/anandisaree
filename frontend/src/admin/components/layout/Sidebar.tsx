import { NavLink } from "react-router-dom";
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
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Products", to: "/products", icon: Package },
  { label: "Orders", to: "/orders", icon: ShoppingCart },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Feedback", to: "/reviews", icon: MessageSquare },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Coupons", to: "/coupons", icon: Tag },
  { label: "Reels", to: "/reels", icon: Clapperboard },
];

const MARKETING_ITEMS = [
  { label: "Banners", to: "/banners", icon: Image },
  { label: "Newsletter", to: "/newsletter", icon: Mail },
];

const TAIL_ITEMS = [
  { label: "CMS & Blog", to: "/cms", icon: FileText },
  { label: "Settings", to: "/settings", icon: Settings },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-royal-600/5 hover:text-royal-600",
    isActive && "bg-royal-gradient text-white shadow-sm hover:text-white"
  );

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col overflow-hidden border-r border-black/5 bg-sidebar-gradient lg:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-black/5 px-6">
        <img src="/images/anandi-sarees-logo-crop.png" alt="Anandi Sarees" className="h-10 rounded" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Marketing</p>
        {MARKETING_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        <div className="my-2 border-t border-black/5" />
        {TAIL_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
