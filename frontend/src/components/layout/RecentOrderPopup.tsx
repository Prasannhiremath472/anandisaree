import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { RECENT_ORDERS } from "@/data/homeContent";

const DISPLAY_MS = 5500;
const GAP_MS = 6000;
const FIRST_DELAY_MS = 3000;

export function RecentOrderPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const showTimer = setTimeout(() => setVisible(true), FIRST_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;

    const hideTimer = setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => clearTimeout(hideTimer);
  }, [visible, dismissed]);

  useEffect(() => {
    if (visible || dismissed) return;

    const nextTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % RECENT_ORDERS.length);
      setVisible(true);
    }, GAP_MS);
    return () => clearTimeout(nextTimer);
  }, [visible, dismissed]);

  if (dismissed) return null;

  const order = RECENT_ORDERS[index];

  return (
    <div className="fixed bottom-5 left-5 z-40 hidden max-w-xs sm:block">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center gap-ds-4 rounded-xl2 border border-gold-200/60 bg-white p-ds-4 pr-ds-8 shadow-soft"
          >
            <button
              aria-label="Dismiss"
              onClick={() => setDismissed(true)}
              className="absolute right-2 top-2 text-charcoal/40 hover:text-charcoal"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <img
              src={order.productImage}
              alt={order.productName}
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gold-600">
                Recently Ordered
              </p>
              <p className="truncate font-heading text-ds-sm font-semibold text-charcoal">{order.productName}</p>
              <p className="truncate text-ds-xs text-charcoal/60">
                by {order.buyerName} · {order.city}
              </p>
              <div className="mt-1 flex items-center gap-ds-2 text-ds-xs">
                <span className="font-heading font-semibold text-royal-700">
                  ₹{order.price.toLocaleString("en-IN")}
                </span>
                <span className="text-charcoal/40">{order.orderCode}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
