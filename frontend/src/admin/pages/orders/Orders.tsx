import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Download, Plus, X } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useExportCsv } from "@/admin/hooks/useExportCsv";
import { useOrders } from "@/admin/hooks/api/useOrders";
import { useAppSelector } from "@/admin/hooks/redux";
import type { OrderListItem, OrderStatus, PaymentStatus } from "@/admin/types/order";
import { CreateOrderModal } from "./CreateOrderModal";

const STATUS_FILTERS: (OrderStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];
const PAYMENT_STATUS_FILTERS: (PaymentStatus | "ALL")[] = ["ALL", "PENDING", "PAID", "FAILED", "REFUNDED"];

export function Orders() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "ALL">("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateFilter = searchParams.get("date") ?? undefined;
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);

  const { data, isLoading } = useOrders({
    page,
    pageSize: 10,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
    paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
    categoryId: selectedCategoryId ?? undefined,
    date: dateFilter,
  });

  function clearDateFilter() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("date");
      return next;
    });
    setPage(1);
  }
  const { exportCsv, exporting } = useExportCsv("/admin/orders/export", "orders.csv");

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);

  const columns: Column<OrderListItem>[] = [
    {
      header: t("orders.columnOrder"),
      key: "orderNumber",
      render: (o) => (
        <div>
          <p className="font-medium text-neutral-800">{o.orderNumber}</p>
          <p className="text-xs text-neutral-400">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
        </div>
      ),
    },
    {
      header: t("common.customer"),
      key: "user",
      render: (o) => (
        <div>
          <p className="text-neutral-700">{o.user.name}</p>
          <p className="text-xs text-neutral-400">{o.user.email}</p>
        </div>
      ),
    },
    { header: t("orders.columnItems"), key: "items", render: (o) => t("orders.itemCount", { count: o.items.length }) },
    { header: t("orders.columnTotal"), key: "totalAmount", render: (o) => `₹${Number(o.totalAmount).toLocaleString("en-IN")}` },
    { header: t("orders.columnPayment"), key: "paymentStatus", render: (o) => <StatusBadge status={o.paymentStatus} /> },
    { header: t("common.status"), key: "status", render: (o) => <StatusBadge status={o.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title={t("orders.title")}
        description={t("orders.description")}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                exportCsv({
                  search: search || undefined,
                  status: status === "ALL" ? undefined : status,
                  paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
                  categoryId: selectedCategoryId ?? undefined,
                })
              }
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {exporting ? t("common.exporting") : t("common.export")}
            </button>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> {t("orders.createOrder")}
            </button>
          </div>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("orders.searchPlaceholder")} />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as OrderStatus | "ALL"); setPage(1); }}
          className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? t("orders.allStatuses") : t(`status.${s}`)}</option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value as PaymentStatus | "ALL"); setPage(1); }}
          className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        >
          {PAYMENT_STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s === "ALL" ? t("orders.allPaymentStatuses") : t(`status.${s}`)}</option>
          ))}
        </select>
        {dateFilter && (
          <button
            type="button"
            onClick={clearDateFilter}
            className="flex items-center gap-1.5 rounded-full bg-royal-50 px-3 py-1.5 text-xs font-medium text-royal-700 hover:bg-royal-100"
          >
            {t("orders.filteredByDate", { date: dateFilter })} <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(o) => o.id}
        loading={isLoading}
        emptyMessage={t("common.noOrdersYet")}
        onRowClick={(o) => navigate(`/orders/${o.id}`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <CreateOrderModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
