import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IndianRupee, ShoppingBag, UserPlus, PackageX } from "lucide-react";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useDashboard } from "@/admin/hooks/api/useDashboard";
import { useAppSelector } from "@/admin/hooks/redux";

export function Dashboard() {
  const { t } = useTranslation();
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);
  const { data, isLoading } = useDashboard(selectedCategoryId);

  const statCards = [
    {
      label: t("dashboard.revenue30d"),
      value: `₹${Number(data?.revenue30d ?? 0).toLocaleString("en-IN")}`,
      to: "/reports",
      icon: IndianRupee,
      accent: "bg-green-50 text-green-600",
    },
    {
      label: t("dashboard.orders30d"),
      value: String(data?.orders30d ?? 0),
      to: "/orders",
      icon: ShoppingBag,
      accent: "bg-royal-50 text-royal-600",
    },
    {
      label: t("dashboard.newCustomers30d"),
      value: String(data?.newCustomers30d ?? 0),
      to: "/customers",
      icon: UserPlus,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: t("dashboard.lowStockItems"),
      value: String(data?.lowStockCount ?? 0),
      to: "/products",
      icon: PackageX,
      accent: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.accent}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="mt-1 font-heading text-2xl font-semibold text-neutral-800">
                {isLoading ? "..." : card.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-neutral-800">{t("dashboard.latestOrders")}</h2>
            <Link to="/orders" className="text-xs font-medium text-royal-600 hover:text-royal-700">
              {t("dashboard.viewAll")}
            </Link>
          </div>
          {!data?.recentOrders.length ? (
            <p className="text-sm text-neutral-400">{t("common.noOrdersYet")}</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-neutral-800">{o.orderNumber}</p>
                    <p className="text-xs text-neutral-400">{o.user.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="font-medium">₹{Number(o.totalAmount).toLocaleString("en-IN")}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-neutral-800">{t("dashboard.topProducts")}</h2>
            <Link to="/reports" className="text-xs font-medium text-royal-600 hover:text-royal-700">
              {t("dashboard.viewReports")}
            </Link>
          </div>
          {!data?.topProducts.length ? (
            <p className="text-sm text-neutral-400">{t("dashboard.noSalesDataYet")}</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.topProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <p className="font-medium text-neutral-800">{p.name}</p>
                  <span className="text-neutral-500">{t("dashboard.soldCount", { count: p.soldCount })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
