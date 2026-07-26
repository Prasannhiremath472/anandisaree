import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "@/api/client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearCart } from "@/store/cartSlice";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function Checkout() {
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!accessToken) return;
    apiClient
      .get<{ data: Address[] }>("/checkout/addresses")
      .then((res) => {
        setAddresses(res.data.data);
        const def = res.data.data.find((a) => a.isDefault) ?? res.data.data[0];
        if (def) setSelectedAddressId(def.id);
        else setShowNewAddressForm(true);
      })
      .catch(() => setShowNewAddressForm(true));
  }, [accessToken]);

  if (!accessToken) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-ds-6 py-16 text-center">
        <p className="text-ds-sm text-charcoal/60">Your bag is empty. Add something you love first.</p>
      </div>
    );
  }

  async function saveNewAddress(): Promise<string | null> {
    try {
      const res = await apiClient.post<{ data: Address }>("/checkout/addresses", {
        ...form,
        isDefault: addresses.length === 0,
      });
      const created = res.data.data;
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      return created.id;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not save address");
      return null;
    }
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      let addressId = selectedAddressId;
      if (showNewAddressForm || !addressId) {
        addressId = await saveNewAddress();
        if (!addressId) {
          setPlacing(false);
          return;
        }
      }

      const orderPayload = {
        addressId,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const { data } = await apiClient.post("/checkout/orders", orderPayload);
      const order = data.data;

      if (paymentMethod === "COD") {
        dispatch(clearCart());
        toast.success("Order placed! We'll call to confirm delivery.");
        navigate(`/account`);
        return;
      }

      const keyRes = await apiClient.get<{ data: { keyId: string } }>("/checkout/razorpay-key");
      const razorpay = new window.Razorpay({
        key: keyRes.data.data.keyId,
        amount: order.razorpayOrder.amount,
        currency: order.razorpayOrder.currency,
        name: "Anandi Sarees",
        description: `Order ${order.orderNumber}`,
        order_id: order.razorpayOrder.id,
        prefill: {
          name: form.fullName || user?.name,
          contact: form.phone,
          email: user?.email,
        },
        theme: { color: "#54208C" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await apiClient.post("/checkout/orders/verify-payment", {
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            dispatch(clearCart());
            toast.success("Payment successful! Your order is confirmed.");
            navigate("/account");
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });
      razorpay.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not place order. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-ds-6 py-12 lg:px-ds-8">
      <h1 className="font-display text-2xl text-gradient-royal sm:text-3xl">Checkout</h1>

      <div className="mt-ds-8 grid grid-cols-1 gap-ds-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-heading text-ds-md font-semibold text-charcoal">Delivery Address</h2>

          {addresses.length > 0 && !showNewAddressForm && (
            <div className="mt-ds-4 space-y-ds-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block cursor-pointer rounded-lg border p-ds-4 text-ds-sm transition-colors ${
                    selectedAddressId === addr.id ? "border-royal-600 bg-royal-50" : "border-charcoal/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="sr-only"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <p className="font-medium text-charcoal">
                    {addr.fullName} · {addr.phone}
                  </p>
                  <p className="text-charcoal/70">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                    {addr.landmark ? `, ${addr.landmark}` : ""}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </label>
              ))}
              <button
                onClick={() => setShowNewAddressForm(true)}
                className="text-ds-sm font-medium text-royal-600 hover:text-royal-500"
              >
                + Add a new address
              </button>
            </div>
          )}

          {showNewAddressForm && (
            <div className="mt-ds-4 space-y-ds-4 rounded-lg border border-charcoal/15 p-ds-6">
              <div className="grid grid-cols-2 gap-ds-4">
                <input
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
                />
                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
                />
              </div>
              <input
                placeholder="Address line 1"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                className="w-full rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
              />
              <input
                placeholder="Address line 2 (optional)"
                value={form.line2}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                className="w-full rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
              />
              <input
                placeholder="Landmark (optional)"
                value={form.landmark}
                onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
                className="w-full rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
              />
              <div className="grid grid-cols-3 gap-ds-4">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
                />
                <input
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  className="rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
                />
                <input
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                  className="rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
                />
              </div>
              {addresses.length > 0 && (
                <button
                  onClick={() => setShowNewAddressForm(false)}
                  className="text-ds-sm font-medium text-charcoal/60 hover:text-charcoal"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          <h2 className="mt-ds-8 font-heading text-ds-md font-semibold text-charcoal">Payment Method</h2>
          <div className="mt-ds-4 space-y-ds-3">
            <label
              className={`flex items-center gap-ds-3 rounded-lg border p-ds-4 text-ds-sm cursor-pointer ${
                paymentMethod === "RAZORPAY" ? "border-royal-600 bg-royal-50" : "border-charcoal/15"
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />
              Pay Online (Card / UPI / Netbanking)
            </label>
            <label
              className={`flex items-center gap-ds-3 rounded-lg border p-ds-4 text-ds-sm cursor-pointer ${
                paymentMethod === "COD" ? "border-royal-600 bg-royal-50" : "border-charcoal/15"
              }`}
            >
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              Cash on Delivery
            </label>
          </div>
        </div>

        <div className="rounded-xl2 border border-gold-200/60 bg-white p-ds-6 shadow-soft">
          <h2 className="font-heading text-ds-md font-semibold text-charcoal">Order Summary</h2>
          <div className="mt-ds-4 space-y-ds-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? "base"}`} className="flex justify-between text-ds-sm">
                <span className="text-charcoal/80">
                  {item.name} {item.size ? `(${item.size})` : ""} × {item.quantity}
                </span>
                <span className="font-medium text-charcoal">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-ds-4 flex justify-between border-t border-charcoal/10 pt-ds-4 font-heading text-ds-md font-semibold text-royal-700">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="mt-ds-6 w-full rounded-full bg-royal-gradient py-ds-4 font-heading text-ds-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {placing ? "Placing Order..." : paymentMethod === "COD" ? "Place Order" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
