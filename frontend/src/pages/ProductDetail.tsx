import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/home/ProductCard";
import { useStorefrontProductDetail, useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useAppDispatch } from "@/hooks/redux";
import { addItem, toggleDrawer } from "@/store/cartSlice";

const LOW_STOCK_THRESHOLD = 8;

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useStorefrontProductDetail(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const { data: related = [] } = useStorefrontProducts({
    categoryId: product?.categoryId,
    pageSize: 5,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-ds-6 py-16 text-center text-ds-sm text-charcoal/60">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-ds-6 py-16 text-center text-ds-sm text-charcoal/60">
        Product not found.
      </div>
    );
  }

  const hasVariants = product.variants.length > 0;
  const availableSizes = [...new Set(product.variants.map((v) => v.size).filter((s): s is string => Boolean(s)))];
  const availableColors = [...new Set(product.variants.map((v) => v.color).filter((c): c is string => Boolean(c)))];

  const activeVariant = hasVariants
    ? product.variants.find(
        (v) => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
      ) ??
      product.variants.find((v) => v.size === selectedSize) ??
      product.variants.find((v) => v.color === selectedColor) ??
      product.variants[0]
    : undefined;
  const size = activeVariant?.size ?? undefined;
  const price = activeVariant?.price ?? product.price;
  const stockQuantity = activeVariant ? activeVariant.stockQuantity : product.stockQuantity ?? 0;
  const discountPct = Math.round(((product.mrp - price) / product.mrp) * 100);
  const isOutOfStock = (stockQuantity ?? 0) <= 0;
  const isLowStock = !isOutOfStock && (stockQuantity ?? 0) <= LOW_STOCK_THRESHOLD;
  const images =
    activeVariant?.imageUrl
      ? [activeVariant.imageUrl, ...product.images.filter((img) => img !== activeVariant.imageUrl)]
      : product.images.length
      ? product.images
      : [product.image];
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  useEffect(() => {
    setActiveImage(0);
  }, [activeVariant?.imageUrl]);

  function addToCart() {
    if (!product) return;
    dispatch(
      addItem({
        productId: product.id,
        variantId: activeVariant?.id,
        size,
        name: product.name,
        imageUrl: activeVariant?.imageUrl ?? product.image,
        price,
        quantity,
      })
    );
    dispatch(toggleDrawer(true));
  }

  return (
    <div className="mx-auto max-w-7xl px-ds-6 py-12 lg:px-ds-8">
      <div className="grid grid-cols-1 gap-ds-8 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-xl2 bg-cream-300">
            <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-ds-4 grid grid-cols-5 gap-ds-2">
              {images.map((img, i) => (
                <button
                  key={img.slice(0, 40) + i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? "border-royal-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-ds-xs uppercase tracking-wide text-gold-700">{product.category}</p>
          <h1 className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">{product.name}</h1>

          <div className="mt-ds-4 flex items-center gap-ds-3">
            <span className="font-heading text-ds-2xl font-semibold text-royal-700">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {product.mrp > price && (
              <>
                <span className="text-ds-md text-charcoal/40 line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
                <span className="rounded-full bg-charcoal/80 px-ds-4 py-1 text-[10px] font-semibold text-white">
                  {discountPct}% OFF
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-ds-xs text-charcoal/60">Taxes included. Shipping calculated at checkout.</p>

          {product.shortDescription && (
            <p className="mt-ds-4 text-ds-sm text-charcoal/80">{product.shortDescription}</p>
          )}

          {availableColors.length > 0 && (
            <div className="mt-ds-6">
              <p className="mb-ds-2 text-ds-sm font-medium text-charcoal">
                Color{activeVariant?.color ? `: ${activeVariant.color}` : ""}
              </p>
              <div className="flex flex-wrap gap-ds-2">
                {availableColors.map((c) => {
                  const variantForColor = product.variants.find((v) => v.color === c);
                  const colorOutOfStock = variantForColor ? variantForColor.stockQuantity <= 0 : false;
                  return (
                    <button
                      key={c}
                      onClick={() => !colorOutOfStock && setSelectedColor(c)}
                      disabled={colorOutOfStock}
                      aria-pressed={activeVariant?.color === c}
                      className={`rounded-md border px-ds-4 py-ds-2 text-ds-sm font-medium transition-colors ${
                        activeVariant?.color === c
                          ? "border-royal-600 bg-royal-600 text-white"
                          : colorOutOfStock
                          ? "cursor-not-allowed border-charcoal/10 text-charcoal/30 line-through"
                          : "border-charcoal/20 text-charcoal hover:border-royal-400"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className="mt-ds-6">
              <p className="mb-ds-2 text-ds-sm font-medium text-charcoal">Size</p>
              <div className="flex flex-wrap gap-ds-2">
                {availableSizes.map((s) => {
                  const variantForSize = product.variants.find(
                    (v) => v.size === s && (!selectedColor || v.color === selectedColor)
                  );
                  const sizeOutOfStock = variantForSize ? variantForSize.stockQuantity <= 0 : false;
                  return (
                    <button
                      key={s}
                      onClick={() => !sizeOutOfStock && setSelectedSize(s)}
                      disabled={sizeOutOfStock}
                      aria-pressed={size === s}
                      className={`rounded-md border px-ds-4 py-ds-2 text-ds-sm font-medium transition-colors ${
                        size === s
                          ? "border-royal-600 bg-royal-600 text-white"
                          : sizeOutOfStock
                          ? "cursor-not-allowed border-charcoal/10 text-charcoal/30 line-through"
                          : "border-charcoal/20 text-charcoal hover:border-royal-400"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-ds-6">
            <p className="mb-ds-2 text-ds-sm font-medium text-charcoal">Quantity</p>
            <div className="flex w-32 items-center justify-between rounded-lg border border-charcoal/20">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-ds-4 py-ds-2 text-ds-lg text-charcoal hover:text-royal-600"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-ds-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-ds-4 py-ds-2 text-ds-lg text-charcoal hover:text-royal-600"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-ds-6 grid grid-cols-2 gap-ds-3">
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className="rounded-lg border border-royal-600 py-ds-3 text-ds-sm font-heading font-semibold text-royal-700 transition-colors hover:bg-royal-50 disabled:cursor-not-allowed disabled:border-charcoal/20 disabled:text-charcoal/40 disabled:hover:bg-transparent"
            >
              {isOutOfStock ? "Sold Out" : "Buy Now"}
            </button>
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className="rounded-lg bg-royal-gold-gradient py-ds-3 text-ds-sm font-heading font-semibold text-white shadow-soft transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-none disabled:bg-charcoal/20 disabled:text-charcoal/40"
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>

          {isLowStock && (
            <p className="mt-ds-2 text-ds-xs font-semibold text-royal-600">
              Only {stockQuantity} left in stock
            </p>
          )}

          <div className="mt-ds-6 grid grid-cols-3 gap-ds-4 border-t border-charcoal/10 pt-ds-6 text-center text-ds-xs text-charcoal/70">
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-royal-600" />
              Free Shipping
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-royal-600" />
              Secure Checkout
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="h-5 w-5 text-royal-600" />
              7-Day Returns
            </div>
          </div>

          {(product.description || product.washCare) && (
            <div className="mt-ds-8 space-y-ds-4 border-t border-charcoal/10 pt-ds-6">
              {product.description && (
                <div>
                  <h2 className="font-heading text-ds-sm font-semibold text-charcoal">Description</h2>
                  <p className="mt-ds-2 whitespace-pre-line text-ds-sm text-charcoal/70">{product.description}</p>
                </div>
              )}
              {product.washCare && (
                <div>
                  <h2 className="font-heading text-ds-sm font-semibold text-charcoal">Wash Care</h2>
                  <p className="mt-ds-2 whitespace-pre-line text-ds-sm text-charcoal/70">{product.washCare}</p>
                </div>
              )}
              <p className="text-ds-xs text-charcoal/50">Fabric: {product.fabric}</p>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-ds-8 font-display text-2xl text-gradient-royal">You may also like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
