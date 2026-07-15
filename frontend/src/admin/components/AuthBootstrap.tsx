import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch } from "@/admin/hooks/redux";
import { setCredentials } from "@/admin/store/authSlice";

/**
 * On hard page load/reload, the Redux access token is gone but the httpOnly
 * refresh cookie may still be valid. Attempt a silent refresh before
 * ProtectedRoute decides whether to bounce to /admin/login.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    axios
      .post("/api/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        if (cancelled) return;
        const { user, accessToken } = res.data.data;
        dispatch(setCredentials({ user, accessToken }));
      })
      .catch(() => {
        // no valid refresh cookie — user stays logged out
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-neutral-400">Loading...</div>;
  }

  return <>{children}</>;
}
