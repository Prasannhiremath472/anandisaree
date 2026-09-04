import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/admin/hooks/redux";
import { setSelectedCategory } from "@/admin/store/categorySlice";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
  type CategoryFormInput,
} from "@/admin/hooks/api/useCategories";
import { PRODUCT_OPTIONAL_FIELDS, ALL_PRODUCT_OPTIONAL_FIELDS, type ProductOptionalField } from "@/admin/pages/products/productFields";
import { cn } from "@/admin/utils";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500";

const emptyForm: CategoryFormInput = {
  name: "",
  group: "PAN_INDIAN",
  isActive: true,
  enabledFields: [...ALL_PRODUCT_OPTIONAL_FIELDS],
};

export function CategoryBar() {
  const { data: categories, isLoading } = useCategories();
  const selectedCategoryId = useAppSelector((s) => s.category.selectedCategoryId);
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(category: Category, e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      group: category.group,
      isActive: category.isActive,
      enabledFields: category.enabledFields?.length ? category.enabledFields : [...ALL_PRODUCT_OPTIONAL_FIELDS],
    });
    setShowForm(true);
  }

  function toggleField(field: ProductOptionalField) {
    setForm((f) => {
      const current = f.enabledFields ?? [];
      const next = current.includes(field) ? current.filter((x) => x !== field) : [...current, field];
      return { ...f, enabledFields: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: form });
        toast.success("Category updated");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Category created");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save category");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      if (selectedCategoryId === deleteTarget.id) {
        dispatch(setSelectedCategory(null));
      }
      toast.success("Category deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete category");
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;
  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);
  const currentLabel = selectedCategory?.name ?? "All Categories";

  return (
    <div className="shrink-0 border-b border-black/5 bg-white px-6 pt-3">
      <p className="mb-2 text-xs text-neutral-400">
        Currently viewing: <span className="font-semibold text-royal-700">{currentLabel}</span>
      </p>

      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => dispatch(setSelectedCategory(null))}
          className={cn(
            "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            selectedCategoryId === null
              ? "border-royal-600 text-royal-700"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          )}
        >
          All Categories
        </button>

        {isLoading ? (
          <span className="px-4 py-2.5 text-xs text-neutral-400">Loading categories...</span>
        ) : (
          categories?.map((category) => (
            <div
              key={category.id}
              className={cn(
                "group flex shrink-0 items-center gap-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                selectedCategoryId === category.id
                  ? "border-royal-600 text-royal-700"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              )}
            >
              <button type="button" onClick={() => dispatch(setSelectedCategory(category.id))}>
                {category.name}
                {category.productCount > 0 && (
                  <span className="ml-1 text-xs text-neutral-400">({category.productCount})</span>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => openEdit(category, e)}
                aria-label={`Edit ${category.name}`}
                className="rounded p-0.5 text-neutral-300 opacity-0 transition-opacity hover:text-royal-600 group-hover:opacity-100"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={openAdd}
          aria-label="Add category"
          className="ml-1 flex shrink-0 items-center justify-center rounded-full p-1.5 text-neutral-400 hover:bg-royal-50 hover:text-royal-600"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Dialog.Root open={showForm} onOpenChange={setShowForm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <Dialog.Title className="font-heading text-base font-semibold text-neutral-800">
                {editing ? "Edit Category" : "Add Category"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label="Close" className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Name</label>
                <input
                  required
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Group</label>
                <select
                  value={form.group}
                  onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as "MAHARASHTRIAN" | "PAN_INDIAN" }))}
                  className={`mt-1 ${inputClass}`}
                >
                  <option value="MAHARASHTRIAN">Maharashtrian</option>
                  <option value="PAN_INDIAN">Pan-Indian</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Product fields for this category</label>
                <p className="mt-0.5 text-xs text-neutral-400">
                  Only checked fields show by default when adding a product in this category. Admins can still add an
                  unchecked field to one specific product if needed.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg border border-neutral-200 p-3">
                  {ALL_PRODUCT_OPTIONAL_FIELDS.map((field) => (
                    <label key={field} className="flex items-center gap-1.5 text-xs text-neutral-700">
                      <input
                        type="checkbox"
                        checked={(form.enabledFields ?? []).includes(field)}
                        onChange={() => toggleField(field)}
                        className="h-3.5 w-3.5 rounded border-neutral-300 text-royal-600"
                      />
                      {PRODUCT_OPTIONAL_FIELDS[field]}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.isActive ?? true}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-300 text-royal-600"
                />
                Active
              </label>

              <div className="flex items-center justify-between pt-2">
                {editing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteTarget(editing);
                      setShowForm(false);
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Dialog.Close asChild>
                    <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-royal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl">
            <Dialog.Title className="font-heading text-base font-semibold text-neutral-800">
              Delete "{deleteTarget?.name}"?
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-neutral-500">
              {deleteTarget && deleteTarget.productCount > 0
                ? `This category has ${deleteTarget.productCount} product(s) linked to it. They will keep their other categories, but lose this one.`
                : "This category will be hidden from the storefront."}
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
