import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { apiClient } from "@/admin/api/client";
import { useAppDispatch } from "@/admin/hooks/redux";
import { setCredentials } from "@/admin/store/authSlice";

const inputClass =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none";

type Step = "login" | "forgotRequest" | "forgotVerify";

export function Login() {
  const { t } = useTranslation();
  const location = useLocation();
  const [step, setStep] = useState<Step>(
    (location.state as { forgotPassword?: boolean } | null)?.forgotPassword ? "forgotRequest" : "login"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [resetEmail, setResetEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/admin/login", { identifier, password });
      const { user, accessToken } = res.data.data;
      dispatch(setCredentials({ user, accessToken }));
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: resetEmail });
      toast.success(t("login.otpSent"));
      setStep("forgotVerify");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("login.couldNotSendCode"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", { email: resetEmail, code, newPassword });
      toast.success(t("login.passwordResetSuccess"));
      setStep("login");
      setIdentifier(resetEmail);
      setPassword("");
      setCode("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("login.invalidCode"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-gradient px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
        <img src="/images/anandi-sarees-logo-crop.png" alt={t("login.logoAlt")} className="h-16 rounded-lg" />
        <p className="mt-4 text-sm text-neutral-500">
          {step === "login" && t("login.signInToManageStore")}
          {step === "forgotRequest" && t("login.forgotPasswordHint")}
          {step === "forgotVerify" && t("login.enterCodeSentTo", { email: resetEmail })}
        </p>

        {step === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("login.mobileNumber")}</label>
                <input
                  type="text"
                  inputMode="tel"
                  required
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("login.password")}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-royal-600"
                />
                {t("login.keepSignedIn")}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-royal-gradient py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t("login.signingIn") : t("login.signIn")}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("forgotRequest");
                setResetEmail("");
              }}
              className="mt-3 w-full text-center text-sm font-medium text-royal-600 hover:text-royal-500"
            >
              {t("login.forgotPassword")}
            </button>
          </form>
        )}

        {step === "forgotRequest" && (
          <form onSubmit={handleForgotRequest}>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("login.email")}</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-royal-gradient py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t("login.sendingCode") : t("login.sendOtp")}
            </button>

            <button
              type="button"
              onClick={() => setStep("login")}
              className="mt-3 w-full text-center text-sm font-medium text-royal-600 hover:text-royal-500"
            >
              {t("login.backToSignIn")}
            </button>
          </form>
        )}

        {step === "forgotVerify" && (
          <form onSubmit={handleForgotVerify}>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("login.sixDigitCode")}</label>
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
              <div>
                <label className="text-sm font-medium text-neutral-700">{t("login.newPassword")}</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-neutral-400">{t("login.passwordHint")}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="mt-6 w-full rounded-lg bg-royal-gradient py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t("login.verifying") : t("login.setPasswordAndSignIn")}
            </button>

            <button
              type="button"
              onClick={() => setStep("forgotRequest")}
              className="mt-3 w-full text-center text-sm font-medium text-royal-600 hover:text-royal-500"
            >
              {t("login.useDifferentEmail")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
