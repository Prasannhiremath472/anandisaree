import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "@/admin/components/ui/PageHeader";
import { BackLink } from "@/admin/components/ui/BackLink";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { useCoupon, useCreateCoupon, useUpdateCoupon } from "@/admin/hooks/api/useCoupons";

const emptyForm = {
  code: "",
  type: "PERCENTAGE" as const,
  value: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  isFestival: false,
  isActive: true,
};

export function CouponForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: coupon, isLoading } = useCoupon(id ?? null);
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code,
        type: coupon.type as "PERCENTAGE",
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount ?? "",
        maxDiscount: coupon.maxDiscount ?? "",
        usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
        isFestival: coupon.isFestival,
        isActive: coupon.isActive,
      });
    }
  }, [coupon]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      isFestival: form.isFestival,
      isActive: form.isActive,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, input: payload });
        toast.success("Coupon updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Coupon created");
      }
      navigate("/coupons");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save coupon");
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoading) {
    return <p className="text-neutral-400">Loading coupon...</p>;
  }

  return (
    <div>
      <BackLink to="/coupons" label="Back to Coupons" />
      <PageHeader title={isEdit ? "Edit Coupon" : "Create Coupon"} description={isEdit ? form.code : "Set up a new discount code."} />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-black/5 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Coupon Code" required>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="FESTIVE20"
              className={inputClass}
            />
          </Field>
          <Field label="Type" required>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as never })} className={inputClass}>
              <option value="PERCENTAGE">Percentage Off</option>
              <option value="FLAT">Flat Amount Off</option>
              <option value="BOGO">Buy One Get One</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label={form.type === "PERCENTAGE" ? "Discount (%)" : "Discount (₹)"} required>
            <input required type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Max Discount (₹)">
            <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Minimum Order (₹)">
            <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Usage Limit">
            <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className={inputClass} placeholder="Unlimited" />
          </Field>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={form.isFestival} onChange={(e) => setForm({ ...form, isFestival: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
            Festival Offer
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 text-royal-600" />
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/coupons")} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
