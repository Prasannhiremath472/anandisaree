import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Pencil, Trash2, Upload, Loader2, X, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useDeleteProduct, useImportProducts, useProducts, type ImportProductsResult } from "@/admin/hooks/api/useProducts";
import type { Product } from "@/admin/types/product";

export function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportProductsResult | null>(null);
  const navigate = useNavigate();
  const importFileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useProducts({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteProduct();
  const importMutation = useImportProducts();

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Product deleted");
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete product");
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
      toast.error(err?.response?.data?.message ?? "Failed to import products");
    }
  }

  const columns: Column<Product>[] = [
    {
      header: "Product",
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
    { header: "Fabric", key: "fabric" },
    {
      header: "Price",
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
      header: "Stock",
      key: "stockQuantity",
      render: (p) => (
        <span className={p.stockQuantity <= p.lowStockThreshold ? "font-medium text-red-600" : ""}>
          {p.stockQuantity}
        </span>
      ),
    },
    {
      header: "Status",
      key: "isActive",
      render: (p) => <StatusBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} />,
    },
    {
      header: "Actions",
      key: "actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/products/${p.id}/edit`)} aria-label="Edit" className="text-neutral-500 hover:text-royal-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeletingId(p.id)} aria-label="Delete" className="text-neutral-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your saree catalog, pricing and inventory."
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
              {importMutation.isPending ? "Importing..." : "Import from Excel"}
            </button>
            <Link
              to="/products/new"
              className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </div>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, SKU or fabric..." />
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        rowKey={(p) => p.id}
        loading={isLoading}
        emptyMessage="No products yet. Add your first saree."
        onRowClick={(p) => navigate(`/products/${p.id}/edit`)}
      />

      {data && data.total > 0 && (
        <Pagination page={data.page} totalPages={data.totalPages} total={data.total} pageSize={data.pageSize} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete product?"
        description="This product will be hidden from the storefront. This action can be reversed by an administrator."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />

      <Dialog.Root open={Boolean(importResult)} onOpenChange={(open) => !open && setImportResult(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] flex max-h-[80vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <Dialog.Title className="font-heading text-base font-semibold text-neutral-800">
                Import results
              </Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Close" className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {importResult && (
              <>
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> {importResult.created} created
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <MinusCircle className="h-4 w-4" /> {importResult.skipped} skipped
                  </span>
                  <span className="flex items-center gap-1.5 text-red-700">
                    <AlertCircle className="h-4 w-4" /> {importResult.failed} failed
                  </span>
                </div>

                <div className="mt-4 flex-1 overflow-y-auto rounded-lg border border-neutral-200">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-neutral-50">
                      <tr>
                        <th className="px-3 py-2 font-medium text-neutral-600">Row</th>
                        <th className="px-3 py-2 font-medium text-neutral-600">Product</th>
                        <th className="px-3 py-2 font-medium text-neutral-600">Status</th>
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
                              <span className="text-green-700">Created</span>
                            ) : (
                              <span className={r.status === "failed" ? "text-red-700" : "text-amber-700"}>
                                {r.status === "failed" ? "Failed" : "Skipped"}
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
                  Done
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
