import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "@/admin/api/client";
import { useAppDispatch } from "@/admin/hooks/redux";
import { setCredentials } from "@/admin/store/authSlice";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "INVENTORY_MANAGER",
  "ORDER_MANAGER",
  "CUSTOMER_SUPPORT",
  "MARKETING_MANAGER",
  "CONTENT_MANAGER",
];

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none";

export function Login() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      if (!ADMIN_ROLES.includes(user.role)) {
        toast.error("This account does not have admin access");
        return;
      }
      dispatch(setCredentials({ user, accessToken }));
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-gradient px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <img src="/images/anandi-sarees-logo-crop.png" alt="Anandi Sarees" className="h-16 rounded-lg" />
        <p className="mt-4 text-sm text-neutral-500">
          {step === "email"
            ? "Sign in to manage your store"
            : `Enter the 6-digit code sent to ${email}.`}
        </p>

        {step === "email" ? (
          <form onSubmit={handleRequestOtp}>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-royal-gradient py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">6-digit code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={`${inputClass} text-center text-lg tracking-[0.5em]`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="mt-6 w-full rounded-lg bg-royal-gradient py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
              }}
              className="mt-3 w-full text-center text-sm font-medium text-royal-600 hover:text-royal-500"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
