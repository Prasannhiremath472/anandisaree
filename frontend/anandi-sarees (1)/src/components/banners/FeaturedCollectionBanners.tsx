import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CornerFlourish } from '../decorative/CornerFlourish';

export const FeaturedCollectionBanners: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-[#FAF7F2] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Banner 1: Timeless Best Sellers in Royal Purple */}
          <Link
            to="/collections/best-sellers"
            className="group relative block overflow-hidden rounded-xs border-2 border-[#D4AF37] bg-royal-purple p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Corner Accents in Gold */}
            <CornerFlourish position="top-left" className="top-2 left-2" size={42} color="#D4AF37" />
            <CornerFlourish position="bottom-right" className="bottom-2 right-2" size={42} color="#D4AF37" />

            {/* Inner Dashed Border */}
            <div className="absolute inset-2 border border-[#D4AF37]/40 border-dashed pointer-events-none rounded-xs" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              {/* Model Photo on Left */}
              <div className="w-2/5 shrink-0">
                <div className="aspect-[3/4] rounded-xs overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-[#3B1366]">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80"
                    alt="Best Seller Paithani Saree"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text on Right */}
              <div className="w-3/5 text-center flex flex-col items-center justify-center pl-2 text-[#FAF7F2]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold block mb-1">
                  Join The Trendsetters
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#FFFFFF] tracking-tight uppercase leading-tight drop-shadow-sm">
                  Best Seller
                </h3>
                
                <p className="text-xs sm:text-sm text-[#F4EFE6]/90 mt-2 max-w-xs leading-relaxed font-light">
                  Shop the handcrafted sarees everyone is talking about. Handloom certified with royal zari elegance.
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37] pb-0.5 group-hover:text-[#FFFFFF] group-hover:border-[#FFFFFF] transition-colors">
                  <span>Explore Best Sellers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Banner 2: Exclusive Anandi Collection in Deep Purple */}
          <Link
            to="/collections/all"
            className="group relative block overflow-hidden rounded-xs border-2 border-[#D4AF37] bg-royal-purple p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Corner Accents in Gold */}
            <CornerFlourish position="top-right" className="top-2 right-2" size={42} color="#D4AF37" />
            <CornerFlourish position="bottom-left" className="bottom-2 left-2" size={42} color="#D4AF37" />

            {/* Inner Dashed Border */}
            <div className="absolute inset-2 border border-[#D4AF37]/40 border-dashed pointer-events-none rounded-xs" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              {/* Text on Left */}
              <div className="w-3/5 text-center flex flex-col items-center justify-center pr-2 text-[#FAF7F2]">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-bold block mb-1">
                  Bespoke Loom Creations
                </span>
                
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#FFFFFF] tracking-tight uppercase leading-tight drop-shadow-sm">
                  Our Exclusive <br />
                  <span className="text-lg sm:text-xl font-normal lowercase italic tracking-normal text-gold-gradient">Collections</span>
                </h3>
                
                <p className="text-xs sm:text-sm text-[#F4EFE6]/90 mt-2 max-w-xs leading-relaxed font-light">
                  Discover tradition in every drape with Anandi Sarees. Limited edition weaves honoring master weavers.
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37] pb-0.5 group-hover:text-[#FFFFFF] group-hover:border-[#FFFFFF] transition-colors">
                  <span>Discover Exclusive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Model Photo on Right */}
              <div className="w-2/5 shrink-0">
                <div className="aspect-[3/4] rounded-xs overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-[#3B1366]">
                  <img
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80"
                    alt="Exclusive Anandi Silk Drape"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};
