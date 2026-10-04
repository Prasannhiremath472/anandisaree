import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { DataTable, type Column } from "@/admin/components/ui/DataTable";
import { StatusBadge } from "@/admin/components/ui/StatusBadge";
import { Tooltip } from "@/admin/components/ui/Tooltip";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
  type CategoryFormInput,
} from "@/admin/hooks/api/useCategories";
import { ALL_PRODUCT_OPTIONAL_FIELDS, type ProductOptionalField } from "@/admin/pages/products/productFields";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500";

const emptyForm: CategoryFormInput = {
  name: "",
  group: "PAN_INDIAN",
  isActive: true,
  parentId: undefined,
  enabledFields: [...ALL_PRODUCT_OPTIONAL_FIELDS],
};

export function Categories() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();

  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [groupFilter, setGroupFilter] = useState<"MAHARASHTRIAN" | "PAN_INDIAN" | "">("");
  const [parentFilter, setParentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "">("");

  const filteredCategories = (categories ?? []).filter((c) => {
    if (groupFilter && c.group !== groupFilter) return false;
    if (parentFilter === "__top__" && c.parentId) return false;
    if (parentFilter && parentFilter !== "__top__" && c.parentId !== parentFilter) return false;
    if (statusFilter === "active" && !c.isActive) return false;
    if (statusFilter === "inactive" && c.isActive) return false;
    return true;
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      group: category.group,
      isActive: category.isActive,
      parentId: category.parentId ?? undefined,
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
        toast.success(t("categoryBar.categoryUpdated"));
      } else {
        await createMutation.mutateAsync(form);
        toast.success(t("categoryBar.categoryCreated"));
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("categoryBar.failedToSaveCategory"));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(t("categoryBar.categoryDeleted"));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("categoryBar.failedToDeleteCategory"));
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  const columns: Column<Category>[] = [
    {
      header: t("categoryBar.name"),
      key: "name",
      render: (c) => (
        <div>
          <p className="font-medium text-neutral-800">{c.name}</p>
          <p className="text-xs text-neutral-400">{c.slug}</p>
        </div>
      ),
    },
    {
      header: t("categoryBar.group"),
      key: "group",
      render: (c) => (c.group === "MAHARASHTRIAN" ? t("categoryBar.maharashtrian") : t("categoryBar.panIndian")),
    },
    {
      header: t("categoryBar.parentCategory"),
      key: "parentId",
      render: (c) =>
        c.parentId ? (
          <span className="text-neutral-600">{categories?.find((p) => p.id === c.parentId)?.name ?? "—"}</span>
        ) : (
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">{t("categoryBar.mainMenu")}</span>
        ),
    },
    {
      header: t("categories.columnProducts"),
      key: "productCount",
      render: (c) => c.productCount,
    },
    {
      header: t("common.status"),
      key: "isActive",
      render: (c) => <StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} />,
    },
    {
      header: t("common.actions"),
      key: "actions",
      stickyRight: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <Tooltip label={t("common.edit")}>
            <button onClick={() => openEdit(c)} aria-label={t("common.edit")} className="text-neutral-500 hover:text-royal-600">
              <Pencil className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label={t("common.delete")}>
            <button onClick={() => setDeleteTarget(c)} aria-label={t("common.delete")} className="text-neutral-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("categories.title")}
        description={t("categories.description")}
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> {t("categoryBar.addCategory")}
          </button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value as typeof groupFilter)}
          className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        >
          <option value="">{t("categories.allGroups")}</option>
          <option value="MAHARASHTRIAN">{t("categoryBar.maharashtrian")}</option>
          <option value="PAN_INDIAN">{t("categoryBar.panIndian")}</option>
        </select>
        <select
          value={parentFilter}
          onChange={(e) => setParentFilter(e.target.value)}
          className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        >
          <option value="">{t("categories.allCategories")}</option>
          <option value="__top__">{t("categoryBar.mainMenu")}</option>
          {categories
            ?.filter((c) => !c.parentId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {t("categories.subCategoryOf", { name: c.name })}
              </option>
            ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs focus:border-royal-500 focus:outline-none"
        >
          <option value="">{t("products.allStatuses")}</option>
          <option value="active">{t("status.ACTIVE")}</option>
          <option value="inactive">{t("status.INACTIVE")}</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={filteredCategories}
        rowKey={(c) => c.id}
        loading={isLoading}
        emptyMessage={t("categories.emptyMessage")}
      />

      <Dialog.Root open={showForm} onOpenChange={setShowForm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <Dialog.Title className="font-heading text-base font-semibold text-neutral-800">
                {editing ? t("categoryBar.editCategory") : t("categoryBar.addCategory")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button aria-label={t("common.close")} className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("categoryBar.name")}</label>
                <input
                  required
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={`mt-1 ${inputClass}`}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("categoryBar.group")}</label>
                <select
                  value={form.group}
                  onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as "MAHARASHTRIAN" | "PAN_INDIAN" }))}
                  className={`mt-1 ${inputClass}`}
                >
                  <option value="MAHARASHTRIAN">{t("categoryBar.maharashtrian")}</option>
                  <option value="PAN_INDIAN">{t("categoryBar.panIndian")}</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("categoryBar.parentCategory")}</label>
                <p className="mt-0.5 text-xs text-neutral-400">{t("categoryBar.parentCategoryHint")}</p>
                <select
                  value={form.parentId ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value || undefined }))}
                  className={`mt-1 ${inputClass}`}
                >
                  <option value="">{t("categoryBar.noneTopLevel")}</option>
                  {categories
                    ?.filter((c) => !c.parentId && c.id !== editing?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("categoryBar.productFieldsLabel")}</label>
                <p className="mt-0.5 text-xs text-neutral-400">{t("categoryBar.productFieldsHint")}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg border border-neutral-200 p-3">
                  {ALL_PRODUCT_OPTIONAL_FIELDS.map((field) => (
                    <label key={field} className="flex items-center gap-1.5 text-xs text-neutral-700">
                      <input
                        type="checkbox"
                        checked={(form.enabledFields ?? []).includes(field)}
                        onChange={() => toggleField(field)}
                        className="h-3.5 w-3.5 rounded border-neutral-300 text-royal-600"
                      />
                      {t(`productFields.${field}`)}
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
                {t("common.active")}
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
                    {t("common.cancel")}
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {saving ? t("common.saving") : editing ? t("common.saveChanges") : t("categoryBar.create")}
                </button>
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
              {t("categoryBar.deleteConfirmTitle", { name: deleteTarget?.name })}
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-neutral-500">
              {deleteTarget && deleteTarget.productCount > 0
                ? t("categoryBar.deleteConfirmWithProducts", { count: deleteTarget.productCount })
                : t("categoryBar.deleteConfirmEmpty")}
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">{t("common.cancel")}</button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMutation.isPending ? t("categoryBar.deleting") : t("common.delete")}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
