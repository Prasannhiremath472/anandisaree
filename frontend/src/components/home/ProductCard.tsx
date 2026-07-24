import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductCard as ProductCardData } from "@/data/homeContent";
import { useAppDispatch } from "@/hooks/redux";
import { addItem, toggleDrawer } from "@/store/cartSlice";

const LOW_STOCK_THRESHOLD = 8;

export function ProductCard({ product }: { product: ProductCardData }) {
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const discountPct = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const isLowStock =
    typeof product.stockQuantity === "number" &&
    product.stockQuantity > 0 &&
    product.stockQuantity <= LOW_STOCK_THRESHOLD;

  function addToCart() {
    dispatch(
      addItem({
        productId: product.id,
        size: selectedSize,
        name: product.name,
        imageUrl: product.image,
        price: product.price,
        quantity: 1,
      })
    );
    dispatch(toggleDrawer(true));
  }

  function handleAddToCart(e: MouseEvent) {
    e.preventDefault();
    addToCart();
  }

  function handleBuyNow(e: MouseEvent) {
    e.preventDefault();
    // No checkout flow yet — behaves the same as Add to Cart until one exists.
    addToCart();
  }

  function handleSizeSelect(e: MouseEvent, size: string) {
    e.preventDefault();
    setSelectedSize(size);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group overflow-hidden rounded-xl2 border border-gold-200/60 bg-white shadow-soft transition-shadow hover:shadow-gold"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-300">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute left-ds-4 top-ds-4 flex flex-col gap-ds-2">
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
        </div>
      </Link>

      <div className="p-ds-6">
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-ds-4 flex flex-wrap gap-ds-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => handleSizeSelect(e, size)}
                aria-pressed={selectedSize === size}
                className={`rounded-md border px-ds-3 py-1 text-ds-xs font-medium transition-colors ${
                  selectedSize === size
                    ? "border-royal-600 bg-royal-600 text-white"
                    : "border-charcoal/20 text-charcoal hover:border-royal-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <Link to={`/product/${product.id}`} className="block">
          <p className="text-ds-xs uppercase tracking-wide text-gold-700">{product.category}</p>
          <h3 className="mt-1 truncate font-heading text-ds-sm font-medium text-charcoal">{product.name}</h3>

          <div className="mt-ds-2 flex items-center gap-ds-2">
            <span className="font-heading text-ds-lg font-semibold text-royal-700">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp > product.price && (
              <span className="text-ds-xs text-charcoal/40 line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="mt-ds-2 flex flex-wrap items-center gap-ds-4 text-ds-xs">
            <span className="flex items-center gap-1 text-charcoal/60">
              <Truck className="h-3.5 w-3.5" /> Free Shipping
            </span>
            {isLowStock && (
              <span className="font-semibold text-royal-600">Only {product.stockQuantity} left</span>
            )}
          </div>
        </Link>

        <div className="mt-ds-4 grid grid-cols-2 gap-ds-2">
          <button
            onClick={handleBuyNow}
            className="rounded-lg border border-royal-600 py-ds-3 text-ds-xs font-heading font-semibold text-royal-700 transition-colors hover:bg-royal-50"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            className="rounded-lg bg-royal-gold-gradient py-ds-3 text-ds-xs font-heading font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
