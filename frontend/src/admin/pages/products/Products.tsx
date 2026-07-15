import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { Pagination } from "@/admin/components/ui/Pagination";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { ConfirmDialog } from "@/admin/components/ui/ConfirmDialog";
import { useDeleteProduct, useProducts } from "@/admin/hooks/api/useProducts";
import type { Product } from "@/admin/types/product";

export function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useProducts({ page, pageSize: 10, search: search || undefined });
  const deleteMutation = useDeleteProduct();

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
          <Link
            to="/products/new"
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
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
    </div>
  );
}
