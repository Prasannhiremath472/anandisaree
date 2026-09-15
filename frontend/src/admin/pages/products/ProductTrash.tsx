import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RotateCcw, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import {
  usePermanentlyDeleteProduct,
  useRestoreProduct,
  useTrashedProducts,
} from "@/admin/hooks/api/useProducts";
import type { Product } from "@/admin/types/product";

export function ProductTrash() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useTrashedProducts({ page, pageSize: 10, search: search || undefined });
  const restoreMutation = useRestoreProduct();
  const permanentDeleteMutation = usePermanentlyDeleteProduct();

  async function handleRestore(id: string) {
    try {
      await restoreMutation.mutateAsync(id);
      toast.success(t("productTrash.productRestored"));
    } catch {
      toast.error(t("productTrash.failedToRestore"));
    }
  }

  async function confirmPermanentDelete() {
    if (!deletingId) return;
    try {
      await permanentDeleteMutation.mutateAsync(deletingId);
      toast.success(t("productTrash.productPermanentlyDeleted"));
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("productTrash.failedToPermanentlyDelete"));
    }
  }

  const columns: Column<Product>[] = [
    {
      header: t("products.columnProduct"),
      key: "name",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.images[0]?.url ?? "https://placehold.co/80x100"}
            alt={p.name}
            className="h-12 w-10 rounded object-cover"
          />
          <div>
            <p className="font-medium text-neutral-800">{p.name}</p>
            <p className="text-xs text-neutral-400">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { header: t("products.columnFabric"), key: "fabric" },
    {
      header: t("common.actions"),
      key: "actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRestore(p.id)}
            className="flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700"
          >
            <RotateCcw className="h-3.5 w-3.5" /> {t("productTrash.restore")}
          </button>
          <button
            onClick={() => setDeletingId(p.id)}
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t("productTrash.deletePermanently")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <BackLink to="/products" label={t("productTrash.backToProducts")} />
      <PageHeader title={t("productTrash.title")} description={t("productTrash.description")} />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("products.searchPlaceholder")} />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(p) => p.id}
        loading={isLoading}
        emptyMessage={t("productTrash.emptyMessage")}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title={t("productTrash.deleteConfirmTitle")}
        description={t("productTrash.deleteConfirmDescription")}
        confirmLabel={t("productTrash.deletePermanently")}
        onConfirm={confirmPermanentDelete}
        loading={permanentDeleteMutation.isPending}
      />
    </div>
  );
}
