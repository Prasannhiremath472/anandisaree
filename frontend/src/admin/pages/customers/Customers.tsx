import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { useCustomers, type CustomerListItem } from "@/admin/hooks/api/useCustomers";

export function Customers() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useCustomers({ page, pageSize: 10, search: search || undefined });

  const columns: Column<CustomerListItem>[] = [
    {
      header: t("customers.columnCustomer"),
      key: "name",
      render: (c) => (
        <div>
          <p className="font-medium text-neutral-800">{c.name}</p>
          <p className="text-xs text-neutral-400">{c.email}</p>
        </div>
      ),
    },
    { header: t("customers.columnPhone"), key: "phone", render: (c) => c.phone ?? "—" },
    { header: t("customers.columnOrders"), key: "orders", render: (c) => c._count.orders },
    { header: t("customers.columnJoined"), key: "createdAt", render: (c) => new Date(c.createdAt).toLocaleDateString("en-IN") },
    { header: t("common.status"), key: "isActive", render: (c) => <StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} /> },
  ];

  return (
    <div>
      <PageHeader title={t("customers.title")} description={t("customers.description")} />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("customers.searchPlaceholder")} />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(c) => c.id}
        loading={isLoading}
        emptyMessage={t("customers.emptyMessage")}
        onRowClick={(c) => navigate(`/customers/${c.id}`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}
    </div>
  );
}
