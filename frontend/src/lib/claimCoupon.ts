import toast from "react-hot-toast";
import { apiClient } from "@/api/client";
import { clearPendingCoupon, getPendingCoupon } from "@/lib/pendingCoupon";

/** Call right after a successful login/register to auto-claim any coupon the user was chasing. */
export async function claimPendingCouponIfAny() {
  const code = getPendingCoupon();
  if (!code) return;

  try {
    await apiClient.post("/coupons/claim", { code, source: "popup" });
    toast.success(`Coupon ${code} added to your account!`);
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? "Could not apply your coupon, please try again from your account.");
  } finally {
    clearPendingCoupon();
  }
}
