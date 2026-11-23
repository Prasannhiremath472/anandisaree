import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { craftStories } from '../../data/crafts';
import { CraftCardSilhouette } from '../decorative/CraftCardSilhouette';
import { EthnicBorderStrip } from '../decorative/EthnicBorderStrip';

export const ShopByCraft: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-parchment-royal select-none py-12 sm:py-16">
      {/* Top ornamental ethnic border strip in Royal Purple & Gold */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-b border-[#D4AF37]/50 mb-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#D4AF37]/30">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#53208C] font-medium tracking-wide">
              Shop by Craft
            </h2>
            <p className="text-xs sm:text-sm text-[#5E4675] mt-1 uppercase tracking-wider font-light">
              Celebrating Generational Weaving Artistry & Pure Handloom Drapes
            </p>
          </div>

          {/* Navigation Controls in Gold */}
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

        {/* 8 Custom Ethnic Card Silhouettes (Reference Screenshot Page 1 & Vastranand inspiration) */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-6 pt-2 hide-scrollbar items-center justify-start lg:justify-center"
        >
          {craftStories.map((craft) => (
            <div key={craft.id} className="shrink-0">
              <CraftCardSilhouette craft={craft} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom ornamental ethnic border strip in Royal Purple & Gold */}
      <EthnicBorderStrip variant="geometric" color="#53208C" className="border-t border-[#D4AF37]/50 mt-6" />
    </section>
  );
};
