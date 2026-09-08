import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Pencil, Trash2, Upload, Loader2, X, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useDeleteProduct, useImportProducts, useProducts, type ImportProductsResult } from "@/admin/hooks/api/useProducts";
import { useAppSelector } from "@/admin/hooks/redux";
import type { Product } from "@/admin/types/product";

export function Products() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportProductsResult | null>(null);
  const navigate = useNavigate();
  const importFileRef = useRef<HTMLInputElement>(null);
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);

  const { data, isLoading } = useProducts({
    page,
    pageSize: 10,
    search: search || undefined,
    categoryId: selectedCategoryId ?? undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);
  const deleteMutation = useDeleteProduct();
  const importMutation = useImportProducts();

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success(t("products.productDeleted"));
      setDeletingId(null);
    } catch {
      toast.error(t("products.failedToDeleteProduct"));
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const result = await importMutation.mutateAsync(file);
      setImportResult(result);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("products.failedToImportProducts"));
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
      header: t("products.columnPrice"),
      key: "sellingPrice",
      render: (p) => (
        <div>
          <p className="font-medium">₹{Number(p.sellingPrice).toLocaleString("en-IN")}</p>
          {Number(p.mrp) > Number(p.sellingPrice) && (
            <p className="text-xs text-neutral-400 line-through">₹{Number(p.mrp).toLocaleString("en-IN")}</p>
          )}
        </div>
      ),
    },
    {
      header: t("products.columnStock"),
      key: "stockQuantity",
      render: (p) => (
        <span className={p.stockQuantity <= p.lowStockThreshold ? "font-medium text-red-600" : ""}>
          {p.stockQuantity}
        </span>
      ),
    },
    {
      header: t("common.status"),
      key: "isActive",
      render: (p) => <StatusBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} />,
    },
    {
      header: t("common.actions"),
      key: "actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/products/${p.id}/edit`)} aria-label={t("common.edit")} className="text-neutral-500 hover:text-royal-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeletingId(p.id)} aria-label={t("common.delete")} className="text-neutral-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("products.title")}
        description={t("products.description")}
        actions={
          <div className="flex items-center gap-3">
            <input
              ref={importFileRef}
              type="file"
              accept=".xlsx"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => importFileRef.current?.click()}
              disabled={importMutation.isPending}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              {importMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {importMutation.isPending ? t("products.importing") : t("products.importFromExcel")}
            </button>
            <Link
              to="/products/new"
              className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> {t("products.addProduct")}
            </Link>
          </div>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("products.searchPlaceholder")} />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(p) => p.id}
        loading={isLoading}
        emptyMessage={t("products.emptyMessage")}
        onRowClick={(p) => navigate(`/products/${p.id}/edit`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title={t("products.deleteConfirmTitle")}
        description={t("products.deleteConfirmDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />

      <Dialog.Root open={Boolean(importResult)} onOpenChange={(open) => !open && setImportResult(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] flex max-h-[80vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <Dialog.Title className="font-heading text-base font-semibold text-neutral-800">
                {t("products.importResults")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label={t("common.close")} className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {importResult && (
              <>
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> {t("products.createdCount", { count: importResult.created })}
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <MinusCircle className="h-4 w-4" /> {t("products.skippedCount", { count: importResult.skipped })}
                  </span>
                  <span className="flex items-center gap-1.5 text-red-700">
                    <AlertCircle className="h-4 w-4" /> {t("products.failedCount", { count: importResult.failed })}
                  </span>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto rounded-lg border border-neutral-200">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-neutral-50">
                      <tr>
                        <th className="px-3 py-2 font-medium text-neutral-600">{t("products.columnRow")}</th>
                        <th className="px-3 py-2 font-medium text-neutral-600">{t("products.columnProduct")}</th>
                        <th className="px-3 py-2 font-medium text-neutral-600">{t("common.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importResult.results.map((r) => (
                        <tr key={r.row} className="border-t border-neutral-100">
                          <td className="px-3 py-2 text-neutral-500">{r.row}</td>
                          <td className="px-3 py-2">
                            <p className="text-neutral-800">{r.name || "—"}</p>
                            <p className="text-xs text-neutral-400">{r.sku}</p>
                          </td>
                          <td className="px-3 py-2">
                            {r.status === "created" ? (
                              <span className="text-green-700">{t("products.created")}</span>
                            ) : (
                              <span className={r.status === "failed" ? "text-red-700" : "text-amber-700"}>
                                {r.status === "failed" ? t("products.failed") : t("products.skipped")}
                                {r.message ? `: ${r.message}` : ""}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="mt-4 flex justify-end">
              <Dialog.Close asChild>
                <button className="rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  {t("common.done")}
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
