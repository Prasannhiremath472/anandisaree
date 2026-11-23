import React, { useRef, useState } from 'react';
import { Play, ShoppingBag, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../../data/products';
import { useShop } from '../../context/ShopContext';
import type { Product } from '../../types';

export const WatchAndShop: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<Product | null>(null);

  const videoProducts = products.slice(0, 6);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 260;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-[#F5EEFA] select-none border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#D4AF37]/30">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#53208C] font-medium tracking-wide">
              Watch & Shop
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4675] mt-1 uppercase tracking-wider font-light">
              See Authentic Maharashtrian Drapes in Motion
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-[#53208C] text-[#53208C] hover:bg-[#53208C] hover:text-[#FAF7F2] flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-[#53208C] text-[#53208C] hover:bg-[#53208C] hover:text-[#FAF7F2] flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Reel Cards Scroll */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 hide-scrollbar"
        >
          {videoProducts.map((product) => (
            <div
              key={product.id}
              className="w-[190px] sm:w-[220px] shrink-0 group relative rounded-xs overflow-hidden border-2 border-[#E8DDF0] hover:border-[#D4AF37] bg-[#FFFFFF] shadow-md transition-all"
            >
              {/* Video Thumbnail (Vertical 9:14 Aspect Ratio) */}
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-[#3B1366]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-106"
                  loading="lazy"
                />

                {/* Subtle royal purple vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0B4C]/85 via-transparent to-black/25 pointer-events-none" />

                {/* Play Button in Gold */}
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(product)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 group-hover:bg-[#D4AF37] text-[#53208C] group-hover:text-[#2A0B4C] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                  aria-label={`Play draping reel for ${product.name}`}
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                {/* Top Badge in Royal Purple */}
                <span className="absolute top-2 left-2 bg-[#53208C]/90 text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-xs backdrop-blur-xs border border-[#D4AF37]">
                  Reel Look
                </span>
              </div>

              {/* Lower Product Info & Action */}
              <div className="p-3 bg-[#FFFFFF] flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#2A0B4C] truncate" title={product.name}>
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-bold text-[#53208C]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#5E4675]/60 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 flex gap-1">
                  <button
                    type="button"
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-[10px] font-bold py-1.5 px-2 rounded-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-colors border border-[#D4AF37]"
                  >
                    <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
                    <span>Shop Look</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(product)}
                    className="p-1.5 border border-[#E8DDF0] rounded-xs text-[#53208C] hover:bg-[#F5EEFA]"
                    title="Quick View"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Preview Modal in Royal Purple & Gold */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setActiveVideoModal(null)}
          />
          <div className="relative bg-[#3B1366] rounded-xs overflow-hidden max-w-sm w-full shadow-2xl z-10 border-2 border-[#D4AF37]">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:text-[#D4AF37] z-20"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
              <img
                src={activeVideoModal.images[0]}
                alt={activeVideoModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#2A0B4C]/40 flex flex-col items-center justify-center text-white p-6 text-center">
                <Play className="w-12 h-12 text-[#D4AF37] mb-2 fill-[#D4AF37]/50" />
                <p className="font-serif text-lg font-medium">{activeVideoModal.name}</p>
                <p className="text-xs text-[#F4EFE6] mt-1 font-light">Live Silk & Zari Draping Walkthrough</p>
                <button
                  onClick={() => {
                    addToCart(activeVideoModal, 1);
                    setActiveVideoModal(null);
                  }}
                  className="mt-6 bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#2A0B4C] text-xs font-bold px-6 py-2.5 rounded-xs uppercase tracking-wider shadow-lg"
                >
                  Shop This Saree (₹{activeVideoModal.price.toLocaleString('en-IN')})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
