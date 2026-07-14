import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleDrawer } from "@/store/cartSlice";
import { BUSINESS } from "@/data/business";

const NAV_LINKS = [
  { label: "Paithani", to: "/category/paithani" },
  { label: "Nauvari", to: "/category/nauvari" },
  { label: "Wedding Collection", to: "/collection/maharashtrian-wedding" },
  { label: "Festive", to: "/collection/festive" },
  { label: "Handloom", to: "/collection/handloom" },
  { label: "New Arrivals", to: "/new-arrivals" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useAppSelector((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-50 border-b border-gold-200/60 bg-cream-100/90 backdrop-blur-md">
      <div className="bg-royal-600 py-2 text-center text-xs tracking-wide text-cream-100">
        Free shipping across Maharashtra on orders above ₹4,999
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6 text-royal-600" />
        </button>

        <Link to="/" className="flex items-center" aria-label={BUSINESS.name}>
          <img
            src="/images/anandi-sarees-logo-crop.png"
            alt={BUSINESS.name}
            className="h-12 rounded-md sm:h-14"
          />
        </Link>

        <nav className="hidden gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-heading text-sm font-medium text-charcoal transition-colors hover:text-royal-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-charcoal hover:text-royal-500">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="text-charcoal hover:text-royal-500">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/account" aria-label="Account" className="hidden text-charcoal hover:text-royal-500 sm:block">
            <User className="h-5 w-5" />
          </Link>
          <button
            aria-label="Cart"
            className="relative text-charcoal hover:text-royal-500"
            onClick={() => dispatch(toggleDrawer(true))}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-royal-600 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-cream-100 p-6 shadow-soft lg:hidden"
          >
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="mb-6">
              <X className="h-6 w-6 text-royal-600" />
            </button>
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-base text-charcoal hover:text-royal-500"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
