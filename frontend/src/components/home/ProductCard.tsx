import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductCard as ProductCardData } from "@/data/homeContent";
import { useAppDispatch } from "@/hooks/redux";
import { addItem, toggleDrawer } from "@/store/cartSlice";

export function ProductCard({ product }: { product: ProductCardData }) {
  const dispatch = useAppDispatch();
  const discountPct = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  function handleQuickAdd(e: MouseEvent) {
    e.preventDefault();
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        imageUrl: product.image,
        price: product.price,
        quantity: 1,
      })
    );
    dispatch(toggleDrawer(true));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 bg-cream-300 shadow-soft">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-ds-2">
            {product.isNew && (
              <span className="rounded-full bg-royal-gradient px-ds-4 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-soft">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-gold-gradient px-ds-4 py-1 text-[10px] font-semibold uppercase tracking-wide text-royal-800">
                Bestseller
              </span>
            )}
            {discountPct > 0 && (
              <span className="rounded-full bg-charcoal/80 px-ds-4 py-1 text-[10px] font-semibold text-white">
                {discountPct}% OFF
              </span>
            )}
          </div>

          <button
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-royal-600 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </button>

          <button
            onClick={handleQuickAdd}
            className="absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-center gap-ds-2 rounded-full bg-royal-gold-gradient py-2.5 text-ds-xs font-heading font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Quick Add
          </button>

          <div className="pointer-events-none absolute inset-0 rounded-xl2 opacity-0 ring-2 ring-gold-400/70 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="mt-ds-4">
          <p className="text-ds-xs uppercase tracking-wide text-gold-700">{product.category}</p>
          <h3 className="mt-1 truncate font-heading text-ds-sm font-medium text-charcoal">{product.name}</h3>
          <p className="mt-0.5 text-ds-xs text-charcoal/60">{product.fabric}</p>
          <div className="mt-1.5 flex items-center gap-ds-2">
            <span className="font-heading text-ds-sm font-semibold text-royal-700">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp > product.price && (
              <span className="text-ds-xs text-charcoal/40 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
