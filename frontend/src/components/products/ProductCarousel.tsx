import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  bgVariant?: 'ivory' | 'warm-beige' | 'white';
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
  products,
  viewAllLink = '/collections/all',
  bgVariant = 'ivory',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const bgClasses = {
    'ivory': 'bg-[#FAF7F2]',
    'warm-beige': 'bg-[#F5EEFA]',
    'white': 'bg-[#FFFFFF]',
  }[bgVariant];

  return (
    <section className={`py-12 sm:py-16 ${bgClasses} relative select-none`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Title & View All */}
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#D4AF37]/30">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#53208C] font-medium tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#5E4675] mt-1 uppercase tracking-wider font-light">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {viewAllLink && (
              <Link 
                to={viewAllLink}
                className="bg-[#53208C] hover:bg-[#3B1366] text-[#FAF7F2] text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider transition-colors shadow-xs border border-[#D4AF37]"
              >
                View all
              </Link>
            )}

            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
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
        </div>

        {/* Carousel Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory hide-scrollbar"
        >
          {products.map(product => (
            <div 
              key={product.id}
              className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
