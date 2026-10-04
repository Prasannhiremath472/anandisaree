import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { IndianRupee, ShoppingBag, UserPlus, PackageX, BarChart3 } from "lucide-react";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { useDashboard, type DashboardSummary } from "@/admin/hooks/api/useDashboard";
import { useSalesReport } from "@/admin/hooks/api/useReports";
import { useAppSelector } from "@/admin/hooks/redux";

type RecentOrder = DashboardSummary["recentOrders"][number];
type TopProduct = DashboardSummary["topProducts"][number];

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);
  const { data, isLoading } = useDashboard(selectedCategoryId);
  const { data: sales } = useSalesReport(30, selectedCategoryId);

  const recentOrderColumns: Column<RecentOrder>[] = [
    {
      header: t("orders.columnOrder"),
      key: "orderNumber",
      render: (o) => <span className="font-medium text-neutral-800">{o.orderNumber}</span>,
    },
    { header: t("common.customer"), key: "customer", render: (o) => o.user.name },
    { header: t("common.status"), key: "status", render: (o) => <StatusBadge status={o.status} /> },
    {
      header: t("orders.columnTotal"),
      key: "totalAmount",
      render: (o) => <span className="font-medium">₹{Number(o.totalAmount).toLocaleString("en-IN")}</span>,
    },
  ];

  const topProductColumns: Column<TopProduct>[] = [
    { header: t("products.columnProduct"), key: "name", render: (p) => <span className="font-medium text-neutral-800">{p.name}</span> },
    {
      header: t("dashboard.columnSold"),
      key: "soldCount",
      render: (p) => <span className="text-neutral-500">{t("dashboard.soldCount", { count: p.soldCount })}</span>,
    },
  ];

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

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-neutral-800">{t("dashboard.revenueChart")}</h2>
          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="flex items-center gap-1.5 rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            <BarChart3 className="h-3.5 w-3.5" /> {t("dashboard.viewReports")}
          </button>
        </div>
        <p className="text-xs text-neutral-400">{t("dashboard.chartClickHint")}</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales?.series ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#54208C"
                strokeWidth={2}
                dot={{ r: 3, cursor: "pointer" }}
                activeDot={{ r: 5, cursor: "pointer", onClick: (_e: unknown, payload: any) => {
                  const date = payload?.payload?.date;
                  if (date) navigate(`/orders?date=${date}`);
                } }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-neutral-800">{t("dashboard.latestOrders")}</h2>
            <Link to="/orders" className="text-xs font-medium text-royal-600 hover:text-royal-700">
              {t("dashboard.viewAll")}
            </Link>
          </div>
          <DataTable
            columns={recentOrderColumns}
            rows={data?.recentOrders ?? []}
            rowKey={(o) => o.id}
            loading={isLoading}
            emptyMessage={t("common.noOrdersYet")}
            onRowClick={(o) => navigate(`/orders/${o.id}`)}
          />
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-neutral-800">{t("dashboard.topProducts")}</h2>
            <Link to="/reports" className="text-xs font-medium text-royal-600 hover:text-royal-700">
              {t("dashboard.viewReports")}
            </Link>
          </div>
          <DataTable
            columns={topProductColumns}
            rows={data?.topProducts ?? []}
            rowKey={(p) => p.id}
            loading={isLoading}
            emptyMessage={t("dashboard.noSalesDataYet")}
          />
        </div>
      </div>
    </div>
  );
}
