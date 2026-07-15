import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useInventoryReport, useOrderStatusReport, useSalesReport, useTopProductsReport } from "@/admin/hooks/api/useReports";

export function Reports() {
  const { data: sales } = useSalesReport(30);
  const { data: orderStatus } = useOrderStatusReport();
  const { data: topProducts } = useTopProductsReport();
  const { data: inventory } = useInventoryReport();

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Sales, inventory and performance insights." />

      <div className="rounded-xl border border-black/5 bg-white p-6">
        <h3 className="font-heading text-sm font-semibold text-neutral-800">Revenue (Last 30 Days)</h3>
        <p className="mt-1 text-2xl font-semibold text-royal-700">
          ₹{(sales?.totalRevenue ?? 0).toLocaleString("en-IN")}
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales?.series ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#54208C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/5 bg-white p-6">
          <h3 className="font-heading text-sm font-semibold text-neutral-800">Orders by Status</h3>
          <ul className="mt-4 space-y-2">
            {orderStatus?.map((s) => (
              <li key={s.status} className="flex items-center justify-between text-sm">
                <StatusBadge status={s.status} />
                <span className="font-medium text-neutral-700">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-6">
          <h3 className="font-heading text-sm font-semibold text-neutral-800">Top Selling Products</h3>
          <ul className="mt-4 space-y-3">
            {topProducts?.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-neutral-800">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.sku}</p>
                </div>
                <span className="font-medium text-royal-700">{p.soldCount} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-black/5 bg-white p-6">
        <h3 className="font-heading text-sm font-semibold text-neutral-800">Low Stock Alert</h3>
        {!inventory?.length ? (
          <p className="mt-3 text-sm text-neutral-400">All products are sufficiently stocked.</p>
        ) : (
          <ul className="mt-3 divide-y divide-neutral-100">
            {inventory.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-neutral-800">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.sku}</p>
                </div>
                <span className="font-medium text-red-600">{p.stockQuantity} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
