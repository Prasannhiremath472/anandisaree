import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image,
  FileText,
  Star,
  Mail,
  BarChart3,
  Megaphone,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Products", to: "/products", icon: Package },
  { label: "Orders", to: "/orders", icon: ShoppingCart },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Coupons", to: "/coupons", icon: Tag },
  { label: "Banners", to: "/banners", icon: Image },
  { label: "CMS & Blog", to: "/cms", icon: FileText },
  { label: "Reviews", to: "/reviews", icon: Star },
  { label: "Newsletter", to: "/newsletter", icon: Mail },
  { label: "Marketing", to: "/marketing", icon: Megaphone },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-black/5 px-6">
        <img src="/images/anandi-sarees-logo-crop.png" alt="Anandi Sarees" className="h-10 rounded" />
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-royal-600/5 hover:text-royal-600",
                isActive && "bg-royal-600/10 text-royal-600"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
