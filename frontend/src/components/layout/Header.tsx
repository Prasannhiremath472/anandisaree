import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleDrawer } from "@/store/cartSlice";
import { BUSINESS } from "@/data/business";
import { TopAnnouncementBar } from "./TopAnnouncementBar";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Category", to: "/category" },
  { label: "Blog", to: "/blog" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useAppSelector((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const isAuthenticated = useAppSelector((s) => Boolean(s.auth.accessToken));
  const dispatch = useAppDispatch();

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-gold-200/60 bg-cream-100/90 backdrop-blur-md">
      <TopAnnouncementBar />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-ds-6 py-ds-6 lg:px-ds-8">
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

        <nav className="hidden gap-ds-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative py-1 font-heading text-ds-sm font-medium transition-colors",
                  isActive
                    ? "text-royal-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-gold-gradient"
                    : "text-charcoal hover:text-royal-500"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-ds-6">
          <button aria-label="Search" className="text-charcoal hover:text-royal-500">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="text-charcoal hover:text-royal-500">
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            aria-label="Account"
            className="hidden text-charcoal hover:text-royal-500 sm:block"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            aria-label="Cart"
            className="relative text-charcoal hover:text-royal-500"
            onClick={() => dispatch(toggleDrawer(true))}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-semibold text-royal-800 shadow-gold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-royal-900/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-[70] w-72 bg-surface-gradient p-ds-7 shadow-soft lg:hidden"
          >
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="mb-ds-7">
              <X className="h-6 w-6 text-royal-600" />
            </button>
            <nav className="flex flex-col gap-5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "font-heading text-ds-md transition-colors",
                      isActive ? "font-semibold text-gradient-royal" : "text-charcoal hover:text-royal-500"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
