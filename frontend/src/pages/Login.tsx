import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "@/api/client";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/store/authSlice";
import { claimPendingCouponIfAny } from "@/lib/claimCoupon";
import { setPendingCoupon } from "@/lib/pendingCoupon";

const inputClass =
  "mt-1 w-full rounded-lg border border-royal-200 px-ds-4 py-2.5 text-ds-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500";

export function Login() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const couponFromUrl = searchParams.get("coupon");
  const redirectTo = searchParams.get("redirect");

  useEffect(() => {
    if (couponFromUrl) {
      setPendingCoupon(couponFromUrl);
    }
  }, [couponFromUrl]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/auth/otp/request", { identifier: email, purpose: "LOGIN" });
      toast.success("We've emailed you a 6-digit code.");
      setStep("otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not send code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/otp/verify", { identifier: email, code, purpose: "LOGIN" });
      const { user, accessToken } = res.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}!`);
      await claimPendingCouponIfAny();
      navigate(redirectTo || "/account");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-ds-6 py-16 lg:px-ds-8">
      <h1 className="font-display text-3xl text-gradient-royal">Sign In</h1>
      <p className="mt-ds-2 text-ds-sm text-charcoal/70">
        {step === "email"
          ? "Enter your email and we'll send you a one-time code."
          : `Enter the 6-digit code sent to ${email}.`}
      </p>

      {step === "email" ? (
        <form onSubmit={handleRequestOtp} className="mt-ds-8 space-y-ds-6">
          <div>
            <label className="text-ds-sm font-medium text-charcoal">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-royal-gradient py-ds-4 font-heading text-ds-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending code..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-ds-8 space-y-ds-6">
          <div>
            <label className="text-ds-sm font-medium text-charcoal">6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className={`${inputClass} text-center text-ds-lg tracking-[0.5em]`}
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full rounded-full bg-royal-gradient py-ds-4 font-heading text-ds-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
            }}
            className="w-full text-center text-ds-sm font-medium text-royal-600 hover:text-royal-500"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-ds-7 text-center text-ds-sm text-charcoal/70">
        New to Anandi Sarees?{" "}
        <Link to="/register" className="font-medium text-royal-600 hover:text-royal-500">
          Create an account
        </Link>
      </p>
    </div>
  );
}
