import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiClient } from "@/admin/api/client";
import { useAppDispatch } from "@/admin/hooks/redux";
import { setCredentials } from "@/admin/store/authSlice";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { user, accessToken } = res.data.data;
      if (!["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "ORDER_MANAGER", "CUSTOMER_SUPPORT", "MARKETING_MANAGER", "CONTENT_MANAGER"].includes(user.role)) {
        toast.error("This account does not have admin access");
        return;
      }
      dispatch(setCredentials({ user, accessToken }));
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-gradient px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <img src="/images/anandi-sarees-logo-crop.png" alt="Anandi Sarees" className="h-16 rounded-lg" />
        <p className="mt-4 text-sm text-neutral-500">Sign in to manage your store</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-royal-gradient py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
