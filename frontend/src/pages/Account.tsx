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

const MENU_ITEMS = [
  { label: "My Orders", icon: Package, to: "/account" },
  { label: "Wishlist", icon: Heart, to: "/wishlist" },
  { label: "Addresses", icon: MapPin, to: "/account" },
  { label: "Wallet", icon: Wallet, to: "/account" },
];

export function Account() {
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [coupons, setCoupons] = useState<ClaimedCoupon[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    apiClient
      .get("/coupons/mine")
      .then((res) => setCoupons(res.data.data))
      .catch(() => {});
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
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="flex items-center gap-4 rounded-xl2 bg-royal-gradient p-6 text-white shadow-soft">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl">{user.name}</h1>
          <p className="text-sm text-cream-200">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center gap-2 rounded-xl2 border border-royal-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-soft"
          >
            <item.icon className="h-6 w-6 text-royal-600" />
            <span className="text-sm font-medium text-charcoal">{item.label}</span>
          </Link>
        ))}
      </div>

      {coupons.length > 0 && (
        <div className="mt-8 rounded-xl2 border border-royal-100 bg-white p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-charcoal">
            <Tag className="h-5 w-5 text-royal-600" /> My Coupons
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-dashed border-gold-400 bg-gold-50 px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm font-bold text-royal-700">{c.coupon.code}</p>
                  <p className="text-xs text-charcoal/60">
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

      <div className="mt-8 rounded-xl2 border border-royal-100 bg-white p-6 text-center">
        <User className="mx-auto h-8 w-8 text-royal-300" />
        <p className="mt-3 text-sm text-charcoal/70">You have no orders yet. Start exploring our collections.</p>
        <Link
          to="/products"
          className="mt-4 inline-block rounded-full bg-royal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-royal-700"
        >
          Shop Now
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-royal-600"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  );
}
