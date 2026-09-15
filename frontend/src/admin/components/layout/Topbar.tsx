import { Bell, KeyRound, LogOut, ShoppingBag, PackageX, Star, CheckCheck } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/admin/hooks/redux";
import { clearAuth } from "@/admin/store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  type AdminNotification,
} from "@/admin/hooks/api/useNotifications";

const NOTIFICATION_ICONS: Record<AdminNotification["type"], React.ElementType> = {
  ORDER: ShoppingBag,
  LOW_STOCK: PackageX,
  REVIEW: Star,
};

const TITLE_KEYS: Record<string, string> = {
  "/": "nav.dashboard",
  "/products": "nav.products",
  "/orders": "nav.orders",
  "/customers": "nav.customers",
  "/coupons": "nav.coupons",
  "/banners": "nav.banners",
  "/cms": "nav.cmsBlog",
  "/reviews": "nav.feedback",
  "/reels": "nav.reels",
  "/newsletter": "nav.newsletter",
  "/marketing": "nav.marketing",
  "/reports": "nav.reports",
  "/settings": "nav.settings",
};

function humanizeRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Topbar() {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: notifications } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  function handleNotificationClick(n: AdminNotification) {
    if (!n.isRead) markReadMutation.mutate(n.id);
    if (n.link) navigate(n.link);
  }

  function handleLogout() {
    dispatch(clearAuth());
    navigate("/login");
  }

  const titleKey = TITLE_KEYS[location.pathname];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/5 bg-white px-6">
      <h1 className="font-heading text-base font-semibold text-neutral-800">{titleKey ? t(titleKey) : t("nav.admin")}</h1>
      <div className="flex items-center gap-5">
        <LanguageSwitcher />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button aria-label={t("topbar.notifications")} className="relative text-neutral-500 hover:text-royal-600">
              <Bell className="h-5 w-5" />
              {Boolean(notifications?.unreadCount) && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {notifications!.unreadCount > 9 ? "9+" : notifications!.unreadCount}
                </span>
              )}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-80 rounded-xl border border-black/5 bg-white p-3 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <p className="font-heading text-sm font-semibold text-neutral-800">{t("topbar.notifications")}</p>
                {Boolean(notifications?.unreadCount) && (
                  <button
                    onClick={() => markAllReadMutation.mutate()}
                    className="flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> {t("topbar.markAllRead")}
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-80 overflow-y-auto">
                {!notifications?.items.length ? (
                  <p className="py-6 text-center text-sm text-neutral-400">{t("topbar.noNotifications")}</p>
                ) : (
                  notifications.items.map((n) => {
                    const Icon = NOTIFICATION_ICONS[n.type];
                    return (
                      <DropdownMenu.Item
                        key={n.id}
                        onSelect={() => handleNotificationClick(n)}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-sm outline-none hover:bg-neutral-50 ${
                          n.isRead ? "text-neutral-500" : "text-neutral-800"
                        }`}
                      >
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.isRead ? "text-neutral-400" : "text-royal-600"}`} />
                        <div className="min-w-0 flex-1">
                          <p className={n.isRead ? "" : "font-medium"}>{n.message}</p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {new Date(n.createdAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                        {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-royal-600" />}
                      </DropdownMenu.Item>
                    );
                  })
                )}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-neutral-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-gradient text-xs font-semibold text-white shadow-sm">
                {user?.name?.charAt(0) ?? "A"}
              </div>
              <div className="hidden text-left text-sm sm:block">
                <p className="font-medium text-neutral-800">{user?.name ?? t("nav.admin")}</p>
                <p className="text-xs text-neutral-500">{user?.role ? humanizeRole(user.role) : ""}</p>
              </div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-64 rounded-xl border border-black/5 bg-white p-3 shadow-xl"
            >
              <div className="border-b border-neutral-100 pb-3">
                <p className="font-heading text-sm font-semibold text-neutral-800">{user?.name}</p>
                <p className="mt-1 truncate text-xs text-neutral-500">{user?.email}</p>
                {user?.phone && <p className="text-xs text-neutral-500">{user.phone}</p>}
                <p className="mt-1 text-xs font-medium text-royal-600">{user?.role ? humanizeRole(user.role) : ""}</p>
              </div>

              <DropdownMenu.Item
                onSelect={() => navigate("/login", { state: { forgotPassword: true } })}
                className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-neutral-700 outline-none hover:bg-neutral-50"
              >
                <KeyRound className="h-4 w-4" />
                {t("topbar.resetPassword")}
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onSelect={handleLogout}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                {t("topbar.logout")}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
