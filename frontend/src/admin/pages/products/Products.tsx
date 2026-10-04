import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Plus, Pencil, Trash2, Upload, Download, Loader2, X, CheckCircle2, AlertCircle, MinusCircle, Eye, Columns, Check } from "lucide-react";
import { useExportCsv } from "@/admin/hooks/useExportCsv";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { Tooltip } from "@/admin/components/ui/Tooltip";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import {
  useDeleteProduct,
  useImportProducts,
  useProducts,
  useUpdateProductStatus,
  type ImportProductsResult,
} from "@/admin/hooks/api/useProducts";
import { useAppSelector } from "@/admin/hooks/redux";
import type { Product, ProductStatus } from "@/admin/types/product";
import { ProductDetailModal } from "./ProductDetailModal";

const STATUS_OPTIONS: ProductStatus[] = ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"];

const STATUS_SELECT_CLASS: Record<ProductStatus, string> = {
  ACTIVE: "border-green-200 bg-green-50 text-green-700",
  INACTIVE: "border-neutral-200 bg-neutral-50 text-neutral-600",
  OUT_OF_STOCK: "border-amber-200 bg-amber-50 text-amber-700",
};

export function Products() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportProductsResult | null>(null);
  const navigate = useNavigate();
  const importFileRef = useRef<HTMLInputElement>(null);
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);

  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("products-hidden-columns");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  function toggleColumn(key: string) {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem("products-hidden-columns", JSON.stringify([...next]));
      } catch {
        // ignore storage errors (private mode, quota, etc.)
      }
      return next;
    });
  }

  const { data, isLoading } = useProducts({
    page,
    pageSize: 10,
    search: search || undefined,
    categoryId: selectedCategoryId ?? undefined,
    status: statusFilter || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId]);
  const deleteMutation = useDeleteProduct();
  const importMutation = useImportProducts();
  const updateStatusMutation = useUpdateProductStatus();
  const { exportCsv, exporting } = useExportCsv("/admin/products/export", "products.csv");

  async function handleStatusChange(id: string, status: ProductStatus) {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success(t("products.statusUpdated"));
    } catch {
      toast.error(t("products.failedToUpdateStatus"));
    }
  }

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
        <div className="flex items-center gap-2">
          <img
            src={p.images[0]?.url ?? "https://placehold.co/80x100"}
            alt={p.name}
            className="h-9 w-7 rounded object-cover"
          />
          <div>
            <p className="font-medium text-neutral-800">{p.name}</p>
            <p className="text-[11px] text-neutral-400">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { header: t("products.columnFabric"), key: "fabric" },
    {
      header: t("products.columnVariants"),
      key: "variants",
      render: (p) => {
        const variants = p.variants ?? [];
        const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
        const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
        if (sizes.length === 0 && colors.length === 0) {
          return <span className="text-xs text-neutral-400">—</span>;
        }
        return (
          <div className="flex flex-col gap-1 text-xs">
            {sizes.length > 0 && (
              <span className="text-neutral-600">{t("products.sizesCount", { count: sizes.length })}</span>
            )}
            {colors.length > 0 && (
              <span className="text-neutral-600">{t("products.colorsCount", { count: colors.length })}</span>
            )}
          </div>
        );
      },
    },
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
      key: "status",
      render: (p) => (
        <select
          value={p.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusChange(p.id, e.target.value as ProductStatus)}
          className={`rounded-lg border px-2 py-1 text-xs font-medium focus:outline-none ${STATUS_SELECT_CLASS[p.status]}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
      ),
    },
    {
      header: t("common.actions"),
      key: "actions",
      stickyRight: true,
      render: (p) => (
        <div className="flex items-center gap-2.5">
          <Tooltip label={t("common.view")}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDetailProductId(p.id);
              }}
              aria-label={t("common.view")}
              className="text-neutral-500 hover:text-royal-600"
            >
              <Eye className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label={t("common.edit")}>
            <button onClick={() => navigate(`/products/${p.id}/edit`)} aria-label={t("common.edit")} className="text-neutral-500 hover:text-royal-600">
              <Pencil className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label={t("common.delete")}>
            <button onClick={() => setDeletingId(p.id)} aria-label={t("common.delete")} className="text-neutral-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const TOGGLEABLE_COLUMNS: { key: string; label: string }[] = [
    { key: "fabric", label: t("products.columnFabric") },
    { key: "variants", label: t("products.columnVariants") },
    { key: "sellingPrice", label: t("products.columnPrice") },
    { key: "stockQuantity", label: t("products.columnStock") },
    { key: "status", label: t("common.status") },
  ];

  const visibleColumns = columns.filter((c) => !hiddenColumns.has(c.key));

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
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              {importMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {importMutation.isPending ? t("products.importing") : t("products.importFromExcel")}
            </button>
            <button
              type="button"
              onClick={() =>
                exportCsv({
                  search: search || undefined,
                  categoryId: selectedCategoryId ?? undefined,
                  status: statusFilter || undefined,
                  minPrice: minPrice ? Number(minPrice) : undefined,
                  maxPrice: maxPrice ? Number(maxPrice) : undefined,
                })
              }
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {exporting ? t("common.exporting") : t("common.export")}
            </button>
            <Link
              to="/products/trash"
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <Trash2 className="h-4 w-4" /> {t("products.trash")}
            </Link>
            <Link
              to="/products/new"
              className="flex items-center gap-2 rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> {t("products.addProduct")}
            </Link>
          </div>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={t("products.searchPlaceholder")} />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as ProductStatus | ""); setPage(1); }}
          className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        >
          <option value="">{t("products.allStatuses")}</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
          placeholder={t("products.minPrice")}
          className="w-24 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        />
        <input
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
          placeholder={t("products.maxPrice")}
          className="w-24 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        />

        <DropdownMenu.Root open={columnMenuOpen} onOpenChange={setColumnMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Columns className="h-3.5 w-3.5" /> {t("products.columns")}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={6}
              className="z-50 w-56 rounded-xl border border-black/5 bg-white p-2 shadow-xl"
            >
              <p className="px-2 py-1 text-xs font-medium text-neutral-400">{t("products.toggleColumnsHint")}</p>
              {TOGGLEABLE_COLUMNS.map((col) => (
                <DropdownMenu.CheckboxItem
                  key={col.key}
                  checked={!hiddenColumns.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                  onSelect={(e) => e.preventDefault()}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-neutral-700 outline-none hover:bg-neutral-50"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      hiddenColumns.has(col.key) ? "border-neutral-300" : "border-royal-600 bg-royal-600 text-white"
                    }`}
                  >
                    {!hiddenColumns.has(col.key) && <Check className="h-3 w-3" />}
                  </span>
                  {col.label}
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <DataTable
        columns={visibleColumns}
        rows={data?.items ?? []}
        rowKey={(p) => p.id}
        loading={isLoading}
        emptyMessage={t("products.emptyMessage")}
        onRowClick={(p) => setDetailProductId(p.id)}
      />

      <ProductDetailModal productId={detailProductId} onOpenChange={(open) => !open && setDetailProductId(null)} />

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
                <button className="rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
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
