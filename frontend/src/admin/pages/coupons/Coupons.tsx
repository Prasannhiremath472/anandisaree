import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useExportCsv } from "@/admin/hooks/useExportCsv";
import { useCoupons, useDeleteCoupon, type Coupon } from "@/admin/hooks/api/useCoupons";

export function Coupons() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useCoupons({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteCoupon();
  const { exportCsv, exporting } = useExportCsv("/admin/coupons/export", "coupons.csv");

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success(t("coupons.couponDeactivated"));
      setDeletingId(null);
    } catch {
      toast.error(t("coupons.failedToDeactivateCoupon"));
    }
  }

  const columns: Column<Coupon>[] = [
    {
      header: t("coupons.columnCode"),
      key: "code",
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-neutral-800">{c.code}</span>
          {c.isFestival && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-medium text-gold-700">{t("coupons.festivalBadge")}</span>}
        </div>
      ),
    },
    {
      header: t("coupons.columnDiscount"),
      key: "value",
      render: (c) => (c.type === "PERCENTAGE" ? `${c.value}%` : c.type === "FLAT" ? `₹${c.value}` : t("coupons.bogo")),
    },
    { header: t("coupons.columnMinOrder"), key: "minOrderAmount", render: (c) => (c.minOrderAmount ? `₹${c.minOrderAmount}` : "—") },
    { header: t("coupons.columnUsage"), key: "usedCount", render: (c) => `${c.usedCount}${c.usageLimit ? ` / ${c.usageLimit}` : ""}` },
    { header: t("common.status"), key: "isActive", render: (c) => <StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} /> },
    {
      header: t("common.actions"),
      key: "actions",
      render: (c) => (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/coupons/${c.id}/edit`)} aria-label={t("common.edit")} className="text-neutral-500 hover:text-royal-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeletingId(c.id)} aria-label={t("coupons.deactivateAria")} className="text-neutral-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("coupons.title")}
        description={t("coupons.description")}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => exportCsv({ search: search || undefined })}
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {exporting ? t("common.exporting") : t("common.export")}
            </button>
            <Link
              to="/coupons/new"
              className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> {t("coupons.createCoupon")}
            </Link>
          </div>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("coupons.searchPlaceholder")} />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(c) => c.id}
        loading={isLoading}
        emptyMessage={t("coupons.emptyMessage")}
        onRowClick={(c) => navigate(`/coupons/${c.id}/edit`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title={t("coupons.deactivateConfirmTitle")}
        description={t("coupons.deactivateConfirmDescription")}
        confirmLabel={t("coupons.deactivate")}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
