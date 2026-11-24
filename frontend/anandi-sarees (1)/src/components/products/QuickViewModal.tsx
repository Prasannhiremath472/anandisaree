import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, isInWishlist, toggleWishlist } = useShop();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isSaved = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] rounded-xs shadow-2xl max-w-4xl w-full overflow-hidden border-2 border-[#D4AF37] z-10 animate-fadeIn">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 p-1.5 bg-[#FFFFFF] rounded-full text-[#53208C] hover:bg-[#53208C] hover:text-[#FFFFFF] transition-colors shadow-md z-20 border border-[#D4AF37]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Image Preview & Thumbnails */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full rounded-xs overflow-hidden border border-[#D4AF37]/50 bg-[#FFFFFF]">
              <img
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-top"
              />
              {quickViewProduct.badge && (
                <span className="absolute top-2 left-2 bg-[#53208C] text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded-xs border border-[#D4AF37]">
                  {quickViewProduct.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded-xs overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#53208C] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Purchase Options */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
                {quickViewProduct.categoryLabel} • {quickViewProduct.origin}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#53208C] mt-1 leading-tight">
                {quickViewProduct.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickViewProduct.rating) ? 'fill-current' : 'text-[#E8DDF0]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#53208C]">
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-[#5E4675]">
                  ({quickViewProduct.reviewCount} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3 pb-3 border-b border-[#E8DDF0]">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#53208C]">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-[#5E4675]/60 line-through">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {quickViewProduct.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-[#53208C] bg-[#F5EEFA] border border-[#D4AF37]/50 px-2 py-0.5 rounded-xs">
                    {quickViewProduct.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#2A0B4C]/90 mt-3 leading-relaxed font-light">
                {quickViewProduct.description}
              </p>

              {/* Specifications Pills */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="bg-[#FFFFFF] p-2 rounded-xs border border-[#E8DDF0]">
                  <span className="text-[#5E4675] block text-[10px] uppercase tracking-wider">Fabric</span>
                  <span className="font-semibold text-[#53208C]">{quickViewProduct.fabric}</span>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xs border border-[#E8DDF0]">
                  <span className="text-[#5E4675] block text-[10px] uppercase tracking-wider">Color</span>
                  <span className="font-semibold text-[#53208C]">{quickViewProduct.color}</span>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xs border border-[#E8DDF0]">
                  <span className="text-[#5E4675] block text-[10px] uppercase tracking-wider">Weave Technique</span>
                  <span className="font-semibold text-[#53208C] truncate block">{quickViewProduct.weavingStyle}</span>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded-xs border border-[#E8DDF0]">
                  <span className="text-[#5E4675] block text-[10px] uppercase tracking-wider">Blouse Included</span>
                  <span className="font-semibold text-[#53208C] truncate block">Running 0.8m Fabric</span>
                </div>
              </div>
            </div>

            {/* Actions: Quantity & Add to Bag */}
            <div className="mt-6 pt-4 border-t border-[#E8DDF0]">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E8DDF0] rounded-xs bg-[#FFFFFF]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-2 text-[#5E4675] hover:bg-[#F5EEFA]"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-xs text-[#53208C]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-2 text-[#5E4675] hover:bg-[#F5EEFA]"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct, quantity);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-xs font-bold py-3 px-4 rounded-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md border border-[#D4AF37]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3 rounded-xs border transition-colors ${
                    isSaved ? 'bg-[#D4AF37] text-[#2A0B4C] border-[#D4AF37]' : 'bg-[#FFFFFF] text-[#53208C] border-[#E8DDF0] hover:border-[#53208C]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* View Full Product Details Link */}
              <div className="mt-3 text-center">
                <Link
                  to={`/product/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="text-xs font-bold text-[#53208C] hover:text-[#D4AF37] hover:underline inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>View Full Product Details & Saree Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Micro Trust Strip */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-[#5E4675] border-t border-[#E8DDF0] pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Silk Mark Certified
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#53208C]" />
                  {quickViewProduct.dispatchTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
