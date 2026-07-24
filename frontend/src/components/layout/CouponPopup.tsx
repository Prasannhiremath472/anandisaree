import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { BUSINESS } from "@/data/business";
import { setPendingCoupon } from "@/lib/pendingCoupon";
import { useAppSelector } from "@/hooks/redux";
import { apiClient } from "@/api/client";

const COUPON_CODE = "WELCOME15";
const SCROLL_TRIGGER_PX = 400;
const SESSION_KEY = "anandi_coupon_popup_shown";

export function CouponPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isAuthenticated = useAppSelector((s) => Boolean(s.auth.accessToken));
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setDismissed(true);
      return;
    }

    function handleScroll() {
      if (window.scrollY > SCROLL_TRIGGER_PX) {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        window.removeEventListener("scroll", handleScroll);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClose() {
    setVisible(false);
    setDismissed(true);
  }

  async function handleGetCode() {
    if (isAuthenticated) {
      try {
        await apiClient.post("/coupons/claim", { code: COUPON_CODE, source: "popup" });
        toast.success(`Coupon ${COUPON_CODE} added to your account!`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Could not apply your coupon. Please try again.");
      }
      handleClose();
      navigate("/account");
      return;
    }

    setPendingCoupon(COUPON_CODE);
    handleClose();
    navigate("/login?coupon=" + COUPON_CODE);
  }

  if (dismissed && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-royal-900/60"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-ds-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-royal-gradient shadow-2xl"
          >
            <button
              aria-label="Close"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 text-white/80 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center gap-ds-6 p-ds-8 text-center sm:border-r sm:border-white/15">
                <img
                  src="/images/anandi-sarees-logo-crop.png"
                  alt={BUSINESS.name}
                  className="h-24 w-24 rounded-xl object-cover shadow-lg"
                />
                <p className="font-display text-ds-lg text-cream-100">{BUSINESS.name}</p>
                <p className="text-ds-xs uppercase tracking-[0.2em] text-gold-300">Premium Maharashtrian Sarees</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-ds-6 p-ds-8 text-center">
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  Enjoy 15% OFF Instantly
                </h2>
                <p className="text-ds-sm text-cream-200">
                  Sign in or create an account to claim your exclusive welcome coupon.
                </p>
                <button
                  onClick={handleGetCode}
                  className="mt-ds-2 w-full max-w-xs rounded-full bg-gold-gradient px-ds-8 py-ds-4 font-heading text-ds-sm font-bold text-royal-800 shadow-gold transition-transform hover:scale-105"
                >
                  Get Coupon Code
                </button>
                <p className="mt-1 text-[11px] text-cream-300/80">
                  By continuing, you agree to receive marketing emails and updates from {BUSINESS.name}.
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
