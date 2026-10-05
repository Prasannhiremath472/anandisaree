import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { Plus, X, Radio } from "lucide-react";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { SearchInput } from "@/admin/components/ui/SearchInput";
import { Tooltip } from "@/admin/components/ui/Tooltip";
import { useProducts, useUpdateProduct } from "@/admin/hooks/api/useProducts";
import type { Product } from "@/admin/types/product";

export function TodaysLive() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data: liveData, isLoading: liveLoading } = useProducts({
    page: 1,
    pageSize: 100,
    isLiveSpecial: true,
  });
  const liveProducts = liveData?.items ?? [];
  const liveIds = new Set(liveProducts.map((p) => p.id));

  const { data: searchData, isLoading: searchLoading } = useProducts({
    page: 1,
    pageSize: 20,
    search: search || undefined,
  });

  const updateMutation = useUpdateProduct();

  async function addToLive(product: Product) {
    try {
      await updateMutation.mutateAsync({ id: product.id, input: { isLiveSpecial: true } });
      toast.success(t("todaysLive.added", { name: product.name }));
    } catch {
      toast.error(t("todaysLive.failedToAdd"));
    }
  }

  async function removeFromLive(product: Product) {
    try {
      await updateMutation.mutateAsync({ id: product.id, input: { isLiveSpecial: false } });
      toast.success(t("todaysLive.removed", { name: product.name }));
    } catch {
      toast.error(t("todaysLive.failedToRemove"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("todaysLive.title")}
        description={t("todaysLive.description")}
        actions={
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg bg-royal-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> {t("todaysLive.addProduct")}
          </button>
        }
      />

      {pickerOpen && (
        <div className="mb-6 rounded-xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-medium text-neutral-500">{t("todaysLive.pickerHint")}</p>
          <SearchInput value={search} onChange={setSearch} placeholder={t("todaysLive.searchPlaceholder")} />

          <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-neutral-100">
            {searchLoading ? (
              <p className="p-4 text-center text-xs text-neutral-400">{t("common.loading")}</p>
            ) : !searchData?.items.length ? (
              <p className="p-4 text-center text-xs text-neutral-400">{t("todaysLive.noProductsFound")}</p>
            ) : (
              searchData.items
                .filter((p) => !liveIds.has(p.id))
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 border-b border-neutral-100 px-3 py-2 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <img
                        src={p.images[0]?.url ?? "https://placehold.co/80x100"}
                        alt={p.name}
                        className="h-9 w-7 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                        <p className="text-[11px] text-neutral-400">
                          {p.sku} &middot; ₹{Number(p.sellingPrice).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToLive(p)}
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-1 rounded-lg border border-royal-300 px-2.5 py-1 text-xs font-semibold text-royal-600 hover:bg-royal-50 disabled:opacity-60"
                    >
                      <Plus className="h-3.5 w-3.5" /> {t("todaysLive.add")}
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {liveLoading ? (
        <p className="text-neutral-400">{t("common.loading")}</p>
      ) : liveProducts.length === 0 ? (
        <p className="rounded-xl border border-black/5 bg-white py-10 text-center text-neutral-400">
          {t("todaysLive.emptyMessage")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {liveProducts.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-neutral-100">
                <img
                  src={p.images[0]?.url ?? "https://placehold.co/300x400"}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  <Radio className="h-3 w-3" /> {t("todaysLive.liveBadge")}
                </span>
                <Tooltip label={t("todaysLive.removeFromLive")} className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={() => removeFromLive(p)}
                    disabled={updateMutation.isPending}
                    aria-label={t("todaysLive.removeFromLive")}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow hover:text-red-600 disabled:opacity-60"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-medium text-neutral-800">{p.name}</p>
                <p className="mt-1 text-xs text-neutral-500">₹{Number(p.sellingPrice).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
