import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  showQuickAdd = true,
}) => {
  const { isInWishlist, toggleWishlist, setQuickViewProduct, addToCart } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);

  const hoverImg = product.images[1] || product.images[0];

  return (
    <div 
      className={`group relative flex flex-col bg-[#FFFFFF] border border-[#E8DDF0] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#D4AF37] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EEFA]">
        {/* Main & Hover Images */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
            }}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered && product.images.length > 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />

          {product.images.length > 1 && (
            <img
              src={hoverImg}
              alt={`${product.name} detail`}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80';
              }}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span 
              className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs shadow-xs border ${
                product.badge === 'NEW' 
                  ? 'bg-[#53208C] text-[#FAF7F2] border-[#D4AF37]' 
                  : product.badge === 'ONLY 2 LEFT'
                  ? 'bg-[#801818] text-[#FFFFFF] border-red-300'
                  : product.badge === 'BEST SELLER'
                  ? 'bg-[#D4AF37] text-[#2A0B4C] border-[#53208C]'
                  : 'bg-[#3B1366] text-[#FAF7F2] border-[#D4AF37]'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button in Gold & Purple */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 ${
            isSaved 
              ? 'bg-[#D4AF37] text-[#2A0B4C] shadow-md border border-[#53208C]' 
              : 'bg-white/80 hover:bg-white text-[#53208C] hover:text-[#D4AF37] shadow-xs'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-2 bottom-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-[#FAF7F2]/95 hover:bg-[#FFFFFF] text-[#53208C] text-[11px] font-bold py-1.5 px-2 rounded-xs shadow-sm flex items-center justify-center gap-1 border border-[#D4AF37] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Quick View</span>
          </button>

          {showQuickAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="bg-[#53208C] hover:bg-[#3B1366] text-[#D4AF37] border border-[#D4AF37] p-1.5 rounded-xs shadow-sm transition-colors"
              title="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-2 sm:p-3.5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          {/* Category / Origin subtitled tag */}
          <span className="text-[10px] tracking-wider uppercase text-[#D4AF37] font-bold block mb-0.5">
            {product.categoryLabel}
          </span>

          {/* Product Name */}
          <Link 
            to={`/product/${product.slug}`}
            className="font-serif text-sm sm:text-base font-semibold text-[#2A0B4C] hover:text-[#53208C] transition-colors line-clamp-1 block leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-[#5E4675]">
            <div className="flex items-center text-[#D4AF37]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-current text-[#D4AF37]' 
                      : 'text-[#E8DDF0]'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-[#53208C] text-[10px]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-2.5 pt-2 border-t border-[#F5EEFA] flex items-baseline justify-between flex-wrap gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-[#53208C]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-[#5E4675]/60 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.discountPercentage > 0 && (
            <span className="text-[10px] font-bold text-[#53208C] bg-[#F5EEFA] border border-[#D4AF37]/50 px-1.5 py-0.5 rounded-xs">
              {product.discountPercentage}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
