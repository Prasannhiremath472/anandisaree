import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "@/api/client";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/store/authSlice";
import { claimPendingCouponIfAny } from "@/lib/claimCoupon";
import { setPendingCoupon } from "@/lib/pendingCoupon";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const couponFromUrl = searchParams.get("coupon");

  useEffect(() => {
    if (couponFromUrl) {
      setPendingCoupon(couponFromUrl);
    }
  }, [couponFromUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { user, accessToken } = res.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}!`);
      await claimPendingCouponIfAny();
      navigate("/account");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 lg:px-8">
      <h1 className="font-display text-3xl text-gradient-royal">Sign In</h1>
      <p className="mt-2 text-sm text-charcoal/70">Welcome back to Anandi Sarees.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-royal-200 px-3 py-2.5 text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-royal-200 px-3 py-2.5 text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-royal-gradient py-3 font-heading text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/70">
        New to Anandi Sarees?{" "}
        <Link to="/register" className="font-medium text-royal-600 hover:text-royal-500">
          Create an account
        </Link>
      </p>
    </div>
  );
}
