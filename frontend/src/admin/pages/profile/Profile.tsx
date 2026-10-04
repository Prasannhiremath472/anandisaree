import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { Field, inputClass } from "@/admin/components/ui/Field";
import { Card } from "@/admin/components/ui/Card";
import { apiClient } from "@/admin/api/client";
import { useAppDispatch, useAppSelector } from "@/admin/hooks/redux";
import { updateUser, clearAuth } from "@/admin/store/authSlice";
import { useUpdateProfile } from "@/admin/hooks/api/useProfile";
import { useNavigate } from "react-router-dom";

function humanizeRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type PasswordStep = "idle" | "codeSent";

export function Profile() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const updateMutation = useUpdateProfile();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const [passwordStep, setPasswordStep] = useState<PasswordStep>("idle");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updated = await updateMutation.mutateAsync({
        name: name !== user?.name ? name : undefined,
        email: email !== user?.email ? email : undefined,
        phone: phone && phone !== user?.phone ? phone : undefined,
      });
      dispatch(updateUser({ name: updated.name, email: updated.email, phone: updated.phone }));
      toast.success(t("profile.profileUpdated"));
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("profile.failedToUpdateProfile"));
    }
  }

  async function handleSendCode() {
    if (!user?.email) return;
    setPasswordLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email: user.email });
      toast.success(t("login.otpSent"));
      setPasswordStep("codeSent");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("login.couldNotSendCode"));
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.email) return;
    setPasswordLoading(true);
    try {
      await apiClient.post("/auth/reset-password", { email: user.email, code, newPassword });
      toast.success(t("login.passwordResetSuccess"));
      setPasswordStep("idle");
      setCode("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("login.invalidCode"));
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleLogout() {
    dispatch(clearAuth());
    navigate("/login");
  }

  return (
    <div>
      <h1 className="mb-1 font-heading text-xl font-semibold text-neutral-800">{t("profile.title")}</h1>
      <p className="mb-6 text-sm text-neutral-500">{t("profile.description")}</p>

      <div className="max-w-lg space-y-6">
        <Card title={t("profile.accountDetails")}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label={t("profile.role")}>
              <input disabled value={user?.role ? humanizeRole(user.role) : ""} className={`${inputClass} cursor-not-allowed bg-neutral-50 text-neutral-500`} />
            </Field>
            <Field label={t("profile.username")} required>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label={t("login.email")} required>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </Field>
            <Field label={t("login.mobileNumber")}>
              <input value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </Field>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              >
                {updateMutation.isPending ? t("common.saving") : t("common.saveChanges")}
              </button>
            </div>
          </form>
        </Card>

        <Card title={t("profile.changePassword")}>
          {passwordStep === "idle" ? (
            <div>
              <p className="text-xs text-neutral-500">{t("profile.changePasswordHint", { email: user?.email })}</p>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={passwordLoading}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
              >
                {passwordLoading ? t("login.sendingCode") : t("profile.sendVerificationCode")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Field label={t("login.sixDigitCode")} required>
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
              </Field>
              <Field label={t("login.newPassword")} required>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-neutral-400">{t("login.passwordHint")}</p>
              </Field>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordStep("idle");
                    setCode("");
                    setNewPassword("");
                  }}
                  className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading || code.length !== 6}
                  className="rounded-lg bg-royal-gradient px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
                >
                  {passwordLoading ? t("login.verifying") : t("profile.updatePassword")}
                </button>
              </div>
            </form>
          )}
        </Card>

        <Card>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> {t("topbar.logout")}
          </button>
        </Card>
      </div>
    </div>
  );
}
