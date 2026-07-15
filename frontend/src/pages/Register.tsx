import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "@/api/client";
import { useAppDispatch } from "@/hooks/redux";
import { setCredentials } from "@/store/authSlice";
import { claimPendingCouponIfAny } from "@/lib/claimCoupon";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", { name, email, phone: phone || undefined, password });
      const { user, accessToken } = res.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome to Anandi Sarees, ${user.name}!`);
      await claimPendingCouponIfAny();
      navigate("/account");
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0] : null;
      toast.error(
        (Array.isArray(firstError) ? firstError[0] : null) ??
          err?.response?.data?.message ??
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 lg:px-8">
      <h1 className="font-display text-3xl text-gradient-royal">Create Account</h1>
      <p className="mt-2 text-sm text-charcoal/70">Join Anandi Sarees for a personalized shopping experience.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-royal-200 px-3 py-2.5 text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
          />
        </div>
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
          <label className="text-sm font-medium text-charcoal">Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
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
          <p className="mt-1 text-xs text-charcoal/50">
            At least 8 characters, with an uppercase letter, lowercase letter and a number.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-royal-gradient py-3 font-heading text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/70">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-royal-600 hover:text-royal-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
