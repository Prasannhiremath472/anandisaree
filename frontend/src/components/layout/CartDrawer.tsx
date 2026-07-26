import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { removeItem, updateQuantity, toggleDrawer } from "@/store/cartSlice";

export function CartDrawer() {
  const isOpen = useAppSelector((s) => s.cart.isDrawerOpen);
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function close() {
    dispatch(toggleDrawer(false));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-royal-900/60"
            onClick={close}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-md flex-col bg-cream-100 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gold-200/60 p-ds-6">
              <h2 className="font-heading text-ds-lg font-semibold text-charcoal">
                Your Bag {items.length > 0 && `(${items.length})`}
              </h2>
              <button aria-label="Close cart" onClick={close} className="text-charcoal hover:text-royal-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-ds-4 p-ds-8 text-center">
                <ShoppingBag className="h-12 w-12 text-charcoal/20" />
                <p className="text-ds-sm text-charcoal/60">Your bag is empty.</p>
                <Link
                  to="/products"
                  onClick={close}
                  className="rounded-full bg-royal-gradient px-ds-6 py-ds-3 text-ds-sm font-heading font-semibold text-white shadow-soft"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-ds-6">
                  <div className="space-y-ds-6">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId ?? "base"}`} className="flex gap-ds-4">
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-300">
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="font-heading text-ds-sm font-medium text-charcoal">{item.name}</p>
                            {item.size && <p className="text-ds-xs text-charcoal/60">Size: {item.size}</p>}
                            <p className="mt-1 text-ds-sm font-semibold text-royal-700">
                              ₹{item.price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-charcoal/20">
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      productId: item.productId,
                                      variantId: item.variantId,
                                      quantity: item.quantity - 1,
                                    })
                                  )
                                }
                                className="px-ds-3 py-1 text-charcoal hover:text-royal-600"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="px-ds-2 text-ds-xs font-medium">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      productId: item.productId,
                                      variantId: item.variantId,
                                      quantity: item.quantity + 1,
                                    })
                                  )
                                }
                                className="px-ds-3 py-1 text-charcoal hover:text-royal-600"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                dispatch(removeItem({ productId: item.productId, variantId: item.variantId }))
                              }
                              aria-label="Remove item"
                              className="text-charcoal/50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gold-200/60 p-ds-6">
                  <div className="mb-ds-4 flex items-center justify-between">
                    <span className="text-ds-sm text-charcoal/70">Subtotal</span>
                    <span className="font-heading text-ds-lg font-semibold text-royal-700">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mb-ds-4 text-ds-xs text-charcoal/50">Shipping and taxes calculated at checkout.</p>
                  <Link
                    to="/checkout"
                    onClick={close}
                    className="block w-full rounded-full bg-royal-gradient py-ds-4 text-center font-heading text-ds-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
