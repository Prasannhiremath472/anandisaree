import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/admin/components/ui/Modal";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { SearchableSelect } from "@/admin/components/ui/SearchableSelect";
import { useCustomers, useCustomer } from "@/admin/hooks/api/useCustomers";
import { useProducts } from "@/admin/hooks/api/useProducts";
import { useCreateOrder, type CreateOrderInput } from "@/admin/hooks/api/useOrders";

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LineItem {
  key: string;
  productId: string;
  variantId?: string;
  quantity: number;
}

const PAYMENT_METHODS: CreateOrderInput["paymentMethod"][] = ["COD", "RAZORPAY", "UPI", "CARD", "NETBANKING", "WALLET"];

export function CreateOrderModal({ open, onOpenChange }: CreateOrderModalProps) {
  const { t } = useTranslation();
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPincode, setNewPincode] = useState("");

  const [items, setItems] = useState<LineItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<CreateOrderInput["paymentMethod"]>("COD");
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID">("PENDING");

  const { data: customerResults } = useCustomers({ page: 1, pageSize: 20, search: customerSearch || undefined });
  const { data: selectedCustomer } = useCustomer(selectedCustomerId || null);
  const { data: productResults } = useProducts({ page: 1, pageSize: 100 });
  const createMutation = useCreateOrder();

  const products = productResults?.items ?? [];

  function addLineItem() {
    setItems((prev) => [...prev, { key: crypto.randomUUID(), productId: "", quantity: 1 }]);
  }

  function updateLineItem(key: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function removeLineItem(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  const total = useMemo(() => {
    let sum = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      const variant = product.variants.find((v) => v.id === item.variantId);
      const unitPrice = Number(product.sellingPrice) + (variant ? Number(variant.priceDelta) : 0);
      sum += unitPrice * item.quantity;
    }
    return sum;
  }, [items, products]);

  function resetForm() {
    setCustomerMode("existing");
    setCustomerSearch("");
    setSelectedCustomerId("");
    setSelectedAddressId("");
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewLine1("");
    setNewLine2("");
    setNewCity("");
    setNewState("");
    setNewPincode("");
    setItems([]);
    setPaymentMethod("COD");
    setPaymentStatus("PENDING");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0 || items.some((i) => !i.productId)) {
      toast.error(t("createOrder.addAtLeastOneItem"));
      return;
    }

    const payload: CreateOrderInput = {
      paymentMethod,
      paymentStatus,
      items: items.map((i) => ({ productId: i.productId, variantId: i.variantId || undefined, quantity: i.quantity })),
    };

    if (customerMode === "existing") {
      if (!selectedCustomerId || !selectedAddressId) {
        toast.error(t("createOrder.selectCustomerAndAddress"));
        return;
      }
      payload.userId = selectedCustomerId;
      payload.addressId = selectedAddressId;
    } else {
      if (!newName || !newPhone || !newLine1 || !newCity || !newState || !newPincode) {
        toast.error(t("createOrder.fillCustomerDetails"));
        return;
      }
      payload.newCustomer = {
        name: newName,
        phone: newPhone,
        email: newEmail || undefined,
        address: {
          fullName: newName,
          phone: newPhone,
          line1: newLine1,
          line2: newLine2 || undefined,
          city: newCity,
          state: newState,
          pincode: newPincode,
        },
      };
    }

    try {
      await createMutation.mutateAsync(payload);
      toast.success(t("createOrder.orderCreated"));
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("createOrder.failedToCreateOrder"));
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={t("createOrder.title")} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setCustomerMode("existing")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${customerMode === "existing" ? "bg-royal-gradient text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              {t("createOrder.existingCustomer")}
            </button>
            <button
              type="button"
              onClick={() => setCustomerMode("new")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${customerMode === "new" ? "bg-royal-gradient text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              {t("createOrder.newCustomer")}
            </button>
          </div>

          {customerMode === "existing" ? (
            <div className="space-y-3">
              <Field label={t("createOrder.customer")}>
                <SearchableSelect
                  value={selectedCustomerId}
                  onChange={(id) => {
                    setSelectedCustomerId(id);
                    setSelectedAddressId("");
                  }}
                  placeholder={t("createOrder.searchCustomerPlaceholder")}
                  options={(customerResults?.items ?? []).map((c) => ({
                    value: c.id,
                    label: `${c.name} — ${c.phone ?? c.email}`,
                  }))}
                />
              </Field>
              {selectedCustomer && (
                <Field label={t("createOrder.deliveryAddress")}>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">{t("createOrder.selectAddress")}</option>
                    {selectedCustomer.addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.line1}, {a.city}, {a.state} {a.pincode}
                      </option>
                    ))}
                  </select>
                  {selectedCustomer.addresses.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600">{t("createOrder.noAddressesOnFile")}</p>
                  )}
                </Field>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("createOrder.customerName")} required>
                <input required value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("login.mobileNumber")} required>
                <input required value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("login.email")}>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("createOrder.pincode")} required>
                <input required value={newPincode} onChange={(e) => setNewPincode(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("createOrder.addressLine1")} required className="col-span-2">
                <input required value={newLine1} onChange={(e) => setNewLine1(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("createOrder.addressLine2")} className="col-span-2">
                <input value={newLine2} onChange={(e) => setNewLine2(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("createOrder.city")} required>
                <input required value={newCity} onChange={(e) => setNewCity(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t("createOrder.state")} required>
                <input required value={newState} onChange={(e) => setNewState(e.target.value)} className={inputClass} />
              </Field>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700">{t("createOrder.items")}</label>
            <button type="button" onClick={addLineItem} className="flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700">
              <Plus className="h-3.5 w-3.5" /> {t("createOrder.addItem")}
            </button>
          </div>

          {items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-neutral-300 py-6 text-center text-sm text-neutral-400">
              {t("createOrder.noItemsYet")}
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div key={item.key} className="flex items-end gap-2 rounded-lg border border-neutral-200 p-3">
                    <div className="flex-1">
                      <SearchableSelect
                        value={item.productId}
                        onChange={(productId) => updateLineItem(item.key, { productId, variantId: undefined })}
                        placeholder={t("createOrder.selectProduct")}
                        options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))}
                      />
                    </div>
                    {product && product.variants.length > 0 && (
                      <div className="w-40">
                        <select
                          value={item.variantId ?? ""}
                          onChange={(e) => updateLineItem(item.key, { variantId: e.target.value || undefined })}
                          className={inputClass}
                        >
                          <option value="">{t("createOrder.noVariant")}</option>
                          {product.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {[v.color, v.size].filter(Boolean).join(" / ") || v.sku}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="w-20">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.key, { quantity: Math.max(1, Number(e.target.value)) })}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.key)}
                      aria-label={t("common.remove")}
                      className="shrink-0 rounded-lg p-2 text-neutral-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label={t("orders.columnPayment")}>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as CreateOrderInput["paymentMethod"])} className={inputClass}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("common.status")}>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as "PENDING" | "PAID")} className={inputClass}>
              <option value="PENDING">{t("status.PENDING")}</option>
              <option value="PAID">{t("status.PAID")}</option>
            </select>
          </Field>
          <Field label={t("orders.columnTotal")}>
            <input disabled value={`₹${total.toLocaleString("en-IN")}`} className={`${inputClass} cursor-not-allowed bg-neutral-50 text-neutral-500`} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-neutral-200 pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
          >
            {createMutation.isPending ? t("common.saving") : t("createOrder.createOrder")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
