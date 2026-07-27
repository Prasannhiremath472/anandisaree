import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Heart, LogOut, MapPin, Package, Tag, User, Wallet } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearAuth } from "@/store/authSlice";
import { apiClient } from "@/api/client";
import toast from "react-hot-toast";

interface ClaimedCoupon {
  id: string;
  isUsed: boolean;
  claimedAt: string;
  coupon: {
    code: string;
    type: "PERCENTAGE" | "FLAT" | "BOGO";
    value: string;
    minOrderAmount: string | null;
    expiresAt: string | null;
  };
}

interface MyOrderItem {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: string;
}

interface MyOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
  items: MyOrderItem[];
}

const MENU_ITEMS = [
  { label: "My Orders", icon: Package, to: "/account" },
  { label: "Wishlist", icon: Heart, to: "/wishlist" },
  { label: "Addresses", icon: MapPin, to: "/account" },
  { label: "Wallet", icon: Wallet, to: "/account" },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-neutral-200 text-neutral-600",
  RETURNED: "bg-neutral-200 text-neutral-600",
  REFUNDED: "bg-neutral-200 text-neutral-600",
};

export function Account() {
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [coupons, setCoupons] = useState<ClaimedCoupon[]>([]);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    apiClient
      .get("/coupons/mine")
      .then((res) => setCoupons(res.data.data))
      .catch(() => {});
    apiClient
      .get("/checkout/orders/mine")
      .then((res) => setOrders(res.data.data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [accessToken]);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore - clear local state regardless
    }
    dispatch(clearAuth());
    toast.success("Signed out successfully");
  }

  return (
    <div className="mx-auto max-w-4xl px-ds-6 py-12 lg:px-ds-8">
      <div className="flex items-center gap-ds-6 rounded-xl2 bg-royal-gradient p-ds-7 text-white shadow-soft">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl">{user.name}</h1>
          <p className="text-ds-sm text-cream-200">{user.email}</p>
        </div>
      </div>

      <div className="mt-ds-8 grid grid-cols-2 gap-ds-6 sm:grid-cols-4">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center gap-ds-2 rounded-xl2 border border-royal-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-soft"
          >
            <item.icon className="h-6 w-6 text-royal-600" />
            <span className="text-ds-sm font-medium text-charcoal">{item.label}</span>
          </Link>
        ))}
      </div>

      {coupons.length > 0 && (
        <div className="mt-ds-8 rounded-xl2 border border-royal-100 bg-white p-ds-7">
          <h2 className="flex items-center gap-ds-2 font-heading text-ds-md font-semibold text-charcoal">
            <Tag className="h-5 w-5 text-royal-600" /> My Coupons
          </h2>
          <div className="mt-ds-6 grid grid-cols-1 gap-ds-4 sm:grid-cols-2">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-dashed border-gold-400 bg-gold-50 px-ds-6 py-ds-4"
              >
                <div>
                  <p className="font-mono text-ds-sm font-bold text-royal-700">{c.coupon.code}</p>
                  <p className="text-ds-xs text-charcoal/60">
                    {c.coupon.type === "PERCENTAGE"
                      ? `${c.coupon.value}% off`
                      : c.coupon.type === "FLAT"
                        ? `₹${c.coupon.value} off`
                        : "Buy One Get One"}
                    {c.coupon.minOrderAmount ? ` on orders above ₹${c.coupon.minOrderAmount}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    c.isUsed ? "bg-neutral-200 text-neutral-600" : "bg-green-100 text-green-700"
                  }`}
                >
                  {c.isUsed ? "Used" : "Available"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-ds-8 rounded-xl2 border border-royal-100 bg-white p-ds-7">
        <h2 className="flex items-center gap-ds-2 font-heading text-ds-md font-semibold text-charcoal">
          <Package className="h-5 w-5 text-royal-600" /> My Orders
        </h2>

        {ordersLoading ? (
          <p className="mt-ds-6 text-center text-ds-sm text-charcoal/60">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="mt-ds-6 text-center">
            <User className="mx-auto h-8 w-8 text-royal-300" />
            <p className="mt-ds-4 text-ds-sm text-charcoal/70">You have no orders yet. Start exploring our collections.</p>
            <Link
              to="/products"
              className="mt-ds-6 inline-block rounded-full bg-royal-600 px-ds-7 py-ds-2 text-ds-sm font-semibold text-white hover:bg-royal-700"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="mt-ds-6 space-y-ds-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border border-royal-100 p-ds-5">
                <div className="flex flex-wrap items-center justify-between gap-ds-2">
                  <div>
                    <p className="font-heading text-ds-sm font-semibold text-charcoal">{order.orderNumber}</p>
                    <p className="text-ds-xs text-charcoal/50">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      STATUS_STYLES[order.status] ?? "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-ds-4 space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-ds-sm text-charcoal/80">
                      {item.productName} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="mt-ds-4 flex items-center justify-between border-t border-royal-50 pt-ds-3">
                  <span className="text-ds-xs text-charcoal/50">
                    Payment: {order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus}
                  </span>
                  <span className="font-heading text-ds-sm font-semibold text-royal-700">
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-ds-8 flex items-center gap-ds-2 text-ds-sm font-medium text-charcoal/60 hover:text-royal-600"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
