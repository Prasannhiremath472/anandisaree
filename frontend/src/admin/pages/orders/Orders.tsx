import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useOrders } from "@/admin/hooks/api/useOrders";
import type { OrderListItem, OrderStatus } from "@/admin/types/order";

const STATUS_FILTERS: (OrderStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export function Orders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const navigate = useNavigate();

  const { data, isLoading } = useOrders({
    page,
    pageSize: 10,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
  });

  const columns: Column<OrderListItem>[] = [
    {
      header: "Order",
      key: "orderNumber",
      render: (o) => (
        <div>
          <p className="font-medium text-neutral-800">{o.orderNumber}</p>
          <p className="text-xs text-neutral-400">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
      ),
    },
    {
      header: "Customer",
      key: "user",
      render: (o) => (
        <div>
          <p className="text-neutral-700">{o.user.name}</p>
          <p className="text-xs text-neutral-400">{o.user.email}</p>
        </div>
      ),
    },
    { header: "Items", key: "items", render: (o) => `${o.items.length} item${o.items.length !== 1 ? "s" : ""}` },
    { header: "Total", key: "totalAmount", render: (o) => `₹${Number(o.totalAmount).toLocaleString("en-IN")}` },
    { header: "Payment", key: "paymentStatus", render: (o) => <StatusBadge status={o.paymentStatus} /> },
    { header: "Status", key: "status", render: (o) => <StatusBadge status={o.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Orders" description="Track and manage customer orders." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search order # or customer..." />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as OrderStatus | "ALL"); setPage(1); }}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? "All Statuses" : s}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(o) => o.id}
        loading={isLoading}
        emptyMessage="No orders yet."
        onRowClick={(o) => navigate(`/orders/${o.id}`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </div>
  );
}
